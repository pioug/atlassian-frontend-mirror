import {
	type FilePreview,
	type MediaClient,
	type MediaStoreGetFileImageParams,
	type MediaType,
} from '@atlaskit/media-client';
import { getMediaTypeFromMimeType, type MediaTraceContext } from '@atlaskit/media-common';
import { getOrientation } from '@atlaskit/media-ui';

import { LocalPreviewError, RemotePreviewError } from '../errors';
import { type MediaFilePreview } from '../types';

import { takeSnapshot } from './videoSnapshot';

/**
 * This method tells the support for the media
 * types covered in getCardPreviewFromFilePreview
 */
export const isSupportedLocalPreview = (mediaType?: MediaType) =>
	mediaType === 'image' || mediaType === 'video';

const getImageLocalPreview = async (value: Blob): Promise<MediaFilePreview> => {
	try {
		const orientation = await getOrientation(value as File);
		const dataURI = URL.createObjectURL(value);
		return {
			dataURI,
			orientation,
			source: 'local',
		};
	} catch (e) {
		throw new LocalPreviewError('local-preview-image', e instanceof Error ? e : undefined);
	}
};

const getVideoLocalPreview = async (value: Blob): Promise<MediaFilePreview> => {
	try {
		const dataURI = await takeSnapshot(value);
		return {
			dataURI,
			orientation: 1,
			source: 'local',
		};
	} catch (e) {
		throw new LocalPreviewError('local-preview-video', e instanceof Error ? e : undefined);
	}
};

export const getLocalPreview = async (
	filePreview: FilePreview | Promise<FilePreview>,
): Promise<MediaFilePreview> => {
	let value;
	try {
		const resolvedFilePreview = await filePreview;
		value = resolvedFilePreview.value;
	} catch (e) {
		throw new LocalPreviewError('local-preview-rejected', e instanceof Error ? e : undefined);
	}
	if (typeof value === 'string') {
		return {
			dataURI: value,
			orientation: 1,
			source: 'local',
		};
	} else if (value instanceof Blob) {
		const { type } = value;
		const mediaType = getMediaTypeFromMimeType(type);
		switch (mediaType) {
			case 'image':
				return getImageLocalPreview(value);
			case 'video':
				return getVideoLocalPreview(value);
			default:
				throw new LocalPreviewError('local-preview-unsupported');
		}
	}
	throw new LocalPreviewError('local-preview-unsupported');
};

export const getRemotePreview = async (
	mediaClient: MediaClient,
	id: string,
	params: MediaStoreGetFileImageParams,
	traceContext?: MediaTraceContext,
): Promise<MediaFilePreview> => {
	try {
		const blob = await mediaClient.getImage(id, params, undefined, undefined, traceContext);
		return {
			dataURI: URL.createObjectURL(blob),
			orientation: 1,
			source: 'remote',
		};
	} catch (e) {
		throw new RemotePreviewError('remote-preview-fetch', e instanceof Error ? e : undefined);
	}
};
