/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

/**
 * @deprecated Use `import { sanitizeNode } from '@atlaskit/editor-json-transformer/sanitize/sanitize-node'` instead.
 */

export { sanitizeNode } from './sanitize/sanitize-node';
/**
 * @deprecated Use `import { removeMarks } from '@atlaskit/editor-json-transformer/sanitize/remove-marks'` instead.
 */
export { removeMarks } from './sanitize/remove-marks';
