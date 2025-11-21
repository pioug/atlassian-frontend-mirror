import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

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
