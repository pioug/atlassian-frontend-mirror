/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import MediaViewer from '@atlaskit/media-viewer/media-viewer-loader'` instead.
 */

export { default as MediaViewer } from './components/media-viewer-loader';
/**
 * @deprecated Use `import type { MediaViewerExtensions, MediaViewerExtensionsActions, MediaViewerProps, MediaMessage } from '@atlaskit/media-viewer/types'` instead.
 */
export type {
	MediaViewerExtensions,
	MediaViewerExtensionsActions,
	MediaViewerProps,
	MediaMessage,
} from './components/types';
/**
 * @deprecated Use `import type { ViewerOptionsProps, CustomRendererConfig, CustomRendererStateProps, CustomRendererProps, ArchiveFileItem } from '@atlaskit/media-viewer/viewer-options'` instead.
 */
export type {
	ViewerOptionsProps,
	CustomRendererConfig,
	CustomRendererStateProps,
	CustomRendererProps,
	ArchiveFileItem,
} from './viewerOptions';
