import React from 'react';

import { Colgroup } from './colgroup';
import { SharedTableProps } from './types';

export type TableProps = SharedTableProps & {
  innerRef?: React.RefObject<HTMLTableElement>;
  children: React.ReactNode[];
};

export const Table = React.memo(
  ({
    innerRef,
    isNumberColumnEnabled,
    columnWidths,
    layout,
    renderWidth,
    children,
    tableNode,
    rendererAppearance,
  }: TableProps) => {
    return (
      <table
        data-testid="renderer-table"
        data-number-column={isNumberColumnEnabled}
        ref={innerRef}
      >
        <Colgroup
          columnWidths={columnWidths}
          layout={layout}
          isNumberColumnEnabled={isNumberColumnEnabled}
          renderWidth={renderWidth}
          tableNode={tableNode}
          rendererAppearance={rendererAppearance}
        />
        <tbody>{children}</tbody>
      </table>
    );
  },
);
