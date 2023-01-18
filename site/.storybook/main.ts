import type { StorybookConfig } from '@storybook/html-vite';
import remarkGfm from 'remark-gfm';
import { mergeConfig } from 'vite';
import ViteConfig from '../vite.config';

const config: StorybookConfig = {
    'stories': [
        '../src/**/*.mdx',
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(ts|tsx)',
    ],

    'addons': [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        {
            name: '@storybook/addon-docs',
            options: {
                mdxPluginOptions: {
                    mdxCompileOptions: {
                        remarkPlugins: [remarkGfm],
                    },
                },
            },
        },
    ],

    framework: '@storybook/html-vite',

    core: {
        builder: '@storybook/builder-vite',
    },

    async viteFinal(config) {
        return mergeConfig(config, ViteConfig);
    },

    docs: {
        autodocs: true,
    },
};

export default config;
