import { type ToolbarItem, type ToolbarSpace, type ToolbarSplit } from '../index';
import { type EditorView } from '@codemirror/view';

export const split: ToolbarSplit = {
    type: 'split',
};

export const space: ToolbarSpace = {
    type: 'space',
};

export const fullScreen: ToolbarItem = {
    label: 'Full Screen',
    key: 'fullScreen',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M32 32h96V96H64v64H0V64 32H32zM0 192H64V320H0V192zm384 0h64V320H384V192zm64-32H384V96H320V32h96 32V64v96zm0 192v96 32H416 320V416h64V352h64zM64 352v64h64v64H32 0V448 352H64zM288 480H160V416H288v64zM160 96V32H288V96H160z"/></svg>',
    command: (view: EditorView) => {
        if(view.dom.ownerDocument.fullscreenElement) {
            view.dom.ownerDocument.exitFullscreen();
        } else {
            view.dom.requestFullscreen();
        }

        return true;
    },
};
