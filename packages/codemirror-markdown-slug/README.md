# codemirror-markdown-slug
<p>
    <a href="https://www.npmjs.com/package/codemirror-markdown-slug" style="margin-right: 4px">
        <img src="https://img.shields.io/npm/v/codemirror-markdown-slug" alt="npm">
    </a>
    <a href="https://cm.yeliex.dev/?path=/docs/markdown-image">
        <img src="https://therealsujitk-vercel-badge.vercel.app/?app=codemirror-extensions-site-yeliex" alt="vercel deploy">
    </a>
</p>

slug preview for codemirror markdown, supports github flavored markdown

[Docs and examples](https://cm.yeliex.dev)

## Install

```bash
yarn add codemirror-markdown-slug
```

## Usage
```typescript
import { EditorView } from '@codemirror/view';
import markdownSlug from 'codemirror-markdown-slug';

new EditorView({
    extensions:[markdownSlug()]
});
```
