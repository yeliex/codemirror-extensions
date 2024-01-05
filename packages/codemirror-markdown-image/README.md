# codemirror-markdown-image
<p>
    <a href="https://www.npmjs.com/package/codemirror-markdown-image" style="margin-right: 4px">
        <img src="https://img.shields.io/npm/v/codemirror-markdown-image" alt="npm">
    </a>
    <a href="https://cm.yeliex.dev/?path=/docs/markdown-image">
        <img src="https://therealsujitk-vercel-badge.vercel.app/?app=codemirror-extensions-site-yeliex" alt="vercel deploy">
    </a>
</p>

image preview and uploader for codemirror markdown editor

[Docs and examples](https://cm.yeliex.dev)

## Install

```bash
yarn add codemirror-markdown-image
```

## Usage

```typescript
import { EditorView } from '@codemirror/view';
import markdownImage, { command } from 'codemirror-markdown-image';

const view = new EditorView({
    extensions: [
        markdownImage({
            action: ({ callback }) => {
                callback.success(FILE_URL);
            },
        }),
    ],
});

// call file select and upload
command(view);
```
