/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import Motion from '@atlaskit/motion/entering/motion';
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
					<Motion
						action={isIn ? 'enter' : 'exit'}
						enteringAnimation={token('motion.blanket.enter')}
						exitingAnimation={token('motion.blanket.exit')}
					>
						<Block />
					</Motion>
				</Centered>
			</div>
		</RetryContainer>
	);
};

export default MotionPrimitiveTokenExample;
