import type { MediaFeatureFlags, SSR } from '@atlaskit/media-common';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import type { MediaViewerExtensions } from '@atlaskit/media-viewer';

export type MediaSSR = {
	config: MediaClientConfig;
	mode: SSR;
	/**
	 * Host SSR media payload. The renderer looks up each card's id with `.find()`
	 * and passes the matching item as `ssrMediaItem` to Card. Missing entries fall
	 * back to the normal remote fetch path.
	 */
	ssrMediaItems?: ReadonlyArray<{ id?: string }>;
};

export type MediaRenderEventPayload =
	| { type: 'mounted' | 'unmounted' }
	| { renderedMediaId?: string; type: 'preview-rendered' }
	| { reason: string; type: 'error' };

export type MediaRenderEvent = {
	dataConsumerSource?: string;
	mediaId?: string;
	mediaInstance: object;
} & MediaRenderEventPayload;

export interface MediaOptions {
	allowCaptions?: boolean;
	allowLinking?: boolean;
	enableDownloadButton?: boolean;
	enableSyncMediaCard?: boolean;
	/**
	 * Optional fallback fetcher to retrieve the media filename from another service
	 * Workaround for #hot-301450 where media service is missing filenames for DC -> Cloud migrated media
	 * Receives the file ID and should resolve to the filename string.
	 */
	fallbackMediaNameFetcher?: (id: string) => Promise<string>;
	featureFlags?: MediaFeatureFlags;
	/** Extensions for the media viewer (e.g. header action buttons, sidebar with comment indicator).
	 * When provided, the media viewer will use these extensions for all media items.
	 * Use headerActions.isVisible to control per-item header action visibility. */
	mediaViewerExtensions?: MediaViewerExtensions;
	/** Receives lifecycle events for each rendered media node. */
	onMediaRenderEvent?: (event: MediaRenderEvent) => void;
	ssr?: MediaSSR;
}
