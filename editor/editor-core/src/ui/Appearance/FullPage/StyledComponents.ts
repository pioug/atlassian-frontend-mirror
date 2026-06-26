/* eslint-disable @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766 */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_non_ecc_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/Appearance/FullPage/FullPage-compiled.tsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const fullPageEditorWrapper: SerializedStyles = css({
	minWidth: '340px',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	boxSizing: 'border-box',
});

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_non_ecc_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/Appearance/FullPage/FullPageContentArea-compiled.tsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const contentAreaWrapper: SerializedStyles = css({
	width: '100%',
	containerType: 'inline-size',
	containerName: 'editor-area',
	// Chrome 129 Regression!
	// By the spec, when the container-type: inline-size is used
	// The browser should apply the bewlo properties to the element.
	// However, for reasons that goes beyond my knowledge.
	// Chrome 129 broke that behavior, and now we need to make it explicity.
	contain: 'layout style inline-size',
});

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_non_ecc_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/Appearance/FullPage/FullPageContentArea-compiled.tsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports -- Ignored via go/DSP-18766
export const sidebarArea: SerializedStyles = css({
	height: '100%',
	boxSizing: 'border-box',
	alignSelf: 'flex-end',

	// Make the sidebar sticky within the legacy content macro
	// to prevent it from aligning to the bottom with large content.
	// This style is only applied when opening inside the legacy content macro.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
	'.extension-editable-area &': {
		height: 'auto',
		position: 'sticky',
		top: 0,
		alignSelf: 'flex-start',
	},
});
