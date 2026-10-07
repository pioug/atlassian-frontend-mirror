/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required */
/* eslint-disable @atlaskit/editor/no-re-export */

import { type ReactSerializerInit, default as ReactSerializerLegacy } from '../react';
import { nodeToReact } from '../react/nodes';

/**
 * @deprecated Use `ReactSerializerInit` from `@atlaskit/renderer/serializer/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export type { ReactSerializerInit } from '../react/index';

/**
 * @deprecated Use `ReactSerializer` from `@atlaskit/renderer/serializer/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export default class ReactSerializer extends ReactSerializerLegacy {
	constructor(init: ReactSerializerInit) {
		super({
			...init,
			nodeComponents: {
				...nodeToReact, // Lazy nodes from react/nodes/index.ts
				...init.nodeComponents,
			},
		});
	}
}
