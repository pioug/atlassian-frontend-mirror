import React, { PropsWithChildren } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import rafSchd from 'raf-schd';

import { ResizerNext } from '@atlaskit/editor-common/resizer';

import {
  scaleTable,
  previewScaleTable,
  getColgroupChildrenLength,
  COLUMN_MIN_WIDTH,
} from '../pm-plugins/table-resizing/utils';

interface TableResizerProps {
  width: number;
  maxWidth: number;
  updateWidth: (width: number) => void;
  editorView: EditorView;
  getPos: () => number | undefined;
  node: PMNode;
  tableRef: HTMLTableElement;
}

const handles = { right: true };

export const TableResizer = ({
  children,
  width,
  maxWidth,
  updateWidth,
  editorView,
  getPos,
  node,
  tableRef,
}: PropsWithChildren<TableResizerProps>) => {
  const currentColumnCount = getColgroupChildrenLength(node);
  const minColumnWidth =
    currentColumnCount <= 3
      ? currentColumnCount * COLUMN_MIN_WIDTH
      : 3 * COLUMN_MIN_WIDTH;

  return (
    <ResizerNext
      enable={handles}
      width={width}
      handleResizeStart={() => width}
      handleResize={rafSchd((originalState, delta) => {
        const newWidth = originalState.width + delta.width;
        const pos = getPos();
        if (typeof pos !== 'number') {
          return;
        }

        previewScaleTable(
          tableRef,
          {
            node,
            prevNode: node,
            start: pos + 1,
            parentWidth: newWidth,
          },
          editorView.domAtPos.bind(editorView),
        );

        updateWidth(newWidth);
        return newWidth;
      })}
      handleResizeStop={(originalState, delta) => {
        const newWidth = originalState.width + delta.width;

        const { state, dispatch } = editorView;
        const pos = getPos();

        if (typeof pos !== 'number') {
          return;
        }

        let tr = state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          width: newWidth,
        });

        const newNode = tr.doc.nodeAt(pos)!;
        tr = scaleTable(
          tableRef,
          {
            node: newNode,
            prevNode: node,
            start: pos + 1,
            parentWidth: newWidth,
          },
          editorView.domAtPos.bind(editorView),
        )(tr);

        dispatch(tr);

        updateWidth(newWidth);
        return newWidth;
      }}
      resizeRatio={2}
      minWidth={minColumnWidth}
      maxWidth={maxWidth}
    >
      {children}
    </ResizerNext>
  );
};
