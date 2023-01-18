import { EditorSelection, RangeSetBuilder, Text } from '@codemirror/state';
import {
    Decoration,
    type DecorationSet,
    EditorView,
    type PluginValue,
    ViewPlugin,
    ViewUpdate,
} from '@codemirror/view';
import { FILE_CACHE, IMAGE_UPLOADING_CACHE_REGEXP, IMAGE_UPLOADING_FLAG } from './consts';
import { selectFileTriggerEffect, type UploadAction, uploadActionEffect } from './state';
import UploadWidget from './UploadWidget';
import { generateId } from './utils';

interface UploadCallback {
    progress: (percent: number) => void;
    fail: (error: Error) => void;
    success: (url: string) => void;
}

export interface UploadActionParams {
    id: string;
    file: File;
    signal?: AbortSignal;
    callback: UploadCallback;
}

export interface UploadOption {
    multiple: boolean;
    accept: string;
    action: (params: UploadActionParams) => void;
    generateId: (file: File) => string | Promise<string>;
}

export interface CacheItem {
    id: string;
    url: string;
}

interface InsertPosition {
    anchor: number;
    head: number;
}

const DEFAULT_OPTIONS: Omit<UploadOption, 'action'> = {
    multiple: true,
    accept: 'image/*',
    generateId,
};

export class UploadPlugin implements PluginValue {
    decorations: DecorationSet = Decoration.none;

    private readonly options: UploadOption;

