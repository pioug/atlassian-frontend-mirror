// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import {
	akEditorMobileMaxWidth,
	FULL_PAGE_EDITOR_TOOLBAR_HEIGHT,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

export const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 868;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const mainToolbarIconBeforeStyle: SerializedStyles = css({
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
export const nonCustomToolbarWrapperStyle: SerializedStyles = css({
	alignItems: 'center',
	display: 'flex',
	flexGrow: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const customToolbarWrapperStyle: SerializedStyles = css({
	alignItems: 'center',
	display: 'flex',
});
