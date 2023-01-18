import { Text } from '@codemirror/state';
import { EditorView, type PluginValue, ViewPlugin, ViewUpdate } from '@codemirror/view';

export class FinalNewLinePlugin implements PluginValue {
    constructor(private readonly view: EditorView) {
        setTimeout(() => {
            this.ensureFinalNewLine(true);
        }, 0);
    }

    private ensureFinalNewLine(newLine = false) {
        const endLine = this.view.state.doc.line(this.view.state.doc.lines);

        if (endLine.length) {
            const hasSelection = this.view.state.selection.ranges.some((range) => range.from !== range.to);

            this.view.dispatch({
                    changes: {
                        from: endLine.to,
                        insert: Text.of(['', '']),
                    },
                    selection: newLine && !hasSelection ? {
                        anchor: endLine.to + 1,
                        head: endLine.to + 1,
                    } : undefined,
                },
            );
        }
    }

    update(update: ViewUpdate) {
        if (update.focusChanged) {
            setTimeout(() => {
                this.ensureFinalNewLine();
            }, 0);
        }
    }
}

const plugin = ViewPlugin.fromClass(FinalNewLinePlugin);

export default plugin;
