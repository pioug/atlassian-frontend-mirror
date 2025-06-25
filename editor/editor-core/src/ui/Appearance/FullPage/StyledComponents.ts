// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import {
	FULL_PAGE_EDITOR_TOOLBAR_HEIGHT,
	akEditorSwoopCubicBezier,
} from '@atlaskit/editor-shared-styles';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const fullPageEditorWrapper = css({
	minWidth: '340px',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	boxSizing: 'border-box',
});

// delete when cleaning up experiment `platform_editor_core_static_emotion_non_central`
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const contentArea = () => {
	const editorToolbarHeight = FULL_PAGE_EDITOR_TOOLBAR_HEIGHT();
	return css({
		display: 'flex',
		flexDirection: 'row',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `calc(100% - ${editorToolbarHeight})`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		'&.ak-editor-content-area-no-toolbar': {
			// The editor toolbar height is 1px off (from the border) -- so we need to add 1px to the height
			// to match the toolbar height
			height: `calc(100% + 1px)`,
		},
		boxSizing: 'border-box',
		margin: 0,
		padding: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		transition: `padding 0ms ${akEditorSwoopCubicBezier}`,
	});
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const contentAreaWrapper = css({
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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const sidebarArea = css({
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

// initially hide until we have a containerWidth and can properly size them,
// otherwise they can cause the editor width to extend which is non-recoverable
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const editorContentAreaHideContainer = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.fabric-editor--full-width-mode': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.pm-table-container, .code-block, .extension-container': {
			display: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.multiBodiedExtension--container': {
			display: 'none',
		},
	},
});
