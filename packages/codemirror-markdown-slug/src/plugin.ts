import { Line, RangeSetBuilder } from '@codemirror/state';
import {
    Decoration,
    type DecorationSet,
    EditorView,
    type PluginValue,
    ViewPlugin,
    ViewUpdate,
    WidgetType,
} from '@codemirror/view';
import { slug as createSlug } from 'github-slugger';

class SlugWidget extends WidgetType {
    renderSlug: string | undefined;

    constructor(
        public readonly title: string,
        public readonly slug: string | undefined,
    ) {
        super();

        this.renderSlug = slug || createSlug(title.trim());
    }

    toDOM(_view: EditorView): HTMLElement {
        const el = window.document.createElement('span');
        el.innerHTML = `#${this.renderSlug}`;
        el.classList.add('codemirror-markdown-slug');
        if (!this.slug) {
            el.classList.add('codemirror-markdown-slug--default');
        }

        return el;
    }

    override ignoreEvent() {
        return false;
    }
}

export const TITLE_MATCH_REGEXP = /^#+\s.*/;

interface ParseTitleResult {
    level: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    title: string | undefined;
    slug: string | undefined;
}

const parseTitle = (text: string): ParseTitleResult => {
    const res: ParseTitleResult = {
        level: 0,
        title: '',
        slug: '',
    };

    const match = text.match(/^(?<level>#{1,6}) (?<content>.*)$/);

    if (!match) {
        return res;
    }

    res.level = match.groups!.level.length as ParseTitleResult['level'];

    const titleContent = match.groups!.content;

    const slugMatch = titleContent.match(/^(?<content>.*) \{#(?<slug>.*)}$/);

    if (slugMatch) {
        res.title = slugMatch.groups!.content;
        res.slug = slugMatch.groups!.slug;
    } else {
        res.title = titleContent;
    }

    return res;
};

const isHeading = (text: string | undefined): boolean => {
    return !!text && TITLE_MATCH_REGEXP.test(text);
};

export class SlugPlugin implements PluginValue {
    decorations: DecorationSet = Decoration.none;

    constructor(private readonly view: EditorView) {
        this.renderWidgets();
    }

    private getDecorationForText(line: Line) {
        if (!line.text || !isHeading(line.text)) {
            return;
        }

        const { level, title, slug } = parseTitle(line.text);

        if (!title) {
            return;
        }

        return {
            level,
            title,
            slug,
            from: line.from + title.length + level + 1,
            to: line.to,
            value: Decoration.replace({
                widget: new SlugWidget(title, slug),
            }),
        };
    }

    private renderWidgets() {
        const { state } = this.view;
        const { doc } = state;
        const currentLine = this.view.hasFocus ? doc.lineAt(state.selection.main.head).number : 0;

        const lineCount = doc.lines;

        const decorations = new RangeSetBuilder<Decoration>();

        for (let i = 1; i <= lineCount; i++) {
            if (i === currentLine) {
                continue;
            }

            const line = doc.line(i);

            if (!isHeading(line.text)) {
                continue;
            }

            const item = this.getDecorationForText(line);

            if (item) {
                decorations.add(
                    item.from,
                    item.to,
                    item.value,
                );
            }
        }

        this.decorations = decorations.finish();
    }

    update(update: ViewUpdate) {
        if (update.docChanged) {
            this.renderWidgets();

            return;
        }

        const { state, startState } = update;

        if (update.focusChanged) {
            const line = state.doc.lineAt(state.selection.main.head);

            if (isHeading(line.text)) {
                if (update.view.hasFocus) {
                    this.decorations = this.decorations.update({
                        filterFrom: line.from,
                        filterTo: line.to,
                        filter: () => {
                            return false;
                        },
                    });
                } else {
                    const item = this.getDecorationForText(line);

                    if (item) {
                        this.decorations = this.decorations.update({
                            add: [
                                {
                                    from: item.from,
                                    to: item.to,
                                    value: item.value,
                                },
                            ],
                        });
                    }
                }
            }

            return;
        }

        if (update.selectionSet) {
            const fromLine = startState.doc.lineAt(startState.selection.main.head);
            const toLine = state.doc.lineAt(state.selection.main.head);

            if (fromLine.number === toLine.number) {
                return;
            }

            if (isHeading(toLine.text)) {
                this.decorations = this.decorations.update({
                    filterFrom: toLine.from,
                    filterTo: toLine.to,
                    filter: () => {
                        return false;
                    },
                });
            }

            if (isHeading(fromLine.text)) {
                const item = this.getDecorationForText(fromLine);

                if (item) {
                    this.decorations = this.decorations.update({
                        add: [
                            {
                                from: item.from,
                                to: item.to,
                                value: item.value,
                            },
                        ],
                    });
                }
            }
        }
    }
}

const plugin = ViewPlugin.fromClass(
    SlugPlugin,
    {
        decorations: (v) => v.decorations,
        provide: (v) => {
            return EditorView.atomicRanges.of((view) => {
                return view.plugin(v)?.decorations || Decoration.none;
            });
        },
    },
);

export default plugin;
