// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import {
	akEditorFloatingDialogZIndex,
	akEditorMobileMaxWidth,
	akEditorSwoopCubicBezier,
	akEditorToolbarKeylineHeight,
	FULL_PAGE_EDITOR_TOOLBAR_HEIGHT,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

export const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 868;

// box-shadow is overriden by the mainToolbar
const mainToolbarWithKeyline = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	boxShadow: fg('platform.confluence.frontend.narrow-full-page-editor-toolbar')
		? `${token('elevation.shadow.overflow')}`
		: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			`0 ${akEditorToolbarKeylineHeight}px 0 0 ${token(
				'color.background.accent.gray.subtlest',
				'#F1F2F4',
			)}`,
});

const mainToolbarTwoLineStyle = () => {
	const editorToolbarHeight = FULL_PAGE_EDITOR_TOOLBAR_HEIGHT();
	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		[`@media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px)`]: {
			flexWrap: 'wrap',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height: `calc(${editorToolbarHeight} * 2)`,
		},
	});
};

const mainToolbar = () => {
	const editorToolbarHeight = FULL_PAGE_EDITOR_TOOLBAR_HEIGHT();
	return css({
		position: 'relative',
		alignItems: 'center',
		boxShadow: 'none',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		borderBottom: fg('platform.confluence.frontend.narrow-full-page-editor-toolbar')
			? `1px solid ${token('color.border')}`
			: undefined,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		transition: `box-shadow 200ms ${akEditorSwoopCubicBezier}`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		zIndex: akEditorFloatingDialogZIndex,
		display: 'flex',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: editorToolbarHeight,
		flexShrink: 0,
		backgroundColor: token('elevation.surface', 'white'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& object': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
			height: '0 !important',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
			display: 'grid',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height: `calc(${editorToolbarHeight} * 2)`,
		},
	});
};

export const mainToolbarStyle = (showKeyline: boolean, twoLineEditorToolbar: boolean) => [
	mainToolbar,
	showKeyline && mainToolbarWithKeyline,
	twoLineEditorToolbar && mainToolbarTwoLineStyle,
];

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const mainToolbarIconBeforeStyle = css({
	margin: token('space.200', '16px'),
	height: token('space.400', '32px'),
	width: token('space.400', '32px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
		gridColumn: 1,
		gridRow: 1,
	},
});

const mainToolbarFirstChild = css({
	display: 'flex',
	flexGrow: 1,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
		gridColumn: 1,
		gridRow: 1,
	},
});

const mainToolbarFirstChildTowLine = () => {
	const editorToolbarHeight = FULL_PAGE_EDITOR_TOOLBAR_HEIGHT();
	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		[`@media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px)`]: {
			flex: '1 1 100%',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height: editorToolbarHeight,
			justifyContent: 'flex-end',
			minWidth: 'fit-content',
		},
	});
};

export const mainToolbarFirstChildStyle = (twoLineEditorToolbar: boolean) => [
	mainToolbarFirstChild,
	twoLineEditorToolbar && mainToolbarFirstChildTowLine,
];

const mainToolbarSecondChild = css({
	minWidth: 'fit-content',
});

const mainToolbarSecondChildTwoLine = () => {
	const editorToolbarHeight = FULL_PAGE_EDITOR_TOOLBAR_HEIGHT();
	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		[`@media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px)`]: {
			display: 'flex',
			flexGrow: 1,
			flex: '1 1 100%',
			margin: 'auto',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height: editorToolbarHeight,
			minWidth: 0,
		},
	});
};

export const mainToolbarSecondChildStyle = (twoLineEditorToolbar: boolean) => [
	mainToolbarSecondChild,
	twoLineEditorToolbar && mainToolbarSecondChildTwoLine,
];

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const nonCustomToolbarWrapperStyle = css({
	alignItems: 'center',
	display: 'flex',
	flexGrow: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const customToolbarWrapperStyle = css({
	alignItems: 'center',
	display: 'flex',
});
