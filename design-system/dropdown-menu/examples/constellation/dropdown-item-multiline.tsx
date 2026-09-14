import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';

const DropdownItemMultilineExample = (): React.JSX.Element => {
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
