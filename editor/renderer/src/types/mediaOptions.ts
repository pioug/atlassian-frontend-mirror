import type { MediaClientConfig } from '@atlaskit/media-core';
import type { MediaFeatureFlags, SSR } from '@atlaskit/media-common';

export type MediaSSR = { config: MediaClientConfig; mode: SSR };

export interface MediaOptions {
	allowCaptions?: boolean;
	allowLinking?: boolean;
	enableDownloadButton?: boolean;
	enableSyncMediaCard?: boolean;
	featureFlags?: MediaFeatureFlags;
	ssr?: MediaSSR;
}
