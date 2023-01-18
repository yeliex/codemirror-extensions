import { EditorView } from '@codemirror/view';

const style = EditorView.baseTheme({
    '.cm-image-preview': {
        position: 'relative',
    },
    '.cm-image-preview__content': {
        position: 'absolute',
        left: 0,
        opacity: 1,
        display: 'none',
        background: '#FFFFFF',
        zIndex: 10,
        userSelect: 'none',
        padding: '0.5em',
    },
    '.cm-image-preview__content img': {
        maxHeight: '200px'
    },
    '.cm-image-preview:hover .cm-image-preview__content': {
        display: 'block'
    }
});

export default style;
