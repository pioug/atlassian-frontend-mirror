import type { ArchiveViewerErrorReason } from './ArchiveViewerError';

export class MediaViewerError extends Error {
	constructor(
		readonly primaryReason: MediaViewerErrorReason | ArchiveViewerErrorReason,
		readonly secondaryError?: Error | undefined,
	) {
		super(primaryReason);

		// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
		Object.setPrototypeOf(this, new.target.prototype);

		// https://v8.dev/docs/stack-trace-api
		if ('captureStackTrace' in Error) {
			Error.captureStackTrace(this, new.target);
		}
	}
}
export type MediaViewerErrorReason =
	| 'collection-fetch-metadata'
	| 'header-fetch-metadata'
	| 'itemviewer-onerror'
	| 'itemviewer-fetch-metadata'
	| 'itemviewer-file-error-status'
	| 'itemviewer-file-failed-processing-status'
	| 'imageviewer-external-onerror'
	| 'imageviewer-fetch-url'
	| 'imageviewer-src-onerror'
	| 'imageviewer-unsupported-mime'
	| 'audioviewer-fetch-url'
	| 'audioviewer-missing-artefact'
	| 'audioviewer-playback'
	| 'videoviewer-fetch-url'
	| 'videoviewer-missing-artefact'
	| 'videoviewer-playback'
	| 'docviewer-fetch-url'
	| 'docviewer-content-fetch-failed'
	| 'docviewer-fetch-pdf'
	| 'codeviewer-fetch-src'
	| 'codeviewer-load-src'
	| 'codeviewer-file-size-exceeds'
	| 'codeviewer-parse-email'
	| 'svg-img-error'
	| 'svg-binary-fetch'
	| 'svg-unknown-error'
	| 'svg-blob-to-datauri'
	| 'unsupported'
	| 'custom-viewer-error'
	| 'download';
