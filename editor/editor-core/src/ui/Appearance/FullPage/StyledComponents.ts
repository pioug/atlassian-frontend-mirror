// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { decisionListSelector, taskListSelector } from '@atlaskit/adf-schema';
import { tableFullPageEditorStyles } from '@atlaskit/editor-plugins/table/ui/common-styles';
import { tableMarginFullWidthMode } from '@atlaskit/editor-plugins/table/ui/consts';
import {
	akEditorFullWidthLayoutWidth,
	akEditorGutterPaddingDynamic,
	akEditorSwoopCubicBezier,
	akLayoutGutterOffset,
	FULL_PAGE_EDITOR_TOOLBAR_HEIGHT,
} from '@atlaskit/editor-shared-styles';
import { scrollbarStyles } from '@atlaskit/editor-shared-styles/scrollbar';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { createEditorContentStyle } from '../../ContentStyles';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const SWOOP_ANIMATION = `0.5s ${akEditorSwoopCubicBezier}`;
const getTotalPadding = () => akEditorGutterPaddingDynamic() * 2;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const fullPageEditorWrapper = css({
	minWidth: '340px',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	boxSizing: 'border-box',
});

const scrollStyles = css(
	{
		flexGrow: 1,
		height: '100%',
		overflowY: 'scroll',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		scrollBehavior: 'smooth',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	scrollbarStyles,
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ScrollContainer = createEditorContentStyle(scrollStyles);
ScrollContainer.displayName = 'ScrollContainer';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const contentArea = () => {
	const editorToolbarHeight = FULL_PAGE_EDITOR_TOOLBAR_HEIGHT();
	return css({
		display: 'flex',
		flexDirection: 'row',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `calc(100% - ${editorToolbarHeight})`,
		boxSizing: 'border-box',
		margin: 0,
		padding: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		transition: `padding 0ms ${akEditorSwoopCubicBezier}`,
	});
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const contentAreaContainerTypeInlineSize = () => {
	const editorToolbarHeight = FULL_PAGE_EDITOR_TOOLBAR_HEIGHT();
	return css({
		display: 'flex',
		flexDirection: 'row',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `calc(100% - ${editorToolbarHeight})`,
		boxSizing: 'border-box',
		margin: 0,
		padding: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		transition: `padding 0ms ${akEditorSwoopCubicBezier}`,
		containerType: 'inline-size',
		containerName: 'editor-area',
	});
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const contentAreaHeightNoToolbar = css({
	height: '100%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const sidebarArea = css({
	height: '100%',
	boxSizing: 'border-box',
	alignSelf: 'flex-end',
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
				maxWidth: `calc(100% + ${akLayoutGutterOffset * 2}px)`,
			},
		},
	});

export const editorContentAreaStyle = ({
	layoutMaxWidth,
	fullWidthMode,
}: {
	layoutMaxWidth: number;
	fullWidthMode: boolean;
}) => [
	editorContentArea,
	!fullWidthMode && editorContentAreaWithLayoutWith(layoutMaxWidth),
	editorContentAreaContainerStyle(),
];

const editorContentAreaWithLayoutWith = (layoutMaxWidth: number) =>
	css({
		// this restricts max width
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxWidth: `${layoutMaxWidth + getTotalPadding()}px`,
	});

const editorContentArea = css(
	{
		lineHeight: '24px',
		paddingTop: token('space.600', '48px'),
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
	const padding = fg('platform.editor.core.increase-full-page-guttering')
		? // there is no space token for 52px
			`0 52px`
		: `0 ${token('space.400', '32px')}`;

	return css({
		boxSizing: 'border-box',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		padding: padding,
	});
};
