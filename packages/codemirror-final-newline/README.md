# codemirror-final-newline

<p>
    <a href="https://www.npmjs.com/package/codemirror-final-newline" style="margin-right: 4px">
        <img src="https://img.shields.io/npm/v/codemirror-final-newline" alt="npm">
    </a>
    <a href="https://cm.yeliex.dev/?path=/docs/final-newline">
        <img src="https://therealsujitk-vercel-badge.vercel.app/?app=codemirror-extensions-site-yeliex" alt="vercel deploy">
    </a>
</p>

add final newline for codemirror

[Docs and examples](https://cm.yeliex.dev)

## Install

```bash
yarn add codemirror-final-newline
```

## Usage

```typescript
import finalNewLine from 'codemirror-final-newline';
import { EditorView } from '@codemirror/view';

new EditorView({
    extensions: [finalNewline],
});
```
