import { css } from '@emotion/react';

import { akEditorUnitZIndex, relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import * as colors from '@atlaskit/theme/colors';
import { B300, N400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const header = css({
	zIndex: akEditorUnitZIndex,
	minHeight: token('space.300', '24px'),
	padding: `${token('space.250', '20px')} ${token('space.500', '40px')}`,
	fontSize: relativeFontSizeToBase16(24),
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	boxShadow: "'none'",
	color: token('color.text', colors.N400),
	backgroundColor: token('color.background.neutral.subtle', colors.N0),
	borderRadius: token('border.radius', '3px'),
});

export const footer = css({
	zIndex: akEditorUnitZIndex,
	fontSize: relativeFontSizeToBase16(14),
	lineHeight: token('space.250', '20px'),
	color: token('color.text.subtlest', colors.N300),
	padding: token('space.300', '24px'),
	textAlign: 'right',
	boxShadow: "'none'",
});

export const contentWrapper = css({
	padding: `${token('space.250', '20px')} ${token('space.500', '40px')}`,
	borderBottomRightRadius: token('border.radius', '3px'),
	overflow: 'auto',
	position: 'relative',
	color: token('color.text.subtle', colors.N400),
	backgroundColor: token('color.background.neutral.subtle', colors.N0),
});

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

export const row = css({
	margin: `${token('space.250', '20px')} 0`,
	display: 'flex',
	justifyContent: 'space-between',
});

export const dialogHeader = {
	'&': {
		fontSize: relativeFontSizeToBase16(24),
		fontWeight: 400,
		color: token('color.text.subtle', N400),
		letterSpacing: 'normal',
		lineHeight: 1.42857142857143,
	},
};
export const title = {
	'&': {
		fontSize: relativeFontSizeToBase16(18),
		fontWeight: 400,
		color: token('color.text.subtle', N400),
		letterSpacing: 'normal',
		lineHeight: 1.42857142857143,
	},
};

export const codeSm = css({
	backgroundColor: token('color.background.neutral', colors.N20),
	borderRadius: token('border.radius', '3px'),
	width: token('space.300', '24px'),
	display: 'inline-block',
	height: token('space.300', '24px'),
	lineHeight: '24px',
	textAlign: 'center',
});

export const codeMd = css({
	backgroundColor: token('color.background.neutral', colors.N20),
	borderRadius: token('border.radius', '3px'),
	display: 'inline-block',
	height: token('space.300', '24px'),
	lineHeight: '24px',
	width: '50px',
	textAlign: 'center',
});

export const codeLg = css({
	backgroundColor: token('color.background.neutral', colors.N20),
	borderRadius: token('border.radius', '3px'),
	display: 'inline-block',
	height: token('space.300', '24px'),
	lineHeight: token('space.300', '24px'),
	padding: `0 ${token('space.150', '12px')}`,
	textAlign: 'center',
});

export const shortcutsArray = css({
	display: 'flex',
	flexDirection: 'column',
	flexShrink: 0,
	gap: token('space.150', '12px'),
});

export const componentFromKeymapWrapperStyles = css({
	flexShrink: 0,
});

export const toolbarButton = css({
	'&:focus': {
		outline: `2px solid ${token('color.border.focused', B300)}`,
		outlineOffset: token('space.025', '2px'),
	},
});