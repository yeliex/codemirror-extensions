import { EditorView } from '@codemirror/view';

const toolbarStyle = EditorView.baseTheme({
    '.codemirror-markdown-slug': {
        marginLeft: '1em',
        fontSize: '0.8em',
        borderRadius: '2px',
        backgroundColor: '#1EA7FD',
        color: '#FFFFFF',
        padding: '2px',
        cursor: 'pointer',
    },
    '.codemirror-markdown-slug--default': {
        color: '#999999',
        backgroundColor: '#F5F5F5',
    },
});

export default toolbarStyle;
