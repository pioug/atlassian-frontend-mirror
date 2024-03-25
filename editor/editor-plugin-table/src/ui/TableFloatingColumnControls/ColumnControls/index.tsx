/* eslint-disable @atlaskit/design-system/prefer-primitives */
import type { MouseEvent } from 'react';
import React, { useCallback, useMemo, useRef } from 'react';

import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';
import { CellSelection } from '@atlaskit/editor-tables';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';

import {
  clearHoverSelection,
  hoverCell,
  hoverColumns,
  selectColumn,
  selectColumns,
} from '../../../commands';
import { toggleDragMenu } from '../../../pm-plugins/drag-and-drop/commands';
import type { TriggerType } from '../../../pm-plugins/drag-and-drop/types';
import type { CellHoverMeta, HandleTypes } from '../../../types';
import { TableCssClassName as ClassName } from '../../../types';
import { getRowsParams, getSelectedColumnIndexes } from '../../../utils';
import type { DragHandleAppearance } from '../../DragHandle';
import { DragHandle } from '../../DragHandle';

export interface ColumnControlsProps {
  editorView: EditorView;
  tableActive?: boolean;
  isInDanger?: boolean;
  tableRef: HTMLTableElement;
  hoveredCell?: CellHoverMeta;
  stickyTop?: number;
  localId?: string;
  rowHeights?: number[];
  colWidths?: (number | undefined)[];
  hasHeaderColumn?: boolean;
  isTableHovered?: boolean;
  tableContainerWidth?: number;
  isNumberColumnEnabled?: boolean;
  isDragging?: boolean;
  getScrollOffset?: () => number;
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
  stickyTop,
  localId,
  isInDanger,
  rowHeights,
  colWidths,
  hasHeaderColumn,
  isTableHovered,
  tableContainerWidth,
  isNumberColumnEnabled,
  isDragging,
  getScrollOffset,
}: ColumnControlsProps) => {
  const columnControlsRef = useRef<HTMLDivElement>(null);
  const widths =
    colWidths
      ?.map((width) =>
        // when there is sticky header, a `margin-right: -1px` applied to `tr.sticky th` so it causes colWidths to be 1px wider
        // we need to reduce the width by 1px to avoid misalignment of column controls.
        width ? (stickyTop ? `${width - 2}px` : `${width - 1}px`) : '0px',
      )
      .join(' ') ?? '0px';
  // TODO: reusing getRowsParams here because it's generic enough to work for columns -> rename
  const columnParams = getRowsParams(colWidths ?? []);
  const colIndex = hoveredCell?.colIndex;
  const selectedColIndexes = getSelectedColumns(editorView.state.selection);

  const firstRow = tableRef.querySelector('tr');
  const hasHeaderRow = firstRow
    ? firstRow.getAttribute('data-header-row')
    : false;

  const marginTop =
    hasHeaderRow && stickyTop !== undefined ? rowHeights?.[0] ?? 0 : 0;

  const handleClick = useCallback(
    (event: MouseEvent) => {
      const { state, dispatch } = editorView;

      const isClickOutsideSelectedCols =
        selectedColIndexes.length >= 1 &&
        !selectedColIndexes.includes(colIndex!);

      if (
        !selectedColIndexes ||
        selectedColIndexes.length === 0 ||
        isClickOutsideSelectedCols
      ) {
        selectColumn(colIndex!, event.shiftKey)(state, dispatch);
      }

      if (
        selectedColIndexes.length > 1 &&
        selectedColIndexes.includes(colIndex!) &&
        !event.shiftKey
      ) {
        selectColumns(selectedColIndexes)(state, dispatch);
      }
    },
    [colIndex, selectedColIndexes, editorView],
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
      if (tableActive) {
        // For context:  Whenever we mouse over a column or row drag handle, we will ALWAYS be hovering over the 0 index
        // of the opposite dimension. For example; here when we mouse over the column drag handle then we're technically
        // also hovering over row 0 index. And vice-versa with rows. This means we don't need to worry about knowing the
        // current row index. We can just force it to 0.
        hoverCell(0, Number(colIndex))(state, dispatch);
      }
    },
    [editorView, tableActive],
  );

  const handleMouseOut = useCallback(() => {
    if (tableActive) {
      const { state, dispatch } = editorView;
      clearHoverSelection()(state, dispatch);
    }
  }, [editorView, tableActive]);

  const toggleDragMenuHandler = useCallback(
    (
      trigger: TriggerType,
      event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | undefined,
    ) => {
      const { state, dispatch } = editorView;
      if (event?.shiftKey) {
        return;
      }
      toggleDragMenu(undefined, 'column', colIndex, trigger)(state, dispatch);
    },
    [editorView, colIndex],
  );

  const colIndexes = useMemo(() => {
    return [colIndex!];
  }, [colIndex]);

  if (stickyTop && columnControlsRef.current) {
    columnControlsRef.current.scrollLeft = getScrollOffset?.() ?? 0;
  }

  const generateHandleByType = (
    type: HandleTypes,
    appearance: DragHandleAppearance,
    gridColumn: string,
    indexes: number[],
  ) => {
    const isHover = type === 'hover';
    const previewHeight = rowHeights?.reduce((sum, cur) => sum + cur, 0) ?? 0;

    const previewWidth =
      colWidths?.reduce<number>(
        (sum, v, i) =>
          sum + (v ?? tableCellMinWidth) * (indexes.includes(i) ? 1 : 0),
        0,
      ) ?? tableCellMinWidth;

    return (
      <div
        contentEditable={false}
        key={type}
        style={{
          gridColumn,
          gridRow: '1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'fit-content',
          placeSelf: 'center',
          zIndex: 99,
          width: '100%',
          position: 'relative',
        }}
        data-testid={`table-floating-column-${
          isHover ? colIndex : selectedColIndexes[0]
        }-drag-handle`}
      >
        <DragHandle
          isDragMenuTarget={!isHover}
          direction="column"
          tableLocalId={localId || ''}
          indexes={indexes}
          hoveredCell={hoveredCell}
          previewWidth={previewWidth}
          forceDefaultHandle={!isHover}
          previewHeight={previewHeight}
          appearance={appearance}
          onClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          toggleDragMenu={toggleDragMenuHandler}
          editorView={editorView}
        />
      </div>
    );
  };

  const columnHandles = () => {
    const handles = [];
    const isColumnSelected = selectedColIndexes.length > 0;
    const isEntireTableSelected =
      (colWidths || []).length > selectedColIndexes.length;

    if (!tableActive) {
      return null;
    }

    // placeholder / selected need to always render at least one handle
    // so it can be focused via keyboard shortcuts
    handles.push(
      generateHandleByType(
        'selected',
        isColumnSelected && isEntireTableSelected
          ? isInDanger
            ? 'danger'
            : 'selected'
          : 'placeholder',
        `${selectedColIndexes[0] + 1} / span ${selectedColIndexes.length}`,
        selectedColIndexes,
      ),
    );

    if (
      hoveredCell &&
      isTableHovered &&
      colIndex !== undefined &&
      !selectedColIndexes.includes(colIndex)
    ) {
      handles.push(
        generateHandleByType(
          'hover',
          'default',
          `${colIndex! + 1} / span 1`,
          colIndexes,
        ),
      );
    }

    return handles;
  };

  const containerWidth =
    isNumberColumnEnabled && tableContainerWidth
      ? tableContainerWidth - akEditorTableNumberColumnWidth
      : tableContainerWidth;

  return (
    <div
      className={ClassName.DRAG_COLUMN_CONTROLS}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={columnControlsRef}
        className={ClassName.DRAG_COLUMN_CONTROLS_INNER}
        data-testid="table-floating-column-controls"
        style={{
          gridTemplateColumns: widths,
          marginTop,
          width: stickyTop ? containerWidth : undefined,
          overflowX: stickyTop ? 'hidden' : 'visible',
          pointerEvents: isDragging ? 'none' : undefined,
        }}
      >
        {columnParams.map(({ startIndex, endIndex }, index) => (
          <div
            style={{
              gridColumn: `${startIndex + 1} / span 1`,
            }}
            data-start-index={startIndex}
            data-end-index={endIndex}
            className={ClassName.DRAG_COLUMN_FLOATING_INSERT_DOT_WRAPPER}
            contentEditable={false}
            key={index}
          >
            <div
              className={ClassName.DRAG_COLUMN_FLOATING_INSERT_DOT}
              style={columnParams.length - 1 === index ? { right: '0' } : {}}
            />
          </div>
        ))}
        {columnHandles()}
      </div>
    </div>
  );
};

export default ColumnControls;
