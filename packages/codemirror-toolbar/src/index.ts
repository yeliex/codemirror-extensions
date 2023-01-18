import { type Command } from '@codemirror/view';
import style from './style';
import plugin from './plugin';

export * from './defaults';
export * as Items from './items';

export type ToolbarItem = {
    icon: string;
    label: string;
    command: Command;
    description?: string;
    key?: string;
    shortcut?: string;
}

export type ToolbarSplit = {
    type: 'split';
}

export type ToolbarSpace = {
    type: 'space'
}

export interface ToolbarConfig {
    items: Array<ToolbarItem | ToolbarSplit | ToolbarSpace>;
}

export const toolbar = (config: ToolbarConfig) => {
    return [plugin(config), style];
};
