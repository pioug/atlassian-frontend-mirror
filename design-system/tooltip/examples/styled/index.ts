import styled from '@emotion/styled';

import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const color: { [key: string]: string } = {
	blue: colors.B300,
	green: colors.G300,
	neutral: colors.N100,
	purple: colors.P300,
	red: colors.R300,
	teal: colors.T300,
	yellow: colors.Y300,
};

export type Color = 'blue' | 'green' | 'neutral' | 'purple' | 'red' | 'teal' | 'yellow';

interface StyledProps {
	pad?: string;
	position?: string;
	color: Color | string;
}

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Target = styled.button<StyledProps>((props) => ({
	backgroundColor: color[props.color] || token('color.background.brand.bold'),
	borderRadius: '3px',
	border: 0,
	boxSizing: 'initial',
	color: 'white',
	cursor: 'pointer',
	display: 'inline-block',
	fontSize: 'inherit',
	height: '30px',
	lineHeight: '30px',
	padding: '0 1em',
	userSelect: 'none',
}));

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const BigTarget = styled.button<StyledProps>((props) => ({
	backgroundColor: color[props.color] || token('color.background.brand.bold'),
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
