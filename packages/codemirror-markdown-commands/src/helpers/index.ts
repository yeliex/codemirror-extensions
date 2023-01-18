import type { Command } from '@codemirror/view';
import { type ChangeSpec, EditorSelection } from '@codemirror/state';

export const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6): Command => {
    return (view) => {
        const state = view.state;

        const flags = '#'.repeat(level) + ' ';

        view.dispatch(state.changeByRange((range) => {
            const line = state.doc.lineAt(range.from);

            const content = line.text.replace(/^((#+) )?/, flags);

            const diffLength = content.length - line.length;

            return {
                changes: {
                    from: line.from,
                    to: line.to,
                    insert: content,
                },
                range: EditorSelection.range(range.anchor + diffLength, range.head + diffLength),
            };
        }));

        view.focus();

        return true;
    };
};

type ListType = 'ul' | 'ol' | 'todo';

const getListTypeOfLine = (text: string): [ListType, number?] | undefined => {
    text = text && text.trimStart();

    if (!text) {
        return undefined;
    }

    if (text.startsWith('- ')) {
        if (text.startsWith('- [ ] ') || text.startsWith('- [x] ')) {
            return ['todo'];
        }

        return ['ul'];
    }

    const v = text.match(/^(\d+)\. /);

    if (v) {
        return ['ol', Number.parseInt(v[1], 10)];
    }

    return undefined;
};

export const createList = (type: ListType): Command => {
    return (view) => {
        const { state } = view;

        const { doc } = state;

        let olIndex = 1;

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

                    const currentListType = getListTypeOfLine(line.text);

                    if (currentListType && currentListType[0] === type) {
                        if (currentListType[0] === 'ol' && currentListType[1]) {
                            olIndex = currentListType[1];
                        }

                        return;
                    }

                    const content = line.text.replace(/^((?<space> *)(-( \[[x ]])?|\d+\.) )?/, (...args) => {
                        const params = args[args.length - 1];

                        const { space = '' } = params;

                        let newFlag = '- ';

                        if (type === 'ol') {
                            newFlag = `${olIndex}. `;
                            olIndex++;
                        } else if (type === 'todo') {
                            newFlag = '- [ ] ';
                        }

                        return space + newFlag;
                    });

                    const diffLength = content.length - line.length;

                    changes.push({
                        from: line.from,
                        to: line.to,
                        insert: content,
                    });

                    if (index === 0) {
                        selectionStart = selectionStart + diffLength;
                    } else {
                        selectionLength = selectionLength + diffLength;
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
};
