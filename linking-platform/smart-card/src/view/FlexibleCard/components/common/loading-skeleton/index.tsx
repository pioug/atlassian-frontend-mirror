/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx, keyframes } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import LoadingSkeletonOld from './LoadingSkeletonOld';
import { type LoadingSkeletonProps } from './types';

const animationNameStyles = keyframes({
	'0%': {
		backgroundPosition: '50% 0',
	},
	'100%': {
		backgroundPosition: '-50% 0',
	},
});

const LoadingSkeletonNew = ({ testId, width, height }: LoadingSkeletonProps) => {
	const styles = css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${width}rem`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `${height}rem`,
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

	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- needs dynamic css
	return <span css={styles} data-testid={testId} />;
};

const LoadingSkeleton = (props: LoadingSkeletonProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <LoadingSkeletonNew {...props} />;
	}
	return <LoadingSkeletonOld {...props} />;
};

export default LoadingSkeleton;
