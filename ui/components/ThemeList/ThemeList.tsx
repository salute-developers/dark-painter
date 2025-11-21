import React, { useEffect, useState } from 'react';
import { BodyL, Flow, RadioGroup, RectSkeleton } from '@salutejs/sdds-serv';

import type { ParsedTheme } from 'types';

import { CONSTANTS } from '../../../utils/constants';
import { pixsoEventBus } from '../../helpers/pixso';
import { ThemeItem } from './ThemeItem';

type ThemeListProps = {
    activeTheme: string;
    loadActiveTheme: () => void;
};

export const ThemeList = ({ activeTheme, loadActiveTheme }: ThemeListProps) => {
    const [themeList, setThemeList] = useState<Array<ParsedTheme>>([]);
    const [themeListLoading, setThemeListLoading] = useState(false);

    const getParsedThemes = (storedThemes: any) => {
        return Object.entries(storedThemes).map(([key, value]) => {
            const themeName = key.replace(CONSTANTS.storagePrefix, '');
            const { darkFrameLink, lightFrameLink } = value as ParsedTheme;

            return {
                originalName: key,
                themeName,
                darkFrameLink,
                lightFrameLink,
            };
        });
    };

    const processThemes = (message: any) => {
        const { storedThemes } = message;
        if (Object.keys(storedThemes).length) {
            const parsedThemes = getParsedThemes(storedThemes);

            setThemeList(parsedThemes);
        }
        setThemeListLoading(false);

        pixsoEventBus.off(CONSTANTS.msgType.activeThemeFetched, processThemes);
    };

    const loadThemes = () => {
        setThemeListLoading(true);

        parent.postMessage({ pluginMessage: { type: CONSTANTS.msgType.loadStoredThemes } }, '*');

        pixsoEventBus.on(CONSTANTS.msgType.loadedStoredThemes, processThemes);
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

    useEffect(() => {
        loadThemes();
    }, []);

    if (themeListLoading) {
        return <RectSkeleton width="100%" height="65px" />;
    }

    if (!themeList?.length) {
        return <BodyL>Список тем пустой. Добавьте тему</BodyL>;
    }

    return (
        <RadioGroup>
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
    );
};
