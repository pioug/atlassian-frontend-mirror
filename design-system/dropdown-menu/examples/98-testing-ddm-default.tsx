import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

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
