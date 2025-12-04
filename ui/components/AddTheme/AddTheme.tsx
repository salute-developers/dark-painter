import React, { useState } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { Button, Flow, TextField } from '@salutejs/sdds-serv';
import { CONSTANTS } from 'utils/constants';
import type { TabThemeContent } from 'types';

import './AddTheme.styles.css';
import { pixsoEventBus } from '../../helpers/pixso';

type AddThemeProps = {
    setThemeTabValue: Dispatch<SetStateAction<keyof TabThemeContent>>;
};

export const AddTheme = ({ setThemeTabValue }: AddThemeProps) => {
    const [themeName, setThemeName] = useState('');

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setThemeName(e.target.value);
    };

    const processParsedTokens = () => {
        setThemeName('');
        setThemeTabValue('list');

        pixsoEventBus.off(CONSTANTS.msgType.parsedTokens, processParsedTokens);
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

        pixsoEventBus.on(CONSTANTS.msgType.parsedTokens, processParsedTokens);
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
