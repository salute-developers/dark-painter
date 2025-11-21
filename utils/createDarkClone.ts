import { CONSTANTS } from './constants';

const findDuplicates = (frameNodeName: string) => {
    const duplicates = pixso.currentPage.findAll((node) => node.name === frameNodeName) as FrameNode[];

    if (!duplicates?.length) {
        return false;
    }

    return true;
};

// Функция для извлечения цветов из узла
// function extractColorsFromNode(node) {
//     const colors = new Set();

//     // Рекурсивно обходим все дочерние элементы
//     function traverse(node) {
//         if (node.fills && Array.isArray(node.fills)) {
//             console.log(node.fills);
//             node.fills.forEach((fill) => {
//                 if (fill.type === 'SOLID' && fill.color) {
//                     const color = rgbToHex(fill.color);
//                     colors.add(color);
//                 }
//             });
//         }

//         if (node.strokes && Array.isArray(node.strokes)) {
//             node.strokes.forEach((stroke) => {
//                 if (stroke.type === 'SOLID' && stroke.color) {
//                     const color = rgbToHex(stroke.color);
//                     colors.add(color);
//                 }
//             });
//         }

//         // Если у узла есть дочерние элементы, обходим их
//         if (node.children) {
//             node.children.forEach((child) => traverse(child));
//         }
//     }

//     traverse(node);
//     return Array.from(colors);
// }

// // Функция для конвертации RGB в HEX
function rgbToHex(color) {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

async function getDetailedColorTokens(frame) {
    const tokens = {
        fills: [],
        strokes: [],
        text: [],
        effects: [],
    };

    function traverse(node) {
        // Fills с токенами
        if (node.fills && Array.isArray(node.fills)) {
            node.fills.forEach((fill) => {
                if (fill.type === 'SOLID') {
                    console.log(fill);
                    // const tokenInfo = {
                    //     color: rgbToHex(fill.color),
                    //     nodeName: node.name,
                    //     nodeType: node.type,
                    // };

                    // if (fill.styleId) {
                    //     const style = pixso.getStyleById(fill.styleId);
                    //     tokenInfo.tokenName = style?.name;
                    //     tokenInfo.styleId = fill.styleId;
                    //     tokens.fills.push(tokenInfo);
                    // } else {
                    //     tokenInfo.tokenName = 'Local Color';
                    //     tokens.fills.push(tokenInfo);
                    // }
                }
            });
        }

        // Strokes с токенами
        // if (node.strokes && Array.isArray(node.strokes)) {
        //     node.strokes.forEach((stroke) => {
        //         if (stroke.type === 'SOLID') {
        //             const tokenInfo = {
        //                 color: rgbToHex(stroke.color),
        //                 nodeName: node.name,
        //                 nodeType: node.type,
        //             };

        //             if (stroke.styleId) {
        //                 const style = pixso.getStyleById(stroke.styleId);
        //                 tokenInfo.tokenName = style?.name;
        //                 tokenInfo.styleId = stroke.styleId;
        //                 tokens.strokes.push(tokenInfo);
        //             } else {
        //                 tokenInfo.tokenName = 'Local Color';
        //                 tokens.strokes.push(tokenInfo);
        //             }
        //         }
        //     });
        // }

        // // Text styles
        // if (node.characters) {
        //     const tokenInfo = {
        //         nodeName: node.name,
        //         nodeType: node.type,
        //         textContent: node.characters,
        //     };

        //     if (node.textStyleId) {
        //         const style = pixso.getStyleById(node.textStyleId);
        //         if (style) {
        //             tokenInfo.tokenName = style.name;
        //             tokenInfo.styleId = node.textStyleId;
        //             tokenInfo.color = getColorFromTextStyle(style);
        //             tokens.text.push(tokenInfo);
        //         }
        //     }
        // }

        // // Effects (shadows etc)
        // if (node.effects && Array.isArray(node.effects)) {
        //     node.effects.forEach((effect) => {
        //         if (effect.color && effect.type.includes('SHADOW')) {
        //             const tokenInfo = {
        //                 color: rgbToHex(effect.color),
        //                 nodeName: node.name,
        //                 nodeType: node.type,
        //                 effectType: effect.type,
        //             };

        //             if (effect.styleId) {
        //                 const style = pixso.getStyleById(effect.styleId);
        //                 tokenInfo.tokenName = style?.name;
        //                 tokenInfo.styleId = effect.styleId;
        //             } else {
        //                 tokenInfo.tokenName = 'Local Effect';
        //             }

        //             tokens.effects.push(tokenInfo);
        //         }
        //     });
        // }

        if (node.children) {
            node.children.forEach((child) => traverse(child));
        }
    }

    traverse(frame);
    return tokens;
}

const replaceTokensInFrame = (node: any, tokenMappings: Record<string, any>) => {
    console.log(node.children[0]);
    // node.fills = tokenMappings
    // if (node.name === 'Token') {
    //     if (node.children && Array.isArray(node.children)) {
    //         // NOTE: получаем фрейм с цветом (frame.type === Rectangle) и названием (frame.name === textBox)
    //         const tokenInfoNode = node.children[0];

    //         const tokenNameNode = tokenInfoNode.children[1].children[1];
    //         const tokenName = tokenNameNode.characters.replace(/🌕|🌑/g, '');

    //         const prevColorInfo = tokens.get(tokenName);

    //         const tokenColorNode = tokenInfoNode.children[0];
    //         const colorInfo = tokenColorNode.fills;

    //         const mergedColorInfo = {
    //             ...prevColorInfo,
    //             [theme]: colorInfo,
    //         };

    //         tokens.set(tokenName, mergedColorInfo);

    //         return;
    //     }
    // }

    // Рекурсивно обходим дочерние элементы
    // if (node.children && Array.isArray(node.children)) {
    //     for (const child of node.children) {
    //         traverseFrameForTokens(child, tokens, theme);
    //     }
    // }
};

export const createDarkClone = async (themeName: string) => {
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
    // const isNameDuplicate = findDuplicates(darkFrameName);

    // if (isNameDuplicate) {
    //     pixso.notify(`Фрейм с именем ${darkFrameName} уже существует`, { icon: 'WARN' });
    // }

    // console.log('is not duplicate', isNameDuplicate);

    // const clonedFrame = originalFrame.clone();
    // clonedFrame.name = darkFrameName;

    // clonedFrame.x = originalFrame.x + originalFrame.width + 100;
    // clonedFrame.y = originalFrame.y;

    // replaceTokensInFrame(clonedFrame, theme.tokenMappings);
    const colors = await getDetailedColorTokens(originalFrame);
    console.log('Найденные цвета:', colors);

    // pixso.currentPage.appendChild(clonedFrame, false);
    // pixso.currentPage.selection = [clonedFrame];

    pixso.notify(`Фрейм с именем ${darkFrameName} создан`, { icon: 'SUCCESS' });

    pixso.ui.postMessage({
        type: CONSTANTS.msgType.darkCloneCreated,
    });
};
