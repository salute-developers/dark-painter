import { CONSTANTS } from './constants';

export const removeTheme = async (themeName: string) => {
    await pixso.clientStorage.deleteAsync(themeName);

    const currentActive = await pixso.clientStorage.getAsync(CONSTANTS.storageActivePrefix);
    if (currentActive === themeName) {
        await pixso.clientStorage.setAsync(CONSTANTS.storageActivePrefix, '');
    }

    pixso.ui.postMessage({
        type: CONSTANTS.msgType.themeRemoved,
    });
};
