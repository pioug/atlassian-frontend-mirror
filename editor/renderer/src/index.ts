import type { ComponentProps, JSX } from 'react';

import type { ReactSerializerInit } from './react';
import { default as ReactSerializerLegacy } from './react';
import { nodeToReact } from './react/nodes';
import { withLazyNodes } from './react/utils/withLazyNodes';
/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required */
/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json
import RendererWithAnnotationSelectionLegacy, {
	RendererWithAnalytics as RendererWithAnalyticsLegacy,
} from './ui/Renderer';

/**
 * @deprecated Use `ReactSerializerInit` from `@atlaskit/renderer/serializer/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export type { ReactSerializerInit } from './react';

/**
 * @deprecated Use `ReactSerializer` from `@atlaskit/renderer/serializer/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export class ReactSerializer extends ReactSerializerLegacy {
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

/**
 * @private
 * @deprecated Use `TextSerializer` from `@atlaskit/renderer/serializer/text` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export { default as TextSerializer } from './text';

/**
 * @deprecated Use `Renderer` from `@atlaskit/renderer/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export const ReactRenderer: typeof RendererWithAnnotationSelectionLegacy = withLazyNodes(
	RendererWithAnnotationSelectionLegacy,
);

/**
 * @deprecated Use `Renderer` from `@atlaskit/renderer/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export const RendererWithAnalytics: (
	props: ComponentProps<typeof RendererWithAnalyticsLegacy>,
) => JSX.Element = withLazyNodes(RendererWithAnalyticsLegacy);

/**
 * @deprecated Use `nodes` from `@atlaskit/renderer/nodes/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export { nodeToReact as defaultNodeComponents } from './react/nodes';

export { InlineNodeRendererWrapper } from './ui/ExtensionRenderer';
export { AnnotationsWrapper } from './ui/annotations';
export { ValidationContextProvider } from './ui/Renderer/ValidationContext';

/**
 * @deprecated Use `Serializer` from `@atlaskit/renderer/serializer/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export type { Serializer } from './serializer';

export type {
	HeadingAnchorLinksProps,
	RendererAppearance,
	RendererContentMode,
	StickyHeaderProps,
	NodeComponentsProps,
} from './ui/Renderer/types';
export type { RendererProps } from './ui/renderer-props';
export type { RendererContext, NodeProps, ExtensionViewportSize } from './react/types';
export { ADFEncoder } from './utils';

export { renderDocument } from './render-document';
export type { RenderOutputStat } from './render-document';

export type { MediaSSR } from './types/mediaOptions';

export type { AnalyticsEventPayload } from './analytics/events';
