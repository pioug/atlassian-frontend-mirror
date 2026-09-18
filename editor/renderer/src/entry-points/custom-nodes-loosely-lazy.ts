/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required */
/* eslint-disable @atlaskit/editor/no-re-export */

/**
 * @deprecated Use `nodes` from `@atlaskit/renderer/nodes/default` instead.
 * This entry point will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */

export { nodeToReact as defaultNodeComponentsWithLooselyLazy } from '../react/nodes/loosely-lazy';
