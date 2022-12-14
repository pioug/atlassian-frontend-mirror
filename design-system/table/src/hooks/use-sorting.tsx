import { useCallback, useState } from 'react';

import { SortDirection, SortKey } from './use-table';

export const useSorting = <ItemType extends object>(
  sortKey: SortKey<keyof ItemType>,
) => {
  const [localSortKey, setLocalSortKey] = useState(sortKey);
  const [localSortDirection, setLocalSortDirection] = useState<SortDirection>();

  const toggleSortDirection = useCallback(() => {
    setLocalSortDirection(oldLocalSortDirection => {
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
    (key: SortKey<keyof ItemType>) => {
      setLocalSortKey(localSortKey => {
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

  return {
    sortKey: localSortKey,
    sortDirection: localSortDirection,
    setSortState,
  };
};
