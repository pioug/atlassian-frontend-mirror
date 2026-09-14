import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import FadeIn from '@atlaskit/motion/fade-in';

import { Block } from './utils/blocks';
import { Centered, RetryContainer } from './utils/containers';

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
