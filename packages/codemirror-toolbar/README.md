# codemirror-toolbar

<p>
    <a href="https://www.npmjs.com/package/codemirror-toolbar" style="margin-right: 4px">
        <img src="https://img.shields.io/npm/v/codemirror-toolbar" alt="npm">
    </a>
    <a href="https://cm.yeliex.dev/?path=/docs/toolbar">
        <img src="https://therealsujitk-vercel-badge.vercel.app/?app=codemirror-extensions-site-yeliex" alt="vercel deploy">
    </a>
</p>

toolbarw render for codemirror

[Docs and examples](https://cm.yeliex.dev)

## Install

```bash
yarn add codemirror-markdown-slug
```

## Usage

```typescript
import { EditorView } from '@codemirror/view';
import toolbar, { markdownItems } from 'codemirror-toolbar';

new EditorView({
    extensions: [
        toolbar({
            items: markdownItems,
        }),
    ],
});
```

## Plugin Options
```typescript
export interface ToolbarConfig {
    items: Array<ToolbarItem | ToolbarSplit | ToolbarSpace>;
}

export type ToolbarItem = {
    // icon string, html code like svg
    icon: string;
    // render label
    label: string;
    // command to execute
    command: Command;
    // unique key, default `command.name || command.displayName`
    key?: string;
}

// Split slash
export type ToolbarSplit = {
    type: 'split';
}

// Render space with `flex: 1`
export type ToolbarSpace = {
    type: 'space';
}

```
