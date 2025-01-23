import { useEffect, useMemo } from 'react';

import {
	type FileIdentifier,
	type FileState,
	isNonErrorFinalFileState,
	type ProcessedFileState,
	type ProcessingFailedState,
} from '@atlaskit/media-client';

import { useMediaClient } from './MediaClientProvider';
import { useMediaStore } from './useMediaStore';
import { usePrevious } from './utils/usePrevious';

const areFilesPotentiallyDuplicated = (
	file1: ProcessedFileState | ProcessingFailedState,
	file2: FileState,
) =>
	file1.status === file2.status &&
	file1.name === file2.name &&
	file1.size === file2.size &&
	file1.mimeType === file2.mimeType &&
	file1.id !== file2.id;

export function useFileHashes(ids: FileIdentifier[]) {
	const nonErrorFiles = useMediaStore((state) =>
		Object.values(state.files).filter(isNonErrorFinalFileState),
	);

	const mediaClient = useMediaClient();

	const collections = useMemo(
		() => Object.fromEntries(ids.map(({ id, collectionName }) => [id, collectionName])),
		[ids],
	);

	const files = useMemo(
		() => nonErrorFiles.filter((file) => ids.some(({ id }) => file.id === id)),
		[nonErrorFiles, ids],
	);

	const prevFiles = usePrevious(files);

	useEffect(() => {
		const prev = prevFiles ?? [];

		// Get the files that have been added or whose status has changed since last time.
		const addedOrChangedFiles = files.filter(
			(file) =>
				file &&
				prev.every((prevFile) => prevFile.id !== file.id || prevFile.status !== file.status),
		);

		// Get the files from the list that are duplicates of the added / changed files
		const potentialDuplicates = files.filter((file) =>
			addedOrChangedFiles.some((addedFile) => areFilesPotentiallyDuplicated(file, addedFile)),
		);

		if (potentialDuplicates.length) {
			// if any duplicates are found then fetch their hashes along with the added files
			[...addedOrChangedFiles, ...potentialDuplicates].forEach((file) => {
				const collectionName = collections[file.id];
				mediaClient.file.getFileState(file.id, {
					collectionName,
					includeHashForDuplicateFiles: true,
					forceRefresh: true,
				});
			});
		}
	}, [files, prevFiles, mediaClient, collections]);

	const hashMap = useMemo(
		() => Object.fromEntries(files.map((file) => [file.id, file.hash])),
		[files],
	);

	return hashMap;
}
