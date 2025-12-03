import type { TokenNameMap, ThemeValue } from '../types';
import { CONSTANTS } from './constants';

const smileToThemeMap = {
    '🌕': 'light',
    '🌑': 'dark',
};

export const generateTokenMappings = async (themeName: string) => {
    if (!themeName) {
        pixso.notify('Задайте имя для темы', { icon: 'INFO' });
        return;
    }

    try {
        const themeKey = `${CONSTANTS.storagePrefix}${themeName}`;
        const clientKeys = await pixso.clientStorage.keysAsync();
        const isThemeExist = clientKeys.includes(themeKey);
        if (isThemeExist) {
            pixso.notify('Имя темы уже существует. Придумайте другое имя, или же отредактируйте уже существующее', {
                icon: 'INFO',
            });
        }

        const localStyles = pixso.getLocalPaintStyles();

        const parsedTokens = localStyles.reduce((acc: TokenNameMap, curr: PaintStyle) => {
            const rawTokenName = curr.name;
            const moonEmoji = [...rawTokenName][0] || '';
            const themeValue = smileToThemeMap[moonEmoji as keyof typeof smileToThemeMap] as ThemeValue;
            const tokenName = rawTokenName.replace(/🌕|🌑/g, '');

            if (!themeValue) {
                return acc;
            }

            if (!acc[tokenName]) {
                acc[tokenName] = {
                    light: {
                        id: '',
                        key: '',
                    },
                    dark: {
                        id: '',
                        key: '',
                    },
                };
            }

            acc[tokenName][themeValue] = {
                id: String(curr.id),
                key: String(curr.key),
            };

            return acc;
        }, {} as TokenNameMap);

        const lightToDarkMapKeys = Object.values(parsedTokens).reduce((acc: Record<string, string>, curr) => {
            const key = curr.light.key;
            const value = curr.dark.key;

            acc[key] = value;

            return acc;
        }, {});

        const lightToDarkMapIds = Object.values(parsedTokens).reduce((acc: Record<string, string>, curr) => {
            const key = curr.light.id;
            const value = curr.dark.id;

            acc[key] = value;

            return acc;
        }, {});

        await pixso.clientStorage.setAsync(themeKey, { lightToDarkMapKeys, lightToDarkMapIds });

        pixso.ui.postMessage({ type: CONSTANTS.msgType.parsedTokens });

        pixso.notify(`Создано ${Object.values(lightToDarkMapKeys).length} соответствий токенов`, { icon: 'SUCCESS' });
    } catch (error) {
        console.error('Error generating token mappings:', error);
        pixso.notify('Ошибка парсинга токенов', { error: true });
    }
};
