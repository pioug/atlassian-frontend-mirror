import { useCallback, useState } from 'react';

import { type ColumnSizesMap } from '../types';

export const useColumnResize = (
  initialColumnCustomSizes: ColumnSizesMap | undefined,
) => {
  const [columnCustomSizes, setColumnCustomSizes] = useState<
    ColumnSizesMap | undefined
  >(initialColumnCustomSizes);

  const onColumnResize = useCallback(
    (key: string, width: number) => {
      setColumnCustomSizes({ ...columnCustomSizes, [key]: width });
    },
    [columnCustomSizes],
  );

  return {
    columnCustomSizes,
    onColumnResize,
  };
};
