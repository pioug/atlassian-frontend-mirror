import type { MouseEvent } from 'react';
import React, { useCallback, useMemo } from 'react';

import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';

import {
  clearHoverSelection,
  hoverColumns,
  selectColumn,
} from '../../../commands';
import type { CellHoverMeta } from '../../../types';
import { TableCssClassName as ClassName } from '../../../types';
import { getSelectedColumnIndexes } from '../../../utils';
import { DragHandle } from '../../DragHandle';

export interface ColumnControlsProps {
  editorView: EditorView;
  tableActive?: boolean;
  isInDanger?: boolean;
  tableRef: HTMLTableElement;
  hoveredCell?: CellHoverMeta;
  isResizing?: boolean;
  stickyTop?: number;
  localId?: string;
  rowHeights?: number[];
  colWidths?: (number | undefined)[];
}

const getSelectedColumns = (selection: Selection) => {
  if (selection instanceof CellSelection && selection.isColSelection()) {
    const rect = getSelectionRect(selection);
    if (!rect) {
      return [];
    }
    return getSelectedColumnIndexes(rect);
  }
  return [];
};

export const ColumnControls = ({
  editorView,
  tableActive,
  tableRef,
  hoveredCell,
  isResizing,
  stickyTop,
  localId,
  isInDanger,
  rowHeights,
  colWidths,
}: ColumnControlsProps) => {
  const widths =
    colWidths?.map((width) => (width ? `${width - 1}px` : '0px')).join(' ') ??
    '0px';
  const colIndex = hoveredCell?.colIndex;
  const selectedColIndexes = getSelectedColumns(editorView.state.selection);

  const gridColumnPosition = useMemo(() => {
    // if more than one row is selected, ensure the handle spans over the selected range
    if (selectedColIndexes.includes(colIndex!)) {
      return `${selectedColIndexes[0] + 1} / span ${selectedColIndexes.length}`;
    }
    return `${colIndex! + 1} / span 1`;
  }, [colIndex, selectedColIndexes]);

  const firstRow = tableRef.querySelector('tr');
  const hasHeaderRow = firstRow
    ? firstRow.getAttribute('data-header-row')
    : false;

  const marginTop =
    hasHeaderRow && stickyTop !== undefined ? rowHeights?.[0] ?? 0 : 0;

  const handleClick = useCallback(
    (event: MouseEvent) => {
      const { state, dispatch } = editorView;
      selectColumn(colIndex!, event.shiftKey)(state, dispatch);
    },
    [colIndex, editorView],
  );

  const handleMouseOver = useCallback(() => {
    const { state, dispatch } = editorView;
    hoverColumns([colIndex!])(state, dispatch);
  }, [colIndex, editorView]);

  const handleMouseOut = useCallback(() => {
    if (tableActive) {
      const { state, dispatch } = editorView;
      clearHoverSelection()(state, dispatch);
    }
  }, [editorView, tableActive]);

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
        {tableActive &&
          !isResizing &&
          !!hoveredCell &&
          Number.isFinite(hoveredCell.colIndex) && (
            <div
              style={{
                gridColumn: gridColumnPosition,
                marginTop: `-15px`,
              }}
              data-column-control-index={hoveredCell.colIndex}
              data-testid="table-floating-column-control"
            >
              <DragHandle
                direction="column"
                tableLocalId={localId || ''}
                indexes={[hoveredCell.colIndex!]}
                previewWidth={hoveredCell.colWidth}
                previewHeight={hoveredCell.colHeight}
                appearance={
                  selectedColIndexes.includes(hoveredCell.colIndex!)
                    ? isInDanger
                      ? 'danger'
                      : 'selected'
                    : 'default'
                }
                onClick={handleClick}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default ColumnControls;
