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
type ThemeData = Record<ThemeValue, string>;
export type TokenNameMap = Record<string, ThemeData>;
