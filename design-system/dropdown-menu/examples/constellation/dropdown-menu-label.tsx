import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';

const DropdownMenuLabelExample = (): React.JSX.Element => {
	return (
		<DropdownMenu trigger="More" label="More actions" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem>Edit</DropdownItem>
				<DropdownItem>Share</DropdownItem>
				<DropdownItem>Move</DropdownItem>
				<DropdownItem>Clone</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
				<DropdownItem>Report</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownMenuLabelExample;
