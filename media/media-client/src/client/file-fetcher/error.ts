/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { FileFetcherError } from '@atlaskit/media-client/file-fetcher'` instead.
 */

export { FileFetcherError } from './FileFetcherError';
export type {
	FileFetcherErrorReason,
	FileFetcherErrorAttributes,
	FileFetcherErrorMetadata,
} from './FileFetcherError';
/**
 * @deprecated Use `import { isFileFetcherError } from '@atlaskit/media-client/file-fetcher'` instead.
 */
export { isFileFetcherError } from './isFileFetcherError';
