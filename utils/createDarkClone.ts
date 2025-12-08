import { NodesUnion } from 'types';
import { CONSTANTS } from './constants';

const findDuplicateFrames = (frameNodeName: string) => {
    const duplicates = pixso.currentPage.children.filter((node) => node.name === frameNodeName);

    return duplicates || [];
};

const replaceTokensInFrame = async (
    node: NodesUnion,
    tokenMappingsKeys: Record<string, string>,
    tokenMappingsIds: Record<string, string>,
) => {
    const fillStyleId = node.fillStyleId;

    const currentStyle = pixso.getStyleById(fillStyleId);
    const remoteKey = currentStyle?.key;

    if (remoteKey && tokenMappingsKeys?.[remoteKey]) {
        const style = await pixso.importStyleByKeyAsync(tokenMappingsKeys[remoteKey]);
        node.fillStyleId = style.id;
    } else if (tokenMappingsIds?.[fillStyleId]) {
        node.fillStyleId = tokenMappingsIds[fillStyleId];
    }

    const childStyleReplacePromises = [];
    if ('children' in node && node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
            childStyleReplacePromises.push(replaceTokensInFrame(child, tokenMappingsKeys, tokenMappingsIds));
        }

        await Promise.all(childStyleReplacePromises);
    }
};

export const createDarkClone = async (themeName: string, type?: 'new' | 'replace') => {
    try {
        const selection = pixso.currentPage.selection;

        if (selection.length === 0) {
            pixso.notify('Сначала выделите фрейм с который нужно перекрасить в темную тему', {
                icon: 'WARN',
            });
            return;
        }

        if (selection.length > 1) {
            pixso.notify('Выделите только один фрейм', { icon: 'WARN' });
            return;
        }

        const theme = await pixso.clientStorage.getAsync(themeName);

        if (!theme) {
            pixso.notify('Похоже, что темы не существует. Попробуйте создать новую', { icon: 'WARN' });
        }

        const originalFrame = selection[0];
        const darkFrameName = `DARK_${originalFrame.name}`;

        const duplicatesNodes = findDuplicateFrames(darkFrameName);
        if (duplicatesNodes?.length > 0) {
            if (!type) {
                pixso.ui.postMessage({
                    type: CONSTANTS.msgType.hasDuplicates,
                });
                return;
            }

            if (type === 'replace') {
                duplicatesNodes[0].remove();
            }
        }

        const clonedFrame = originalFrame.clone() as NodesUnion;
        clonedFrame.name = type === 'new' ? `${darkFrameName}_${new Date().getTime()}` : darkFrameName;

        clonedFrame.x = originalFrame.x + originalFrame.width + 100;
        clonedFrame.y = originalFrame.y;

        await replaceTokensInFrame(clonedFrame, theme.lightToDarkMapKeys, theme.lightToDarkMapIds);

        pixso.currentPage.appendChild(clonedFrame, false);
        pixso.currentPage.selection = [clonedFrame];

        pixso.notify(`Фрейм с именем ${darkFrameName} создан`, { icon: 'SUCCESS' });
    } catch (error) {
        console.error(error);
        pixso.notify('Ошибка при создании темного клона', { icon: 'WARN' });
    }

    pixso.ui.postMessage({
        type: CONSTANTS.msgType.darkCloneCreated,
    });
};
