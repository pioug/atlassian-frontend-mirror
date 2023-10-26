import React, { useEffect, useMemo, useState } from 'react';

import ReactDOM from 'react-dom';

import type { TableColumnOrdering } from '@atlaskit/custom-steps';
import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';

import type { RowStickyState } from '../../pm-plugins/sticky-headers';
import type { CellHoverMeta, DraggableSourceData } from '../../types';
import { TableCssClassName as ClassName } from '../../types';
import {
  containsHeaderColumn,
  getColumnsWidths,
  getRowHeights,
} from '../../utils';

import { ColumnControls } from './ColumnControls';
import { ColumnDropTargets } from './ColumnDropTargets';

export interface Props {
  editorView: EditorView;
  getEditorFeatureFlags: GetEditorFeatureFlags;
  selection?: Selection;
  tableRef?: HTMLTableElement;
  getNode: () => PmNode;
  tableActive?: boolean;
  isInDanger?: boolean;
  hasHeaderRow?: boolean;
  headerRowHeight?: number;
  hoveredRows?: number[];
  hoveredCell?: CellHoverMeta;
  isResizing?: boolean;
  ordering?: TableColumnOrdering;
  stickyHeader?: RowStickyState;
}

export const TableFloatingColumnControls: React.FC<Props> = ({
  editorView,
  tableRef,
  getNode,
  tableActive,
  hasHeaderRow,
  hoveredCell,
  isResizing,
  stickyHeader,
  selection,
  isInDanger,
}) => {
  const [tableRect, setTableRect] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 },
  );

  const [hasDropTargets, setHasDropTargets] = useState(false);
  const node = getNode();
  const currentNodeLocalId = node?.attrs.localId;
  const hasHeaderColumn = containsHeaderColumn(node);

  useEffect(() => {
    if (tableRef && window?.ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setTableRect((prev) => {
            if (
              prev.width !== entry.contentRect.width ||
              prev.height !== entry.contentRect.height
            ) {
              return entry.contentRect;
            }
            return prev;
          });
        }
      });
      resizeObserver.observe(tableRef);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [tableRef]);

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        const { type, localId, indexes } =
          source.data as Partial<DraggableSourceData>;
        return (
          type === 'table-column' &&
          !!indexes?.length &&
          localId === currentNodeLocalId
        );
      },
      onDragStart() {
        setHasDropTargets(true);
      },
      onDrop() {
        setHasDropTargets(false);
      },
    });
  }, [editorView, currentNodeLocalId]);

  const rowHeights = useMemo(() => {
    // NOTE: we don't care so much as to what tableHeight is, we only care that it changed and is a sane value.
    if (tableRef && !!tableRect.height) {
      return getRowHeights(tableRef);
    }
    return [0];
  }, [tableRef, tableRect.height]);

  if (!tableRef) {
    return null;
  }

  const colWidths = getColumnsWidths(editorView);

  const stickyTop =
    stickyHeader && stickyHeader.sticky && hasHeaderRow
      ? stickyHeader.top
      : undefined;

  const mountTo = (tableRef && tableRef?.parentElement) || document.body;

  if (!tableActive) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className={ClassName.COLUMN_CONTROLS_WRAPPER}
      data-testid="table-floating-column-controls-wrapper"
    >
      <ColumnControls
        editorView={editorView}
        hoveredCell={hoveredCell}
        tableRef={tableRef}
        isResizing={isResizing}
        tableActive={tableActive}
        stickyTop={tableActive ? stickyTop : undefined}
        localId={currentNodeLocalId}
        isInDanger={isInDanger}
        rowHeights={rowHeights}
        colWidths={colWidths}
        hasHeaderColumn={hasHeaderColumn}
      />
      {hasDropTargets && (
        <ColumnDropTargets
          tableRef={tableRef}
          stickyTop={tableActive ? stickyTop : undefined}
          tableHeight={tableRect.height}
          localId={currentNodeLocalId}
          rowHeights={rowHeights}
          colWidths={colWidths}
        />
      )}
    </div>,
    mountTo,
  );
};

export default TableFloatingColumnControls;
