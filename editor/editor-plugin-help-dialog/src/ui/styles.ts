// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { akEditorUnitZIndex, relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const header: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: akEditorUnitZIndex,
	minHeight: token('space.300'),
	padding: `${token('space.250')} ${token('space.500')}`,
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	boxShadow: "'none'",
	font: token('font.heading.large'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('color.background.neutral.subtle'),
	borderRadius: token('radius.small', '3px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const footer: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: akEditorUnitZIndex,
	color: token('color.text.subtle'),
	font: token('font.body'),
	padding: token('space.300'),
	textAlign: 'right',
	boxShadow: "'none'",
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const contentWrapper: SerializedStyles = css({
	padding: `${token('space.250')} ${token('space.500')}`,
	borderBottomRightRadius: token('radius.small', '3px'),
	overflow: 'auto',
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.text.subtle'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('color.background.neutral.subtle'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const line: SerializedStyles = css({
	background: token('color.background.neutral.subtle'),
	content: "''",
	display: 'block',
	height: token('space.025'),
	left: 0,
	position: 'absolute',
	top: 0,
	right: 0,
	width: '100%',
	minWidth: '604px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const content: SerializedStyles = css({
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
export const row: SerializedStyles = css({
	margin: `${token('space.250')} 0`,
	display: 'flex',
	justifyContent: 'space-between',
});

export const dialogHeader: {
	'&': {
		fontSize: string;
		fontWeight: 'var(--ds-font-weight-regular)';
		color: 'var(--ds-text-subtle)';
		letterSpacing: string;
		lineHeight: number;
	};
} = {
	'&': {
		fontSize: relativeFontSizeToBase16(24),
		fontWeight: token('font.weight.regular'),
		color: token('color.text.subtle'),
		letterSpacing: 'normal',
		lineHeight: 1.42857142857143,
	},
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const shortcutsArray: SerializedStyles = css({
	display: 'flex',
	flexDirection: 'column',
	flexShrink: 0,
	gap: token('space.150'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const componentFromKeymapWrapperStyles: SerializedStyles = css({
	flexShrink: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const toolbarButton: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:focus:not(:focus-visible)': {
		outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
		outlineOffset: token('space.025'),
	},
});
