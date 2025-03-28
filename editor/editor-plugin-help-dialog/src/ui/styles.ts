// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { akEditorUnitZIndex, relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as colors from '@atlaskit/theme/colors';
import { B300, N400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const header = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: akEditorUnitZIndex,
	minHeight: token('space.300', '24px'),
	padding: `${token('space.250', '20px')} ${token('space.500', '40px')}`,
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	boxShadow: "'none'",
	font: token('font.heading.large'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text', colors.N400),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('color.background.neutral.subtle', colors.N0),
	borderRadius: token('border.radius', '3px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const footer = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: akEditorUnitZIndex,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.subtlest', colors.N300),
	font: token('font.body'),
	padding: token('space.300', '24px'),
	textAlign: 'right',
	boxShadow: "'none'",
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const contentWrapper = css({
	padding: `${token('space.250', '20px')} ${token('space.500', '40px')}`,
	borderBottomRightRadius: token('border.radius', '3px'),
	overflow: 'auto',
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.subtle', colors.N400),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('color.background.neutral.subtle', colors.N0),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const line = css({
	background: token('color.background.neutral.subtle', '#fff'),
	content: "''",
	display: 'block',
	height: token('space.025', '2px'),
	left: 0,
	position: 'absolute',
	top: 0,
	right: 0,
	width: '100%',
	minWidth: '604px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const content = css({
	minWidth: '524px',
	width: '100%',
	position: 'relative',
	display: 'flex',
	justifyContent: 'space-between',
});

export const column = {
	width: '44%',
	'& > ul': {
		padding: 0,
	},
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const row = css({
	margin: `${token('space.250', '20px')} 0`,
	display: 'flex',
	justifyContent: 'space-between',
});

export const dialogHeader = {
	'&': {
		fontSize: relativeFontSizeToBase16(24),
		fontWeight: token('font.weight.regular'),
		color: token('color.text.subtle', N400),
		letterSpacing: 'normal',
		lineHeight: 1.42857142857143,
	},
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const shortcutsArray = css({
	display: 'flex',
	flexDirection: 'column',
	flexShrink: 0,
	gap: token('space.150', '12px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const componentFromKeymapWrapperStyles = css({
	flexShrink: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const toolbarButton = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:focus:not(:focus-visible)': {
		outline: `2px solid ${token('color.border.focused', B300)}`,
		outlineOffset: token('space.025', '2px'),
	},
});
