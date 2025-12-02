import React from 'react';
import { Flow, IconButton, Radiobox } from '@salutejs/sdds-serv';
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
        <Flow orientation="horizontal" arrangement="spaceBetween" alignment="center" style={{ width: '100%' }}>
            <Radiobox
                size="l"
                name="theme-value"
                label={item.themeName}
                checked={item.originalName === activeTheme}
                onChange={() => handleChangeActive(item.originalName)}
            />

            <IconButton view="critical" size="xs" onClick={() => handleDeleteTheme(item.originalName)}>
                <IconTrashFill size="xs" color="inherit" />
            </IconButton>
        </Flow>
    );
};
