import type { MouseEvent } from 'react';
import React, { useCallback, useMemo } from 'react';

import { injectIntl } from 'react-intl-next';
import type { WrappedComponentProps } from 'react-intl-next';

import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables';
import { findTable, getSelectionRect } from '@atlaskit/editor-tables/utils';

import { clearHoverSelection } from '../../../commands';
import type { CellHoverMeta } from '../../../types';
import { TableCssClassName as ClassName } from '../../../types';
import { getRowHeights, getSelectedRowIndexes } from '../../../utils';
import { DragHandle } from '../../DragHandle';

type DragControlsProps = {
  editorView: EditorView;
  tableRef: HTMLTableElement;
  tableActive?: boolean;
  hoveredCell?: CellHoverMeta;
  isInDanger?: boolean;
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
  hoveredCell,
  tableActive,
  editorView,
  isInDanger,
  hoverRows,
  selectRow,
  updateCellHoverLocation,
}: DragControlsProps & WrappedComponentProps) => {
  const rowHeights = getRowHeights(tableRef);
  const heights = rowHeights.map((height) => `${height - 1}px`).join(' ');
  const selectedRowIndexes = getSelectedRows(editorView.state.selection);
  const rowWidth = tableRef.offsetWidth;
  const rowIndex = hoveredCell?.rowIndex;

  const gridRowPosition = useMemo(() => {
    // if more than one row is selected, ensure the handle spans over the selected range
    if (selectedRowIndexes.includes(rowIndex!)) {
      return `${selectedRowIndexes[0] + 1} / span ${selectedRowIndexes.length}`;
    }
    return `${rowIndex! + 1} / span 1`;
  }, [rowIndex, selectedRowIndexes]);

  const getLocalId = () => {
    const tableNode = findTable(editorView.state.selection);
    return tableNode?.node?.attrs?.localId || '';
  };

  const handleMouseOut = useCallback(() => {
    if (tableActive) {
      const { state, dispatch } = editorView;
      clearHoverSelection()(state, dispatch);
    }
  }, [editorView, tableActive]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // avoid updating if event target is drag handle
      if (
        !(e.nativeEvent.target as Element).classList.contains(
          ClassName.ROW_CONTROLS_WITH_DRAG,
        )
      ) {
        return;
      }

      const hoverHeight = e.nativeEvent.offsetY;
      let totalHeight = 0;
      const rowIndex = rowHeights.findIndex((row) => {
        totalHeight += row;
        return hoverHeight <= totalHeight;
      });

      updateCellHoverLocation(rowIndex);
    },
    [updateCellHoverLocation, rowHeights],
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
      className={ClassName.ROW_CONTROLS_WITH_DRAG}
      style={{
        gridTemplateRows: heights,
      }}
      onMouseMove={handleMouseMove}
    >
      {Number.isFinite(rowIndex) && (
        <div
          style={{
            gridRow: gridRowPosition,
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DragHandle
            tableLocalId={getLocalId()}
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
          />
        </div>
      )}
    </div>
  );
};

export const DragControls = injectIntl(DragControlsComponent);
