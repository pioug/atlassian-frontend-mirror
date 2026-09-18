/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export type ImageLoadPrimaryReason =
	| 'cache-remote-uri'
	| 'cache-local-uri'
	| 'local-uri'
	| 'remote-uri'
	| 'external-uri'
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

export type SvgPrimaryReason =
	| 'svg-img-error'
	| 'svg-binary-fetch'
	| 'svg-blob-to-datauri'
	| 'svg-unknown-error';

/**
 * @deprecated Use `import { MediaCardError } from '@atlaskit/media-card/media-card-error'` instead.
 */
export { MediaCardError } from './MediaCardError';
export type { MediaCardErrorPrimaryReason } from './MediaCardError';
/**
 * @deprecated Use `import { LocalPreviewError } from '@atlaskit/media-card/local-preview-error'` instead.
 */
export { LocalPreviewError } from './LocalPreviewError';
/**
 * @deprecated Use `import { RemotePreviewError } from '@atlaskit/media-card/remote-preview-error'` instead.
 */
export { RemotePreviewError } from './RemotePreviewError';
/**
 * @deprecated Use `import { SsrPreviewError } from '@atlaskit/media-card/ssr-preview-error'` instead.
 */
export { SsrPreviewError } from './SsrPreviewError';
/**
 * @deprecated Use `import { getImageLoadPrimaryReason } from '@atlaskit/media-card/get-image-load-primary-reason'` instead.
 */
export { getImageLoadPrimaryReason } from './getImageLoadPrimaryReason';
/**
 * @deprecated Use `import { ImageLoadError } from '@atlaskit/media-card/image-load-error'` instead.
 */
export { ImageLoadError } from './ImageLoadError';
/**
 * @deprecated Use `import { isMediaCardError } from '@atlaskit/media-card/is-media-card-error'` instead.
 */
export { isMediaCardError } from './isMediaCardError';
/**
 * @deprecated Use `import { isLocalPreviewError } from '@atlaskit/media-card/is-local-preview-error'` instead.
 */
export { isLocalPreviewError } from './isLocalPreviewError';
/**
 * @deprecated Use `import { isRemotePreviewError } from '@atlaskit/media-card/is-remote-preview-error'` instead.
 */
export { isRemotePreviewError } from './isRemotePreviewError';
/**
 * @deprecated Use `import { isUnsupportedLocalPreviewError } from '@atlaskit/media-card/is-unsupported-local-preview-error'` instead.
 */
export { isUnsupportedLocalPreviewError } from './isUnsupportedLocalPreviewError';
/**
 * @deprecated Use `import { isImageLoadError } from '@atlaskit/media-card/is-image-load-error'` instead.
 */
export { isImageLoadError } from './isImageLoadError';
/**
 * @deprecated Use `import { ensureMediaCardError } from '@atlaskit/media-card/ensure-media-card-error'` instead.
 */
export { ensureMediaCardError } from './ensureMediaCardError';
/**
 * @deprecated Use `import { isUploadError } from '@atlaskit/media-card/is-upload-error'` instead.
 */
export { isUploadError } from './isUploadError';
