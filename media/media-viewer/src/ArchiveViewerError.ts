import { type ZipEntry } from 'unzipit';

import { MediaViewerError } from './MediaViewerError';

export class ArchiveViewerError extends MediaViewerError {
	constructor(
		readonly primaryReason: ArchiveViewerErrorReason,
		readonly secondaryError?: Error | undefined,
		readonly zipEntry?: ZipEntry | undefined,
	) {
		super(primaryReason, secondaryError);
	}
}
export type ArchiveViewerErrorReason =
	| 'archiveviewer-bundle-loader'
	| 'archiveviewer-read-binary'
	| 'archiveviewer-not-zip'
	| 'archiveviewer-create-url'
	| 'archiveviewer-imageviewer-onerror'
	| 'archiveviewer-videoviewer-onerror'
	| 'archiveviewer-audioviewer-onerror'
	| 'archiveviewer-docviewer-onerror'
	| 'archiveviewer-codeviewer-onerror'
	| 'archiveviewer-codeviewer-file-size-exceeds'
	| 'archiveviewer-missing-name-src'
	| 'archiveviewer-unsupported'
	| 'archiveviewer-encrypted-entry'
	| 'archiveviewer-customrenderer-onerror';
