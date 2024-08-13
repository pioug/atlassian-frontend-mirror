/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import noop from '@atlaskit/ds-lib/noop';
import { Box, Text, xcss } from '@atlaskit/primitives';

import Popup from '../src';

const data = [
	`Last night I saw you in my dreams, now I can't wait to go to sleep.`,
	`You've got to realize that the world's a test, you can only do your best and let Him do the rest.`,
	`Reality is wrong.`,
	`I've done a lot of work to get where I'm at, but I have to keep working.`,
	`Every day is new.`,
	`Be careful what you say to someone today.`,
];

const quoteStyles = xcss({
	maxWidth: '600px',
	padding: 'space.200',
	textAlign: 'center',
});

const buttonGroupContainer = xcss({
	width: '100%',
	textAlign: 'center',
});

const Quotes = ({ onUpdate }: { onUpdate: () => void }) => {
	const [textIndex, setTextIndex] = useState(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTextIndex((prevIndex) => (prevIndex + 1) % data.length);
			onUpdate();
		}, 5000);

		return () => clearInterval(intervalId);
	}, [onUpdate]);

	return (
		<Box as="blockquote" xcss={quoteStyles} aria-live="assertive" aria-atomic="true">
			<Text>{data[textIndex]}</Text>
		</Box>
	);
};

export default () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isUpdateOn, setIsUpdateOn] = useState(true);

	return (
		<Box xcss={buttonGroupContainer}>
			<ButtonGroup label="Content updates">
				<Popup
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					content={(props) => <Quotes onUpdate={isUpdateOn ? props.update : noop} />}
					trigger={(triggerProps) => (
						<Button {...triggerProps} isSelected={isOpen} onClick={() => setIsOpen(!isOpen)}>
							Quotes
						</Button>
					)}
				/>
				<Button isSelected={isUpdateOn} onClick={() => setIsUpdateOn((prev) => !prev)}>
					{isUpdateOn ? 'Will schedule update' : 'Will not schedule update'}
				</Button>
			</ButtonGroup>
		</Box>
	);
};
