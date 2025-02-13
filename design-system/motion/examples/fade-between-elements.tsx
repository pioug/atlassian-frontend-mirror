/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useState } from 'react';

import { jsx } from '@compiled/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { ConfluenceIcon, JiraServiceManagementIcon } from '@atlaskit/logo';

import { ExitingPersistence, FadeIn } from '../src';

import { Block, Centered, RetryContainer } from './utils';

const EnteringBlock = ({
	children,
	exitThenEnter,
}: {
	children: ReactNode;
	exitThenEnter?: boolean;
}) => (
	<FadeIn>
		{(props, state) => (
			<Block
				css={{
					position: state === 'entering' || exitThenEnter ? 'static' : 'absolute',
					left: 0,
					top: 0,
				}}
				ref={props.ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={props.className}
			>
				{children}
			</Block>
		)}
	</FadeIn>
);

const elements = [
	(exitThenEnter: boolean) => (
		<EnteringBlock exitThenEnter={exitThenEnter}>
			<ConfluenceIcon size="xlarge" />
		</EnteringBlock>
	),
	(exitThenEnter: boolean) => (
		<EnteringBlock exitThenEnter={exitThenEnter}>
			<JiraServiceManagementIcon size="xlarge" />
		</EnteringBlock>
	),
];

export default () => {
	const [index, setIndex] = useState(0);
	const [appear, setAppear] = useState(true);
	const [exitThenEnter, setExitThenEnter] = useState(false);

	return (
		<RetryContainer>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<div css={{ textAlign: 'center' }}>
				<ButtonGroup label="Motion options">
					<Button onClick={() => setIndex((prev) => (prev + 1) % elements.length)}>Switch</Button>

					<Button isSelected={appear} onClick={() => setAppear((appear) => !appear)}>
						{appear ? 'Appears on mount' : 'Immediately appear on mount'}
					</Button>

					<Button
						isSelected={exitThenEnter}
						onClick={() => {
							setExitThenEnter((prev) => !prev);
							setTimeout(() => setIndex((prev) => (prev + 1) % elements.length), 1);
						}}
					>
						{exitThenEnter ? 'Will exit first then enter' : 'Will exit and enter at the same time'}
					</Button>
				</ButtonGroup>

				<Centered>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div css={{ position: 'relative' }}>
						<ExitingPersistence appear={appear} exitThenEnter={exitThenEnter}>
							<div key={index}>{elements[index](exitThenEnter)}</div>
						</ExitingPersistence>
					</div>
				</Centered>
			</div>
		</RetryContainer>
	);
};
