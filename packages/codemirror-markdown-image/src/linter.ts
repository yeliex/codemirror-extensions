import { type Diagnostic, linter } from '@codemirror/lint';
import { FILE_CACHE, IMAGE_CATCH_REGEXP, IMAGE_UPLOADING_FLAG } from './consts';

export const imageStatusLinter = linter((view) => {
    let diagnostics: Diagnostic[] = [];

    const { state } = view;
    const lineCount = state.doc.lines;

    for (let i = 1; i <= lineCount; i++) {
        const line = state.doc.line(i);
        if (!line.length) {
            continue;
        }

        const matched = IMAGE_CATCH_REGEXP.exec(line.text);

        if (!matched) {
            continue;
        }

        const { url } = matched.groups as {
            url: string;
            title: string;
        };

        const pos = {
            from: line.from + matched.index,
            to: line.from + matched.index + matched[0].length,
        };

        if (url.startsWith(`${IMAGE_UPLOADING_FLAG}:`)) {
            const id = url.replace(`${IMAGE_UPLOADING_FLAG}:`, '');
            console.log(id, FILE_CACHE.get(id));
            if (id) {
                const item = FILE_CACHE.get(id);

                if (item) {
                    if (item.status === 'error') {
                        diagnostics.push({
                            ...pos,
                            message: 'Image upload failed, remove this line and try again',
                            severity: 'error',
                        });

                        continue;
                    } else if (item.status === 'uploading') {
                        diagnostics.push({
                            ...pos,
                            message: 'Image is uploading',
                            severity: 'error',
                        });

                        continue;
                    }
                }
            }

            diagnostics.push({
                ...pos,
                message: 'Invalid uploading image, remove this line and try again',
                severity: 'error',
            });

            continue;
        }

        if (!URL.canParse(url)) {
            diagnostics.push({
                ...pos,
                message: 'Invalid image file',
                severity: 'error',
            });
        }
    }

    return diagnostics;
});
