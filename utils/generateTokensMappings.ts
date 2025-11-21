import type { ThemeFrames, ThemeFrameType } from 'types';
import { CONSTANTS } from './constants';

const traverseFrameForTokens = (node: any, tokens: Map<string, any>, theme: ThemeFrameType) => {
    if (node.name === 'Token') {
        if (node.children && Array.isArray(node.children)) {
            // NOTE: получаем фрейм с цветом (frame.type === Rectangle) и названием (frame.name === textBox)
            const tokenInfoNode = node.children[0];

            const tokenNameNode = tokenInfoNode.children[1].children[1];
            const tokenName = tokenNameNode.characters.replace(/🌕|🌑/g, '');

            const prevColorInfo = tokens.get(tokenName);

            const tokenColorNode = tokenInfoNode.children[0];
            const colorInfo = tokenColorNode.fills;

            const mergedColorInfo = {
                ...prevColorInfo,
                [theme]: colorInfo,
            };

            tokens.set(tokenName, mergedColorInfo);

            return;
        }
    }

    // Рекурсивно обходим дочерние элементы
    if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
            traverseFrameForTokens(child, tokens, theme);
        }
    }
};

export const generateTokenMappings = async (
    themeFrames: ThemeFrames,
    tokenMappings: Map<string, any>,
    themeName: string,
) => {
    if (!themeName) {
        pixso.notify('Задайте имя для темы', { icon: 'INFO' });
        return;
    }

    if (!themeFrames.lightFrame || !themeFrames.darkFrame) {
        pixso.notify('Сначала выберите оба фрейма (светлый и тёмный)', { icon: 'INFO' });
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

        traverseFrameForTokens(themeFrames.lightFrame, tokenMappings, 'light');
        traverseFrameForTokens(themeFrames.darkFrame, tokenMappings, 'dark');

        const parsedTokens = Object.fromEntries(tokenMappings);
        const lightFrameLink = CONSTANTS.pixsoThemeFrameLink(
            pixso.origin,
            pixso?.fileKey || '',
            themeFrames.lightFrame.id,
        );
        const darkFrameLink = CONSTANTS.pixsoThemeFrameLink(
            pixso.origin,
            pixso?.fileKey || '',
            themeFrames.darkFrame.id,
        );

        await pixso.clientStorage.setAsync(themeKey, { parsedTokens, lightFrameLink, darkFrameLink });

        pixso.ui.postMessage({ type: CONSTANTS.msgType.parsedTokens });

        pixso.notify(`Создано ${tokenMappings.size} соответствий токенов`, { icon: 'SUCCESS' });
    } catch (error) {
        console.error('Error generating token mappings:', error);
        pixso.notify('Ошибка парсинга токенов', { error: true });
    }
};
