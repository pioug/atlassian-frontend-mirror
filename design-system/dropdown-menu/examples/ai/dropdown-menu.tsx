import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';

export default [
	<DropdownMenu
		shouldRenderToParent
		trigger={({ triggerRef, ...props }) => (
			<IconButton ref={triggerRef} {...props} icon={MoreIcon} label="More" />
		)}
	>
		<DropdownItemGroup>
			<DropdownItem href="/dashboard">Dashboard</DropdownItem>
			<DropdownItem>Create</DropdownItem>
			<DropdownItem>Delete</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>,
	<DropdownMenu shouldRenderToParent trigger="Actions">
		<DropdownItemGroup>
			<DropdownItem>Export</DropdownItem>
			<DropdownItem>Share</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>,
];
