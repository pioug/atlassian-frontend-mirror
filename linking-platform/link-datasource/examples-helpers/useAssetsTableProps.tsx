import { useCallback, useState } from 'react';

import { assetsDefaultInitialVisibleColumnKeys } from '@atlaskit/link-test-helpers/datasource';

import { type DatasourceTableViewProps } from '../src/ui/datasource-table-view/types';
import { type ColumnSizesMap } from '../src/ui/issue-like-table/types';

export const useAssetsTableProps = (
  props: { defaultColumnCustomSizes?: ColumnSizesMap } = {},
): Required<
  Pick<
    DatasourceTableViewProps,
    | 'visibleColumnKeys'
    | 'onVisibleColumnKeysChange'
    | 'wrappedColumnKeys'
    | 'onWrappedColumnChange'
    | 'onColumnResize'
  >
> &
  Pick<DatasourceTableViewProps, 'columnCustomSizes'> => {
  const [visibleColumnKeys, onVisibleColumnKeysChange] = useState<string[]>(
    assetsDefaultInitialVisibleColumnKeys,
  );

  const [columnCustomSizes, setColumnCustomSizes] = useState<
    ColumnSizesMap | undefined
  >(props.defaultColumnCustomSizes);

  const onColumnResize = useCallback(
    (key: string, width: number) => {
      setColumnCustomSizes({ ...columnCustomSizes, [key]: width });
    },
    [columnCustomSizes],
  );

  const [wrappedColumnKeys, setWrappedColumnKeys] = useState<string[]>([]);

  const onWrappedColumnChange = useCallback(
    (key: string, shouldWrap: boolean) => {
      if (shouldWrap) {
        setWrappedColumnKeys([...wrappedColumnKeys, key]);
      } else {
        setWrappedColumnKeys(wrappedColumnKeys.filter(k => k !== key));
      }
    },
    [wrappedColumnKeys],
  );

  return {
    visibleColumnKeys,
    onVisibleColumnKeysChange,
    columnCustomSizes,
    onColumnResize,
    wrappedColumnKeys,
    onWrappedColumnChange,
  };
};
