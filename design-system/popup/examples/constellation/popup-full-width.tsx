/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import Popup from '@atlaskit/popup';
import { Box, xcss } from '@atlaskit/primitives';

const contentStyles = xcss({
	padding: 'space.200',
});

const PopupFullWidth = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			content={() => <Box xcss={contentStyles}>Content</Box>}
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
