import React, { useState } from 'react';

import FilterButton from '@atlaskit/button/filter-button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';

export default function FilterButtonDropdownExample(): React.JSX.Element {
	const [hasActiveFilters, setHasActiveFilters] = useState(false);

	return (
		<DropdownMenu
			shouldRenderToParent
			menuLabel="Filters"
			trigger={({ triggerRef, ...triggerProps }) => (
				<FilterButton
					{...triggerProps}
					ref={triggerRef}
					trailingMetric={hasActiveFilters ? 1 : undefined}
					isSelected={hasActiveFilters || triggerProps.isSelected}
				>
					Filter
				</FilterButton>
			)}
		>
			<DropdownItemGroup>
				<DropdownItem onClick={() => setHasActiveFilters(true)}>Apply status filter</DropdownItem>
				<DropdownItem onClick={() => setHasActiveFilters(false)}>Clear filters</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}
