/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';

import Popup from '../src';

const spacerStyles = xcss({
	display: 'flex',
	margin: 'space.1000',
	gap: 'space.150',
});

const sizedContentStyles = xcss({
	height: '80px',
	padding: 'space.400',
	alignItems: 'center',
	overflow: 'auto',
	textAlign: 'center',
	verticalAlign: 'center',
});

const PopupContent = () => {
	return (
		<Box id="popup-content" xcss={sizedContentStyles}>
			<Button testId="popup-button-0">Button 0</Button>
			<Button testId="popup-button-1">Button 1</Button>
		</Box>
	);
};

export default () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Box xcss={spacerStyles}>
			<Button appearance="subtle" testId="button-0">
				Button 0
			</Button>
			<Popup
				testId="popup"
				isOpen={isOpen}
				shouldRenderToParent
				onClose={() => setIsOpen(false)}
				content={() => <PopupContent />}
				trigger={(triggerProps) => (
					<Button
						id="popup-trigger"
						{...triggerProps}
						onClick={() => setIsOpen(!isOpen)}
						testId="popup-trigger"
					>
						{isOpen ? 'Close' : 'Open'} Popup
					</Button>
				)}
			/>
			<Button appearance="subtle" testId="button-1">
				Button 1
			</Button>
		</Box>
	);
};
