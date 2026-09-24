import type { FileState } from './file-state';

export interface Store {
	files: Record<string, FileState>;
}

export type { MediaStore } from './media-store';
