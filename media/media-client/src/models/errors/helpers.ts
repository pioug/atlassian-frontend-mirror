/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export type { MediaClientError, MediaClientErrorReason } from './types';

/**
 * @deprecated Use `import { isMediaClientError } from '@atlaskit/media-client/errors'` instead.
 */
export { isMediaClientError } from './isMediaClientError';
/**
 * @deprecated Use `import { getMediaClientErrorReason } from '@atlaskit/media-client/errors'` instead.
 */
export { getMediaClientErrorReason } from './getMediaClientErrorReason';
