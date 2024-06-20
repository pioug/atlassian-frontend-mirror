/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';

import { ExitingPersistence, FadeIn } from '../src';

import { Block, Centered, RetryContainer } from './utils';

export default () => {
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
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<div css={{ textAlign: 'center' }}>
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

				<Centered css={{ height: '182px' }}>
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
