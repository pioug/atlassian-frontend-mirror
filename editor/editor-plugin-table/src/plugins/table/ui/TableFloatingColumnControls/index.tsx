import React, { useEffect, useMemo, useState } from 'react';

import type { TableColumnOrdering } from '@atlaskit/custom-steps';
import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { findTable } from '@atlaskit/editor-tables';

import type { RowStickyState } from '../../pm-plugins/sticky-headers';

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
  ordering?: TableColumnOrdering;
  stickyHeader?: RowStickyState;
}

export const TableFloatingColumnControls: React.FC<Props> = ({
  editorView,
  tableRef,
  tableActive,
  hasHeaderRow,
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

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      data-testid="table-floating-column-controls-wrapper"
    >
      {tableActive && (
        <ColumnDropTargets
          editorView={editorView}
          tableRef={tableRef}
          stickyTop={tableActive ? stickyTop : undefined}
          tableHeight={tableRect.height}
          localId={selectedLocalId}
        />
      )}
    </div>
  );
};

export default TableFloatingColumnControls;
