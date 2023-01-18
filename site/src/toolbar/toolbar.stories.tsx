import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { keymap } from '@codemirror/view';
import type { Meta, StoryFn } from '@storybook/html';
import { basicSetup, EditorView } from 'codemirror';
import finalNewline from 'codemirror-final-newline';
import image, { command as imageUploadCommand } from 'codemirror-markdown-image';
import slugPlugin, { command as slugCommand } from 'codemirror-markdown-slug';
import { markdownItems, toolbar, type ToolbarItem } from 'codemirror-toolbar';

export default {
    title: 'codemirror-toolbar',
} as Meta<any>;

const DOC = `# Hello World {#hw}
## Subtitle
**bold**
*italic*
~~strikethrough~~
<u>underline</u>

> blockquote

- list
- list

1. list
2. list

- [ ] unchecked
- [x] checked

[link](https://github.com){target=blank}
![link](https://github.githubassets.com/assets/mona-loading-default-c3c7aad1282f.gif){target=blank}
![link](__image_uploading__:1212131312)
`;

const Template: StoryFn = (args) => {
    const container = window.document.createElement('div');

    const shadow = container.attachShadow({ mode: 'open' });

    new EditorView({
        doc: DOC,
        extensions: [
            basicSetup,
            finalNewline,
            keymap.of([...defaultKeymap, indentWithTab]),
            markdown({ codeLanguages: languages }),
            EditorView.baseTheme({
                '&.cm-editor': {
                    height: 'calc(100vh - 2em)',
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

                    const lastHeadingIndex = items.findLastIndex(item => 'label'
                        in item
                        && item.label.toLowerCase()
                        === 'h6');

                    items.splice(lastHeadingIndex + 1, 0, {
                        label: 'Slug',
                        icon: '#',
                        command: slugCommand,
                    });

                    return items;
                })(),
            }),
            slugPlugin(),
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
        ...args,
    });

    return container;
};

export const Basic = Template.bind({});

Basic.args = {};
