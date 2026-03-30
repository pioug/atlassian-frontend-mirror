/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ButtonHTMLAttributes, forwardRef } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const backgroundColors: { [key: string]: string } = {
	blue: token('color.background.brand.bold'),
	green: token('color.background.success.bold'),
	neutral: token('color.background.neutral'), // it seems unused
	purple: token('color.background.accent.purple.bolder'),
	red: token('color.background.danger.bold'),
	teal: token('color.background.accent.teal.bolder'),
	yellow: token('color.background.warning.bold'),
};

// text colors for a given background color
const textColors: { [key: string]: string } = {
	yellow: token('color.text.warning.inverse'),
};

export type Color = 'blue' | 'green' | 'neutral' | 'purple' | 'red' | 'teal' | 'yellow';
type TargetProps = StyledProps & ButtonHTMLAttributes<HTMLButtonElement>;

interface StyledProps {
	pad?: string;
	position?: string;
	color: Color | string;
}

const targetStyles = css({
	display: 'inline-block',
	boxSizing: 'initial',
	height: '30px',
	padding: '0 1em',
	border: 0,
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	cursor: 'pointer',
	fontSize: 'inherit',
	lineHeight: '30px',
	userSelect: 'none',
});

export const Target: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<TargetProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, TargetProps>((props, ref) => {
	const { style = {}, color, ...restProps } = props;

	return (
		<button
			ref={ref}
			css={targetStyles}
			style={{
				backgroundColor: backgroundColors[props.color] || token('color.background.brand.bold'),
				color: textColors[props.color] || token('color.text.inverse'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				...style,
			}}
			type="button"
			{...restProps}
		>
			{props.children}
		</button>
	);
});

const bigTargetStyles = css({
	display: 'flex',
	boxSizing: 'initial',
	width: '150px',
	height: '100px',
	padding: '0 1em',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	border: 0,
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	color: 'white',
	cursor: 'pointer',
	fontSize: 'inherit',
	lineHeight: 'unset',
	textAlign: 'center',
	userSelect: 'none',
});

export const BigTarget: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<TargetProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, TargetProps>((props, ref) => {
	const { style = {}, color, ...restProps } = props;

	return (
		<button
			ref={ref}
			css={bigTargetStyles}
			style={{
				backgroundColor: backgroundColors[props.color] || token('color.background.brand.bold'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				...style,
			}}
			type="button"
			{...restProps}
		>
			{props.children}
		</button>
	);
});
