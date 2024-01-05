import type { Meta } from '@storybook/html';
import { basicSetup, EditorView } from 'codemirror';
import finalNewline from 'codemirror-final-newline';

export default {
    title: 'packages/codemirror-final-newline',
    id: 'final-new-line',
} as Meta;

export const Basic = () => {
    const container = window.document.createElement('div');

    const shadow = container.attachShadow({ mode: 'open' });

    new EditorView({
        extensions: [basicSetup, finalNewline],
        parent: shadow,
    });

    return container;
};
