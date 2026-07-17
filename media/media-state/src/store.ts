import type { FileState } from './file-state';

export interface Store {
	files: Record<string, FileState>;
}

export { mediaStore } from './media-store';
export { createMediaStore } from './create-media-store';
export type { MediaStore } from './media-store';
