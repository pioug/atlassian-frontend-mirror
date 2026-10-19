import React from 'react';

import FilterButton from '@atlaskit/button/filter-button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';

export default function FilterButtonExample(): React.JSX.Element {
	return (
		<Stack space="space.150">
			<Inline space="space.100">
				<FilterButton trailingMetric={8} testId="filter">
					Filter
				</FilterButton>
				<FilterButton trailingMetric={0}>Filter</FilterButton>
				<FilterButton trailingMetric="99+">Filter</FilterButton>
				<FilterButton>Filter</FilterButton>
			</Inline>
			<Inline space="space.100">
				<FilterButton trailingMetric={8} spacing="compact">
					Compact filter
				</FilterButton>
				<FilterButton trailingMetric={8} isSelected aria-pressed="true">
					Selected filter
				</FilterButton>
				<FilterButton trailingMetric={8} isDisabled>
					Disabled filter
				</FilterButton>
				<FilterButton trailingMetric={8} isLoading>
					Loading filter
				</FilterButton>
			</Inline>
			<DropdownMenu
				shouldRenderToParent
				trigger={({ triggerRef, ...triggerProps }) => (
					<FilterButton
						{...triggerProps}
						ref={triggerRef}
						trailingMetric={8}
						iconAfter={ChevronDownIcon}
					>
						Filter
					</FilterButton>
				)}
			>
				<DropdownItemGroup>
					<DropdownItem>Status</DropdownItem>
					<DropdownItem>Assignee</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
		</Stack>
	);
}
