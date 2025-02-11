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

import { css, cssMap, jsx } from '@compiled/react';

export type Color = 'grey' | 'red' | 'blue' | 'green' | 'purple' | 'yellow';

export type Props = React.HTMLProps<HTMLSpanElement> & {
	clickable?: boolean;
	color?: Color;
};

const baseStyles = css({
	borderRadius: token('border.radius', '3px'),
	paddingTop: token('space.025', '2px'),
	paddingRight: token('space.050', '4px'),
	paddingBottom: token('space.025', '2px'),
	paddingLeft: token('space.050', '4px'),
	margin: '0 1px',
	position: 'relative',
	transition: 'background 0.3s',
	whiteSpace: 'nowrap',
	cursor: 'unset',
});

const onClickStyles = css({
	cursor: 'pointer',
});

const colorStyles = cssMap({
	red: {
		backgroundColor: token('color.background.accent.red.subtlest', R50),
		color: token('color.text.accent.red', R500),
		'&:hover': {
			backgroundColor: token('color.background.accent.red.subtler', R75),
		},
	},
	yellow: {
		backgroundColor: token('color.background.accent.yellow.subtlest', Y50),
		color: token('color.text.accent.yellow', Y500),
		'&:hover': {
			backgroundColor: token('color.background.accent.yellow.subtler', Y75),
		},
	},
	blue: {
		backgroundColor: token('color.background.accent.blue.subtlest', B50),
		color: token('color.text.accent.blue', B500),
		'&:hover': {
			backgroundColor: token('color.background.accent.blue.subtler', B75),
		},
	},
	green: {
		backgroundColor: token('color.background.accent.green.subtlest', G50),
		color: token('color.text.accent.green', G500),
		'&:hover': {
			backgroundColor: token('color.background.accent.green.subtler', G75),
		},
	},
	purple: {
		backgroundColor: token('color.background.accent.purple.subtlest', P50),
		color: token('color.text.accent.purple', P500),
		'&:hover': {
			backgroundColor: token('color.background.accent.purple.subtler', P75),
		},
	},
	grey: {
		backgroundColor: token('color.background.neutral', N30A),
		color: token('color.text', N800),
		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered', N40),
		},
	},
});

export const DateLozenge = (props: Props) => {
	const { className, color = 'grey', children, ...rest } = props;
	return (
		// eslint-disable-next-line @atlaskit/design-system/no-html-button
		<span
			{...rest}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			role="button"
			css={[baseStyles, props.onClick && onClickStyles, colorStyles[color]]}
		>
			{children}
		</span>
	);
};
