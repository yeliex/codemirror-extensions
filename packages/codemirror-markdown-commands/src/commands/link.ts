import type { Command } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';

export const link: Command = (view) => {
    const { state } = view;

    const { doc } = state;

    view.dispatch(
        state.changeByRange((range) => {
            const { from, to } = range;

            const text = doc.sliceString(from, to);

            const link = `[${text}]()`;

            const cursor = from + (text.length ? (3 + text.length) : 1);

            return {
                changes: [
                    {
                        from,
                        to,
                        insert: link,
                    },
                ],
                range: EditorSelection.range(cursor, cursor),
            };
        }),
    );

    view.focus();
    return true;
};
