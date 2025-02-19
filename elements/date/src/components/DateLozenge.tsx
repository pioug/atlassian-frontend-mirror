/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
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
				token('color.background.accent.red.subtlest'),
				token('color.text.accent.red'),
				token('color.background.accent.red.subtler'),
			];
		}
		case 'yellow': {
			return [
				token('color.background.accent.yellow.subtlest'),
				token('color.text.accent.yellow'),
				token('color.background.accent.yellow.subtler'),
			];
		}
		case 'blue': {
			return [
				token('color.background.accent.blue.subtlest'),
				token('color.text.accent.blue'),
				token('color.background.accent.blue.subtler'),
			];
		}
		case 'green': {
			return [
				token('color.background.accent.green.subtlest'),
				token('color.text.accent.green'),
				token('color.background.accent.green.subtler'),
			];
		}
		case 'purple': {
			return [
				token('color.background.accent.purple.subtlest'),
				token('color.text.accent.purple'),
				token('color.background.accent.purple.subtler'),
			];
		}
		case 'grey':
		default:
			return [
				token('color.background.neutral'),
				token('color.text'),
				token('color.background.neutral.hovered'),
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
		// eslint-disable-next-line @atlaskit/design-system/no-html-button
		<span
			role="button"
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
