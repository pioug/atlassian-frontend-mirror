/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Popup from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

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

const PopupContent = () => {
	return (
		<Box id="popup-content" xcss={sizedContentStyles.root}>
			<Button testId="popup-button-0">Button 0</Button>
			<Button testId="popup-button-1">Button 1</Button>
		</Box>
	);
};

export default (): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Box xcss={spacerStyles.root}>
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
