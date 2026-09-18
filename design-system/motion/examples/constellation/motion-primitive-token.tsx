/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import Motion from '@atlaskit/motion/entering/motion';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { token } from '@atlaskit/tokens';

import { Block } from '../utils/blocks';
import { Centered, RetryContainer } from '../utils/containers';

const styles = cssMap({
	container: {
		textAlign: 'center',
	},
	centered: {
		height: '182px',
	},
});

const MotionPrimitiveTokenExample = (): JSX.Element => {
	const [isIn, setIsIn] = useState(true);

	return (
		<RetryContainer>
			<div css={styles.container}>
				<Button onClick={() => setIsIn((prev) => !prev)}>{isIn ? 'Exit' : 'Enter'}</Button>

				<Centered css={styles.centered}>
					<ExitingPersistence appear>
						{isIn && (
							<Motion
								enteringAnimation={token('motion.blanket.enter')}
								exitingAnimation={token('motion.blanket.exit')}
							>
								<Block />
							</Motion>
						)}
					</ExitingPersistence>
				</Centered>
			</div>
		</RetryContainer>
	);
};

export default MotionPrimitiveTokenExample;
