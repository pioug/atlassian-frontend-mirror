import React from 'react';

import Avatar from '@atlaskit/avatar';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

export default () => (
	<DropdownMenu defaultOpen trigger="Assign to" shouldRenderToParent>
		<DropdownItemGroup>
			<DropdownItem elemBefore={<Avatar size="small" />}>Some text</DropdownItem>
			<DropdownItem elemBefore={<Avatar size="small" />}>Some text also</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);
