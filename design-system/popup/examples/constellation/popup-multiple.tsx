/** @jsx jsx */
import { type FC, useState } from 'react';

import { jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';

import Popup from '../../src';

const contentStyles = xcss({
	padding: 'space.200',
});

type PopupExampleProps = {
	index: number;
};

const PopupExample: FC<PopupExampleProps> = ({ index }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => <Box xcss={contentStyles}>Content</Box>}
			trigger={(triggerProps) => (
				<Button {...triggerProps} isSelected={isOpen} onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? 'Close' : 'Open'} popup {index + 1}
				</Button>
			)}
			placement="bottom-start"
		/>
	);
};

const PopupMultipleExample = () => (
	<ButtonGroup label="Open required popup">
		{Array.from(Array(3)).map((_, index) => (
			<PopupExample index={index} />
		))}
	</ButtonGroup>
);

export default PopupMultipleExample;
