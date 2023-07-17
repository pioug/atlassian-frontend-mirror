import React, {
  PropsWithChildren,
  useCallback,
  useRef,
  useMemo,
  useState,
} from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import rafSchd from 'raf-schd';

import {
  HandleHeightSizeType,
  HandleResize,
  ResizerNext,
} from '@atlaskit/editor-common/resizer';
import { getGuidelinesWithHighlights } from '@atlaskit/editor-common/guideline';
import type { GuidelineConfig } from '@atlaskit/editor-plugin-guideline';

import {
  scaleTable,
  previewScaleTable,
  getColgroupChildrenLength,
  COLUMN_MIN_WIDTH,
} from '../pm-plugins/table-resizing/utils';
import { defaultGuidelines, defaultGuidelineWidths } from '../utils/guidelines';
import { findClosestSnap } from '../utils/snapping';
import { TABLE_SNAP_GAP, TABLE_HIGHLIGHT_GAP } from '../ui/consts';

interface TableResizerProps {
  width: number;
  maxWidth: number;
  updateWidth: (width: number) => void;
  editorView: EditorView;
  getPos: () => number | undefined;
  node: PMNode;
  tableRef: HTMLTableElement;
  displayGuideline: (guideline: GuidelineConfig[]) => boolean;
}

const handles = { right: true };
const tableHandleMarginTop = 11;

export const TableResizer = ({
  children,
  width,
  maxWidth,
  updateWidth,
  editorView,
  getPos,
  node,
  tableRef,
  displayGuideline,
}: PropsWithChildren<TableResizerProps>) => {
  const currentColumnCount = getColgroupChildrenLength(node);
  const minColumnWidth =
    currentColumnCount <= 3
      ? currentColumnCount * COLUMN_MIN_WIDTH
      : 3 * COLUMN_MIN_WIDTH;

  const tableHeight = tableRef?.clientHeight;
  let handleHeightSize: HandleHeightSizeType | undefined = 'small';
  /*
    - One row table height (minimum possible table height) ~ 45px
    - Two row table height ~ 90px
    - Three row table height ~ 134px

    In the if below we need to use:
    - > 46 because the height of the table can be a float number like 45.44.
    - < 96 is the height of large resize handle.
  */
  if (tableHeight && tableHeight > 46 && tableHeight < 96) {
    handleHeightSize = 'medium';
  } else if (tableHeight && tableHeight >= 96) {
    handleHeightSize = 'large';
  }
  const currentGap = useRef(0);
  const [snappingEnabled, setSnappingEnabled] = useState(false);

  const updateActiveGuidelines = useCallback(
    ({ gap, keys }: { gap: number; keys: string[] }) => {
      if (gap !== currentGap.current) {
        currentGap.current = gap;
        displayGuideline(
          getGuidelinesWithHighlights(
            gap,
            TABLE_SNAP_GAP,
            keys,
            defaultGuidelines,
          ),
        );
      }
    },
    [displayGuideline],
  );

  const guidelineSnaps = useMemo(
    () =>
      snappingEnabled
        ? {
            x: defaultGuidelineWidths,
          }
        : undefined,
    [snappingEnabled],
  );

  const handleResizeStart = useCallback(() => {
    setSnappingEnabled(displayGuideline(defaultGuidelines));
    return width;
  }, [width, displayGuideline]);

  const handleResizeStop = useCallback<HandleResize>(
    (originalState, delta) => {
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

      // Hide guidelines when resizing stops
      displayGuideline([]);

      updateWidth(newWidth);
      return newWidth;
    },
    [updateWidth, editorView, getPos, node, tableRef, displayGuideline],
  );

  return (
    <ResizerNext
      enable={handles}
      width={width}
      handleAlignmentMethod="sticky"
      handleHeightSize={handleHeightSize}
      handleMarginTop={tableHandleMarginTop}
      handleResizeStart={handleResizeStart}
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

        updateActiveGuidelines(
          findClosestSnap(
            newWidth,
            defaultGuidelineWidths,
            defaultGuidelines,
            TABLE_HIGHLIGHT_GAP,
          ),
        );

        updateWidth(newWidth);
        return newWidth;
      })}
      handleResizeStop={handleResizeStop}
      resizeRatio={2}
      minWidth={minColumnWidth}
      maxWidth={maxWidth}
      snapGap={TABLE_SNAP_GAP}
      snap={guidelineSnaps}
    >
      {children}
    </ResizerNext>
  );
};
