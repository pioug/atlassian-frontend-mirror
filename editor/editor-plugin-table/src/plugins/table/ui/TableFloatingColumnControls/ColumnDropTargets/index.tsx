import React, { useEffect, useMemo, useRef } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';

import type { DraggableSourceData } from '../../../types';
import { TableCssClassName as ClassName } from '../../../types';
import { getColumnsWidths, getRowHeights } from '../../../utils';

export interface Props {
  editorView: EditorView;
  tableRef: HTMLTableElement;
  stickyTop?: number;
  tableHeight?: number;
  localId?: string;
}

export const ColumnDropTargets: React.FC<Props> = ({
  editorView,
  tableRef,
  tableHeight,
  stickyTop,
  localId,
}) => {
  const colWidths = getColumnsWidths(editorView);
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

  return (
    <div className={ClassName.COLUMN_DROP_TARGET_CONTROLS}>
      <div
        className={ClassName.COLUMN_CONTROLS_INNER}
        data-testid="table-floating-column-controls-drop-targets"
      >
        {colWidths.map((width, index) => {
          return (
            <ColumnDropTarget
              key={index}
              index={index}
              localId={localId}
              width={width}
              height={tableHeight}
              marginTop={marginTop}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ColumnDropTargets;

const ColumnDropTarget: React.FC<{
  index: number;
  localId?: string;
  width?: number;
  height?: number;
  marginTop?: number;
}> = ({ index, localId, width, height, marginTop }) => {
  const dropTargetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!dropTargetRef.current) {
      return;
    }

    return dropTargetForElements({
      element: dropTargetRef.current,
      canDrop({ source }) {
        const data = source.data as DraggableSourceData;
        return (
          // Only draggables of row type can be dropped on this target
          data.type === 'table-column' &&
          // Only draggables which came from the same table can be dropped on this target
          data.localId === localId &&
          // Only draggables which DO NOT include this drop targets index can be dropped
          !!data.indexes?.length &&
          data.indexes?.indexOf(index) === -1
        );
      },
      getData({ input, element }) {
        const data = {
          localId,
          type: 'table-column',
          targetIndex: index,
        };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['left', 'right'],
        });
      },
    });
  }, [index, localId]);

  return (
    <div
      ref={dropTargetRef}
      style={{
        width: width && `${width - 1}px`,
        height: height && `${height}px`,
        marginTop: marginTop && `${marginTop}px`,
      }}
      data-drop-target-index={index}
      data-drop-target-localid={localId}
      data-testid="table-floating-column-controls-drop-target"
    ></div>
  );
};
