import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';

const _default_1: React.JSX.Element[] = [
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
export default _default_1;
