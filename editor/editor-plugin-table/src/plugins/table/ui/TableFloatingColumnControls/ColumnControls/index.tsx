import type { MouseEvent } from 'react';
import React, { useCallback, useMemo } from 'react';

import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';

import {
  clearHoverSelection,
  hoverCell,
  hoverColumns,
  selectColumn,
} from '../../../commands';
import { toggleDragMenu } from '../../../pm-plugins/drag-and-drop/commands';
import type { CellHoverMeta } from '../../../types';
import { TableCssClassName as ClassName } from '../../../types';
import { getRowsParams, getSelectedColumnIndexes } from '../../../utils';
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
  hasHeaderColumn?: boolean;
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
  hasHeaderColumn,
}: ColumnControlsProps) => {
  const widths =
    colWidths?.map((width) => (width ? `${width - 1}px` : '0px')).join(' ') ??
    '0px';
  // TODO: reusing getRowsParams here because it's generic enough to work for columns -> rename
  const columnParams = getRowsParams(colWidths ?? []);
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

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const isParentDragControls = (e.nativeEvent.target as Element).closest(
        `.${ClassName.DRAG_COLUMN_CONTROLS}`,
      );
      const colIndex = (e.nativeEvent.target as Element).getAttribute(
        'data-start-index',
      );

      // avoid updating if event target is not related
      if (!isParentDragControls || !colIndex) {
        return;
      }

      // update hovered cell location
      const { state, dispatch } = editorView;
      if (tableActive && hoveredCell?.colIndex !== Number(colIndex)) {
        hoverCell(hoveredCell?.rowIndex, Number(colIndex))(state, dispatch);
      }
    },
    [editorView, hoveredCell?.colIndex, hoveredCell?.rowIndex, tableActive],
  );

  const handleMouseOut = useCallback(() => {
    if (tableActive) {
      const { state, dispatch } = editorView;
      clearHoverSelection()(state, dispatch);
    }
  }, [editorView, tableActive]);

  const handleMouseUp = useCallback(() => {
    const { state, dispatch } = editorView;
    toggleDragMenu(undefined, 'column', colIndex)(state, dispatch);
  }, [editorView, colIndex]);

  const colIndexes = useMemo(() => {
    return [colIndex!];
  }, [colIndex]);

  return (
    <div
      className={ClassName.DRAG_COLUMN_CONTROLS}
      onMouseMove={handleMouseMove}
    >
      <div
        className={ClassName.DRAG_COLUMN_CONTROLS_INNER}
        data-testid="table-floating-column-controls"
        style={{
          gridTemplateColumns: widths,
          marginTop,
        }}
      >
        {!isResizing &&
          columnParams.map(({ startIndex, endIndex }, index) => (
            <div
              style={{
                gridColumn: `${index + 1} / span 1`,
              }}
              data-start-index={startIndex}
              data-end-index={endIndex}
              className={ClassName.DRAG_COLUMN_FLOATING_INSERT_DOT_WRAPPER}
              contentEditable={false}
              key={index}
            >
              {/* TODO: Disabling first column insert button https://atlassian.slack.com/archives/C05U8HRQM50/p1698363744682219?thread_ts=1698209039.104909&cid=C05U8HRQM50 */}
              {/* {!hasHeaderColumn && index === 0 && (
                <div
                  style={{
                    left: '0px',
                    right: 'unset',
                  }}
                  className={ClassName.DRAG_COLUMN_FLOATING_INSERT_DOT}
                />
              )} */}
              <div
                className={ClassName.DRAG_COLUMN_FLOATING_INSERT_DOT}
                style={columnParams.length - 1 === index ? { right: '0' } : {}}
              />
            </div>
          ))}
        {tableActive &&
          !isResizing &&
          !!hoveredCell &&
          Number.isFinite(hoveredCell.colIndex) && (
            <div
              style={{
                gridColumn: gridColumnPosition,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 99,
              }}
              data-column-control-index={hoveredCell.colIndex}
              data-testid="table-floating-column-control"
            >
              <DragHandle
                direction="column"
                tableLocalId={localId || ''}
                indexes={colIndexes}
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
                onMouseUp={handleMouseUp}
                editorView={editorView}
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default ColumnControls;
