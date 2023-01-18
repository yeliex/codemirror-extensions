import type { Command } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';

const underline: Command = (view) => {
    const currentRange = view.state.selection.main;

    if (currentRange.from >= 3) {
        const charStart = view.state.sliceDoc(currentRange.from - 3, currentRange.from);
        const chatEnd = view.state.sliceDoc(currentRange.to, currentRange.to + 4);

        if(charStart === '<u>' && chatEnd === '</u>') {
            view.focus();
            return false;
        }
    }

    view.dispatch(
        view.state.changeByRange((range) => {
            return {
                changes: [
                    { from: range.from, insert: '<u>' },
                    { from: range.to, insert: '</u>' },
                ],
                range: EditorSelection.range(range.from + 3, range.to + 3),
            };
        }),
    );

    view.focus();

    return true;
}

export default underline;
