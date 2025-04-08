/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import noop from '@atlaskit/ds-lib/noop';
import Heading from '@atlaskit/heading';
import Popup from '@atlaskit/popup';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

import { data } from './data';

const wrapperStyles = cssMap({
	root: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
});

const contentStyles = cssMap({
	root: {
		maxWidth: '350px',
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
		textAlign: 'center',
	},
});

const Values = ({ onUpdate }: { onUpdate: () => void }) => {
	const [textIndex, setTextIndex] = useState(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTextIndex((prevIndex) => (prevIndex + 1) % data.length);
			onUpdate();
		}, 15000);

		return () => clearInterval(intervalId);
	}, [onUpdate]);

	return (
		<Box xcss={contentStyles.root} aria-live="assertive" aria-atomic="true">
			<Stack space="space.100">
				<Heading size="large">{data[textIndex].title}</Heading>
				<Box as="blockquote">
					<Text>{data[textIndex].description}</Text>
				</Box>
			</Stack>
		</Box>
	);
};

const PopupContentUpdateExample = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isUpdateOn, setIsUpdateOn] = useState(true);

	return (
		<Box xcss={wrapperStyles.root}>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={(props) => <Values onUpdate={isUpdateOn ? props.update : noop} />}
				placement="right"
				trigger={(triggerProps) => (
					<Button
						{...triggerProps}
						appearance="primary"
						isSelected={isOpen}
						onClick={() => setIsOpen(!isOpen)}
					>
						Open popup
					</Button>
				)}
			/>
			<Box>
				<Text>Updates {isUpdateOn ? 'on' : 'off'}</Text>
				<Toggle
					size="large"
					label="Updates toggle switch controls"
					isChecked={isUpdateOn}
					onChange={(e) => setIsUpdateOn(e.currentTarget.checked)}
				/>
			</Box>
		</Box>
	);
};

export default PopupContentUpdateExample;
