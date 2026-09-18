/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export type ImageLoadPrimaryReason =
	| 'cache-remote-uri'
	| 'cache-local-uri'
	| 'local-uri'
	| 'remote-uri'
	| 'external-uri'
	| 'ssr-client-uri'
	| 'ssr-server-uri'
	| 'unknown-uri';

export type RemotePreviewPrimaryReason =
	| 'remote-preview-fetch'
	| 'remote-preview-not-ready'
	| 'remote-preview-fetch-ssr';

export type LocalPreviewPrimaryReason =
	| 'local-preview-get'
	| 'local-preview-unsupported'
	| 'local-preview-rejected'
	| 'local-preview-image'
	| 'local-preview-video';

export type SsrPreviewPrimaryReason =
	| 'ssr-client-uri'
	| 'ssr-client-load'
	| 'ssr-server-uri'
	| 'ssr-server-load';

/**
 * @deprecated Use `import { MediaFilePreviewError } from '@atlaskit/media-file-preview/media-file-preview-error'` instead.
 */
export { MediaFilePreviewError } from './MediaFilePreviewError';
export type { MediaFilePreviewErrorPrimaryReason } from './MediaFilePreviewError';
/**
 * @deprecated Use `import { LocalPreviewError } from '@atlaskit/media-file-preview/local-preview-error'` instead.
 */
export { LocalPreviewError } from './LocalPreviewError';
/**
 * @deprecated Use `import { RemotePreviewError } from '@atlaskit/media-file-preview/remote-preview-error'` instead.
 */
export { RemotePreviewError } from './RemotePreviewError';
/**
 * @deprecated Use `import { SsrPreviewError } from '@atlaskit/media-file-preview/ssr-preview-error'` instead.
 */
export { SsrPreviewError } from './SsrPreviewError';
/**
 * @deprecated Use `import { ImageLoadError } from '@atlaskit/media-file-preview/image-load-error'` instead.
 */
export { ImageLoadError } from './ImageLoadError';
/**
 * @deprecated Use `import { isMediaFilePreviewError } from '@atlaskit/media-file-preview/is-media-file-preview-error'` instead.
 */
export { isMediaFilePreviewError } from './isMediaFilePreviewError';
/**
 * @deprecated Use `import { isLocalPreviewError } from '@atlaskit/media-file-preview/is-local-preview-error'` instead.
 */
export { isLocalPreviewError } from './isLocalPreviewError';
/**
 * @deprecated Use `import { isRemotePreviewError } from '@atlaskit/media-file-preview/is-remote-preview-error'` instead.
 */
export { isRemotePreviewError } from './isRemotePreviewError';
/**
 * @deprecated Use `import { isUnsupportedLocalPreviewError } from '@atlaskit/media-file-preview/is-unsupported-local-preview-error'` instead.
 */
export { isUnsupportedLocalPreviewError } from './isUnsupportedLocalPreviewError';
/**
 * @deprecated Use `import { ensureMediaFilePreviewError } from '@atlaskit/media-file-preview/ensure-media-file-preview-error'` instead.
 */
export { ensureMediaFilePreviewError } from './ensureMediaFilePreviewError';
