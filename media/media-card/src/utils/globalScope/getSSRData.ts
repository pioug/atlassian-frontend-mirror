import { type FileIdentifier } from '@atlaskit/media-client';

import { getKey } from './getKey';
import { getMediaCardSSR } from './getMediaCardSSR';
import type { MediaCardSsrData } from './types';

export const getSSRData = (identifier: FileIdentifier): MediaCardSsrData | undefined => {
	const mediaCardSsr = getMediaCardSSR();
	if (!mediaCardSsr) {
		return;
	}
	return mediaCardSsr[getKey(identifier)];
};
