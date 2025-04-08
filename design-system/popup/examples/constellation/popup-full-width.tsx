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

const contentStyles = cssMap({
	root: {
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
	},
});

const PopupFullWidth = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			content={() => <Box xcss={contentStyles.root}>Content</Box>}
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			placement="bottom-start"
			shouldFitContainer
			trigger={(triggerProps) => (
				<Button
					{...triggerProps}
					appearance="primary"
					isSelected={isOpen}
					onClick={() => setIsOpen(!isOpen)}
					shouldFitContainer
				>
					{isOpen ? 'Close' : 'Open'} popup{' '}
				</Button>
			)}
		/>
	);
};

export default PopupFullWidth;
