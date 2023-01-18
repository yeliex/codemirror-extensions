import type { ToolbarConfig, ToolbarItem, ToolbarSpace, ToolbarSplit } from '../index';

const createSpecial = (item: ToolbarSpace | ToolbarSplit) => {
    const el = window.document.createElement('span');

    el.classList.add(`codemirror-toolbar__${item.type}`);

    return el;
};

const createButton = (item: ToolbarItem) => {
    const el = window.document.createElement('button');

    el.classList.add('codemirror-toolbar__item');

    el.dataset.item = item.key;
    el.title = item.label;

    el.innerHTML = `<i class="codemirror-toolbar__icon">${item.icon || ''}</i>`;

    return el;
};

export const createElement = (config: ToolbarConfig) => {
    const element = window.document.createElement('div');
    element.classList.add('codemirror-toolbar');

    const fragment = window.document.createDocumentFragment();

    fragment.append(...config.items.map((item) => {
        if ('type' in item) {
            return createSpecial(item);
        }

        return createButton(item);
    }));

    element.appendChild(fragment);

    return element;
};
