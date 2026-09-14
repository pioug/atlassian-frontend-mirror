import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';

const DropdownMenuDefault = (): React.JSX.Element => {
	return (
		<DropdownMenu
			placement="bottom-start"
			testId="lite-mode-ddm"
			trigger="Click to open"
			shouldRenderToParent
		>
			<DropdownItemGroup title="bleh">
				<DropdownItem>Move</DropdownItem>

				<DropdownItem>Clone</DropdownItem>

				<DropdownItem>Delete</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownMenuDefault;
