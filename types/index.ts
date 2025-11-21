import { ReactNode } from 'react';

export type ThemeFrameType = 'light' | 'dark';

export type ThemeFrames = {
    lightFrame: any | null;
    darkFrame: any | null;
};

export type TabThemeContent = {
    new: ReactNode;
    list: ReactNode;
};

export type ParsedTheme = {
    originalName: string;
    themeName: string;
    darkFrameLink: string;
    lightFrameLink: string;
};
