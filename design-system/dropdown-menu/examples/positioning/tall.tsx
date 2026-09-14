import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';

export default (): React.JSX.Element => (
	<DropdownMenu shouldRenderToParent trigger="More cities" appearance="tall">
		<DropdownItemGroup>
			<DropdownItem>Sydney</DropdownItem>
			<DropdownItem>Brisbane</DropdownItem>
			<DropdownItem>Gold Coast</DropdownItem>
			<DropdownItem>Perth</DropdownItem>
			<DropdownItem>Darwin</DropdownItem>
			<DropdownItem>Melbourne</DropdownItem>
			<DropdownItem>Adelaide</DropdownItem>
			<DropdownItem>Canberra</DropdownItem>
			<DropdownItem>Hobart</DropdownItem>
			<DropdownItem>Newcastle</DropdownItem>
			<DropdownItem>Sydney</DropdownItem>
			<DropdownItem>Brisbane</DropdownItem>
			<DropdownItem>Gold Coast</DropdownItem>
			<DropdownItem>Perth</DropdownItem>
			<DropdownItem>Darwin</DropdownItem>
			<DropdownItem>Melbourne</DropdownItem>
			<DropdownItem>Adelaide</DropdownItem>
			<DropdownItem>Canberra</DropdownItem>
			<DropdownItem>Hobart</DropdownItem>
			<DropdownItem>Newcastle</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);
