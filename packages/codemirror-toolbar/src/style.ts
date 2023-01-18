import { EditorView } from '@codemirror/view';

const toolbarStyle = EditorView.baseTheme({
    '.codemirror-toolbar': {
        display: 'flex',
        padding: '4px 5px',
        backgroundColor: 'rgb(245, 245, 245)',
        borderBottom: '1px solid rgb(221, 221, 221)',
    },
    '.codemirror-toolbar__icon': {
        display: 'inline-block',
        height: '1em',
        width: '1em',
        overflow: 'visible',
    },
    '.codemirror-toolbar__icon svg': {
        overflow: 'visible',
        boxSizing: 'content-box',
        height: '1em',
        width: '1em',
        verticalAlign: '-.125em',
    },
    '.codemirror-toolbar__item': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        borderRadius: '2px',
        height: '20px',
        width: '20px',
        transition: 'all .3s',
    },
    '.codemirror-toolbar__item:hover': {
        color: '#1EA7FD',
        backgroundColor: 'rgba(30,167,253,0.12)',
    },
    '.codemirror-toolbar__item > *': {
        pointerEvents: 'none',
    },
    '.codemirror-toolbar__split': {
        display: 'inline-block',
        width: '1px',
        height: '20px',
        margin: '0 6px',
        backgroundColor: 'rgb(221, 221, 221)'
    },
    '.codemirror-toolbar__space': {
        display: 'inline-block',
        flex: 1,
    }
});

export default toolbarStyle;
