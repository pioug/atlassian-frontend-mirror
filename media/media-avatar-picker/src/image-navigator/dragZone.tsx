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
	// TODO (AFB-874): Disabling due to failing test
	// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
	padding: token('space.200', '15px'),
	position: 'relative',
	borderRadius: token('radius.full'),
	transition: 'background-color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)',
	'&::after': {
		content: "''",
		borderRadius: token('radius.full'),
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
		animationName: spin,
		animationDuration: '8s',
		animationTimingFunction: 'linear',
		animationIterationCount: 'infinite',
	},
});

const border = css({
	'&::after': {
		borderWidth: token('border.width.selected'),
		borderStyle: 'dashed',
		borderColor: token('color.border', '#d0d6d0'),
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
