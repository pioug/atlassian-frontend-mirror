/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
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
		backgroundColor: token('color.background.accent.red.subtlest'),
		color: token('color.text.accent.red'),
		'&:hover': {
			backgroundColor: token('color.background.accent.red.subtler'),
		},
	},
	yellow: {
		backgroundColor: token('color.background.accent.yellow.subtlest'),
		color: token('color.text.accent.yellow'),
		'&:hover': {
			backgroundColor: token('color.background.accent.yellow.subtler'),
		},
	},
	blue: {
		backgroundColor: token('color.background.accent.blue.subtlest'),
		color: token('color.text.accent.blue'),
		'&:hover': {
			backgroundColor: token('color.background.accent.blue.subtler'),
		},
	},
	green: {
		backgroundColor: token('color.background.accent.green.subtlest'),
		color: token('color.text.accent.green'),
		'&:hover': {
			backgroundColor: token('color.background.accent.green.subtler'),
		},
	},
	purple: {
		backgroundColor: token('color.background.accent.purple.subtlest'),
		color: token('color.text.accent.purple'),
		'&:hover': {
			backgroundColor: token('color.background.accent.purple.subtler'),
		},
	},
	grey: {
		backgroundColor: token('color.background.neutral'),
		color: token('color.text'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered'),
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
