import React from 'react';

import { TableCssClassName as ClassName } from '../../../types';

import { ColumnDropTarget } from './ColumnDropTarget';

export interface Props {
  tableRef: HTMLTableElement;
  stickyTop?: number;
  tableHeight?: number;
  localId?: string;
  rowHeights?: number[];
  colWidths?: (number | undefined)[];
}

export const ColumnDropTargets: React.FC<Props> = ({
  tableRef,
  tableHeight,
  stickyTop,
  localId,
  rowHeights,
  colWidths,
}) => {
  if (!tableRef) {
    return null;
  }

  const firstRow = tableRef.querySelector('tr');
  const hasHeaderRow = firstRow
    ? firstRow.getAttribute('data-header-row')
    : false;

  const marginTop =
    hasHeaderRow && stickyTop !== undefined ? rowHeights?.[0] ?? 0 : 0;

  return (
    <div
      className={ClassName.DRAG_COLUMN_DROP_TARGET_CONTROLS}
      contentEditable={false}
    >
      <div
        className={ClassName.DRAG_COLUMN_CONTROLS_INNER}
        data-testid="table-floating-column-controls-drop-targets"
      >
        {colWidths?.map((width, index) => {
          return (
            <ColumnDropTarget
              key={index}
              index={index}
              localId={localId}
              width={width}
              height={tableHeight}
              marginTop={marginTop}
            />
          );
        })}
      </div>
    </div>
  );
};
