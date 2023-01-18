import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, EditorView, type PluginValue, ViewPlugin, type ViewUpdate } from '@codemirror/view';
import { FILE_CACHE, IMAGE_CATCH_REGEXP, IMAGE_MATCH_REGEXP, IMAGE_UPLOADING_FLAG_MATCH } from './consts';
import PreviewWidget from './PreviewWidget';

export class PreviewPlugin implements PluginValue {
    decorations = Decoration.none;

    constructor(private readonly view: EditorView) {
        this.renderWidgets();
    }

    private renderWidgets() {
        const { state } = this.view;
        const { doc } = state;
        const lineCount = doc.lines;

        const decorations = new RangeSetBuilder<Decoration>();

        for (let i = 1; i <= lineCount; i++) {
            const line = doc.line(i);

            if (!line.length) {
                continue;
            }

            if (!IMAGE_MATCH_REGEXP.exec(line.text)) {
                continue;
            }

            const matched = IMAGE_CATCH_REGEXP.exec(line.text)!;

            let url = matched.groups!.url;

            if (IMAGE_UPLOADING_FLAG_MATCH.test(url)) {
                const id = url.replace(IMAGE_UPLOADING_FLAG_MATCH, '');

                if (FILE_CACHE.has(id)) {
                    const item = FILE_CACHE.get(id)!;
                    if(item.url) {
                        url = item.url;
                    } else {
                        url = URL.createObjectURL(item.file);
                        item.url = url;
                    }
                } else {
                    continue;
                }
            }

            if (URL.canParse(url)) {
                const widget = new PreviewWidget(url);

                decorations.add(line.from, line.from, Decoration.line({
                    class: 'cm-image-preview',
                }));
                decorations.add(line.to, line.to, Decoration.widget({
                    widget,
                }));
            }
        }

        this.decorations = decorations.finish();
    }

    update(update: ViewUpdate) {
        if (update.docChanged) {
            this.renderWidgets();
        }
    }
}

const previewPlugin = () => {
    return ViewPlugin.define(
        view => new PreviewPlugin(view),
        {
            decorations: v => v.decorations,
            provide: (v) => {
                return EditorView.atomicRanges.of((view) => {
                    return view.plugin(v)?.decorations || Decoration.none;
                });
            },
        },
    );
};

export default previewPlugin;
