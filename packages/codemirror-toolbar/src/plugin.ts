import { type Command, type EditorView, type PluginValue, ViewPlugin } from '@codemirror/view';
import { type ToolbarConfig } from './index';
import { createElement } from './libs/dom';

export class ToolbarPlugin implements PluginValue {
    private readonly element: HTMLDivElement;

    protected readonly config: ToolbarConfig;

    protected readonly handlers: Record<string, Command> = {};

    constructor(private readonly view: EditorView, config: ToolbarConfig) {
        this.config = {
            ...config,
            items: config.items.map((item, index) => {
                if ('type' in item) {
                    return { ...item };
                }

                const key = item.key || (item.command as any).displayName || item.command?.name || `cmd_${index}`;

                this.handlers[key] = item.command;

                return {
                    ...item,
                    key,
                };
            }),
        };

        const element = this.element = createElement(this.config);

        element.addEventListener('click', this.handleClick.bind(this));

        this.view.dom.prepend(element);
    }

    private handleClick(e: MouseEvent) {
        const target = e.target;

        if (target && (target as HTMLButtonElement).tagName === 'BUTTON') {
            const cmd = (target as HTMLButtonElement).dataset.item;

            if (cmd) {
                const command = this.handlers[cmd];

                if (command) {
                    e.preventDefault();
                    e.stopPropagation();

                    command(this.view);

                    return;
                }
            }
        }

        this.view.focus();
    }

    destroy() {
        this.element.remove();
    }
}

const plugin = (config: ToolbarConfig) => {
    return ViewPlugin.define(view => new ToolbarPlugin(view, config));
};

export default plugin;
