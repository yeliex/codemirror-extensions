# codemirror-markdown-commands
<p>
    <a href="https://www.npmjs.com/package/codemirror-markdown-commands" style="margin-right: 4px">
        <img src="https://img.shields.io/npm/v/codemirror-markdown-commands" alt="npm">
    </a>
    <a href="https://cm.yeliex.dev/?path=/docs/markdown-commands">
        <img src="https://therealsujitk-vercel-badge.vercel.app/?app=codemirror-extensions-site-yeliex" alt="vercel deploy">
    </a>
</p>

commands for markdown text operations, useful with toolbar or invoke manually

[Docs and examples](https://cm.yeliex.dev)

## Install

```bash
yarn add codemirror-markdown-commands
```

## Usage
```typescript
import { EditorView } from '@codemirror/view';
import { bold } from 'codemirror-markdown-commands';

const view = new EditorView({
    
});

bold(view);
```
