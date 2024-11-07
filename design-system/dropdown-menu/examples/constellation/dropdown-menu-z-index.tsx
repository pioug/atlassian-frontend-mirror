import React, { useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MediaServicesAddCommentIcon from '@atlaskit/icon/glyph/media-services/add-comment';
import Popup from '@atlaskit/popup';
import { Box, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
	width: 'size.300',
	height: 'size.300',
});

const DropdownMenuZIndex = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			placement="bottom-start"
			zIndex={600}
			content={() => (
				<Box padding="space.100" xcss={containerStyles}>
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
					icon={MediaServicesAddCommentIcon}
					label="Add"
					testId="popup--trigger"
				/>
			)}
		/>
	);
};

export default DropdownMenuZIndex;
