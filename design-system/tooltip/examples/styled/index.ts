// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const backgroundColors: { [key: string]: string } = {
	blue: token('color.background.brand.bold', colors.B300),
	green: token('color.background.success.bold', colors.G400),
	neutral: token('color.background.neutral', colors.N100), // it seems unused
	purple: token('color.background.accent.purple.bolder', colors.P300),
	red: token('color.background.danger.bold', colors.R400),
	teal: token('color.background.accent.teal.bolder', '#227D9B'), // #227D9B is equal to T700 that is absent in @atlaskit/theme/colors
	yellow: token('color.background.warning.bold', colors.Y200),
};

// text colors for a given background color
const textColors: { [key: string]: string } = {
	yellow: token('color.text.warning.inverse', colors.N800),
};

export type Color = 'blue' | 'green' | 'neutral' | 'purple' | 'red' | 'teal' | 'yellow';

interface StyledProps {
	pad?: string;
	position?: string;
	color: Color | string;
}

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const Target = styled.button<StyledProps>((props) => {
	const background = backgroundColors[props.color] || token('color.background.brand.bold');
	const textColor = textColors[props.color] || token('color.text.inverse');
	return {
		backgroundColor: background,
		borderRadius: '3px',
		border: 0,
		boxSizing: 'initial',
		color: textColor,
		cursor: 'pointer',
		display: 'inline-block',
		fontSize: 'inherit',
		height: '30px',
		lineHeight: '30px',
		padding: '0 1em',
		userSelect: 'none',
	};
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const BigTarget = styled.button<StyledProps>((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: backgroundColors[props.color] || token('color.background.brand.bold'),
	borderRadius: '3px',
	border: 0,
	boxSizing: 'initial',
	color: 'white',
	cursor: 'pointer',
	display: 'flex',
	flexDirection: 'column',
	fontSize: 'inherit',
	lineHeight: 'unset',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100px',
	width: '150px',
	padding: '0 1em',
	userSelect: 'none',
	textAlign: 'center',
}));
