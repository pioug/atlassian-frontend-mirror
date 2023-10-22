import React, { useMemo } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { CellHoverCoordinates } from '../../../types';
import { TableCssClassName as ClassName } from '../../../types';
import { getColumnsWidths, getRowHeights } from '../../../utils';
import { DragHandle } from '../../DragHandle';

export interface Props {
  editorView: EditorView;
  tableActive?: boolean;
  tableRef: HTMLTableElement;
  hoveredCell?: CellHoverCoordinates;
  isResizing?: boolean;
  stickyTop?: number;
  tableHeight?: number;
  localId?: string;
}

export const ColumnControls: React.FC<Props> = ({
  editorView,
  tableActive,
  tableRef,
  hoveredCell,
  isResizing,
  tableHeight,
  stickyTop,
  localId,
}) => {
  const rowHeights = useMemo(() => {
    // NOTE: we don't care so much as to what tableHeight is, we only care that it changed and is a sane value.
    if (tableRef && !!tableHeight) {
      return getRowHeights(tableRef);
    }
    return [0];
  }, [tableRef, tableHeight]);

  if (!tableRef) {
    return null;
  }

  const firstRow = tableRef.querySelector('tr');
  const hasHeaderRow = firstRow
    ? firstRow.getAttribute('data-header-row')
    : false;

  const marginTop =
    hasHeaderRow && stickyTop !== undefined ? rowHeights?.[0] ?? 0 : 0;

  const colWidths = getColumnsWidths(editorView);
  const widths = colWidths
    .map((width) => (width ? `${width - 1}px` : '0px'))
    .join(' ');

  const colIndex = hoveredCell?.colIndex;

  const onClick = (
    index: number,
    event: React.MouseEvent<Element, MouseEvent>,
  ) => {};

  const onMouseOver = () => {};
  const onMouseOut = () => {};

  return (
    <div className={ClassName.COLUMN_CONTROLS_WITH_DRAG}>
      <div
        className={ClassName.COLUMN_CONTROLS_INNER}
        data-testid="table-floating-column-controls"
        style={{
          gridTemplateColumns: widths,
          marginTop,
        }}
      >
        {tableActive && !isResizing && Number.isFinite(colIndex) && (
          <div
            style={{
              gridColumn: `${(colIndex as number) + 1} / span 1`,
              marginTop: `-15px`,
            }}
            data-column-control-index={colIndex}
            data-testid="table-floating-column-control"
          >
            <DragHandle
              direction="column"
              indexes={[]}
              onClick={(event) => onClick(colIndex as number, event)}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              tableLocalId={localId || ''}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColumnControls;
