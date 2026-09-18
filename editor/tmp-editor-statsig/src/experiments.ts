/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

/**
 * @deprecated Use `import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments'` instead.
 */

export { editorExperiment } from './editor-experiment';
/**
 * @deprecated Use `import { unstable_editorExperimentParam } from '@atlaskit/tmp-editor-statsig/experiments'` instead.
 */
export { unstable_editorExperimentParam } from './unstable-editor-experiment-param';
