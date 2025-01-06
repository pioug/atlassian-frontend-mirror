// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { getTruncateStyles } from '../../../../utils';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const dropdownItemGroupStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		width: '220px',
		'&:hover': {
			backgroundColor: 'inherit',
			cursor: 'default',
		},
	},
});

const sharedBlockStyles = css({
	display: 'flex',
	gap: token('space.100', '0.5rem'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '1rem',
	minWidth: 0,
	overflow: 'hidden',
	flexDirection: 'row',
	alignItems: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const contentStyles = css(sharedBlockStyles, {
	marginTop: token('space.025', '2px'),
	alignItems: 'flex-start',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span, > div': {
		font: token('font.body'),
		color: token('color.text', N800),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const linkStyles = css(sharedBlockStyles, {
	cursor: 'pointer',
	font: token('font.body'),
	marginTop: token('space.100', '8px'),
	marginLeft: token('space.400', '32px'),
	marginBottom: token('space.025', '2px'),
});

export const textStyles = (maxLines: number) =>
	css(
		{
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: '1rem',
			whiteSpace: 'normal',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		getTruncateStyles(maxLines),
	);
