import React from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { CellHoverCoordinates } from '../../../types';
import { TableCssClassName as ClassName } from '../../../types';
import { DragHandle } from '../../DragHandle';

export interface Props {
  editorView: EditorView;
  tableActive?: boolean;
  tableRef: HTMLTableElement;
  hoveredCell?: CellHoverCoordinates;
  isResizing?: boolean;
  stickyTop?: number;
  localId?: string;
  rowHeights?: number[];
  colWidths?: (number | undefined)[];
}

export const ColumnControls: React.FC<Props> = ({
  editorView,
  tableActive,
  tableRef,
  hoveredCell,
  isResizing,
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

  const widths =
    colWidths?.map((width) => (width ? `${width - 1}px` : '0px')).join(' ') ??
    '0px';

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
              indexes={[colIndex!]}
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
