/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required */
/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import Media from '../../react/nodes/media';
import MediaGroup from '../../react/nodes/mediaGroup';
import MediaInline from '../../react/nodes/mediaInline';
import MediaSingle from '../../react/nodes/mediaSingle';

/**
 * Synchronous renderer node mapping for media nodes
 *
 * WARNING: This is an EXPERIMENTAL entry point and may change without notice in the future. Use it only at your own risk!
 *
 * Context: https://hello.atlassian.net/wiki/spaces/JIE/pages/5342146338 (Atlassian-internal)
 */
const nodeToReact: typeof import('../../react/nodes').nodeToReact = {
	media: Media,
	mediaGroup: MediaGroup,
	mediaInline: MediaInline,
	mediaSingle: MediaSingle,
};

/**
 * @deprecated Use `nodes` from `@atlaskit/renderer/nodes/default` instead.
 * This entry point will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export default nodeToReact;
