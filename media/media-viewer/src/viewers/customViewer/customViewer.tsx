import type { FileState, MediaClient, NonErrorFileState } from '@atlaskit/media-client';
import { MediaViewerError } from '../../errors';
import { useCallback, useEffect, useState } from 'react';
import type { CustomRendererConfig } from '../../viewerOptions';
import React from 'react';
import { Spinner } from '../../loading';

export type Props = {
	mediaClient: MediaClient;
	item: NonErrorFileState;
	customRendererConfig: CustomRendererConfig;
	onError: (error: MediaViewerError, fileItem?: FileState) => void;
	onSuccess: () => void;
};

export const CustomViewer = ({
	mediaClient,
	item,
	customRendererConfig,
	onSuccess,
	onError,
}: Props) => {
	const [getBinaryContent, setGetBinaryContent] = useState<() => Promise<Blob>>();
	useEffect(() => {
		setGetBinaryContent(undefined);
		const abortController = new AbortController();
		// This sets the 'getBinaryContent' to an async function that fetches the binary content of the file
		// The 'getBinaryContent' function has to be updated when the item changes
		// This approach handles aborting in-progress request outside of the custom-renderer concern
		if (item.status === 'processed' || item.status === 'failed-processing') {
			setGetBinaryContent(
				() => () => mediaClient.mediaStore.getFileBinary(item.id, undefined, abortController),
			);
		}
		return () => abortController.abort();
	}, [item, mediaClient]);

	const onLoadFailed = useCallback(
		(error: Error): void => {
			const mediaError = new MediaViewerError('custom-viewer-error', error);
			onError(mediaError, item);
		},
		[item, onError],
	);

	if (!getBinaryContent) {
		return <Spinner />;
	}

	return (
		<>
			{customRendererConfig.renderContent({
				fileItem: item,
				getBinaryContent,
				onLoad: onSuccess,
				onError: onLoadFailed,
			})}
		</>
	);
};
