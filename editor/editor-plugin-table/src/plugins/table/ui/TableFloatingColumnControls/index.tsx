import React, { useEffect, useMemo, useState } from 'react';

import ReactDOM from 'react-dom';

import type { TableColumnOrdering } from '@atlaskit/custom-steps';
import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { findTable } from '@atlaskit/editor-tables';

import type { RowStickyState } from '../../pm-plugins/sticky-headers';
import type { CellHoverCoordinates } from '../../types';
import { TableCssClassName as ClassName } from '../../types';

import { ColumnControls } from './ColumnControls';
import { ColumnDropTargets } from './ColumnDropTargets';

export interface Props {
  editorView: EditorView;
  getEditorFeatureFlags: GetEditorFeatureFlags;
  selection?: Selection;
  tableRef?: HTMLTableElement;
  tableActive?: boolean;
  hasHeaderRow?: boolean;
  headerRowHeight?: number;
  hoveredRows?: number[];
  hoveredCell?: CellHoverCoordinates;
  isResizing?: boolean;
  ordering?: TableColumnOrdering;
  stickyHeader?: RowStickyState;
}

export const TableFloatingColumnControls: React.FC<Props> = ({
  editorView,
  tableRef,
  tableActive,
  hasHeaderRow,
  hoveredCell,
  isResizing,
  stickyHeader,
  selection,
}) => {
  const [tableRect, setTableRect] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 },
  );

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

  const selectedLocalId = useMemo(() => {
    if (!selection) {
      return undefined;
    }

    const tableNode = findTable(selection);
    if (!tableNode) {
      return undefined;
    }

    return tableNode.node.attrs.localId;
  }, [selection]);

  if (!tableRef) {
    return null;
  }

  const stickyTop =
    stickyHeader && stickyHeader.sticky && hasHeaderRow
      ? stickyHeader.top
      : undefined;

  const mountTo = (tableRef && tableRef?.parentElement) || document.body;

  return ReactDOM.createPortal(
    <div className={ClassName.COLUMN_CONTROLS_WRAPPER}>
      <div
        onMouseDown={(e) => e.preventDefault()}
        data-testid="table-floating-column-controls-wrapper"
      >
        <ColumnControls
          editorView={editorView}
          hoveredCell={hoveredCell}
          tableRef={tableRef}
          isResizing={isResizing}
          tableActive={tableActive}
          stickyTop={tableActive ? stickyTop : undefined}
          tableHeight={tableRect.height}
          localId={selectedLocalId}
        />
        <ColumnDropTargets
          editorView={editorView}
          tableRef={tableRef}
          stickyTop={tableActive ? stickyTop : undefined}
          tableHeight={tableRect.height}
          localId={selectedLocalId}
        />
      </div>
    </div>,
    mountTo,
  );
};

export default TableFloatingColumnControls;
