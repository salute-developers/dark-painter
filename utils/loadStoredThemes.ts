import type { StoredThemes } from 'types';

export const loadStoredThemes = async (themes: StoredThemes) => {
    if (!Object.keys(themes)) {
        return;
    }

    try {
        const setClientStoragePromises = Object.entries(themes).map(([themeName, themeInfo]) => {
            return pixso.clientStorage.setAsync(themeName, themeInfo);
        });

        await Promise.all(setClientStoragePromises);
    } catch (e) {
        console.error(e);
        pixso.notify('Ошибка при загрузке тем', {
            icon: 'WARN',
        });

        return;
    }

    pixso.notify('Темы загружены', {
        icon: 'SUCCESS',
    });
};
