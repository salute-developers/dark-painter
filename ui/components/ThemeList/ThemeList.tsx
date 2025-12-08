import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BodyL, Button, Flow, RadioGroup, RectSkeleton } from '@salutejs/sdds-serv';
import { CONSTANTS } from 'utils/constants';
import type { ParsedTheme, StoredThemes } from 'types';

import './ThemeList.styles.css';

import { pixsoEventBus } from '../../helpers/pixso';
import { ThemeItem } from './ThemeItem';

type ThemeListProps = {
    activeTheme: string;
    loadActiveTheme: () => void;
    originalThemeList: StoredThemes;
    setOriginalThemeList: Dispatch<SetStateAction<StoredThemes>>;
};

type LoadThemesMessage = {
    type: string;
    storedThemes: StoredThemes;
};

export const ThemeList = ({
    activeTheme,
    originalThemeList,
    loadActiveTheme,
    setOriginalThemeList,
}: ThemeListProps) => {
    const [themeList, setThemeList] = useState<Array<ParsedTheme>>([]);
    const [themeListLoading, setThemeListLoading] = useState(false);

    const getParsedThemes = (storedThemes: LoadThemesMessage['storedThemes']) => {
        return Object.entries(storedThemes).map(([key]) => {
            const themeName = key.replace(CONSTANTS.storagePrefix, '');

            return {
                originalName: key,
                themeName,
            };
        });
    };

    const processThemes = (message: LoadThemesMessage) => {
        const { storedThemes } = message;
        if (Object.keys(storedThemes).length) {
            setOriginalThemeList(storedThemes);
            const parsedThemes = getParsedThemes(storedThemes);

            setThemeList(parsedThemes);
        } else {
            setThemeList([]);
        }

        setThemeListLoading(false);

        pixsoEventBus.off(CONSTANTS.msgType.activeThemeFetched, processThemes);
    };

    const loadThemes = async () => {
        try {
            setThemeListLoading(true);

            const response = await fetch(CONSTANTS.repoUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const decodedContent = atob(data.content);
            const jsonData = JSON.parse(decodedContent);

            processThemes({ storedThemes: jsonData } as LoadThemesMessage);
            parent.postMessage(
                { pluginMessage: { type: CONSTANTS.msgType.loadStoredThemes, data: { storedThemes: jsonData } } },
                '*',
            );
        } catch (err) {
            console.error('Error fetching theme:', err);
        } finally {
            setThemeListLoading(false);
        }
    };

    const processActiveThemeChange = () => {
        loadActiveTheme();

        pixsoEventBus.off(CONSTANTS.msgType.activeThemeChanged, processActiveThemeChange);
    };

    const handleChangeActiveTheme = (themeName: string) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: CONSTANTS.msgType.changeActiveTheme,
                    data: {
                        themeName,
                    },
                },
            },
            '*',
        );

        pixsoEventBus.on(CONSTANTS.msgType.activeThemeChanged, processActiveThemeChange);
    };

    const processDeleteTheme = () => {
        loadThemes();
        loadActiveTheme();

        pixsoEventBus.off(CONSTANTS.msgType.themeRemoved, processDeleteTheme);
    };

    const handleDeleteTheme = (themeName: string) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: CONSTANTS.msgType.removeTheme,
                    data: {
                        themeName,
                    },
                },
            },
            '*',
        );

        pixsoEventBus.on(CONSTANTS.msgType.themeRemoved, processDeleteTheme);
    };

    // const downloadThemes = () => {
    //     const data = JSON.stringify(originalThemeList, null, 2);
    //     const blob = new Blob([data], { type: 'application/json' });
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement('a');

    //     a.href = url;
    //     a.download = `themes.json`;
    //     document.body.appendChild(a);
    //     a.click();

    //     setTimeout(() => {
    //         document.body.removeChild(a);
    //         URL.revokeObjectURL(url);
    //     }, 100);
    // };

    useEffect(() => {
        loadThemes();
        loadActiveTheme();
    }, []);

    if (themeListLoading) {
        return <RectSkeleton width="100%" height="65px" />;
    }

    if (!themeList?.length) {
        return <BodyL>Список тем пустой. Добавьте тему</BodyL>;
    }

    return (
        <>
            <RadioGroup className="theme-list">
                <Flow orientation="vertical" mainAxisGap="20px">
                    {themeList.map((item, ind) => (
                        <ThemeItem
                            key={`${item.themeName}_${ind}`}
                            item={item}
                            activeTheme={activeTheme}
                            handleChangeActive={handleChangeActiveTheme}
                            handleDeleteTheme={handleDeleteTheme}
                        />
                    ))}
                </Flow>
            </RadioGroup>
            {/* <Button view="success" size="xs" text="Скачать темы" onClick={downloadThemes} /> */}
        </>
    );
};
