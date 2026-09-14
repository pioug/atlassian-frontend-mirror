import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';

const DropdownItemDisabledExample = (): React.JSX.Element => {
	return (
		<DropdownMenu trigger="Page actions" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem isDisabled>Edit</DropdownItem>
				<DropdownItem>Move</DropdownItem>
				<DropdownItem>Clone</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownItemDisabledExample;
