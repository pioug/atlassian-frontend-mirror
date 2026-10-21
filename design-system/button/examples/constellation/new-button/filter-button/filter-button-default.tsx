import React from 'react';

import FilterButton from '@atlaskit/button/filter-button';
import { Inline } from '@atlaskit/primitives/compiled/inline';

export default function FilterButtonDefaultExample(): React.JSX.Element {
	return (
		<Inline space="space.100" shouldWrap>
			<FilterButton trailingMetric={8}>Filter</FilterButton>
			<FilterButton trailingMetric={0}>Filter</FilterButton>
			<FilterButton trailingMetric="99+">Filter</FilterButton>
			<FilterButton hasChevronDown={false}>Filter</FilterButton>
		</Inline>
	);
}
