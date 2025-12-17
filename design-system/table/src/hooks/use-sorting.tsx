import { useCallback, useState } from 'react';

import { type SortDirection, type SortKey } from './use-table';

export const useSorting = <ItemType extends object>(sortKey: SortKey<keyof ItemType>) => {
	const [localSortKey, setLocalSortKey] = useState(sortKey);
	const [localSortDirection, setLocalSortDirection] = useState<SortDirection>();

	const toggleSortDirection = useCallback(() => {
		setLocalSortDirection((oldLocalSortDirection) => {
			switch (oldLocalSortDirection) {
				case undefined:
					return 'ascending';
				case 'ascending':
					return 'descending';
				case 'descending':
					return 'ascending';
			}
		});
	}, []);

	const setSortState = useCallback(
		(key: SortKey<keyof ItemType>): void => {
			setLocalSortKey((localSortKey) => {
				if (key !== localSortKey) {
					// sorting by different column
					setLocalSortDirection('ascending');
					return key;
				} else {
					toggleSortDirection();
				}

				return localSortKey;
			});
		},
		[toggleSortDirection],
	);

	const sortFn = useCallback(
		(rowA: ItemType, rowB: ItemType) => {
			if (localSortKey === 'unset') {
				return 0;
			}

			const ascendingComparator = rowA[localSortKey] < rowB[localSortKey] ? -1 : 1;
			return localSortDirection === 'ascending' ? ascendingComparator : -ascendingComparator;
		},
		[localSortDirection, localSortKey],
	);

	return {
		sortKey: localSortKey,
		sortDirection: localSortDirection,
		setSortState,
		sortFn,
	};
};
