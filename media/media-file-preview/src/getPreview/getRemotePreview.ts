import type { MediaClient } from '@atlaskit/media-client/media-client';
import type { MediaStoreGetFileImageParams } from '@atlaskit/media-client/media-store/types';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';

import { RemotePreviewError } from '../RemotePreviewError';
import { type MediaFilePreview } from '../types';

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
