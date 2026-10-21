import React, { useState } from 'react';

import FilterButton from '@atlaskit/button/filter-button';
import { Inline } from '@atlaskit/primitives/compiled/inline';

export default function FilterButtonStatesExample(): React.JSX.Element {
	const [isSelected, setIsSelected] = useState(true);

	return (
		<Inline space="space.100" alignBlock="center" shouldWrap>
			<FilterButton trailingMetric={8} spacing="compact">
				Compact filter
			</FilterButton>
			<FilterButton
				trailingMetric={isSelected ? 1 : 0}
				hasChevronDown={false}
				isSelected={isSelected}
				aria-pressed={isSelected}
				onClick={() => setIsSelected(!isSelected)}
			>
				Assigned to me
			</FilterButton>
			<FilterButton trailingMetric={8} isDisabled>
				Disabled filter
			</FilterButton>
			<FilterButton trailingMetric={8} isLoading>
				Loading filter
			</FilterButton>
		</Inline>
	);
}
