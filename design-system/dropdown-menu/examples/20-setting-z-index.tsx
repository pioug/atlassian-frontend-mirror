import React, { Fragment, useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MediaServicesAddCommentIcon from '@atlaskit/icon/glyph/media-services/add-comment';
import Popup from '@atlaskit/popup';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		width: '12rem',
		height: '12rem',
		paddingTop: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),
		paddingBottom: token('space.100', '8px'),
		paddingLeft: token('space.100', '8px'),
	},
});

export default () => {
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
