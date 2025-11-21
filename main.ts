import { CONSTANTS } from './utils/constants';
import { clearThemeFrame } from './utils/clearThemeFrame';
import { selectThemeFrame } from './utils/selectThemeFrame';
import { generateTokenMappings } from './utils/generateTokensMappings';
import { loadStoredThemes } from './utils/loadStoredThemes';
import { removeTheme } from './utils/removeTheme';
import { getActiveTheme, setActiveTheme } from './utils/activeTheme';
import { createDarkClone } from './utils/createDarkClone';

import type { ThemeFrames } from 'types';

pixso.showUI(__html__, {
    width: 500,
    height: 580,
    title: 'Dark theme painter',
});

let themeFrames: ThemeFrames = {
    lightFrame: null,
    darkFrame: null,
};

let tokenMappings = new Map<string, any>();

pixso.ui.onmessage = async (msg) => {
    switch (msg.type) {
        case CONSTANTS.msgType.loadStoredThemes:
            loadStoredThemes();
            break;

        case CONSTANTS.msgType.removeTheme:
            removeTheme(msg?.data?.themeName);
            break;

        case CONSTANTS.msgType.getActiveTheme:
            getActiveTheme();
            break;

        case CONSTANTS.msgType.changeActiveTheme:
            setActiveTheme(msg?.data?.themeName);
            break;

        case CONSTANTS.msgType.selectLightFrame:
            selectThemeFrame('light', themeFrames);
            break;

        case CONSTANTS.msgType.selectDarkFrame:
            selectThemeFrame('dark', themeFrames);
            break;

        case CONSTANTS.msgType.clearLightFrame:
            clearThemeFrame('light', themeFrames);
            break;

        case CONSTANTS.msgType.clearDarkFrame:
            clearThemeFrame('dark', themeFrames);
            break;

        case CONSTANTS.msgType.parseTokens:
            await generateTokenMappings(themeFrames, tokenMappings, msg?.data?.themeName);
            break;

        case CONSTANTS.msgType.createDarkClone:
            await createDarkClone(msg?.data?.activeTheme);
            break;
    }
};
