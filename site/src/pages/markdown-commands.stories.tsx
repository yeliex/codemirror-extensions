import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { keymap } from '@codemirror/view';
import { basicSetup, EditorView } from 'codemirror';
import * as Commands from 'codemirror-markdown-commands';

export default {
    title: 'packages/codemirror-markdown-commands',
    id: 'markdown-commands'
};

export const Basic = () => {
    const wrapper = window.document.createElement('div');
    const container = window.document.createElement('div');
    const buttons = window.document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.flexWrap = 'wrap';
    buttons.style.gap = '12px';
    buttons.style.marginBottom = '24px';
    wrapper.appendChild(buttons);
    wrapper.appendChild(container);
    const shadow = container.attachShadow({ mode: 'open' });

    const view = new EditorView({
        doc: '# Hello World',
        extensions: [
            basicSetup,
            keymap.of([...defaultKeymap, indentWithTab]),
            markdown({ codeLanguages: languages }),
        ],
        parent: shadow,
    });

    (Object.keys(Commands) as Array<keyof typeof Commands>).forEach((name) => {
        const item = window.document.createElement('button');
        item.innerText = name;
        item.onclick = () => {
            console.log(`click: ${name}`);
            Commands[name](view);
        };
        buttons.appendChild(item);
    });

    return wrapper;
};
