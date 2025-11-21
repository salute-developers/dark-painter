import { CONSTANTS } from './constants';

export const getActiveTheme = async () => {
    const activeTheme = await pixso.clientStorage.getAsync(CONSTANTS.storageActivePrefix);

    pixso.ui.postMessage({
        type: CONSTANTS.msgType.activeThemeFetched,
        themeName: activeTheme,
    });
};

export const setActiveTheme = async (themeName: string) => {
    await pixso.clientStorage.setAsync(CONSTANTS.storageActivePrefix, themeName);

    pixso.ui.postMessage({
        type: CONSTANTS.msgType.activeThemeChanged,
    });
};
