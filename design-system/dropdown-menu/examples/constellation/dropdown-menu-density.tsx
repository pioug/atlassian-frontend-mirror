import React from 'react';

import DropdownMenu, {
	DropdownItem,
	DropdownItemCheckbox,
	DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import { Inline } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Inline space="space.600">
		<DropdownMenu
			trigger="Compact density"
			testId="dropdown"
			spacing="compact"
			shouldRenderToParent
		>
			<DropdownItemGroup>
				<DropdownItem>Copy task link</DropdownItem>
				<DropdownItem>Add flag</DropdownItem>
				<DropdownItem>Add label</DropdownItem>
				<DropdownItem>Add parent</DropdownItem>
				<DropdownItem>Print</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem>Remove from sprint</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItemCheckbox id="action">Action</DropdownItemCheckbox>
				<DropdownItemCheckbox id="filter">Filter</DropdownItemCheckbox>
			</DropdownItemGroup>
		</DropdownMenu>
		<DropdownMenu shouldRenderToParent trigger="Cozy density" testId="dropdown">
			<DropdownItemGroup>
				<DropdownItem>Copy task link</DropdownItem>
				<DropdownItem>Add flag</DropdownItem>
				<DropdownItem>Add label</DropdownItem>
				<DropdownItem>Add parent</DropdownItem>
				<DropdownItem>Print</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItem>Remove from sprint</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<DropdownItemCheckbox id="action-2">Action</DropdownItemCheckbox>
				<DropdownItemCheckbox id="filter-2">Filter</DropdownItemCheckbox>
			</DropdownItemGroup>
		</DropdownMenu>
	</Inline>
);
