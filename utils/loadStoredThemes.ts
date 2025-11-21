import { CONSTANTS } from './constants';

export const loadStoredThemes = async () => {
    const clientKeys = await pixso.clientStorage.keysAsync();
    const themeKeys = clientKeys.filter((key) => key.startsWith(CONSTANTS.storagePrefix));

    if (!themeKeys) {
        return;
    }

    const results: { [key: string]: any } = {};
    for (const key of themeKeys) {
        results[key] = await pixso.clientStorage.getAsync(key);
    }

    pixso.ui.postMessage({
        type: CONSTANTS.msgType.loadedStoredThemes,
        storedThemes: results,
    });
};
