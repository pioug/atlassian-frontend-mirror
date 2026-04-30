/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { keyframes } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { ExitingPersistence, Motion } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Block, Centered, RetryContainer } from '../utils';

const slideIn = keyframes({
	'0%': { transform: 'translateX(-24px)' },
	'100%': { transform: 'translateX(0)' },
});

const slideOut = keyframes({
	'0%': { transform: 'translateX(0)' },
	'100%': { transform: 'translateX(-24px)' },
});

const styles = cssMap({
	container: {
		textAlign: 'center',
	},
	centered: {
		height: '182px',
	},
	entering: {
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationName: `${slideIn}, ${token('motion.keyframe.fade.in')}`,
	},
	exiting: {
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationName: `${slideOut}, ${token('motion.keyframe.fade.out')}`,
	},
});

const MotionPrimitiveCustomKeyframeExample = (): JSX.Element => {
	const [isIn, setIsIn] = useState(true);

	return (
		<RetryContainer>
			<div css={styles.container}>
				<Button onClick={() => setIsIn((prev) => !prev)}>{isIn ? 'Exit' : 'Enter'}</Button>

				<Centered css={styles.centered}>
					<ExitingPersistence appear>
						{isIn && (
							<Motion enteringAnimationXcss={styles.entering} exitingAnimationXcss={styles.exiting}>
								<Block />
							</Motion>
						)}
					</ExitingPersistence>
				</Centered>
			</div>
		</RetryContainer>
	);
};

export default MotionPrimitiveCustomKeyframeExample;
