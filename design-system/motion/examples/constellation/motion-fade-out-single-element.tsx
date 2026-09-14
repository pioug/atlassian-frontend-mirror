/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import FadeIn from '@atlaskit/motion/fade-in';

import { Block } from '../utils/blocks';
import { Centered, RetryContainer } from '../utils/containers';

const MotionFadeOutSingleElementExample = (): JSX.Element => {
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
			<div css={containerStyles}>
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
						<FadeIn entranceDirection={directions[direction]}>
							{(props) => (
								<Block
									ref={props.ref}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
									className={props.className}
								/>
							)}
						</FadeIn>
					</ExitingPersistence>
				</Centered>
			</div>
		</RetryContainer>
	);
};

const containerStyles = css({ textAlign: 'center' });

const centeredStyles = css({ height: '182px' });

export default MotionFadeOutSingleElementExample;
