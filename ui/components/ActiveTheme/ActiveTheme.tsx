import React, { useState } from 'react';
import { Button, InformationWrapper, LineSkeleton, TextL } from '@salutejs/sdds-serv';

import { CONSTANTS } from '../../../utils/constants';
import { pixsoEventBus } from '../../helpers/pixso';

type ActiveThemeProps = {
    isActiveThemeLoading: boolean;
    activeTheme: string;
};

export const ActiveTheme = ({ isActiveThemeLoading, activeTheme }: ActiveThemeProps) => {
    const [isThemeGenerating, setIsThemeGenerating] = useState(false);

    const processThemeGenerating = () => {
        setIsThemeGenerating(false);

        pixsoEventBus.off(CONSTANTS.msgType.darkCloneCreated, processThemeGenerating);
    };

    const handleCreateDarkClone = () => {
        if (isThemeGenerating) {
            return;
        }

        setIsThemeGenerating(true);
        parent.postMessage(
            {
                pluginMessage: {
                    type: CONSTANTS.msgType.createDarkClone,
                    data: {
                        activeTheme,
                    },
                },
            },
            '*',
        );

        pixsoEventBus.on(CONSTANTS.msgType.darkCloneCreated, processThemeGenerating);
    };

    return (
        <InformationWrapper
            label="Текущая активная тема"
            hintText="Соответствия токенов, на основании которых, выбранный фрейм будет перекрашен в токены темной темы"
            hintSize="m"
            hintWidth="290px"
        >
            <div className="frame-selection">
                {isActiveThemeLoading ? (
                    <LineSkeleton size="textL" />
                ) : (
                    <TextL bold>{activeTheme.replace(CONSTANTS.storagePrefix, '')}</TextL>
                )}
                <Button
                    size="s"
                    text="Устроить темную"
                    disabled={isActiveThemeLoading || !activeTheme.length}
                    isLoading={isThemeGenerating}
                    onClick={handleCreateDarkClone}
                    stretch
                />
            </div>
        </InformationWrapper>
    );
};
