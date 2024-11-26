/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { token } from '@atlaskit/tokens';
import { jsx, css, keyframes } from '@compiled/react';

const dragZoneStyles = css({
	width: '200px',
	height: '200px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	padding: token('space.200', '15px'),
	position: 'relative',
	borderRadius: '100%',
	transition: 'background-color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)',
	'&::after': {
		content: "''",
		borderRadius: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		transition: 'border-color 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
	},
	displayName: 'DragZone',
});

const spin = keyframes({
	from: {
		transform: 'rotate(0deg)',
	},
	to: {
		transform: 'rotate(360deg)',
	},
});

const droppingAnimation = css({
	backgroundColor: token('color.background.information.hovered', '#ddecfe'),
	'&::after': {
		borderColor: token('color.border.information', '#0e56c4'),
		animation: `${spin} 8s linear infinite`,
	},
});

const border = css({
	'&::after': {
		border: `2px dashed ${token('color.border', '#d0d6d0')}`,
	},
});

const noBorder = css({
	'&::after': {
		border: `none`,
	},
});

export const DragZone = ({ showBorder, isDroppingFile, children, ...props }: any) => (
	<div
		data-testid="dragzone"
		css={[
			dragZoneStyles,
			isDroppingFile && droppingAnimation,
			showBorder && border,
			!showBorder && noBorder,
		]}
		{...props}
	>
		{children}
	</div>
);
