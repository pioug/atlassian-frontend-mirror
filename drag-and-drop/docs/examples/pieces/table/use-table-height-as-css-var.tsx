import { RefObject, useEffect } from 'react';

import invariant from 'tiny-invariant';

import { cssVarTableHeight } from './constants';

export function useTableHeightAsCssVar(tableRef: RefObject<HTMLTableElement>) {
  useEffect(() => {
    const table = tableRef.current;
    invariant(table);

    /**
     * Ensures that the CSS var stays up to date if the table height changes.
     */
    const resizeObserver = new ResizeObserver(entries => {
      for (const { contentBoxSize } of entries) {
        if (!contentBoxSize) {
          return;
        }

        const [{ blockSize }] = contentBoxSize;

        table.style.setProperty(cssVarTableHeight, `${blockSize}px`);
      }
    });

    resizeObserver.observe(table);

    return () => {
      resizeObserver.disconnect();
    };
  }, [tableRef]);
}
