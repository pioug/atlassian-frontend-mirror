import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';

const DropdownMenuLoadingExample = (): React.JSX.Element => {
	return (
		<DropdownMenu isLoading trigger="Page actions" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem>Loaded action</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownMenuLoadingExample;
