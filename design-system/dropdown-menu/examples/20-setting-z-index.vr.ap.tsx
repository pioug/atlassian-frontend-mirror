import React, { Fragment, useState } from 'react';

import IconButton from '@atlaskit/button/icon/button';
import { cssMap } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import MediaServicesAddCommentIcon from '@atlaskit/icon/core/comment-add';
import { Popup } from '@atlaskit/popup/popup';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		width: '12rem',
		height: '12rem',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

export default (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Fragment>
			<Text as="p">Popup (custom z-index 600) with Dropdown (custom z-index 610)</Text>
			<Popup
				shouldRenderToParent
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				placement="bottom-start"
				zIndex={600}
				content={() => (
					<Box xcss={styles.container}>
						<DropdownMenu
							trigger="Page actions"
							zIndex={610}
							testId="dropdown"
							shouldRenderToParent
							defaultOpen
						>
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
						icon={MediaServicesAddCommentIcon}
						label="Add"
						testId="popup--trigger"
					/>
				)}
			/>
		</Fragment>
	);
};
