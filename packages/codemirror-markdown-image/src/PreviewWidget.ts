import { WidgetType } from '@codemirror/view';

export default class PreviewWidget extends WidgetType {
    constructor(public readonly file: string) {
        super();
    }

    override eq(widget: PreviewWidget): boolean {
        return widget.file === this.file;
    }

    toDOM(): HTMLElement {
        // todo: add element to another layer to prevent cursor problem
        const preview = window.document.createElement('span');
        preview.contentEditable = 'false';
        preview.innerHTML = `<img src="${this.file}" aria-hidden="true" />`;
        preview.className = 'cm-image-preview__content';

        return preview;
    }
}
