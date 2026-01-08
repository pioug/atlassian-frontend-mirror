import React, { type FC, memo } from 'react';

import ArrowDownIcon from '@atlaskit/icon/core/arrow-down';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';

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
				return <ArrowUpIcon color="currentColor" label="" size="small" />;
			case 'descending':
				return <ArrowDownIcon color="currentColor" label="" size="small" />;
		}
	}

	return null;
});
