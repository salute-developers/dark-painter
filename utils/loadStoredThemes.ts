import { StoredThemes } from 'types';
import { CONSTANTS } from './constants';

export const loadStoredThemes = async () => {
    const clientKeys = await pixso.serverStorage.getAsync();
    const themeKeys = Object.keys(clientKeys).filter((key) => key.startsWith(CONSTANTS.storagePrefix));

    if (!themeKeys) {
        return;
    }

    const results: { [key: string]: StoredThemes } = {};
    for (const key of themeKeys) {
        const parsedRes = JSON.parse(await pixso.serverStorage.getAsync(key));
        results[key] = parsedRes;
    }

    console.log(results);
    pixso.ui.postMessage({
        type: CONSTANTS.msgType.loadedStoredThemes,
        storedThemes: results,
    });
};
