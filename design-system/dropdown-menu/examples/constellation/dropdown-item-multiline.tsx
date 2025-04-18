import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

const DropdownItemMultilineExample = () => {
	return (
		<DropdownMenu trigger="Page actions" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem>
					This is a really long menu item label. If there's a really long menu item label and
					shouldTitleWrap is set to false, the label will be trucated.
				</DropdownItem>
				<DropdownItem shouldTitleWrap={false}>
					This is a really long menu item label. If there's a really long menu item label and
					shouldTitleWrap is set to false, the label will be trucated.
				</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownItemMultilineExample;
