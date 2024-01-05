import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { keymap } from '@codemirror/view';
import type { Meta } from '@storybook/html';
import { basicSetup, EditorView } from 'codemirror';
import image, { command as imageUploadCommand } from 'codemirror-markdown-image';
import toolbar, { markdownItems, type ToolbarItem } from 'codemirror-toolbar';

export default {
    title: 'packages/codemirror-toolbar',
    id: 'toolbar',
} as Meta;

export const Basic = () => {
    const container = window.document.createElement('div');
    container.style.height = '200px';
    const shadow = container.attachShadow({ mode: 'open' });

    new EditorView({
        doc: '# Hello World\n## Subtitle {#custom-slug}',
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
            toolbar({
                items: markdownItems,
            }),
        ],
        parent: shadow,
    });

    return container;
};

export const ImageUpload = () => {
    const container = window.document.createElement('div');
    container.style.height = '200px';
    const shadow = container.attachShadow({ mode: 'open' });

    new EditorView({
        doc: '# Hello World\n## Subtitle {#custom-slug}',
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
            toolbar({
                items: (() => {
                    const items = [...markdownItems];

                    const imageIndex = items.findIndex((item) => 'label'
                        in item
                        && item.label.toLowerCase()
                        === 'image');

                    items[imageIndex] = {
                        ...items[imageIndex],
                        command: imageUploadCommand,
                    } as ToolbarItem;

                    return items;
                })(),
            }),
            image({
                multiple: true,
                action: ({ callback }) => {
                    let index = 0;
                    const interval = setInterval(() => {
                        if (index === 100) {
                            clearInterval(interval);
                            callback.success(
                                'https://img.yzcdn.cn/upload_files/2020/01/09/FqrFWXnbxaU3vARLyBzLno4wAVeK.jpeg!origin.jpg');
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

    return container;
}
