import { WidgetType } from '@codemirror/view';
import { FILE_CACHE } from './consts';

export default class UploadWidget extends WidgetType {
    // public readonly progress: number;

    constructor(public readonly id: string) {
        super();
    }

    toDOM(): HTMLElement {
        const { id } = this;

        const item = FILE_CACHE.get(id)!;
        const el = window.document.createElement('span');
        el.className = 'cm-image-upload';

        if (item.status === 'uploading') {
            const progress = window.document.createElement('span');
            progress.className = 'cm-image-upload--uploading';
            progress.innerText = item.progress + '%';
            el.appendChild(progress);
        } else if (item.status === 'error') {
            el.classList.add('cm-image-upload--failed');
            el.innerText = `Failed: ${item.error || 'upload failed'}`;
        }
        return el;
    }
}
