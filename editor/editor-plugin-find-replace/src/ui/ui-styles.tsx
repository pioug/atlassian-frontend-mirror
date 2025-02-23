/* eslint-disable @atlaskit/design-system/no-nested-styles */
/* eslint-disable @repo/internal/styles/no-exported-styles */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const fontSize = 14;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ruleStyles = css({
	width: '100%',
	border: 'none',
	backgroundColor: `${token('color.border', N30A)}`,
	margin: `${token('space.050', '4px')} 0px`,
	height: '1px',
	borderRadius: '1px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const wrapperStyles = css({
	display: 'flex',
	flexDirection: 'column',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'> *:not(#replace-hr-element)': {
		margin: `0px ${token('space.050', '4px')}`,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const wrapperPaddingStyles = css({
	padding: `${token('space.050', '4px')} ${token('space.050', '4px')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const sectionWrapperStyles = css({
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > *': {
		display: 'inline-flex',
		height: '32px',
		flex: '0 0 auto',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-ds--text-field--container]': {
		display: 'flex',
		flex: '1 1 auto',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const sectionWrapperStylesAlternate = css({
	display: 'flex',
	padding: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > *': {
		height: 'unset',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const sectionWrapperJustified = css({
	justifyContent: 'space-between',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: relativeFontSizeToBase16(14),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const textFieldWrapper = css({
	flex: '1 100%',
	flexWrap: 'wrap',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'#find-text-field, #replace-text-field': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `${36 / fontSize}em`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	label: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		fontSize: relativeFontSizeToBase16(14),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/use-tokens-typography -- Ignored via go/DSP-18766
		lineHeight: '16px',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const afterInputSection = css({
	display: 'flex',
	flex: '0 0 auto',
	alignItems: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const matchCaseSection = css({
	paddingRight: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		width: '20px',
		height: '20px',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const nextPreviousItemStyles = css({
	padding: `0px ${token('space.025', '2px')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const countStyles = css({
	color: `${token('color.text.subtlest', '#626F86')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/use-tokens-typography -- Ignored via go/DSP-18766
	fontSize: `${relativeFontSizeToBase16(12)}`,
	flex: '0 0 auto',
	justifyContent: 'center',
	alignItems: 'center',
	marginLeft: token('space.050', '4px'),
	marginRight: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const countStylesAlternateStyles = css({
	display: 'inline-flex',
	height: '32px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const countWrapperStyles = css({
	alignItems: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const orderZeroStyles = css({
	order: '0',
	marginInline: `${token('space.050', '4px')} ${token('space.025', '2px')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const orderOneStyles = css({
	order: '1',
});
