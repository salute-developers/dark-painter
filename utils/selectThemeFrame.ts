import type { ThemeFrames, ThemeFrameType } from 'types';
import { CONSTANTS } from './constants';

export const selectThemeFrame = (theme: ThemeFrameType, themeFrames: ThemeFrames) => {
    const selection = pixso.currentPage.selection;

    if (selection.length === 0) {
        pixso.notify(`Сначала выделите фрейм с токенами для ${theme === 'light' ? 'светлой' : 'тёмной'} темы`, {
            icon: 'WARN',
        });
        return;
    }

    if (selection.length > 1) {
        pixso.notify('Выделите только один фрейм', { icon: 'WARN' });
        return;
    }

    const selectedNode = selection[0];

    if (selectedNode.type !== 'FRAME' && selectedNode.type !== 'COMPONENT') {
        pixso.notify('Выделите фрейм или компонент', { icon: 'WARN' });
        return;
    }

    if (theme === 'light') {
        themeFrames.lightFrame = selectedNode;
        pixso.notify('Светлый фрейм выбран', { icon: 'SUCCESS' });
    } else {
        themeFrames.darkFrame = selectedNode;
        pixso.notify('Тёмный фрейм выбран', { icon: 'SUCCESS' });
    }

    pixso.ui.postMessage({
        type: CONSTANTS.msgType.frameSelected,
        theme: theme,
        frameName: selectedNode.name,
    });
};
