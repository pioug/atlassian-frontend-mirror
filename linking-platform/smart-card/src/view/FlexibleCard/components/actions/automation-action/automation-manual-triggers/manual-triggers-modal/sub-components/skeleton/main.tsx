/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { keyframes, css } from '@emotion/react';

import { N20, N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

type SkeletonProps = {
	lineCount?: number;
};

const AutomationSkeletonContainer = css({
	paddingBlock: token('space.025'),
});

const SkeletonContainer = css({
	marginBlock: token('space.100'),
	marginInline: token('space.250'),
	display: 'flex',
});

const SkeletonIcon = css({
	width: token('space.200'),
	height: token('space.200'),
	display: 'inline-block',
	borderRadius: token('space.025'),
	backgroundColor: 'currentColor',
	border: `${token('space.025', '2px')} solid transparent`,
	opacity: 0.15,
});

const MenuIcon = css({
	width: '24px',
	height: '24px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const shimmer = keyframes({
	'0%': {
		backgroundPosition: '-300px 0',
	},
	'100%': {
		backgroundPosition: '2000px 0',
	},
});

const SkeletonText = css({
	width: '85%',
	height: token('space.200', '16px'),
	marginTop: token('space.050', '4px'),
	marginLeft: token('space.150', '12px'),
	animationDuration: '1s',
	animationFillMode: 'forwards',
	animationIterationCount: 'infinite',
	animationName: shimmer,
	animationTimingFunction: 'linear',
	backgroundColor: token('color.skeleton', N30),
	backgroundImage: `linear-gradient(to right, ${token(
		'color.skeleton',
		N30,
	)} 10%, ${token('color.skeleton.subtle', N20)} 30%, ${token('color.skeleton', N30)} 50%)`,
	backgroundRepeat: 'no-repeat',
});

const SkeletonLine: () => JSX.Element = () => (
	<div css={SkeletonContainer}>
		<div css={MenuIcon}>
			<div css={SkeletonIcon} />
		</div>
		<div css={SkeletonText} />
	</div>
);
const getSkeletonLines = (lineCount: number) => {
	const skeletonLines = [];
	for (let i = 0; i < lineCount; i++) {
		skeletonLines.push(<SkeletonLine key={`skeleton-line-${i}`} />);
	}
	return skeletonLines;
};

export const Skeleton = (props: SkeletonProps) => {
	const { lineCount = 5 } = props;
	return (
		// eslint-disable-next-line @atlaskit/design-system/use-primitives
		<div css={AutomationSkeletonContainer}>{getSkeletonLines(lineCount)}</div>
	);
};
