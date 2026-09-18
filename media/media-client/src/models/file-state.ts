/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import { type FileStatus as CommonFileStatus } from '@atlaskit/media-common';
import type { FilePreview, FileState, ErrorFileState } from '@atlaskit/media-state/file-state';

export type FileStatus = CommonFileStatus;

export interface PreviewOptions {}

export interface GetFileOptions {
	initialFileState?: FileState;
	preview?: PreviewOptions;
	collectionName?: string;
	occurrenceKey?: string;
	includeHashForDuplicateFiles?: boolean;
	forceRefresh?: boolean;
}

export interface PreviewableFileState {
	preview: FilePreview | Promise<FilePreview>;
}

export type NonErrorFileState = Exclude<FileState, ErrorFileState>;

/**
 * @deprecated Use `import { isUploadingFileState } from '@atlaskit/media-client'` instead.
 */
export { isUploadingFileState } from './is-uploading-file-state';
/**
 * @deprecated Use `import { isProcessingFileState } from '@atlaskit/media-client'` instead.
 */
export { isProcessingFileState } from './is-processing-file-state';
/**
 * @deprecated Use `import { isProcessedFileState } from '@atlaskit/media-client'` instead.
 */
export { isProcessedFileState } from './is-processed-file-state';
/**
 * @deprecated Use `import { isErrorFileState } from '@atlaskit/media-client'` instead.
 */
export { isErrorFileState } from './is-error-file-state';
/**
 * @deprecated Use `import { isPreviewableFileState } from '@atlaskit/media-client'` instead.
 */
export { isPreviewableFileState } from './is-previewable-file-state';
/**
 * @deprecated Use `import { isFinalFileState } from '@atlaskit/media-client'` instead.
 */
export { isFinalFileState } from './is-final-file-state';
/**
 * @deprecated Use `import { isNonErrorFinalFileState } from '@atlaskit/media-client'` instead.
 */
export { isNonErrorFinalFileState } from './is-non-error-final-file-state';
/**
 * @deprecated Use `import { hasArtifacts } from '@atlaskit/media-client'` instead.
 */
export { hasArtifacts } from './has-artifacts';
/**
 * @deprecated Use `import { isImageRepresentationReady } from '@atlaskit/media-client'` instead.
 */
export { isImageRepresentationReady } from './is-image-representation-ready';
/**
 * @deprecated Use `import { mapMediaFileToFileState } from '@atlaskit/media-client'` instead.
 */
export { mapMediaFileToFileState } from './map-media-file-to-file-state';
/**
 * @deprecated Use `import { mapMediaItemToFileState } from '@atlaskit/media-client'` instead.
 */
export { mapMediaItemToFileState } from './map-media-item-to-file-state';
