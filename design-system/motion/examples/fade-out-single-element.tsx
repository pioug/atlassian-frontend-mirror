/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import FadeIn from '@atlaskit/motion/fade-in';

import { Block } from './utils/blocks';
import { Centered, RetryContainer } from './utils/containers';

const buttonContainerStyles = css({
	textAlign: 'center',
});

const centeredStyles = css({
	height: '182px',
});

export default (): JSX.Element => {
	const directions = [
		undefined,
		'top' as const,
		'right' as const,
		'bottom' as const,
		'left' as const,
	];
	const [direction, setDirection] = useState(0);
	const [isIn, setIsIn] = useState(true);

	return (
		<RetryContainer>
			<div css={buttonContainerStyles}>
				<Button onClick={() => setIsIn((prev) => !prev)}>{isIn ? 'Exit' : 'Enter'}</Button>
				<Button
					onClick={() => {
						setDirection((direction + 1) % directions.length);
					}}
				>
					{directions[direction] !== undefined
						? `Enter from ${directions[direction]}`
						: 'No Motion'}
				</Button>

				<Centered css={centeredStyles}>
					<ExitingPersistence appear>
						{isIn && (
							<FadeIn entranceDirection={directions[direction]}>
								{(props) => <Block {...props} />}
							</FadeIn>
						)}
					</ExitingPersistence>
				</Centered>
			</div>
		</RetryContainer>
	);
};
