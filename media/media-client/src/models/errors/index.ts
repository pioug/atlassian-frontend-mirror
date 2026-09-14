/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export type { MediaClientError, MediaClientErrorReason, MediaClientErrorAttributes } from './types';

/**
 * @deprecated Use `import { getMediaClientErrorReason } from '@atlaskit/media-client/errors/helpers'` instead.
 */
export { getMediaClientErrorReason } from './getMediaClientErrorReason';
/**
 * @deprecated Use `import { isMediaClientError } from '@atlaskit/media-client/errors/helpers'` instead.
 */
export { isMediaClientError } from './isMediaClientError';

/**
 * @deprecated Use `import { BaseMediaClientError } from '@atlaskit/media-client/errors'` instead.
 */
export { BaseMediaClientError } from './BaseMediaClientError';
/**
 * @deprecated Use `import { CommonMediaClientError } from '@atlaskit/media-client/errors'` instead.
 */
export { CommonMediaClientError } from './CommonMediaClientError';
/**
 * @deprecated Use `import { isCommonMediaClientError } from '@atlaskit/media-client'` instead.
 */
export { isCommonMediaClientError } from './isCommonMediaClientError';
/**
 * @deprecated Use `import { toCommonMediaClientError } from '@atlaskit/media-client'` instead.
 */
export { toCommonMediaClientError } from './toCommonMediaClientError';
/**
 * @deprecated Use `import { fromCommonMediaClientError } from '@atlaskit/media-client/errors'` instead.
 */
export { fromCommonMediaClientError } from './fromCommonMediaClientError';
