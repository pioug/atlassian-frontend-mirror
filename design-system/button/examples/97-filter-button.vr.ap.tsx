import React from 'react';

import FilterButton from '@atlaskit/button/filter-button';
import { cssMap } from '@atlaskit/css';
import { DropdownItem } from '@atlaskit/dropdown-menu/dropdown-item';
import { DropdownItemGroup } from '@atlaskit/dropdown-menu/dropdown-item-group';
import { DropdownMenu } from '@atlaskit/dropdown-menu/dropdown-menu';
import FilterIcon from '@atlaskit/icon/core/filter';
import PersonIcon from '@atlaskit/icon/core/person';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';

const styles = cssMap({
	leftAlignedLabel: {
		display: 'block',
		minWidth: 0,
		overflow: 'hidden',
		textAlign: 'start',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	constrained: {
		width: '240px',
	},
});

export default function FilterButtonExample(): React.JSX.Element {
	return (
		<Stack space="space.150">
			<Inline space="space.100">
				<FilterButton trailingMetric={8} hasChevronDown={false} testId="filter">
					Filter
				</FilterButton>
				<FilterButton trailingMetric={0} hasChevronDown={false}>
					Filter
				</FilterButton>
				<FilterButton trailingMetric="99+" hasChevronDown={false}>
					Filter
				</FilterButton>
				<FilterButton hasChevronDown={false}>Filter</FilterButton>
				<FilterButton iconBefore={FilterIcon} trailingMetric={8}>
					Filter
				</FilterButton>
			</Inline>
			<Inline space="space.100">
				<FilterButton trailingMetric={8} hasChevronDown={false} spacing="compact">
					Compact filter
				</FilterButton>
				<FilterButton trailingMetric={8} hasChevronDown={false} isSelected aria-pressed="true">
					Selected filter
				</FilterButton>
				<FilterButton trailingMetric={8} hasChevronDown={false} isDisabled>
					Disabled filter
				</FilterButton>
				<FilterButton trailingMetric={8} hasChevronDown={false} isLoading>
					Loading filter
				</FilterButton>
			</Inline>
			<DropdownMenu
				shouldRenderToParent
				trigger={({ triggerRef, ...triggerProps }) => (
					<FilterButton {...triggerProps} ref={triggerRef} trailingMetric={8} shouldFitContainer>
						Filter
					</FilterButton>
				)}
			>
				<DropdownItemGroup>
					<DropdownItem>Status</DropdownItem>
					<DropdownItem>Assignee</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
			<FilterButton shouldFitContainer testId="filter-full-width">
				Filter
			</FilterButton>
			<FilterButton
				shouldFitContainer
				iconBefore={PersonIcon}
				trailingMetric="+1"
				isSelected
				testId="filter-left-aligned"
			>
				<Box as="span" xcss={styles.leftAlignedLabel}>
					Assignee: Meng Xiao,
				</Box>
			</FilterButton>
			<Box xcss={styles.constrained}>
				<FilterButton
					shouldFitContainer
					iconBefore={PersonIcon}
					trailingMetric="+12"
					testId="filter-truncated"
				>
					<Box as="span" xcss={styles.leftAlignedLabel}>
						Assignee: A long selected assignee name,
					</Box>
				</FilterButton>
			</Box>
		</Stack>
	);
}
