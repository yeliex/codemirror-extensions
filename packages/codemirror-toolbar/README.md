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

### Customize toolbar items
```typescript
import { EditorView } from '@codemirror/view';
import toolbar from 'codemirror-toolbar';
import * as Items from 'codemirror-toolbar/items';
import * as MarkdownItems from 'codemirror-toolbar/items/markdown';

new EditorView({
    extensions: [
        toolbar({
            items: [
                MarkdownItems.bold,
                MarkdownItems.italic,
                MarkdownItems.strike,
                MarkdownItems.underline,
                Items.split,
                MarkdownItems.h1,
                MarkdownItems.h2,
                MarkdownItems.h3,
                MarkdownItems.h4,
                MarkdownItems.h5,
                MarkdownItems.h6,
                Items.split,
                MarkdownItems.quote,
                MarkdownItems.ul,
                MarkdownItems.ol,
                MarkdownItems.todo,
                Items.split,
                MarkdownItems.link,
                {
                    ...MarkdownItems.image,
                    command: (view: EditorView) => {
                        view.dispatch({
                            // ...
                        });
                        
                        return true;
                    }
                },
                Items.space,
                Items.fullScreen,
            ],
        }),
    ],
});
```

## Plugin Options
```typescript
import { type Command } from '@codemirror/view';

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