    constructor(
        private readonly view: EditorView,
        options: Partial<Omit<UploadOption, 'action'>> & Pick<UploadOption, 'action'>,
    ) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options,
        };

        this.renderWidgets();
    }

    private handleUploadFile(id: string) {
        const item = FILE_CACHE.get(id);

        if (!item) {
            return;
        }

        const { file } = item;

        this.options.action({
            id,
            file,
            callback: {
                progress: (percent) => {
                    item.progress = percent;
                    this.view.dispatch({
                        effects: uploadActionEffect.of({
                            id,
                            action: 'progress',
                            percent,
                        }),
                    });
                },
                success: (url) => {
                    item.status = 'success';
                    item.url = url;
                    this.view.dispatch({
                        effects: uploadActionEffect.of({
                            id,
                            action: 'success',
                            url,
                        }),
                    });
                },
                fail: (error) => {
                    item.status = 'error';
                    this.view.dispatch({
                        effects: uploadActionEffect.of({
                            id,
                            action: 'fail',
                            message: error.message,
                        }),
                    });
                },
            },
        });
    }

    private async uploadFiles(files: File[], position?: InsertPosition) {
        const lastLine = this.view.state.doc.line(this.view.state.doc.lines);
        const pos = position || {
            anchor: lastLine.to,
            head: lastLine.to,
        };

        const [from, to] = [pos.anchor, pos.head].sort();

        const text = pos.head === pos.anchor ? '' : this.view.state.doc.sliceString(from, to);

        const [lineBefore, lineAfter] = (() => {
            const fromLine = this.view.lineBlockAt(from);
            const toLine = this.view.lineBlockAt(to);

            if (fromLine.from === toLine.from) {
                const charBefore = this.view.state.doc.sliceString(from - 1, from);
                const charEnd = this.view.state.doc.sliceString(to, to + 1);

                if (charBefore === '[' && charEnd === ']') {
                    return [false, false];
                }
            }

            if (text) {
                return [false, false];
            }

            const startOfLine = fromLine.from === from;
            const endOfLine = toLine.to === to;

            return [
                !startOfLine,
                !endOfLine,
            ];
        })();

        const imageTags: string[] = [];

        const list: string[] = [];

        for (const file of files) {
            const id = await this.options.generateId(file);

            if (FILE_CACHE.has(id)) {
                const item = FILE_CACHE.get(id)!;

                if (item.status === 'success') {
                    imageTags.push(`![${text || file.name}](${item.url})`);
                    continue;
                }

                if (item.status === 'uploading') {
                    imageTags.push(`![${text || file.name}](${IMAGE_UPLOADING_FLAG}:${id})`);
                    continue;
                }

                if (item.status === 'error') {
                    FILE_CACHE.delete(id);
                }
            }

            FILE_CACHE.set(id, {
                file,
                progress: 0,
                status: 'uploading',
            });
            list.push(id);

            imageTags.push(`![${text || file.name}](${IMAGE_UPLOADING_FLAG}:${id})`);
        }

        const texts = [...imageTags];
        // make new line
        lineBefore && texts.unshift('');
        lineAfter && texts.push('');

        const imageTag = Text.of(texts);
        this.view.dispatch({
            changes: [
                {
                    from,
                    to,
                    insert: imageTag,
                },
            ],
            selection: EditorSelection.cursor(from + imageTag.length),
        });

        await Promise.all(list.map((id) => this.handleUploadFile(id)));
    }

    selectTrigger: HTMLInputElement | undefined = undefined;

    private createSelector() {
        if (this.selectTrigger) {
            this.selectTrigger.parentNode?.removeChild(this.selectTrigger);
        }

        const selector: HTMLInputElement = window.document.createElement('input');
        this.selectTrigger = selector;

        selector.type = 'file';
        selector.accept = this.options.accept || 'image/*';
        selector.multiple = this.options.multiple || false;
        selector.style.display = 'none';

        this.view.dom.appendChild(selector);
    }

    private async selectFile() {
        if (!this.selectTrigger) {
            this.createSelector();
        }

        return new Promise<File[]>((resolve) => {
            this.selectTrigger!.addEventListener('change', (event) => {
                const files = (event.target as HTMLInputElement).files;
                resolve(Array.from(files || []));
                this.selectTrigger!.value = '';
            }, { once: true });

            this.selectTrigger?.click();
        });
    }

    // update
    private uploadStateChanged(states: Map<string, UploadAction>) {
        if (!states.size) {
            return;
        }

        const ids = Array.from(states.keys());

        // todo: support multi match in single line
        const MATCH_REGEXP = new RegExp(`(!\\[.*]\\(${IMAGE_UPLOADING_FLAG}:(?<id>(${ids.join('|')}))\\))`, 'i');

        const { doc } = this.view.state;

        const lineCount = doc.lines;

        const changes: {
            from: number;
            to?: number;
            insert: string;
        }[] = [];

        for (let i = 1; i <= lineCount; i++) {
            const line = doc.line(i);
            const { text } = line;

            if (!text) {
                continue;
            }

            const matched = text.match(MATCH_REGEXP);

            if (!matched) {
                continue;
            }

            const id = (matched.groups as any).id;

            const newState = states.get(id)!;
            const file = FILE_CACHE.get(id)!;
            switch (newState.action) {
                case 'success': {
                    const newText = text.replace(`${IMAGE_UPLOADING_FLAG}:${id}`, newState.url);
                    changes.push({
                        from: line.from + (matched.index || 0),
                        to: line.from + matched.index! + matched[0].length,
                        insert: newText,
                    });
                    file.status = 'success';
                    file.url = newState.url;
                    FILE_CACHE.set(id, file);
                    break;
                }
                case 'fail': {
                    const file = FILE_CACHE.get(id)!;
                    file.status = 'error';
                    file.error = newState.message;
                    FILE_CACHE.set(id, file);
                    break;
                }
            }

            if (['progress', 'fail'].includes(newState.action)) {
                this.decorations = this.decorations.update({
                    filterFrom: line.from,
                    filterTo: line.to,
                    filter: () => {
                        return false;
                    },
                    add: [
                        {
                            from: line.from + matched.index! + matched[0].length,
                            to: line.from + matched.index! + matched[0].length,
                            value: Decoration.widget({
                                widget: new UploadWidget(id),
                            }),
                        },
                    ],
                });
            } else {
                this.decorations = this.decorations.update({
                    filterFrom: line.from,
                    filterTo: line.to,
                    filter: () => {
                        return false;
                    },
                });
            }
        }

        if (changes.length) {
            this.view.dispatch({
                changes: changes.sort((a, b) => a.from - b.from),
            });
        }
    }

    private renderWidgets() {
        const decorations = new RangeSetBuilder<Decoration>();

        const { state } = this.view;
        const { doc } = state;

        const lineCount = doc.lines;

        for (let i = 1; i <= lineCount; i++) {
            const line = doc.line(i);
            const { text } = line;

            if (!text) {
                continue;
            }

            const matched = text.match(IMAGE_UPLOADING_CACHE_REGEXP);

            if (!matched) {
                continue;
            }

            const id = matched.groups!.id;

            const item = FILE_CACHE.get(id);

            if (!item) {
                continue;
            }

            decorations.add(
                line.from + matched.index! + matched[0].length,
                line.from + matched.index! + matched[0].length,
                Decoration.widget({
                    widget: new UploadWidget(id),
                }),
            );
        }

        this.decorations = decorations.finish();
    }

    update(update: ViewUpdate) {
        const changedFiles = new Map<string, UploadAction>;

        update.transactions.forEach((transaction) => {
            transaction.effects.forEach(async (effect) => {
                if (effect.is(selectFileTriggerEffect)) {
                    const files = await this.selectFile();

                    files.length && await this.uploadFiles(files, effect.value || undefined);

                    return;
                }

                if (effect.is(uploadActionEffect)) {
                    const { value } = effect;
                    const { id } = value;
                    changedFiles.set(id, value);
                }
            });
        });

        if (changedFiles.size) {
            setTimeout(() => {
                this.uploadStateChanged(changedFiles);
            });
        }

        if (update.docChanged) {
            this.renderWidgets();
        }
    }
}

const uploadPlugin = (options: ConstructorParameters<typeof UploadPlugin>[1]) => {
    return ViewPlugin.define(
        view => new UploadPlugin(view, options),
        {
            decorations: (v) => v.decorations,
            provide: (v) => {
                return EditorView.atomicRanges.of((view) => {
                    return view.plugin(v)?.decorations || Decoration.none;
                });
            },
        },
    );
};

export default uploadPlugin;
