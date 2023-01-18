import type { Command } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';

const italic: Command = (view) => {
    const currentRange = view.state.selection.main;

    if (currentRange.from >= 1) {
        const charStart = view.state.sliceDoc(currentRange.from - 1, currentRange.from);
        const chatEnd = view.state.sliceDoc(currentRange.to, currentRange.to + 1);

        if (charStart === '*' && chatEnd === '*') {
            if (
                (currentRange.from < 2 ||
                    view.state.sliceDoc(currentRange.from - 1, currentRange.from) !== '*' ||
                    view.state.sliceDoc(currentRange.to, currentRange.to + 1) !== '*') ||
                (
                    currentRange.from >= 3 &&
                    view.state.sliceDoc(currentRange.from - 3, currentRange.from) === '***' &&
                    view.state.sliceDoc(currentRange.to, currentRange.to + 3) === '***'
                )
            ) {
                view.focus();
                return false;
            }
        }
    }

    view.dispatch(
        view.state.changeByRange((range) => {
            return {
                changes: [
                    { from: range.from, insert: '*' },
                    { from: range.to, insert: '*' },
                ],
                range: EditorSelection.range(range.from + 1, range.to + 1),
            };
        }),
    );

    view.focus();

    return true;
};

export default italic;
