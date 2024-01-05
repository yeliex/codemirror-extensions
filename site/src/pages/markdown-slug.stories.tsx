import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { keymap } from '@codemirror/view';
import type { Meta } from '@storybook/html';
import { basicSetup, EditorView } from 'codemirror';
import markdownSlug from 'codemirror-markdown-slug';

export default {
    title: 'packages/codemirror-markdown-slug',
    id: 'markdown-slug',
} as Meta;

export const Basic = () => {
    const container = window.document.createElement('div');
    container.style.height = '100px';
    const shadow = container.attachShadow({ mode: 'open' });

    new EditorView({
        doc: '# Hello World\n## Subtitle {#custom-slug}',
        extensions: [
            basicSetup,
            keymap.of([...defaultKeymap, indentWithTab]),
            markdown({ codeLanguages: languages }),
            markdownSlug(),
        ],
        parent: shadow,
    });

    return container;
};

