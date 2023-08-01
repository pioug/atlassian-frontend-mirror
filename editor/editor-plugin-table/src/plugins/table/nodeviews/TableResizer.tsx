import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import rafSchd from 'raf-schd';

import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  TABLE_ACTION,
  TableEventPayload,
} from '@atlaskit/editor-common/analytics';
import { getGuidelinesWithHighlights } from '@atlaskit/editor-common/guideline';
import {
  HandleHeightSizeType,
  HandleResize,
  ResizerNext,
} from '@atlaskit/editor-common/resizer';
import type { GuidelineConfig } from '@atlaskit/editor-plugin-guideline';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Transaction } from '@atlaskit/editor-prosemirror/state';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables';
import { findTable } from '@atlaskit/editor-tables/utils';

import {
  COLUMN_MIN_WIDTH,
  getColgroupChildrenLength,
  hasTableBeenResized,
  previewScaleTable,
  scaleTable,
} from '../pm-plugins/table-resizing/utils';
import { pluginKey as tableWidthPluginKey } from '../pm-plugins/table-width';
import { TABLE_HIGHLIGHT_GAP, TABLE_SNAP_GAP } from '../ui/consts';
import { getTableWidth } from '../utils';
import { defaultGuidelines, defaultGuidelineWidths } from '../utils/guidelines';
import { findClosestSnap } from '../utils/snapping';
interface TableResizerProps {
  width: number;
  maxWidth: number;
  updateWidth: (width: number) => void;
  editorView: EditorView;
  getPos: () => number | undefined;
  node: PMNode;
  tableRef: HTMLTableElement;
  displayGuideline: (guideline: GuidelineConfig[]) => boolean;
  attachAnalyticsEvent: (
    payload: TableEventPayload,
  ) => ((tr: Transaction) => boolean) | undefined;
}

const handles = { right: true };
const tableHandleMarginTop = 11;

const generateResizedPayload = (props: {
  originalNode: PMNode;
  resizedNode: PMNode;
}): TableEventPayload => {
  const tableMap = TableMap.get(props.resizedNode);

  return {
    action: TABLE_ACTION.RESIZED,
    actionSubject: ACTION_SUBJECT.TABLE,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      newWidth: props.resizedNode.attrs.width,
      prevWidth: props.originalNode.attrs.width ?? null,
      nodeSize: props.resizedNode.nodeSize,
      totalTableWidth: hasTableBeenResized(props.resizedNode)
        ? getTableWidth(props.resizedNode)
        : null,
      totalRowCount: tableMap.height,
      totalColumnCount: tableMap.width,
    },
  };
};

const getResizerHandleHeight = (tableRef: HTMLTableElement) => {
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

  return handleHeightSize;
};

const getResizerMinWidth = (node: PMNode) => {
  const currentColumnCount = getColgroupChildrenLength(node);
  const minColumnWidth =
    currentColumnCount <= 3
      ? currentColumnCount * COLUMN_MIN_WIDTH
      : 3 * COLUMN_MIN_WIDTH;

  return minColumnWidth;
};

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
  attachAnalyticsEvent,
}: PropsWithChildren<TableResizerProps>) => {
  const currentGap = useRef(0);
  const [snappingEnabled, setSnappingEnabled] = useState(false);

  const resizerMinWidth = getResizerMinWidth(node);
  const handleHeightSize = getResizerHandleHeight(tableRef);

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
    const {
      dispatch,
      state: { tr },
    } = editorView;

    dispatch(tr.setMeta(tableWidthPluginKey, { resizing: true }));

    setSnappingEnabled(displayGuideline(defaultGuidelines));
  }, [displayGuideline, editorView]);

  const handleResizeStop = useCallback<HandleResize>(
    (originalState, delta) => {
      const newWidth = originalState.width + delta.width;
      const { state, dispatch } = editorView;
      const pos = getPos();

      let tr = state.tr.setMeta(tableWidthPluginKey, { resizing: false });

      if (typeof pos === 'number') {
        tr = tr.setNodeMarkup(pos, undefined, {
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

        const scaledNode = tr.doc.nodeAt(pos)!;

        attachAnalyticsEvent(
          generateResizedPayload({
            originalNode: node,
            resizedNode: scaledNode,
          }),
        )?.(tr);
      }

      dispatch(tr);

      // Hide guidelines when resizing stops
      displayGuideline([]);
      updateWidth(newWidth);

      return newWidth;
    },
    [
      updateWidth,
      editorView,
      getPos,
      node,
      tableRef,
      displayGuideline,
      attachAnalyticsEvent,
    ],
  );

  const handleResize = useCallback(
    (originalState, delta) => {
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
    },
    [editorView, getPos, node, tableRef, updateWidth, updateActiveGuidelines],
  );

  const scheduleResize = useMemo(() => rafSchd(handleResize), [handleResize]);

  return (
    <ResizerNext
      enable={handles}
      width={width}
      handleAlignmentMethod="sticky"
      handleHeightSize={handleHeightSize}
      handleMarginTop={tableHandleMarginTop}
      handleResizeStart={handleResizeStart}
      handleResize={scheduleResize}
      handleResizeStop={handleResizeStop}
      resizeRatio={2}
      minWidth={resizerMinWidth}
      maxWidth={maxWidth}
      snapGap={TABLE_SNAP_GAP}
      snap={guidelineSnaps}
      handlePositioning="adjacent"
      isHandleVisible={findTable(editorView.state?.selection)?.pos === getPos()}
    >
      {children}
    </ResizerNext>
  );
};
