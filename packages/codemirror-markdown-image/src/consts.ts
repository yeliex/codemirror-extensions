export const IMAGE_UPLOADING_FLAG = '__image_uploading__';

export const IMAGE_UPLOADING_FLAG_MATCH = new RegExp(`^${IMAGE_UPLOADING_FLAG}:`, 'i');

export const SIZE_128K = 128 * 1024;

export const SIZE_64K = 64 * 1024;

export const IMAGE_MATCH_REGEXP = /!\[.*]\(.*\)/;

export const IMAGE_CATCH_REGEXP = /(!\[(?<title>.*)]\((?<url>.+)\))/;

export const IMAGE_UPLOADING_CACHE_REGEXP = new RegExp(`!\\[(?<title>.*)]\\(${IMAGE_UPLOADING_FLAG}:(?<id>.+)\\)`, 'i');

export interface ItemState {
    file: File;
    url?: string;
    progress?: number;
    status?: 'uploading' | 'success' | 'error';
    abortController?: AbortController;
    error?: string;
}

export const FILE_CACHE = new Map<string, ItemState>();
