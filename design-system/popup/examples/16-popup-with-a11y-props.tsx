/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';

import Popup from '../src';

interface PopupContentProps {
	hasTitle?: boolean;
}

const sizedContentStyles = xcss({
	height: '80px',
	padding: 'space.400',
	alignItems: 'center',
	overflow: 'auto',
	textAlign: 'center',
	verticalAlign: 'center',
});

const spacerStyles = xcss({
	display: 'flex',
	margin: 'space.1000',
	gap: 'space.150',
});

const PopupContent: FC<PopupContentProps> = ({ hasTitle }) => {
	return (
		<Box id="popup-content" xcss={sizedContentStyles}>
			{hasTitle && <h2 id="a11y-props-popup-title">Popup accessible title</h2>}
			<h3>Popup content</h3>
			<Button>Button 1</Button>
			<Button>Button 2</Button>
		</Box>
	);
};

const PopupExampleWithLabel = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => <PopupContent />}
			trigger={(triggerProps) => (
				<Button id="popup-trigger-1" {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? 'Close' : 'Open'} Popup
				</Button>
			)}
			role="dialog"
			label="Accessible popup name"
			placement="bottom-start"
		/>
	);
};

const PopupExampleWithTitleId = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => <PopupContent hasTitle />}
			trigger={(triggerProps) => (
				<Button id="popup-trigger-2" {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? 'Close' : 'Open'} Popup
				</Button>
			)}
			placement="bottom-start"
			role="dialog"
			titleId="a11y-props-popup-title"
		/>
	);
};

export default () => (
	<Box xcss={spacerStyles}>
		<Button appearance="subtle">Button 1</Button>
		<PopupExampleWithLabel />
		<Button appearance="subtle">Button 2</Button>
		<PopupExampleWithTitleId />
		<Button appearance="subtle">Button 3</Button>
	</Box>
);
