import React from 'react';

import DropdownItemCheckbox from '@atlaskit/dropdown-menu/dropdown-item-checkbox';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import { Inline } from '@atlaskit/primitives/compiled';

export default (): React.JSX.Element => (
	<Inline space="space.600">
		<DropdownMenu
			trigger="Compact density"
			testId="dropdown"
			spacing="compact"
			shouldRenderToParent
		>
			<DropdownItemGroup title="Modifications">
				<DropdownItem>Copy task link</DropdownItem>
				<DropdownItem>Add flag</DropdownItem>
				<DropdownItem>Add label</DropdownItem>
				<DropdownItem>Add parent</DropdownItem>
				<DropdownItem>Print</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator title="Removal">
				<DropdownItem>Remove from sprint</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator title="Filters">
				<DropdownItemCheckbox id="action">Spaces</DropdownItemCheckbox>
				<DropdownItemCheckbox id="filter">Issues</DropdownItemCheckbox>
			</DropdownItemGroup>
		</DropdownMenu>
		<DropdownMenu shouldRenderToParent trigger="Cozy density" testId="dropdown">
			<DropdownItemGroup title="Modifications">
				<DropdownItem>Copy task link</DropdownItem>
				<DropdownItem>Add flag</DropdownItem>
				<DropdownItem>Add label</DropdownItem>
				<DropdownItem>Add parent</DropdownItem>
				<DropdownItem>Print</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator title="Removal">
				<DropdownItem>Remove from sprint</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator title="Filters">
				<DropdownItemCheckbox id="action-2">Spaces</DropdownItemCheckbox>
				<DropdownItemCheckbox id="filter-2">Issues</DropdownItemCheckbox>
			</DropdownItemGroup>
		</DropdownMenu>
	</Inline>
);
