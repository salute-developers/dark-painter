import { ReactNode } from 'react';

export type NodesUnion =
    | FrameNode
    | ComponentNode
    | InstanceNode
    | BooleanOperationNode
    | VectorNode
    | StarNode
    | LineNode
    | EllipseNode
    | PolygonNode
    | RectangleNode
    | TextNode
    | SectionNode;

export type TabThemeContent = {
    new?: ReactNode;
    list: ReactNode;
};

export type ParsedTheme = {
    originalName: string;
    themeName: string;
};

export type StoredThemes = {
    [name: string]: {
        lightToDarkMapIds: Record<string, string>;
        lightToDarkMapKeys: Record<string, string>;
    };
};

export type ThemeValue = 'light' | 'dark';
export type StyleInfo = {
    id: string;
    key: string;
};
type ThemeData = Record<ThemeValue, StyleInfo>;
export type TokenNameMap = Record<string, ThemeData>;
