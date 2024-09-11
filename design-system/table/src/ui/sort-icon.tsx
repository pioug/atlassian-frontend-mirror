/* eslint-disable no-unused-vars */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import ArrowDownIcon from '@atlaskit/icon/utility/migration/arrow-down';
import ArrowUpIcon from '@atlaskit/icon/utility/migration/arrow-up';

import { useTable } from '../hooks/use-table';

/**
 * __SortIcon__
 *
 * SortIcon is used to display the sort state in our SortableColumn.
 */
export const SortIcon: FC<{ name: string }> = memo(({ name }) => {
	const { sortKey, sortDirection } = useTable();

	if (sortKey === name) {
		switch (sortDirection) {
			case 'ascending':
				return (
					<ArrowUpIcon
						color="currentColor"
						LEGACY_size="small"
						label=""
						LEGACY_primaryColor="inherit"
					/>
				);
			case 'descending':
				return (
					<ArrowDownIcon
						color="currentColor"
						LEGACY_size="small"
						label=""
						LEGACY_primaryColor="inherit"
					/>
				);
		}
	}

	return null;
});
