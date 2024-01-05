import { type ChangeSpec, EditorSelection } from '@codemirror/state';
import type { Command } from '@codemirror/view';

const quote: Command = (view) => {
    const { state } = view;

    const { doc } = state;

    view.dispatch(
        view.state.changeByRange((range) => {
            const startLine = doc.lineAt(range.from);

            const text = doc.slice(range.from, range.to);

            const lineCount = text.lines;

            const changes: ChangeSpec[] = [];

            let selectionStart: number = range.from;
            let selectionLength: number = range.to - range.from;

            new Array(lineCount).fill(0).forEach((_, index) => {
                const line = doc.line(startLine.number + index);

                if (line.text.startsWith('> ')) {
                    return;
                }
                changes.push({
                    from: line.from,
                    insert: '> ',
                });

                if (index === 0) {
                    selectionStart = selectionStart + 2;
                } else {
                    selectionLength += 2;
                }
            });

            return {
                changes,
                range: EditorSelection.range(selectionStart, selectionStart + selectionLength),
            };
        }),
    );

    view.focus();

    return true;
};

export default quote;
