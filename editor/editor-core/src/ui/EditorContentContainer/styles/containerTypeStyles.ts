/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

/**
 * Establishes a container-query context on the editor content area for non-full-page
 * appearances (comment, chromeless).
 *
 * Content sizing (native embeds, media / rich-media) reads `--ak-editor-max-container-width`
 * (`calc(100cqw - gutter)`) and, in some paths, `100cqw` directly. Those `cqw` units resolve
 * against the nearest ancestor with `container-type: inline-size`.
 *
 * Full-page already provides such an ancestor (the `editor-area` wrapper), so full-width
 * breakout keeps working there. But comment / chromeless appearances have no container-query
 * ancestor, so `cqw` falls back to the viewport width. The viewport does not shrink when an
 * in-page sidebar narrows the content column, so content max-widths stay viewport-wide and
 * never shrink: responsiveness works without a sidebar but breaks with one.
 *
 * Making the content area itself a query container gives `cqw` a real, sidebar-aware width to
 * resolve against. It is applied only to non-full-page appearances (full-page keeps the
 * existing `editor-area` container) and only to the content area (not the outer editor
 * wrapper), so the implied `contain: layout` stays confined to content — exactly how the
 * full-page `editor-area` container already behaves.
 *
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 */
export const nonFullPageContainerTypeStyles: SerializedStyles = css({
	containerType: 'inline-size',
});
