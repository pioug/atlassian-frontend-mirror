import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

export default (): React.JSX.Element => (
	<DropdownMenu trigger="Page actions" testId="dropdown" shouldRenderToParent>
		<DropdownItemGroup title="Actions">
			<DropdownItem>Move</DropdownItem>
			<DropdownItem>Clone</DropdownItem>
			<DropdownItem>Delete</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);
