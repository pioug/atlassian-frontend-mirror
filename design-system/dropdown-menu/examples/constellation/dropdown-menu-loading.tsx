import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

const DropdownMenuLoadingExample = () => {
	return (
		<DropdownMenu isLoading trigger="Page actions" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem>Loaded action</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownMenuLoadingExample;
