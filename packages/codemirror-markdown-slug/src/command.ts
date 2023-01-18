import { EditorView } from '@codemirror/view';

export const command = (_view: EditorView): boolean => {

    return true;
};

command.displayName = 'AddSlug';
