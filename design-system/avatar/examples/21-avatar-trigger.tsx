/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import { cssMap } from '@atlaskit/css';
import Popup from '@atlaskit/popup';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	popupContent: {
		paddingInlineStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockStart: token('space.300'),
		paddingBlockEnd: token('space.300'),
		width: '240px',
	},
});

export default (): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			shouldRenderToParent
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			placement="bottom-start"
			content={() => (
				<Box xcss={styles.popupContent}>
					<Text>Popup Content</Text>
				</Box>
			)}
			trigger={(triggerProps) => (
				<Avatar
					size="medium"
					appearance="hexagon"
					label="Popup trigger"
					onClick={() => setIsOpen(!isOpen)}
					{...triggerProps}
				/>
			)}
		/>
	);
};
