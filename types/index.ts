import { ReactNode } from 'react';

export type TabThemeContent = {
    new: ReactNode;
    list: ReactNode;
};

export type ParsedTheme = {
    originalName: string;
    themeName: string;
};

export type ThemeValue = 'light' | 'dark';
export type StyleInfo = {
    id: string;
    key: string;
};
type ThemeData = Record<ThemeValue, StyleInfo>;
export type TokenNameMap = Record<string, ThemeData>;
