import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

export default () => (
	<DropdownMenu
		trigger="Page actions"
		onOpenChange={(e) => console.log('dropdown opened', e)}
		testId="dropdown"
		shouldRenderToParent
	>
		<DropdownItemGroup>
			<DropdownItem>Move</DropdownItem>
			<DropdownItem>Clone</DropdownItem>
			<DropdownItem>Delete</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);
