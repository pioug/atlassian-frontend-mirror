import type { FileState } from './file-state';

export interface Store {
	files: Record<string, FileState>;
}

/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead:
 * `import { mediaStore } from '@atlaskit/media-state/media-store'`.
 * Retained only while consumers migrate off this re-export.
 */
export { mediaStore } from './media-store';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead:
 * `import { createMediaStore } from '@atlaskit/media-state/create-media-store'`.
 * Retained only while consumers migrate off this re-export.
 */
export { createMediaStore } from './create-media-store';
export type { MediaStore } from './media-store';
