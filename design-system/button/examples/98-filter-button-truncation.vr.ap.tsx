import React from 'react';

import FilterButton from '@atlaskit/button/filter-button';
import { cssMap } from '@atlaskit/css';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';

const styles = cssMap({
	container: {
		width: '12rem',
	},
});

export default function FilterButtonTruncationExample(): React.JSX.Element {
	return (
		<Box xcss={styles.container}>
			<Stack space="space.100">
				<FilterButton
					trailingMetric="99+"
					iconAfter={ChevronDownIcon}
					shouldFitContainer
					isSelected
					aria-pressed="true"
					testId="filter-truncation-default"
				>
					Long filter label that must truncate before the count and icon
				</FilterButton>
				<FilterButton
					trailingMetric="99+"
					iconAfter={ChevronDownIcon}
					shouldFitContainer
					spacing="compact"
					isSelected
					aria-pressed="true"
					testId="filter-truncation-compact"
				>
					Long filter label that must truncate before the count and icon
				</FilterButton>
			</Stack>
		</Box>
	);
}
