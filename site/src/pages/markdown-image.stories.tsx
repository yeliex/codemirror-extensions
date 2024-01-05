import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { keymap } from '@codemirror/view';
import type { Meta } from '@storybook/html';
import { basicSetup, EditorView } from 'codemirror';
import markdownImage, { command, type UploadOption, previewStyle, PreviewPlugin } from 'codemirror-markdown-image';

export default {
    title: 'packages/codemirror-markdown-image',
    id: 'markdown-image',
    argTypes: {
        'accept': {
            type: 'string',
            table: {
                defaultValue: 'image/*',
            },
            description: '`string` [accept mime](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept)'
        },
        'multiple': {
            type: 'boolean',
            description: '`string` [multiple](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#multiple)'
        },
        'generateId': {
            type: 'function',
            description: '`(file: File) => Promise<string>` function to generate fileId, for inner cache'
        },
        'action': {
            type: 'function',
            description: '`(option: UploadOption) => void` function to upload file'
        },
        'UploadOption.file': {
            type: 'File',
            description: '`File` file to upload'
        },
        'UploadOption.id': {
            type: 'string',
            description: '`string` fileId'
        },
        'UploadOption.progress': {
            type: 'function',
            description: '`(progress: number) => void` function to update progress'
        },
        'UploadOption.success': {
            type: 'function',
            description: '`(url: string) => void` function to update url'
        },
        'UploadOption.error': {
            type: 'function',
            description: '`(error: Error) => void` function to update error'
        },
    },
} as Meta<UploadOption>;

export const Basic = () => {
    const wrapper = window.document.createElement('div');
    const container = window.document.createElement('div');
    container.style.height = '300px';
    const buttons = window.document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.flexWrap = 'wrap';
    buttons.style.gap = '12px';
    buttons.style.marginBottom = '24px';
    wrapper.appendChild(buttons);
    wrapper.appendChild(container);
    const shadow = container.attachShadow({ mode: 'open' });

    const view = new EditorView({
        doc: '![image](https://github.githubassets.com/assets/mona-loading-default-c3c7aad1282f.gif)',
        extensions: [
            basicSetup,
            keymap.of([...defaultKeymap, indentWithTab]),
            markdown({ codeLanguages: languages }),
            markdownImage({
                action: ({ callback }) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        if (index === 100) {
                            clearInterval(interval);
                            callback.success(
                                'https://github.githubassets.com/assets/mona-loading-default-c3c7aad1282f.gif');
                            return;
                        }

                        index++;
                        callback.progress(index);
                    }, 50);
                },
            }),
        ],
        parent: shadow,
    });

    const button = window.document.createElement('button');
    button.innerText = 'upload image';
    button.onclick = () => {
        command(view);
    };
    buttons.appendChild(button);

    return wrapper;
};

export const PreviewOnly = () => {
    const container = window.document.createElement('div');
    container.style.height = '100px';
    const shadow = container.attachShadow({ mode: 'open' });
    new EditorView({
        doc: '![image](https://github.githubassets.com/assets/mona-loading-default-c3c7aad1282f.gif)',
        extensions: [
            basicSetup,
            keymap.of([...defaultKeymap, indentWithTab]),
            markdown({ codeLanguages: languages }),
            EditorView.baseTheme({
                '&.cm-editor': {
                    height: '100%',
                    backgroundColor: '#FFFFFF',
                },
            }),
            [previewStyle, PreviewPlugin()]
        ],
        parent: shadow,
    });

    return container;
}
