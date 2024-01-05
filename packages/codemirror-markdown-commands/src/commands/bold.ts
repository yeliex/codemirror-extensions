import { EditorSelection } from '@codemirror/state';
import type { Command } from '@codemirror/view';

const bold: Command = (view) => {
    const currentRange = view.state.selection.main;

    if (currentRange.from >= 2) {
        const charStart = view.state.sliceDoc(currentRange.from - 2, currentRange.from);
        const chatEnd = view.state.sliceDoc(currentRange.to, currentRange.to + 2);

        if (charStart === '**' && chatEnd === '**') {
            view.focus();
            return false;
        }
    }

    view.dispatch(
        view.state.changeByRange((range) => {
            return {
                changes: [
                    { from: range.from, insert: '**' },
                    { from: range.to, insert: '**' },
                ],
                range: EditorSelection.range(range.from + 2, range.to + 2),
            };
        }),
    );

    view.focus();

    return true;
};

export default bold;
