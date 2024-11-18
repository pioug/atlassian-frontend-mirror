import { useEffect, useState } from 'react';

import { type FileIdentifier, type FilePreview, type MediaClient } from '@atlaskit/media-client';
import { useFileState, useMediaClient } from '@atlaskit/media-client-react';

import { usePrevious } from '../../utils/usePrevious';

import { MediaSVGError } from './errors';
import type { ContentSource } from './types';

const getLocalSvg = async (
	preview: FilePreview | Promise<FilePreview>,
): Promise<string | undefined> => {
	const { value } = await preview;
	if (typeof value === 'string') {
		return value;
	}
	return URL.createObjectURL(value);
};

const getRemoteSvg = async (
	{ id, collectionName }: FileIdentifier,
	mediaClient: MediaClient,
): Promise<string> => {
	try {
		return URL.createObjectURL(await mediaClient.mediaStore.getFileBinary(id, collectionName));
	} catch (e) {
		throw new MediaSVGError('binary-fetch', e instanceof Error ? e : undefined);
	}
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
				.catch(onError);
		} else {
			getRemoteSvg(identifier, mediaClient)
				.then((content) => {
					setSvgUrl(content);
					setSource('remote');
				})
				.catch(onError);
		}
	}, [identifier, fileState, mediaClient, onError, svgUrl]);

	return { svgUrl, source };
};
