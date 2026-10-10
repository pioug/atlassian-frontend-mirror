import type { FileIdentifier } from '@atlaskit/media-client/identifier';
import type { ImageResizeMode } from '@atlaskit/media-client/image-resize-mode-to-file-image-mode';

import { getKey } from './getKey';
import { getMediaCardSSR } from './getMediaCardSSR';
import type { MediaCardSsrData } from './types';

export const getSSRData = (
	identifier: FileIdentifier,
	resizeMode?: ImageResizeMode,
): MediaCardSsrData | undefined => {
	const mediaCardSsr = getMediaCardSSR();
	if (!mediaCardSsr) {
		return;
	}
	return mediaCardSsr[getKey(identifier, resizeMode)];
};
