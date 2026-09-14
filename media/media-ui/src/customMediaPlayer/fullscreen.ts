/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * Deprecated internal aggregator. This module is not part of the package's public API — it has no
 * `exports` map subpath — so the replacements below are package-internal module paths rather than
 * `@atlaskit/media-ui/*` subpaths. VOLTC-139 tracks deleting this file once the internal callers
 * (and their `jest.mock` targets) import each helper directly.
 */

/**
 * @deprecated Import from `src/customMediaPlayer/findVendorSpecificProp` instead.
 */
export { findVendorSpecificProp } from './findVendorSpecificProp';
/**
 * @deprecated Import from `src/customMediaPlayer/requestFullscreen` instead.
 */
export { requestFullscreen } from './requestFullscreen';
/**
 * @deprecated Import from `src/customMediaPlayer/exitFullscreen` instead.
 */
export { exitFullscreen } from './exitFullscreen';
/**
 * @deprecated Import from `src/customMediaPlayer/getFullscreenElement` instead.
 */
export { getFullscreenElement } from './getFullscreenElement';
/**
 * @deprecated Import from `src/customMediaPlayer/toggleFullscreen` instead.
 */
export { toggleFullscreen } from './toggleFullscreen';
