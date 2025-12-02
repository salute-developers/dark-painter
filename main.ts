import { CONSTANTS } from './utils/constants';
import { generateTokenMappings } from './utils/generateTokensMappings';
import { loadStoredThemes } from './utils/loadStoredThemes';
import { removeTheme } from './utils/removeTheme';
import { getActiveTheme, setActiveTheme } from './utils/activeTheme';
import { createDarkClone } from './utils/createDarkClone';

pixso.showUI(__html__, {
    width: 400,
    height: 480,
    title: 'Dark theme painter',
});

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

        case CONSTANTS.msgType.parseTokens:
            await generateTokenMappings(msg?.data?.themeName);
            break;

        case CONSTANTS.msgType.createDarkClone:
            await createDarkClone(msg?.data?.activeTheme, msg?.data?.type);
            break;
    }
};
