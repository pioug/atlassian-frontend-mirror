/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { forwardRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, keyframes } from '@emotion/react';

import { AtlassianIcon } from '@atlaskit/logo';
import { token } from '@atlaskit/tokens';

interface BlockProps extends React.HTMLProps<HTMLDivElement> {
	appearance?: 'small' | 'medium' | 'large';
}

interface AnimatedBlockProps extends BlockProps {
	curve: string;
	duration: number;
}

const blockSize = {
	small: 50,
	medium: 150,
	large: 300,
};

const logoSize = {
	large: 'xlarge',
	medium: 'large',
	small: 'small',
};

export const Block = forwardRef<HTMLDivElement, BlockProps>(
	({ onClick, appearance = 'medium', ...props }: BlockProps, ref) => {
		const size = blockSize[appearance];
		return (
			<div
				ref={ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={css({
					display: 'flex',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					width: `${size}px`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					height: `${size}px`,
					margin: token('space.200', '16px'),
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: token('elevation.surface'),
					borderRadius: `${Math.floor(size / 7)}px`,
					boxShadow: token('elevation.shadow.overlay'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					cursor: onClick ? 'pointer' : 'default',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
					':hover': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
						backgroundColor: onClick ? token('color.background.brand.bold') : undefined,
					},
				})}
				{...props}
			>
				{props.children || <AtlassianIcon size={logoSize[appearance] as any} />}
			</div>
		);
	},
);

const movesRight = keyframes({
	from: {
		transform: 'none',
	},
	to: {
		transform: 'translate3d(200%, 0, 0)',
	},
});

export const MovesRightBlock = forwardRef<HTMLDivElement, AnimatedBlockProps>(
	(props: AnimatedBlockProps, ref) => (
		<Block
			ref={ref as any}
			css={{
				animationName: `${movesRight}`,
				animationDuration: `${props.duration}ms`,
				animationTimingFunction: props.curve,
				animationIterationCount: 'infinite',
			}}
			{...props}
		/>
	),
);
