import { useCallback, useState } from 'react';

import { defaultInitialVisibleJiraColumnKeys } from '@atlaskit/link-test-helpers/datasource';

import { DatasourceTableViewProps } from '../src/ui/datasource-table-view/types';
import { ColumnSizesMap } from '../src/ui/issue-like-table/types';

export const useCommonTableProps = (
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
    defaultInitialVisibleJiraColumnKeys,
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
