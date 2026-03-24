import type { MediaClientConfig } from '@atlaskit/media-core';
import type { MediaFeatureFlags, SSR } from '@atlaskit/media-common';
import type { MediaViewerExtensions } from '@atlaskit/media-viewer';

export type MediaSSR = { config: MediaClientConfig; mode: SSR };

export interface MediaOptions {
	allowCaptions?: boolean;
	allowLinking?: boolean;
	enableDownloadButton?: boolean;
	enableSyncMediaCard?: boolean;
	featureFlags?: MediaFeatureFlags;
	/** Extensions for the media viewer header (e.g. comment navigation button). */
	mediaViewerExtensions?: MediaViewerExtensions;
	ssr?: MediaSSR;
}
