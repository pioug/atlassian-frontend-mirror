/** @jsx jsx */
import { type FC, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';
import { RadioGroup } from '@atlaskit/radio';
import { token } from '@atlaskit/tokens';

import Popup from '../src';

const radioValues = [
	{ name: 'None', value: '-1', label: 'None' },
	{ name: 'Button 0', value: '0', label: 'Button 0' },
	{ name: 'Button 1', value: '1', label: 'Button 1' },
	{ name: 'Button 2', value: '2', label: 'Button 2' },
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
			<p>
				<strong>Choose a button to focus initially:</strong>
			</p>
			<RadioGroup
				onChange={({ currentTarget: { value } }) => setButtonToFocus(value)}
				defaultValue={radioValues[0].value}
				options={radioValues}
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
