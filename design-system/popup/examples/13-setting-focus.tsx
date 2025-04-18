/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Popup from '@atlaskit/popup';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { RadioGroup } from '@atlaskit/radio';
import { token } from '@atlaskit/tokens';

const radioValues = [
	{ name: 'Button', value: '-1', label: 'None' },
	{ name: 'Button', value: '0', label: 'Button 0' },
	{ name: 'Button', value: '1', label: 'Button 1' },
	{ name: 'Button', value: '2', label: 'Button 2' },
];

const spacerStyles = cssMap({
	root: {
		marginBlockStart: token('space.250'),
		marginBlockEnd: token('space.250'),
		marginInlineStart: token('space.250'),
		marginInlineEnd: token('space.250'),
	},
});

const sizedContentStyles = css({
	alignItems: 'center',
	paddingBlockEnd: token('space.400'),
	paddingBlockStart: token('space.400'),
	paddingInlineEnd: token('space.400'),
	paddingInlineStart: token('space.400'),
	textAlign: 'center',
	verticalAlign: 'center',
});

type PopupProps = {
	buttonToFocus: string;
	setInitialFocusRef: any;
};

const PopupContent: FC<PopupProps> = ({ buttonToFocus, setInitialFocusRef }) => {
	const getRef = (index: number) => {
		if (parseInt(buttonToFocus) === index) {
			return (ref: HTMLButtonElement) => {
				setInitialFocusRef(ref);
			};
		}
	};

	return (
		<div id="popup-content" css={sizedContentStyles}>
			{Array.from({ length: 3 }, (_, index) => (
				<Button key={index} ref={getRef(index)}>
					Button {index}
				</Button>
			))}
		</div>
	);
};

export default () => {
	const [isOpen, setIsOpen] = useState(false);
	const [buttonToFocus, setButtonToFocus] = useState('-1');

	return (
		<Box xcss={spacerStyles.root}>
			<Text as="p">
				<Text as="strong" id="radiogroup-label">
					Choose a button to focus initially:
				</Text>
			</Text>
			<RadioGroup
				onChange={({ currentTarget: { value } }) => setButtonToFocus(value)}
				defaultValue={radioValues[0].value}
				options={radioValues}
				aria-labelledby="radiogroup-label"
			/>
			<Popup
				shouldRenderToParent
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={({ setInitialFocusRef }) => (
					<PopupContent buttonToFocus={buttonToFocus} setInitialFocusRef={setInitialFocusRef} />
				)}
				trigger={(triggerProps) => (
					<Button id="popup-trigger" {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? 'Close' : 'Open'} Popup
					</Button>
				)}
				placement="bottom-start"
			/>
		</Box>
	);
};
