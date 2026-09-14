import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';

const DropdownItemGroupTitleExample = (): React.JSX.Element => {
	return (
		<DropdownMenu trigger="Page actions" shouldRenderToParent>
			<DropdownItemGroup title="Edit page">
				<DropdownItem>Edit</DropdownItem>
				<DropdownItem>Move</DropdownItem>
				<DropdownItem>Clone</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup title="Tools">
				<DropdownItem>Integrations</DropdownItem>
				<DropdownItem>Permissions</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownItemGroupTitleExample;
