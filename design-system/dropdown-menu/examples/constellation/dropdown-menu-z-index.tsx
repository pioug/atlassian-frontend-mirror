import React, { useState } from 'react';

import IconButton from '@atlaskit/button/icon/button';
import { cssMap } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import CommentAddIcon from '@atlaskit/icon/core/comment-add';
import { Popup } from '@atlaskit/popup/popup';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		width: '2rem',
		height: '2rem',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

const DropdownMenuZIndex = (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			shouldRenderToParent
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			placement="bottom-start"
			zIndex={600}
			content={() => (
				<Box xcss={styles.container}>
					<DropdownMenu trigger="Page actions" zIndex={610} testId="dropdown" shouldRenderToParent>
						<DropdownItemGroup>
							<DropdownItem>Move</DropdownItem>
							<DropdownItem>Clone</DropdownItem>
							<DropdownItem>Delete</DropdownItem>
						</DropdownItemGroup>
					</DropdownMenu>
				</Box>
			)}
			trigger={(triggerProps) => (
				<IconButton
					{...triggerProps}
					isSelected={isOpen}
					onClick={() => setIsOpen(!isOpen)}
					value="Add"
					icon={CommentAddIcon}
					label="Add"
					testId="popup--trigger"
				/>
			)}
		/>
	);
};

export default DropdownMenuZIndex;
