/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Box, Text, xcss } from '@atlaskit/primitives';
import { RadioGroup } from '@atlaskit/radio';
import { token } from '@atlaskit/tokens';

import Popup from '../src';

const radioValues = [
	{ name: 'Button', value: '-1', label: 'None' },
	{ name: 'Button', value: '0', label: 'Button 0' },
	{ name: 'Button', value: '1', label: 'Button 1' },
	{ name: 'Button', value: '2', label: 'Button 2' },
];

const spacerStyles = xcss({
	margin: 'space.250',
});

const sizedContentStyles = css({
	padding: token('space.400', '32px'),
	alignItems: 'center',
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
		<Box xcss={spacerStyles}>
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
