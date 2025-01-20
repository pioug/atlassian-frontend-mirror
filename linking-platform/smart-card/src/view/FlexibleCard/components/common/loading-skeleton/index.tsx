/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx, keyframes } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import LoadingSkeletonEmotionOld from './LoadingSkeletonOld';
import type { LoadingSkeletonPropsNew, LoadingSkeletonPropsOld } from './types';

const animationNameStyles = keyframes({
	'0%': {
		backgroundPosition: '50% 0',
	},
	'100%': {
		backgroundPosition: '-50% 0',
	},
});

const loadingSkeletonStyle = css({
	borderRadius: '2px',
	userSelect: 'none',
	backgroundColor: token('color.skeleton.subtle', '#f6f7f8'),
	backgroundImage: `linear-gradient( to right, transparent 0%, ${token(
		'color.skeleton',
		'#edeef1',
	)} 20%, transparent 40%, transparent 100% )`,
	backgroundRepeat: 'no-repeat',
	backgroundSize: '280% 100%',
	display: 'inline-block',
	animationDuration: '1s',
	animationFillMode: 'forwards',
	animationIterationCount: 'infinite',
	animationName: animationNameStyles,
	animationTimingFunction: 'linear',
});

const LoadingSkeletonNew = ({ testId, width, height }: LoadingSkeletonPropsNew) => {
	return (
		<span
			css={loadingSkeletonStyle}
			data-testid={testId}
			style={{
				width,
				height,
			}}
		/>
	);
};

const LoadingSkeletonOld = (props: LoadingSkeletonPropsOld) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return (
			<LoadingSkeletonNew {...props} width={`${props.width}rem`} height={`${props.height}rem`} />
		);
	}
	return <LoadingSkeletonEmotionOld {...props} />;
};

export { LoadingSkeletonOld, LoadingSkeletonNew };
