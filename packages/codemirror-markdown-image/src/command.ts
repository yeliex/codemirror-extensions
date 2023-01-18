import { EditorView } from '@codemirror/view';
import { selectFileTriggerEffect } from './state';

export const command = (view: EditorView) => {
    view.dispatch({
        effects: selectFileTriggerEffect.of(
            {
                flag: Date.now(),
                anchor: view.state.selection.main.anchor,
                head: view.state.selection.main.head,
            },
        ),
    });

    return true;
};

command.displayName = 'AddImage';
