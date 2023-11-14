import type { MouseEvent } from 'react';
import React, { useCallback, useMemo } from 'react';

import { injectIntl } from 'react-intl-next';
import type { WrappedComponentProps } from 'react-intl-next';

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';

import { clearHoverSelection } from '../../../commands';
import { toggleDragMenu } from '../../../pm-plugins/drag-and-drop/commands';
import type { CellHoverMeta } from '../../../types';
import { TableCssClassName as ClassName } from '../../../types';
import {
  getRowHeights,
  getRowsParams,
  getSelectedRowIndexes,
} from '../../../utils';
import { DragHandle } from '../../DragHandle';

type DragControlsProps = {
  editorView: EditorView;
  tableRef: HTMLTableElement;
  tableNode?: PmNode;
  tableActive?: boolean;
  hoveredCell?: CellHoverMeta;
  isInDanger?: boolean;
  isResizing?: boolean;
  hasHeaderRow?: boolean;
  hoverRows: (rows: number[], danger?: boolean) => void;
  selectRow: (row: number, expand: boolean) => void;
  updateCellHoverLocation: (rowIndex: number) => void;
};

const getSelectedRows = (selection: Selection) => {
  if (selection instanceof CellSelection && selection.isRowSelection()) {
    const rect = getSelectionRect(selection);
    if (!rect) {
      return [];
    }
    return getSelectedRowIndexes(rect);
  }
  return [];
};

const DragControlsComponent = ({
  tableRef,
  tableNode,
  hoveredCell,
  tableActive,
  editorView,
  isInDanger,
  isResizing,
  hasHeaderRow,
  hoverRows,
  selectRow,
  updateCellHoverLocation,
}: DragControlsProps & WrappedComponentProps) => {
  const rowHeights = getRowHeights(tableRef);
  const rowsParams = getRowsParams(rowHeights);
  const heights = rowHeights.map((height) => `${height - 1}px`).join(' ');
  const selectedRowIndexes = getSelectedRows(editorView.state.selection);
  const rowWidth = tableRef.offsetWidth;

  const onMouseUp = useCallback(() => {
    toggleDragMenu(
      undefined,
      'row',
      hoveredCell?.rowIndex,
    )(editorView.state, editorView.dispatch);
  }, [editorView, hoveredCell?.rowIndex]);

  const rowIndex = hoveredCell?.rowIndex;

  const gridRowPosition = useMemo(() => {
    // if more than one row is selected, ensure the handle spans over the selected range
    if (selectedRowIndexes.includes(rowIndex!)) {
      return `${selectedRowIndexes[0] + 1} / span ${selectedRowIndexes.length}`;
    }
    return `${rowIndex! + 1} / span 1`;
  }, [rowIndex, selectedRowIndexes]);

  const handleMouseOut = useCallback(() => {
    if (tableActive) {
      const { state, dispatch } = editorView;
      clearHoverSelection()(state, dispatch);
    }
  }, [editorView, tableActive]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const isParentDragControls = (e.nativeEvent.target as Element).closest(
        `.${ClassName.DRAG_ROW_CONTROLS}`,
      );
      const rowIndex = (e.nativeEvent.target as Element).getAttribute(
        'data-start-index',
      );

      // avoid updating if event target is not related
      if (!isParentDragControls || !rowIndex) {
        return;
      }

      updateCellHoverLocation(Number(rowIndex));
    },
    [updateCellHoverLocation],
  );

  const handleMouseOver = useCallback(() => {
    hoverRows([rowIndex!]);
  }, [hoverRows, rowIndex]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      selectRow(rowIndex!, e?.shiftKey);
    },
    [rowIndex, selectRow],
  );

  return (
    <div
      className={ClassName.DRAG_ROW_CONTROLS}
      style={{
        gridTemplateRows: heights,
      }}
      onMouseMove={handleMouseMove}
    >
      {!isResizing &&
        rowsParams.map(({ startIndex, endIndex }, index) => (
          <div
            style={{
              gridRow: `${index + 1} / span 1`,
            }}
            data-start-index={startIndex}
            data-end-index={endIndex}
            className={ClassName.DRAG_ROW_FLOATING_INSERT_DOT_WRAPPER}
            contentEditable={false}
            key={index}
          >
            {/* TODO: Disabling first column insert button https://atlassian.slack.com/archives/C05U8HRQM50/p1698363744682219?thread_ts=1698209039.104909&cid=C05U8HRQM50 */}
            {/* {!hasHeaderRow && index === 0 && (
              <div
                style={{
                  top: '0px',
                  left: token('space.075', '6px'),
                }}
                className={ClassName.DRAG_ROW_FLOATING_INSERT_DOT}
              />
            )} */}
            <div className={ClassName.DRAG_ROW_FLOATING_INSERT_DOT} />
          </div>
        ))}
      {!isResizing && Number.isFinite(rowIndex) && (
        <div
          style={{
            gridRow: gridRowPosition,
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          data-testid="table-floating-row-drag-handle"
        >
          <DragHandle
            tableLocalId={tableNode?.attrs?.localId ?? ''}
            indexes={[rowIndex!]}
            previewWidth={rowWidth}
            previewHeight={rowHeights[rowIndex!]}
            appearance={
              selectedRowIndexes.includes(rowIndex!)
                ? isInDanger
                  ? 'danger'
                  : 'selected'
                : 'default'
            }
            onClick={handleClick}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onMouseUp={onMouseUp}
            editorView={editorView}
          />
        </div>
      )}
    </div>
  );
};

export const DragControls = injectIntl(DragControlsComponent);
