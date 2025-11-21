import React, { useEffect, useState, ComponentProps } from 'react';
import { Divider, Flow, TabItem, Tabs } from '@salutejs/sdds-serv';

import './app.css';

import { ActiveTheme, AddTheme, ThemeList } from './components';
import { CONSTANTS } from '../utils/constants';
import { pixsoEventBus } from './helpers/pixso';
import { TabThemeContent } from 'types';

const App = ({}) => {
    const [activeTheme, setActiveTheme] = useState('');
    const [isActiveThemeLoading, setIsActiveThemeLoading] = useState(false);
    const [themeTabValue, setThemeTabValue] = useState<keyof TabThemeContent>('new');

    const themeTabProps = (tabValue: 'new' | 'list') => ({
        view: 'divider' as ComponentProps<keyof typeof TabItem>['view'],
        size: 'm' as ComponentProps<keyof typeof TabItem>['size'],
        selected: themeTabValue === tabValue,
        onClick: () => setThemeTabValue(tabValue),
    });

    const processActiveTheme = (message: any) => {
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
        new: <AddTheme />,
        list: <ThemeList activeTheme={activeTheme} loadActiveTheme={loadActiveTheme} />,
    };

    useEffect(() => {
        loadActiveTheme();
    }, []);

    return (
        <Flow orientation="vertical" mainAxisGap="16px" className="main-wrapper">
            <Tabs view="divider" size="m" stretch>
                <TabItem {...themeTabProps('new')}>Добавить тему</TabItem>
                <TabItem {...themeTabProps('list')}>Список тем</TabItem>
            </Tabs>

            <Flow orientation="vertical" mainAxisGap="32px">
                {ThemeTabContent[themeTabValue]}

                <Divider />

                <ActiveTheme activeTheme={activeTheme} isActiveThemeLoading={isActiveThemeLoading} />
            </Flow>
        </Flow>
    );
};

export default App;
