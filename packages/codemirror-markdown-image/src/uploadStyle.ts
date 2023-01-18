import { EditorView } from '@codemirror/view';

const uploadStyle = EditorView.baseTheme({
    '.cm-image-upload': {
        fontSize: '1em',
        padding: '0 .6em',
    },
    '.cm-image-upload--uploading': {
        borderRadius: '2px',
        backgroundColor: '#1EA7FD',
        color: '#FFFFFF',
        padding: '2px',
        cursor: 'pointer',
        opacity: 0.6,
        marginRight: '.6em',
    },
    '.cm-image-upload__action': {
        fontSize: '.8em',
        color: '#999999',
        cursor: 'pointer',
    },
    '.cm-image-upload__action:hover': {
        color: '#066adf',
    },
    '.cm-image-upload--failed': {
        color: 'red'
    }
});

export default uploadStyle;
