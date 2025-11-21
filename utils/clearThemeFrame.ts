import { CONSTANTS } from './constants';

import type { ThemeFrames, ThemeFrameType } from 'types';

export const clearThemeFrame = (theme: ThemeFrameType, themeFrames: ThemeFrames) => {
    if (theme === 'light') {
        themeFrames.lightFrame = null;
        pixso.notify('Светлый фрейм очищен', { icon: 'SUCCESS' });
    } else {
        themeFrames.darkFrame = null;
        pixso.notify('Тёмный фрейм очищен', { icon: 'SUCCESS' });
    }

    pixso.ui.postMessage({
        type: CONSTANTS.msgType.frameCleared,
        theme: theme,
    });
};
