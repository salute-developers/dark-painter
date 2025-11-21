import React from 'react';
import { Flow, IconButton, Link, Radiobox, TextS } from '@salutejs/sdds-serv';
import { IconTrashFill } from '@salutejs/plasma-icons';

import type { ParsedTheme } from 'types';

type ThemeItemProps = {
    item: ParsedTheme;
    activeTheme: string;
    handleChangeActive: (themeName: string) => void;
    handleDeleteTheme: (themeName: string) => void;
};

export const ThemeItem = ({ item, activeTheme, handleChangeActive, handleDeleteTheme }: ThemeItemProps) => {
    return (
        <Flow orientation="horizontal" arrangement="spaceBetween" style={{ width: '100%' }}>
            <Radiobox
                size="l"
                name="theme-value"
                label={item.themeName}
                description={
                    <Flow orientation="vertical">
                        <TextS>
                            <Link view="secondary" href={item.lightFrameLink} target="_blank">
                                Светлый фрейм
                            </Link>
                        </TextS>
                        <TextS>
                            <Link view="secondary" href={item.darkFrameLink} target="_blank">
                                Темный фрейм
                            </Link>
                        </TextS>
                    </Flow>
                }
                checked={item.originalName === activeTheme}
                onChange={() => handleChangeActive(item.originalName)}
            />

            <IconButton view="critical" size="xs" onClick={() => handleDeleteTheme(item.originalName)}>
                <IconTrashFill color="inherit" />
            </IconButton>
        </Flow>
    );
};
