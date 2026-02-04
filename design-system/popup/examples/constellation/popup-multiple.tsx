/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useState } from 'react';

import { jsx } from '@compiled/react';

import ButtonGroup from '@atlaskit/button/button-group';
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

type PopupExampleProps = {
	index: number;
};

const PopupExample: FC<PopupExampleProps> = ({ index }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			shouldRenderToParent
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => <Box xcss={contentStyles.root}>Content</Box>}
			trigger={(triggerProps) => (
				<Button {...triggerProps} isSelected={isOpen} onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? 'Close' : 'Open'} popup {index + 1}
				</Button>
			)}
			placement="bottom-start"
		/>
	);
};

const PopupMultipleExample = (): JSX.Element => (
	<ButtonGroup label="Open required popup">
		{Array.from(Array(3)).map((_, index) => (
			<PopupExample index={index} />
		))}
	</ButtonGroup>
);

export default PopupMultipleExample;
