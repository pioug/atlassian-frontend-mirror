import { useEffect, useRef } from 'react';

import type { FileState } from '@atlaskit/media-state/file-state';

import { useMediaClient } from './useMediaClient';
import { useMediaStore } from './useMediaStore';

export type UseFileStateResult = {
	fileState: FileState | undefined;
};

export type UseFileStateOptions = {
	collectionName?: string;
	occurrenceKey?: string;
	// If `true`, we don't fetch remote file state if not found in the cache.
	// The default value is `false`
	skipRemote?: boolean;
	includeHashForDuplicateFiles?: boolean;
	/**
	 * Pre-seeded file state from SSR fragment data. When provided, it is
	 * forwarded to the file-fetcher which seeds the shared media store so all
	 * consumers see the SSR state immediately. If the file is already
	 * `processed`, the fetcher skips the network poll entirely.
	 * Also used as a synchronous fallback return value (`fileState ?? initialFileState`)
	 * before the store is populated.
	 */
	initialFileState?: FileState;
};

export function useFileState(id: string, options: UseFileStateOptions = {}): UseFileStateResult {
	const {
		collectionName,
		occurrenceKey,
		skipRemote = false,
		includeHashForDuplicateFiles,
		initialFileState,
	} = options;
	const mediaClient = useMediaClient();
	const fileState = useMediaStore((state) => state.files[id]);

	// Capture initialFileState as a ref so it's a stable one-time SSR seed that
	// doesn't affect the useEffect dependency array. Including it directly would
	// cause repeated unsubscribe/resubscribe cycles whenever the caller passes a
	// new (unstabilized) object reference — each cycle fires getFileState before
	// the store is populated.
	const initialFileStateRef = useRef(initialFileState);

	useEffect(() => {
		if (!fileState && !skipRemote) {
			mediaClient.file.getFileState(id, {
				initialFileState: initialFileStateRef.current,
				collectionName,
				occurrenceKey,
				includeHashForDuplicateFiles,
			});
		}
	}, [
		id,
		mediaClient,
		collectionName,
		occurrenceKey,
		skipRemote,
		fileState,
		includeHashForDuplicateFiles,
	]);

	return { fileState: fileState ?? initialFileState };
}
