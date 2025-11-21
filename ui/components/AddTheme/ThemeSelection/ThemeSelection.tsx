import React, { Dispatch, SetStateAction } from 'react';
import { Button, InformationWrapper, TextM } from '@salutejs/sdds-serv';
import type { ThemeFrameType } from 'types';

import { CONSTANTS } from '../../../../utils/constants';
import { pixsoEventBus } from '../../../helpers/pixso';

type ThemeSelectionProps = {
    label: string;
    hintText: string;
    selectedFrame: string;
    currentFrame: ThemeFrameType;
    setSelectedFrames: Dispatch<
        SetStateAction<{
            light: string;
            dark: string;
        }>
    >;
};

export const ThemeSelection = ({
    label,
    hintText,
    selectedFrame,
    currentFrame,
    setSelectedFrames,
}: ThemeSelectionProps) => {
    const getButtonText = (themeValue?: string) => {
        return themeValue ? 'Очистить' : 'Подтвердить выбор';
    };

    const getButtonView = (themeValue?: string) => {
        return themeValue ? 'critical' : 'secondary';
    };

    const processSelectFrame = (message: any) => {
        const { frameName, theme } = message;
        setSelectedFrames((prev) => ({
            ...prev,
            [theme]: frameName,
        }));

        pixsoEventBus.off(CONSTANTS.msgType.frameSelected, processSelectFrame);
    };

    const handleSelectFrame = (frame: ThemeFrameType) => {
        const { selectLightFrame, selectDarkFrame } = CONSTANTS.msgType;
        parent.postMessage({ pluginMessage: { type: frame === 'light' ? selectLightFrame : selectDarkFrame } }, '*');

        pixsoEventBus.on(CONSTANTS.msgType.frameSelected, processSelectFrame);
    };

    const processClearFrame = (message: any) => {
        const { theme } = message;
        setSelectedFrames((prev) => ({
            ...prev,
            [theme]: '',
        }));

        pixsoEventBus.off(CONSTANTS.msgType.frameCleared, processClearFrame);
    };

    const handleClearFrame = (frame: ThemeFrameType) => {
        const { clearLightFrame, clearDarkFrame } = CONSTANTS.msgType;
        parent.postMessage({ pluginMessage: { type: frame === 'light' ? clearLightFrame : clearDarkFrame } }, '*');

        pixsoEventBus.on(CONSTANTS.msgType.frameCleared, processClearFrame);
    };

    const getButtonAction = (frame: ThemeFrameType, themeValue?: string) => {
        if (themeValue) {
            return handleClearFrame(frame);
        }

        return handleSelectFrame(frame);
    };

    return (
        <InformationWrapper
            label={label}
            hintText={hintText}
            hintSize="m"
            hintWidth="250px"
            hintPlacement="right-end"
            hasRequiredIndicator
        >
            <div className="frame-selection">
                <TextM className="frame-body">{selectedFrame}</TextM>
                <Button
                    view={getButtonView(selectedFrame)}
                    size="s"
                    text={getButtonText(selectedFrame)}
                    onClick={() => getButtonAction(currentFrame, selectedFrame)}
                    stretch
                />
            </div>
        </InformationWrapper>
    );
};
