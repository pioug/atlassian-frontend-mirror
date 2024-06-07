import { getMediaCardSSR, getKey } from './globalScope';
import type { MediaCardSsrData } from './types';
import { type FileIdentifier } from '@atlaskit/media-client';

export const getSSRData = (identifier: FileIdentifier): MediaCardSsrData | undefined => {
	const mediaCardSsr = getMediaCardSSR();
	if (!mediaCardSsr) {
		return;
	}
	return mediaCardSsr[getKey(identifier)];
};
