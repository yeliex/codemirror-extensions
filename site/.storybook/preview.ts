import type { Parameters } from '@storybook/html';

export const parameters: Parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    docs: {
        source: {
            language: 'typescript',
        }
    }
};
