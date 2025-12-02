import React, { ChangeEvent, useState } from 'react';

import { Button, Flow, TextField } from '@salutejs/sdds-serv';

import { CONSTANTS } from '../../../utils/constants';

import './AddTheme.styles.css';

export const AddTheme = () => {
    const [themeName, setThemeName] = useState('');

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

            <div className="frame-selection" style={{ marginTop: '12px' }}>
                <div />
                <Button size="s" text="Добавить тему" disabled={!themeName} onClick={handleParseTokens} stretch />
            </div>
        </Flow>
    );
};
