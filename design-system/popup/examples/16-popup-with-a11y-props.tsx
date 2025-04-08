/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Popup from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

interface PopupContentProps {
	hasTitle?: boolean;
}

const sizedContentStyles = cssMap({
	root: {
		height: '80px',
		paddingBlockStart: token('space.400'),
		paddingBlockEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		alignItems: 'center',
		overflow: 'auto',
		textAlign: 'center',
		verticalAlign: 'center',
	},
});

const spacerStyles = cssMap({
	root: {
		display: 'flex',
		marginBlockStart: token('space.1000'),
		marginBlockEnd: token('space.1000'),
		marginInlineStart: token('space.1000'),
		marginInlineEnd: token('space.1000'),
		gap: token('space.150'),
	},
});

const PopupContent: FC<PopupContentProps> = ({ hasTitle }) => {
	return (
		<Box id="popup-content" xcss={sizedContentStyles.root}>
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
	<Box xcss={spacerStyles.root}>
		<Button appearance="subtle">Button 1</Button>
		<PopupExampleWithLabel />
		<Button appearance="subtle">Button 2</Button>
		<PopupExampleWithTitleId />
		<Button appearance="subtle">Button 3</Button>
	</Box>
);
