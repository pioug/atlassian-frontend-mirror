/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import {
	R50,
	R500,
	R75,
	Y50,
	Y500,
	Y75,
	B50,
	B500,
	B75,
	G50,
	G500,
	G75,
	P50,
	P500,
	P75,
	N30A,
	N800,
	N40,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

export type Color = 'grey' | 'red' | 'blue' | 'green' | 'purple' | 'yellow';

export type Props = React.HTMLProps<HTMLSpanElement> & {
	clickable?: boolean;
	color?: Color;
};

type ColoursTuple = [string, string, string];

export const resolveColors = (color?: Color): ColoursTuple => {
	switch (color) {
		case 'red': {
			return [
				token('color.background.accent.red.subtlest', R50),
				token('color.text.accent.red', R500),
				token('color.background.accent.red.subtler', R75),
			];
		}
		case 'yellow': {
			return [
				token('color.background.accent.yellow.subtlest', Y50),
				token('color.text.accent.yellow', Y500),
				token('color.background.accent.yellow.subtler', Y75),
			];
		}
		case 'blue': {
			return [
				token('color.background.accent.blue.subtlest', B50),
				token('color.text.accent.blue', B500),
				token('color.background.accent.blue.subtler', B75),
			];
		}
		case 'green': {
			return [
				token('color.background.accent.green.subtlest', G50),
				token('color.text.accent.green', G500),
				token('color.background.accent.green.subtler', G75),
			];
		}
		case 'purple': {
			return [
				token('color.background.accent.purple.subtlest', P50),
				token('color.text.accent.purple', P500),
				token('color.background.accent.purple.subtler', P75),
			];
		}
		case 'grey':
		default:
			return [
				token('color.background.neutral', N30A),
				token('color.text', N800),
				token('color.background.neutral.hovered', N40),
			];
	}
};

const baseStyles = css({
	borderRadius: token('border.radius', '3px'),
	padding: `${token('space.025', '2px')} ${token('space.050', '4px')}`,
	margin: '0 1px',
	position: 'relative',
	transition: 'background 0.3s',
	whiteSpace: 'nowrap',
});

export const DateLozenge = (props: Props) => {
	let colors = resolveColors(props.color);
	if ((colors as unknown as string) === '') {
		colors = ['', '', ''];
	}
	const [background, color, hoverBackground]: ColoursTuple = colors;

	return (
		<span
			css={[
				baseStyles,
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				{
					cursor: props.onClick ? 'pointer' : 'unset',
					background: background,
					color: color,
					'&:hover': {
						background: hoverBackground,
					},
				},
			]}
		>
			{props.children}
		</span>
	);
};
