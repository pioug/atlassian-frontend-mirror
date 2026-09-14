/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */

import { unzip, type ZipInfo, HTTPRangeReader, type Reader } from 'unzipit';

import { type MediaClient, type FileState, isErrorFileState } from '@atlaskit/media-client';
import { isZipMimeType } from '@atlaskit/media-common/isZipMimeType';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { ArchiveViewerError } from '../../ArchiveViewerError';
import { rejectAfter } from '../../utils/rejectAfter';

export const getArchiveEntriesFromFileState = async (
	fileState: FileState,
	mediaClient: MediaClient,
	collectionName?: string,
): Promise<ZipInfo> => {
	// The browser-based archive viewer relies on `unzipit`, which only supports
	// the ZIP container format. Media classifies 40+ archive formats (.tar, .gz,
	// .rar, .7z, etc.) as `archive` and routes them all through this code path,
	// causing unzipit to fail with a cryptic "could not find end of central
	// directory" error. We short-circuit non-ZIP archives up-front so the UI
	// can show a clear "format not supported" message instead. We rely on the
	// file's mime type (provided by the media backend).
	if (
		!isErrorFileState(fileState) &&
		!isZipMimeType(fileState.mimeType) &&
		fg('platform_media_archive_zip_guard')
	) {
		throw new ArchiveViewerError('archiveviewer-not-zip');
	}

	const url = await mediaClient.file.getFileBinaryURL(fileState.id, collectionName);
	const reader = new HTTPRangeReader(url);
	const archive = await rejectAfter(() => unzip(reader as Reader));

	return archive;
};
