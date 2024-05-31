import { css } from '@emotion/react';

import {
	akEditorFloatingDialogZIndex,
	akEditorMobileMaxWidth,
	akEditorSwoopCubicBezier,
	akEditorToolbarKeylineHeight,
	FULL_PAGE_EDITOR_TOOLBAR_HEIGHT,
} from '@atlaskit/editor-shared-styles';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

export const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 868;

// box-shadow is overriden by the mainToolbar
const mainToolbarWithKeyline = css({
	boxShadow: getBooleanFF('platform.confluence.frontend.narrow-full-page-editor-toolbar')
		? `${token('elevation.shadow.overflow')}`
		: `0 ${akEditorToolbarKeylineHeight}px 0 0 ${token(
				'color.background.accent.gray.subtlest',
				'#F1F2F4',
			)}`,
});

const mainToolbarTwoLineStyle = css({
	[`@media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px)`]: {
		flexWrap: 'wrap',
		height: `calc(${FULL_PAGE_EDITOR_TOOLBAR_HEIGHT()} * 2)`,
	},
});

const mainToolbar = css({
	position: 'relative',
	alignItems: 'center',
	boxShadow: 'none',
	borderBottom: getBooleanFF('platform.confluence.frontend.narrow-full-page-editor-toolbar')
		? `1px solid ${token('color.border')}`
		: undefined,
	transition: `box-shadow 200ms ${akEditorSwoopCubicBezier}`,
	zIndex: akEditorFloatingDialogZIndex,
	display: 'flex',
	height: FULL_PAGE_EDITOR_TOOLBAR_HEIGHT(),
	flexShrink: 0,
	backgroundColor: token('elevation.surface', 'white'),
	'& object': {
		height: '0 !important',
	},
	[`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
		display: 'grid',
		height: `calc(${FULL_PAGE_EDITOR_TOOLBAR_HEIGHT()} * 2)`,
	},
});

export const mainToolbarStyle = (showKeyline: boolean, twoLineEditorToolbar: boolean) => [
	mainToolbar,
	showKeyline && mainToolbarWithKeyline,
	twoLineEditorToolbar && mainToolbarTwoLineStyle,
];

export const mainToolbarIconBeforeStyle = css({
	margin: token('space.200', '16px'),
	height: token('space.400', '32px'),
	width: token('space.400', '32px'),
	[`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
		gridColumn: 1,
		gridRow: 1,
	},
});

const mainToolbarFirstChild = css({
	display: 'flex',
	flexGrow: 1,
	[`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
		gridColumn: 1,
		gridRow: 1,
	},
});

const mainToolbarFirstChildTowLine = css({
	[`@media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px)`]: {
		flex: '1 1 100%',
		height: FULL_PAGE_EDITOR_TOOLBAR_HEIGHT(),
		justifyContent: 'flex-end',
		minWidth: 'fit-content',
	},
});

export const mainToolbarFirstChildStyle = (twoLineEditorToolbar: boolean) => [
	mainToolbarFirstChild,
	twoLineEditorToolbar && mainToolbarFirstChildTowLine,
];

const mainToolbarSecondChild = css({
	minWidth: 'fit-content',
});

const mainToolbarSecondChildTwoLine = css({
	[`@media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px)`]: {
		display: 'flex',
		flexGrow: 1,
		flex: '1 1 100%',
		margin: 'auto',
		height: FULL_PAGE_EDITOR_TOOLBAR_HEIGHT(),
		minWidth: 0,
	},
});

export const mainToolbarSecondChildStyle = (twoLineEditorToolbar: boolean) => [
	mainToolbarSecondChild,
	twoLineEditorToolbar && mainToolbarSecondChildTwoLine,
];

export const nonCustomToolbarWrapperStyle = css({
	alignItems: 'center',
	display: 'flex',
	flexGrow: 1,
});

export const customToolbarWrapperStyle = css({
	alignItems: 'center',
	display: 'flex',
});
