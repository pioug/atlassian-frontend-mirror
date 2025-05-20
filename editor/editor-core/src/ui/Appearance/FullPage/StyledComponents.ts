// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { decisionListSelector, taskListSelector } from '@atlaskit/adf-schema';
import { tableFullPageEditorStyles } from '@atlaskit/editor-plugins/table/ui/common-styles';
import { tableMarginFullWidthMode } from '@atlaskit/editor-plugins/table/ui/consts';
import {
	FULL_PAGE_EDITOR_TOOLBAR_HEIGHT,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPaddingDynamic,
	akEditorSwoopCubicBezier,
	akLayoutGutterOffset,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const SWOOP_ANIMATION = `0.5s ${akEditorSwoopCubicBezier}`;
const getTotalPadding = () => akEditorGutterPaddingDynamic() * 2;
const akNestedDndGutterOffset = 8;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const fullPageEditorWrapper = css({
	minWidth: '340px',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	boxSizing: 'border-box',
});

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
export const contentAreaHeightNoToolbar = css({
	height: '100%',
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

/* Prevent horizontal scroll on page in full width mode */
const editorContentAreaContainerStyle = () =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.fabric-editor--full-width-mode': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'.code-block, .extension-container, .multiBodiedExtension--container': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				maxWidth: `calc(100% - ${tableMarginFullWidthMode * 2}px)`,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'.extension-container.inline': {
				maxWidth: '100%',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'td .extension-container.inline': {
				maxWidth: 'inherit',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'[data-layout-section]': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				maxWidth: `calc(100% + ${(akLayoutGutterOffset + (fg('platform_editor_nested_dnd_styles_changes') ? akNestedDndGutterOffset : 0)) * 2}px)`,
			},
		},
	});

export const editorContentAreaStyle = ({
	layoutMaxWidth,
	fullWidthMode,
	isEditorToolbarHidden,
}: {
	layoutMaxWidth: number;
	fullWidthMode: boolean;
	isEditorToolbarHidden?: boolean;
}) => [
	editorContentArea,
	!fullWidthMode && editorContentAreaWithLayoutWith(layoutMaxWidth),
	editorContentAreaContainerStyle(),
	...(fg('platform_editor_controls_no_toolbar_space')
		? []
		: [
				editorExperiment('platform_editor_controls', 'variant1') &&
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
					contentAreaReducedHeaderSpace,
				isEditorToolbarHidden &&
					editorExperiment('platform_editor_controls', 'variant1') &&
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
					contentAreaReservedPrimaryToolbarSpace,
			]),
];

const editorContentAreaWithLayoutWith = (layoutMaxWidth: number) =>
	css({
		// this restricts max width
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxWidth: `${layoutMaxWidth + getTotalPadding()}px`,
	});

const editorContentArea = css(
	{
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '24px',
		paddingTop: token('space.600', '48px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.ak-editor-content-area-no-toolbar &': {
			// When the toolbar is hidden, we don't want content to jump up
			// the extra 1px is to account for the border on the toolbar
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,  @atlaskit/ui-styling-standard/no-unsafe-values
			paddingTop: `calc(${token('space.600', '48px')} + ${FULL_PAGE_EDITOR_TOOLBAR_HEIGHT()} + 1px)`,
		},
		paddingBottom: token('space.600', '48px'),
		height: 'calc( 100% - 105px )',
		width: '100%',
		margin: 'auto',
		flexDirection: 'column',
		flexGrow: 1,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxWidth: `${akEditorFullWidthLayoutWidth + getTotalPadding()}px`,
		transition: `max-width ${SWOOP_ANIMATION}`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& .ProseMirror': {
			flexGrow: 1,
			boxSizing: 'border-box',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'& > *': {
				clear: 'both',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			[`> p, > ul, > ol:not(${taskListSelector}):not(${decisionListSelector}), > h1, > h2, > h3, > h4, > h5, > h6`]:
				{
					clear: 'none',
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'> p:last-child': {
				marginBottom: token('space.300', '24px'),
			},
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	tableFullPageEditorStyles,
	{
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.fabric-editor--full-width-mode': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'.fabric-editor-breakout-mark, .extension-container.block, .pm-table-container': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
				width: '100% !important',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'.fabric-editor-breakout-mark': {
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
				marginLeft: 'unset !important',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
				transform: 'none !important',
			},
		},
	},
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const editorContentGutterStyle = () => {
	return css({
		boxSizing: 'border-box',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		padding: `0 ${akEditorGutterPaddingDynamic()}px`,
	});
};

// An additional spacing applied at the top of the content area reserving space when the primary toolbar
// is hidden – this avoids layout shift when the toolbar is toggled under the editor controls feature
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const contentAreaReservedPrimaryToolbarSpace = css({
	// extra 1px to account for the bottom border on the toolbar
	marginTop: `calc(${token('space.500', '40px')} + 1px)`,
});

// A reduced top spacing applied to the content area to compensate for the reserved space at the top
// of the page when the primary toolbar is hidden under the editor controls feature
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
const contentAreaReducedHeaderSpace = css({
	paddingTop: token('space.400', '32px'),
});
