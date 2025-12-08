import React, { useEffect, useState, ComponentProps } from 'react';
import { Flow, PopupProvider, TabItem, Tabs } from '@salutejs/sdds-serv';
import { CONSTANTS } from 'utils/constants';
import type { StoredThemes, TabThemeContent } from 'types';

import './app.css';

import { ActiveTheme, ThemeList } from './components';
import { pixsoEventBus } from './helpers/pixso';

type ActiveThemeMessage = {
    themeName: string;
    type: string;
};

const App = ({}) => {
    const [activeTheme, setActiveTheme] = useState('');
    const [isActiveThemeLoading, setIsActiveThemeLoading] = useState(false);
    const [originalThemeList, setOriginalThemeList] = useState<StoredThemes>({});
    const [themeTabValue, setThemeTabValue] = useState<keyof TabThemeContent>('list');

    const themeTabProps = (tabValue: 'new' | 'list') => ({
        view: 'divider' as ComponentProps<keyof typeof TabItem>['view'],
        size: 'm' as ComponentProps<keyof typeof TabItem>['size'],
        selected: themeTabValue === tabValue,
        onClick: () => setThemeTabValue(tabValue),
    });

    const processActiveTheme = (message: ActiveThemeMessage) => {
        const { themeName } = message;
        setActiveTheme(themeName || '');
        setIsActiveThemeLoading(false);

        pixsoEventBus.off(CONSTANTS.msgType.activeThemeFetched, processActiveTheme);
    };

    const loadActiveTheme = () => {
        setIsActiveThemeLoading(true);
        parent.postMessage({ pluginMessage: { type: CONSTANTS.msgType.getActiveTheme } }, '*');

        pixsoEventBus.on(CONSTANTS.msgType.activeThemeFetched, processActiveTheme);
    };

    const ThemeTabContent: TabThemeContent = {
        list: (
            <ThemeList
                activeTheme={activeTheme}
                loadActiveTheme={loadActiveTheme}
                originalThemeList={originalThemeList}
                setOriginalThemeList={setOriginalThemeList}
            />
        ),
        // new: <AddTheme setThemeTabValue={setThemeTabValue} />,
    };

    useEffect(() => {
        loadActiveTheme();
    }, []);

    return (
        <PopupProvider>
            <Flow orientation="vertical" mainAxisGap="16px" className="main-wrapper">
                <Tabs view="divider" size="m" stretch>
                    <TabItem {...themeTabProps('list')}>Список тем</TabItem>
                    {/* <TabItem {...themeTabProps('new')}>Добавить тему</TabItem> */}
                </Tabs>

                {ThemeTabContent[themeTabValue]}

                <ActiveTheme
                    themes={originalThemeList}
                    activeTheme={activeTheme}
                    isActiveThemeLoading={isActiveThemeLoading}
                />
            </Flow>
        </PopupProvider>
    );
};

export default App;
