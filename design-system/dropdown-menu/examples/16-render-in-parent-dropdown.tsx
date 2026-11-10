import React from 'react';

import { DropdownItem } from '@atlaskit/dropdown-menu/dropdown-item';
import { DropdownItemGroup } from '@atlaskit/dropdown-menu/dropdown-item-group';
import { DropdownMenu } from '@atlaskit/dropdown-menu/dropdown-menu';

export default (): React.JSX.Element => (
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
