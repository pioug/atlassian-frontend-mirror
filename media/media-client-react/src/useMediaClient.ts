import React from 'react';

import type { MediaClient } from '@atlaskit/media-client';

import { MediaClientContext } from './MediaClientProvider';
import { MediaContext } from './MediaProvider';

export const useMediaClient = (): MediaClient => {
	const mediaClient = React.useContext(MediaClientContext);
	const { mediaClient: altMediaClient } = React.useContext(MediaContext) || {};

	if (!mediaClient && !altMediaClient) {
		throw new Error('No MediaClient set, use MediaClientProvider or MediaProvider to set one');
	}
	// WARNING: typescript can't infer that at least one mediaClient is defined here. Adding the `!` is a hack to make typescript happy.
	return mediaClient || altMediaClient!;
};
