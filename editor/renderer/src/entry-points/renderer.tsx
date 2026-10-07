/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required */
/* eslint-disable @atlaskit/editor/no-re-export */

import type { ComponentProps, JSX } from 'react';

import { withLazyNodes } from '../react/utils/withLazyNodes';
import RendererWithAnnotationSelectionLegacy, {
	Renderer as RendererLegacy,
	RendererFunctionalComponent as RendererFunctionalComponentLegacy,
	RendererWithAnalytics as RendererWithAnalyticsLegacy,
} from '../ui/Renderer/index';

/**
 * @deprecated This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 * Ping #cc-editor-lego if you are using this export.
 */
export { DEGRADED_SEVERITY_THRESHOLD } from '../ui/Renderer/index';

/**
 * @deprecated This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 * Ping #cc-editor-lego if you are using this export.
 */
export { NORMAL_SEVERITY_THRESHOLD } from '../ui/Renderer/index';

/**
 * @deprecated Use `Renderer` from `@atlaskit/renderer/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export const Renderer: typeof RendererLegacy = withLazyNodes(RendererLegacy);

/**
 * @deprecated Use `Renderer` from `@atlaskit/renderer/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export const RendererFunctionalComponent: typeof RendererFunctionalComponentLegacy = withLazyNodes(
	RendererFunctionalComponentLegacy,
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
 * @deprecated This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 * Ping #cc-editor-lego if you are using this export.
 */
export type { RendererWrapperProps } from '../ui/Renderer/index';

const RendererWithAnnotationSelection: typeof RendererWithAnnotationSelectionLegacy = withLazyNodes(
	RendererWithAnnotationSelectionLegacy,
);

/**
 * @deprecated Use `Renderer` from `@atlaskit/renderer/default` instead.
 * This export will be removed in January 2027.
 * @see https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7650942996/Moving+to+Synchronous+Rendering+in+Editor+Renderer for more.
 */
export default RendererWithAnnotationSelection;
