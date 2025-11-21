import React, { ChangeEvent, useState } from 'react';

import { Button, Flow, TextField } from '@salutejs/sdds-serv';

import { CONSTANTS } from '../../../utils/constants';

import './AddTheme.styles.css';
import { ThemeSelection } from './ThemeSelection';

export const AddTheme = () => {
    const [themeName, setThemeName] = useState('');

    const [selectedFrames, setSelectedFrames] = useState({
        light: '',
        dark: '',
    });

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setThemeName(e.target.value);
    };

    const handleParseTokens = () => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: CONSTANTS.msgType.parseTokens,
                    data: {
                        themeName,
                    },
                },
            },
            '*',
        );
    };

    return (
        <Flow orientation="vertical" mainAxisGap="14px" style={{ alignContent: 'unset' }}>
            <TextField
                value={themeName}
                onChange={handleChangeName}
                label="Имя темы"
                placeholder="sdds_serv"
                size="l"
                required
                hasRequiredIndicator
            />

            <ThemeSelection
                label="Светлый фрейм"
                hintText='Выделите фрейм с токенами светлой темы и нажмите кнопку "Подтвердить выбор".'
                selectedFrame={selectedFrames.light}
                currentFrame="light"
                setSelectedFrames={setSelectedFrames}
            />

            <ThemeSelection
                label="Темный фрейм"
                hintText='Выделите фрейм с токенами темной темы и нажмите кнопку "Подтвердить выбор".'
                selectedFrame={selectedFrames.dark}
                currentFrame="dark"
                setSelectedFrames={setSelectedFrames}
            />

            <div className="frame-selection" style={{ marginTop: '12px' }}>
                <div />
                <Button
                    size="s"
                    text="Добавить тему"
                    disabled={!selectedFrames.light || !selectedFrames.dark || !themeName}
                    onClick={handleParseTokens}
                    stretch
                />
            </div>
        </Flow>
    );
};
