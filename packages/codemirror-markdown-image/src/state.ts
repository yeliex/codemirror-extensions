import { StateEffect } from '@codemirror/state';

export type UploadAction =
    {
        id: string
    }
    & ({
        action: 'progress';
        percent: number;
    }
    | {
    action: 'success';
    url: string;
}
    | {
    action: 'fail';
    message: string;
});

export const uploadActionEffect = StateEffect.define<UploadAction>();

export const selectFileTriggerEffect = StateEffect.define<{
    anchor: number;
    head: number;
    flag: number;
} | null>();
