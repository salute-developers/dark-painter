import React, { useState } from 'react';
import { Button, ButtonGroup, InformationWrapper, LineSkeleton, Modal, TextL } from '@salutejs/sdds-serv';
import { CONSTANTS } from 'utils/constants';

import './ActiveTheme.styles.css';

import { pixsoEventBus } from '../../helpers/pixso';

type ActiveThemeProps = {
    isActiveThemeLoading: boolean;
    activeTheme: string;
};

export const ActiveTheme = ({ isActiveThemeLoading, activeTheme }: ActiveThemeProps) => {
    const [isThemeGenerating, setIsThemeGenerating] = useState(false);
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

    const handleDarkCloneCreation = () => {
        setIsThemeGenerating(false);

        pixsoEventBus.off(CONSTANTS.msgType.darkCloneCreated, handleDarkCloneCreation);
        pixsoEventBus.off(CONSTANTS.msgType.hasDuplicates, handleDuplicates);
    };

    const handleDuplicates = () => {
        setIsDuplicateModalOpen(true);

        pixsoEventBus.off(CONSTANTS.msgType.darkCloneCreated, handleDarkCloneCreation);
        pixsoEventBus.off(CONSTANTS.msgType.hasDuplicates, handleDuplicates);
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

        pixsoEventBus.on(CONSTANTS.msgType.darkCloneCreated, handleDarkCloneCreation);
        pixsoEventBus.on(CONSTANTS.msgType.hasDuplicates, handleDuplicates);
    };

    const handleCloneResolving = (type: 'new' | 'replace') => {
        setIsDuplicateModalOpen(false);

        parent.postMessage(
            {
                pluginMessage: {
                    type: CONSTANTS.msgType.createDarkClone,
                    data: {
                        activeTheme,
                        type,
                    },
                },
            },
            '*',
        );

        pixsoEventBus.on(CONSTANTS.msgType.darkCloneCreated, handleDarkCloneCreation);
    };

    const handleModalClose = () => {
        setIsDuplicateModalOpen(false);
        setIsThemeGenerating(false);
    };

    return (
        <>
            <InformationWrapper
                className="active-theme"
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
                        size="xs"
                        text="Покрасить в темную"
                        disabled={isActiveThemeLoading || !activeTheme.length}
                        isLoading={isThemeGenerating}
                        onClick={handleCreateDarkClone}
                        stretch
                    />
                </div>
            </InformationWrapper>
            <Modal
                onClose={() => setIsDuplicateModalOpen(false)}
                opened={isDuplicateModalOpen}
                placement="center"
                offset={[0, 0]}
                closeOnOverlayClick={false}
                closeOnEsc={false}
            >
                <div className="modal-body">
                    <TextL>Такой фрейм с приставкой DARK_ уже существует</TextL>
                    <TextL>Выберите действие:</TextL>
                    <div className="modal-actions">
                        <ButtonGroup shape="segmented" size="xs">
                            <Button text="Заменить" onClick={() => handleCloneResolving('replace')} />
                            <Button text="Создать новый" onClick={() => handleCloneResolving('new')} />
                            <Button text="Отмена" onClick={handleModalClose} />
                        </ButtonGroup>
                    </div>
                </div>
            </Modal>
        </>
    );
};
