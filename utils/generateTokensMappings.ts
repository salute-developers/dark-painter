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
                    light: '',
                    dark: '',
                };
            }

            acc[tokenName][themeValue] = String(curr.id);

            return acc;
        }, {} as TokenNameMap);

        const lightToDarkMap = Object.values(parsedTokens).reduce((acc: Record<string, string>, curr) => {
            const key = curr.light;
            const value = curr.dark;

            acc[key] = value;

            return acc;
        }, {});

        await pixso.clientStorage.setAsync(themeKey, { lightToDarkMap });

        pixso.ui.postMessage({ type: CONSTANTS.msgType.parsedTokens });

        pixso.notify(`Создано ${Object.values(lightToDarkMap).length} соответствий токенов`, { icon: 'SUCCESS' });
    } catch (error) {
        console.error('Error generating token mappings:', error);
        pixso.notify('Ошибка парсинга токенов', { error: true });
    }
};
