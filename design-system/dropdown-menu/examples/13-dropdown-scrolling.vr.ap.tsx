import React from 'react';

import { DropdownItem } from '@atlaskit/dropdown-menu/dropdown-item';
import { DropdownItemCheckbox } from '@atlaskit/dropdown-menu/dropdown-item-checkbox';
import { DropdownItemGroup } from '@atlaskit/dropdown-menu/dropdown-item-group';
import { DropdownMenu } from '@atlaskit/dropdown-menu/dropdown-menu';
import { Inline } from '@atlaskit/primitives/compiled/inline';

export default (): React.JSX.Element => (
	<Inline space="space.600">
		<DropdownMenu
			trigger="Page actions"
			testId="dropdown"
			spacing="compact"
			shouldRenderToParent
			defaultOpen
		>
			<DropdownItemGroup title="Actions" isScrollable>
				<DropdownItem>Copy task link</DropdownItem>
				<DropdownItem>Add flag</DropdownItem>
				<DropdownItem>Add label</DropdownItem>
				<DropdownItem>Add parent</DropdownItem>
				<DropdownItem>Print</DropdownItem>
				<DropdownItem>Go somewhere</DropdownItem>
				<DropdownItem>Do something</DropdownItem>
				<DropdownItem>Add parent</DropdownItem>
				<DropdownItem>Print</DropdownItem>
				<DropdownItem>Go somewhere</DropdownItem>
				<DropdownItem>Do something</DropdownItem>
				<DropdownItem>Add parent</DropdownItem>
				<DropdownItem>Print</DropdownItem>
				<DropdownItem>Go somewhere</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator title="More actions">
				<DropdownItem>Remove from sprint</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator title="Even more actions">
				<DropdownItemCheckbox id="action">Action</DropdownItemCheckbox>
				<DropdownItemCheckbox id="filter">Filter</DropdownItemCheckbox>
			</DropdownItemGroup>
		</DropdownMenu>
		<DropdownMenu trigger="Page actions" testId="dropdown" shouldRenderToParent defaultOpen>
			<DropdownItemGroup title="Actions" isScrollable>
				<DropdownItem>Copy task link</DropdownItem>
				<DropdownItem>Add flag</DropdownItem>
				<DropdownItem>Add label</DropdownItem>
				<DropdownItem>Add parent</DropdownItem>
				<DropdownItem>Print</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator title="More actions">
				<DropdownItem>Remove from sprint</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator title="Even more actions">
				<DropdownItemCheckbox id="action-2">Action</DropdownItemCheckbox>
				<DropdownItemCheckbox id="filter-2">Filter</DropdownItemCheckbox>
			</DropdownItemGroup>
		</DropdownMenu>
	</Inline>
);
