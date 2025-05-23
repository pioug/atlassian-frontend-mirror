import React, { useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import CommentAddIcon from '@atlaskit/icon/core/migration/comment-add--media-services-add-comment';
import Popup from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		width: '2rem',
		height: '2rem',
		paddingTop: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),
		paddingBottom: token('space.100', '8px'),
		paddingLeft: token('space.100', '8px'),
	},
});

const DropdownMenuZIndex = () => {
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
