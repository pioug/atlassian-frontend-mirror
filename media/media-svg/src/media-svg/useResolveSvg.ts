import { useEffect, useState } from 'react';

import { type FileIdentifier, type FilePreview, type MediaClient } from '@atlaskit/media-client';
import { useFileState, useMediaClient } from '@atlaskit/media-client-react';

import { useCurrentValueRef } from '../utils/useCurrentValueRef';
import { usePrevious } from '../utils/usePrevious';

import { MediaSVGError } from './errors';
import type { ContentSource } from './types';

// We need to convert the blob into Base64 for security reasons: https://asecurityteam.atlassian.net/browse/VULN-1495952
// Make sure to update the test helper mockFileReader if this is changed
function blobToBase64(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onloadend = () =>
			resolve(
				// reader.readAsDataURL makes reader.result a string
				// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
				reader.result as string,
			);

		reader.onerror = (e) =>
			reject(new MediaSVGError('blob-to-datauri', e instanceof Error ? e : undefined));

		reader.readAsDataURL(blob);
	});
}

const getLocalSvg = async (
	preview: FilePreview | Promise<FilePreview>,
): Promise<string | undefined> => {
	const { value } = await preview;
	if (typeof value === 'string') {
		return value;
	}
	return blobToBase64(value);
};

const getRemoteSvg = async (
	{ id, collectionName }: FileIdentifier,
	mediaClient: MediaClient,
): Promise<string> => {
	const blob = await mediaClient.mediaStore.getFileBinary(id, collectionName).catch((e) => {
		throw new MediaSVGError('binary-fetch', e instanceof Error ? e : undefined);
	});

	return await blobToBase64(blob);
};

export const useResolveSvg = (
	identifier: FileIdentifier,
	onError?: (error: MediaSVGError) => void,
) => {
	const mediaClient = useMediaClient();
	const { id, collectionName } = identifier;
	const { id: prevId } = usePrevious(identifier) || identifier;
	const { fileState } = useFileState(id, { collectionName });
	const [svgUrl, setSvgUrl] = useState<string | undefined>(undefined);
	const [source, setSource] = useState<ContentSource | undefined>(undefined);
	const onErrorRef = useCurrentValueRef(onError);

	useEffect(() => {
		if (id !== prevId) {
			setSvgUrl(undefined);
		}
	}, [id, prevId]);

	useEffect(() => {
		if (
			svgUrl ||
			!fileState ||
			fileState.status === 'error' ||
			fileState?.mimeType !== 'image/svg+xml'
		) {
			return;
		}

		const { preview } = fileState;
		if (preview) {
			getLocalSvg(preview)
				.then((content) => {
					setSvgUrl(content);
					setSource('local');
				})
				.catch(onErrorRef.current);
		} else {
			getRemoteSvg(identifier, mediaClient)
				.then((content) => {
					setSvgUrl(content);
					setSource('remote');
				})
				.catch(onErrorRef.current);
		}
	}, [identifier, fileState, mediaClient, onErrorRef, svgUrl]);

	return { svgUrl, source };
};
