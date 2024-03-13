import { type Command } from '@codemirror/view';
import plugin from './plugin';
import style from './style';

export * from './defaults';

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
    type: 'space';
}

export interface ToolbarConfig {
    items: Array<ToolbarItem | ToolbarSplit | ToolbarSpace>;
}

export default (config: ToolbarConfig) => {
    return [plugin(config), style];
};
