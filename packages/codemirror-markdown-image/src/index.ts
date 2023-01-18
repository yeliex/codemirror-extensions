import { imageStatusLinter } from './linter';
import previewPlugin from './PreviewPlugin';
import previewStyle from './previewStyle';
import uploadPlugin from './UploadPlugin';
import uploadStyle from './uploadStyle';

export * from './linter';
export * from './utils';
export * from './state';
export * from './command';
export { default as uploadStyle } from './uploadStyle';
export { default as plugin, type UploadOption } from './UploadPlugin';
export { default as previewStyle } from './previewStyle';
export { default as PreviewPlugin } from './PreviewPlugin';

export default (...options: Parameters<typeof uploadPlugin>) => {
    return [
        previewPlugin(),
        previewStyle,
        uploadPlugin(...options),
        uploadStyle,
        imageStatusLinter,
    ];
};
