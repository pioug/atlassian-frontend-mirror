import type { FileState } from '@atlaskit/media-state/file-state';

import { StreamsCache } from './streams-cache';

let streamCache: StreamsCache<FileState>;
export const getFileStreamsCache = (): StreamsCache<FileState> => {
	if (!streamCache) {
		// TODO: we can move this into a static import like
		// import {mediaState} from '@atlaskit/media-core'
		const mediaState = require('@atlaskit/media-core/cache').mediaState;
		streamCache = new StreamsCache<FileState>(mediaState.streams);
	}
	return streamCache;
};
