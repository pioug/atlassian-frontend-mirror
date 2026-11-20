import React from 'react';

import FilterButton from '@atlaskit/button/filter-button';
import FilterIcon from '@atlaskit/icon/core/filter';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';

export default function FilterButtonIconOnlyExample(): React.JSX.Element {
	return (
		<Stack space="space.150">
			{(['default', 'compact'] as const).map((spacing) => (
				<Inline space="space.100" key={spacing} alignBlock="center">
					<FilterButton iconBefore={FilterIcon} hasChevronDown={false} spacing={spacing}>
						Filter
					</FilterButton>
					<FilterButton
						iconBefore={FilterIcon}
						hasChevronDown={false}
						spacing={spacing}
						aria-label="Filters"
					/>
					<FilterButton
						iconBefore={FilterIcon}
						hasChevronDown={false}
						spacing={spacing}
						trailingMetric={2}
						isSelected
						aria-label="Filters, 2 applied"
						testId={`filter-icon-only-${spacing}`}
					/>
					<FilterButton
						iconBefore={FilterIcon}
						hasChevronDown={false}
						spacing={spacing}
						trailingMetric="99+"
						isDisabled
						aria-label="Filters, more than 99 applied"
					/>
				</Inline>
			))}
		</Stack>
	);
}
