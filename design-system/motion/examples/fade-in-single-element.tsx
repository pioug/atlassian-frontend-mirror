import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { FadeIn } from '@atlaskit/motion';

import { Block, Centered, RetryContainer } from './utils';

export default (): React.JSX.Element => {
	const directions = [
		undefined,
		'top' as const,
		'right' as const,
		'bottom' as const,
		'left' as const,
	];
	const [direction, setDirection] = useState(0);

	return (
		<RetryContainer>
			<Centered>
				<FadeIn entranceDirection={directions[direction]}>{(props) => <Block {...props} />}</FadeIn>
			</Centered>
			<Centered>
				<Button
					onClick={() => {
						setDirection((direction + 1) % directions.length);
					}}
				>
					{directions[direction] !== undefined
						? `Enter from ${directions[direction]}`
						: 'No Motion'}
				</Button>
			</Centered>
		</RetryContainer>
	);
};
