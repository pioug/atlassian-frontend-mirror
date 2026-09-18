/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required */
/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export { default as ReactSerializer, type ReactSerializerInit } from './react';
export { default as TextSerializer } from './text';

/**
 * @deprecated Use `Renderer` from `@atlaskit/renderer/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */

export { default as ReactRenderer } from './ui/Renderer';

/**
 * @deprecated Use `RendererWithAnalytics` from `@atlaskit/renderer/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export { RendererWithAnalytics } from './ui/Renderer';
export { InlineNodeRendererWrapper } from './ui/ExtensionRenderer';

/**
 * @deprecated Use `nodes` from `@atlaskit/renderer/nodes/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export { nodeToReact as defaultNodeComponents } from './react/nodes';
export { AnnotationsWrapper } from './ui/annotations';
export { ValidationContextProvider } from './ui/Renderer/ValidationContext';

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
