/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { ExitingPersistence, FadeIn } from '@atlaskit/motion';

import { Block, Centered, RetryContainer } from './utils';

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
