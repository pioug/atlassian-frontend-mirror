/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

import { css, jsx, keyframes } from '@compiled/react';

import { AtlassianIcon } from '@atlaskit/logo';
import { token } from '@atlaskit/tokens';

interface BlockProps extends React.HTMLProps<HTMLDivElement> {
	appearance?: 'small' | 'medium' | 'large';
}

interface AnimatedBlockProps extends BlockProps {
	curve: string;
	duration: number;
}

const logoSize = {
	large: 'xlarge',
	medium: 'large',
	small: 'small',
};

const blockStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: token('elevation.surface'),
	borderRadius: token('radius.xxlarge'),
	boxShadow: token('elevation.shadow.overlay'),
	cursor: 'default',
	marginBlockEnd: token('space.200', '16px'),
	marginBlockStart: token('space.200', '16px'),
	marginInlineEnd: token('space.200', '16px'),
	marginInlineStart: token('space.200', '16px'),
});

const interactiveStyles = css({
	cursor: 'pointer',
	'&:hover': {
		backgroundColor: token('color.background.brand.bold'),
	},
});

const sizeSmall = css({
	width: '50px',
	height: '50px',
});

const sizeMedium = css({
	width: '150px',
	height: '150px',
});

const sizeLarge = css({
	width: '300px',
	height: '300px',
});

export const Block: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<BlockProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, BlockProps>(
	({ onClick, appearance = 'medium', ...props }: BlockProps, ref) => (
		<div
			ref={ref}
			css={[
				blockStyles,
				appearance === 'small' && sizeSmall,
				appearance === 'medium' && sizeMedium,
				appearance === 'large' && sizeLarge,
				onClick && interactiveStyles,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={props.className}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={props.style}
		>
			{props.children || <AtlassianIcon size={logoSize[appearance] as any} />}
		</div>
	),
);

const movesRight = keyframes({
	from: {
		transform: 'none',
	},
	to: {
		transform: 'translate3d(200%, 0, 0)',
	},
});

export const MovesRightBlock: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<AnimatedBlockProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, AnimatedBlockProps>((props: AnimatedBlockProps, ref) => (
	<Block
		ref={ref}
		css={{
			animationName: `${movesRight}`,
			animationDuration: `${props.duration}ms`,
			animationTimingFunction: props.curve,
			animationIterationCount: 'infinite',
		}}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		className={props.className}
		style={props.style}
	/>
));
