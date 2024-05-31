/* eslint-disable @atlaskit/design-system/no-nested-styles */
/* eslint-disable @repo/internal/styles/no-exported-styles */
/** @jsx jsx */
import { css } from '@emotion/react';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { N30A } from '@atlaskit/theme/colors';
import {
	fontSize as getFontSize,
	// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
	gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const fontSize = getFontSize();
const gridSize = getGridSize();

export const ruleStyles = css({
	width: '100%',
	border: 'none',
	backgroundColor: `${token('color.border', N30A)}`,
	margin: `${token('space.050', '4px')} 0px`,
	height: '1px',
	borderRadius: '1px',
});

export const wrapperStyles = css({
	display: 'flex',
	flexDirection: 'column',

	'> *:not(#replace-hr-element)': {
		margin: `0px ${token('space.050', '4px')}`,
	},
});

export const wrapperPaddingStyles = css({
	padding: `${token('space.050', '4px')} ${token('space.050', '4px')}`,
});

export const sectionWrapperStyles = css({
	display: 'flex',
	'& > *': {
		display: 'inline-flex',
		height: '32px',
		flex: '0 0 auto',
	},
	'& > [data-ds--text-field--container]': {
		display: 'flex',
		flex: '1 1 auto',
	},
});

export const sectionWrapperStylesAlternate = css({
	display: 'flex',
	padding: token('space.100', '8px'),
	'& > *': {
		height: 'unset',
	},
});

export const sectionWrapperJustified = css({
	justifyContent: 'space-between',
	fontSize: relativeFontSizeToBase16(14),
});

export const textFieldWrapper = css({
	flex: '1 100%',
	flexWrap: 'wrap',
	'#find-text-field, #replace-text-field': {
		height: `${(gridSize * 4.5) / fontSize}em`,
	},
	label: {
		fontSize: relativeFontSizeToBase16(14),
		lineHeight: `${gridSize * 2}px`,
	},
});

export const afterInputSection = css({
	display: 'flex',
	flex: '0 0 auto',
	alignItems: 'center',
});

export const matchCaseSection = css({
	paddingRight: token('space.100', '8px'),
	button: {
		width: '20px',
		height: '20px',
	},
});

export const nextPreviousItemStyles = css({
	padding: `0px ${token('space.025', '2px')}`,
});

export const countStyles = css({
	color: `${token('color.text.subtlest', '#626F86')}`,
	fontSize: `${relativeFontSizeToBase16(12)}`,
	flex: '0 0 auto',
	justifyContent: 'center',
	alignItems: 'center',
	marginLeft: token('space.050', '4px'),
	marginRight: token('space.100', '8px'),
});

export const countStylesAlternateStyles = css({
	display: 'inline-flex',
	height: '32px',
});

export const countWrapperStyles = css({
	alignItems: 'center',
});

export const orderZeroStyles = css({
	order: '0',
	marginInline: `${token('space.050', '4px')} ${token('space.025', '2px')}`,
});

export const orderOneStyles = css({
	order: '1',
});
