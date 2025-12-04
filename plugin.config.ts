import path from 'path';
import { defineConfig } from '@pixso/plugin-cli';

interface UserConfig {
    ui?: string;
    main?: string;
    manifest?: string;
    configureWebpack?: Object | Function;
}

const config = defineConfig({
    ui: './ui/index.tsx',
    main: './main.ts',
    configureWebpack: {
        resolve: {
            alias: {
                'types/*': path.resolve(__dirname, './types/*'),
                'utils/*': path.resolve(__dirname, './utils/*'),
            },
        },
    },
}) as UserConfig;

export default config;
