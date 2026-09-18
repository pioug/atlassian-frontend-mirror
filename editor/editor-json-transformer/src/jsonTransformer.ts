/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

/**
 * @deprecated Use `import { SchemaStage } from '@atlaskit/editor-json-transformer'` instead.
 */

export { SchemaStage } from './SchemaStage';
/**
 * @deprecated Use `import { toJSON } from '@atlaskit/editor-json-transformer/jsonTransformer'` instead.
 */
export { toJSON } from './toJSON';
/**
 * @deprecated Use `import { JSONTransformer } from '@atlaskit/editor-json-transformer/jsonTransformer'` instead.
 */
export { JSONTransformer } from './JSONTransformer-2';
