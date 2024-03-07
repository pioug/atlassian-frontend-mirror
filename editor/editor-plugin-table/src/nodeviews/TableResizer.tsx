import type { PropsWithChildren } from 'react';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import debounce from 'lodash/debounce';
import rafSchd from 'raf-schd';
import { useIntl } from 'react-intl-next';

import type { TableEventPayload } from '@atlaskit/editor-common/analytics';
import { TABLE_OVERFLOW_CHANGE_TRIGGER } from '@atlaskit/editor-common/analytics';
import { getGuidelinesWithHighlights } from '@atlaskit/editor-common/guideline';
import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import {
  focusTableResizer,
  ToolTipContent,
} from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import type { HandleResize, HandleSize } from '@atlaskit/editor-common/resizer';
import { ResizerNext } from '@atlaskit/editor-common/resizer';
import { browser } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { findTable } from '@atlaskit/editor-tables/utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { getPluginState } from '../pm-plugins/plugin-factory';
import { META_KEYS } from '../pm-plugins/table-analytics';
import {
  COLUMN_MIN_WIDTH,
  getColgroupChildrenLength,
  previewScaleTable,
  scaleTable,
} from '../pm-plugins/table-resizing/utils';
import { pluginKey as tableWidthPluginKey } from '../pm-plugins/table-width';
import {
  TABLE_GUIDELINE_VISIBLE_ADJUSTMENT,
  TABLE_HIGHLIGHT_GAP,
  TABLE_HIGHLIGHT_TOLERANCE,
  TABLE_SNAP_GAP,
} from '../ui/consts';
import {
  generateResizedPayload,
  generateResizeFrameRatePayloads,
  useMeasureFramerate,
} from '../utils/analytics';
import { defaultGuidelines } from '../utils/guidelines';
import { defaultSnappingWidths, findClosestSnap } from '../utils/snapping';

interface TableResizerProps {
  width: number;
  maxWidth: number;
  containerWidth: number;
  updateWidth: (width: number) => void;
  editorView: EditorView;
  getPos: () => number | undefined;
  node: PMNode;
  tableRef: HTMLTableElement;
  displayGuideline: (guideline: GuidelineConfig[]) => boolean;
  attachAnalyticsEvent: (
    payload: TableEventPayload,
  ) => ((tr: Transaction) => boolean) | undefined;
  displayGapCursor: (toggle: boolean) => boolean;
  tablePreserveWidth?: boolean;
}

export interface TableResizerImprovementProps extends TableResizerProps {
  onResizeStop?: () => void;
  onResizeStart?: () => void;
}

type ResizerNextHandler = React.ElementRef<typeof ResizerNext>;

type ResizeAction = 'increase' | 'decrease' | 'none';

const DEBOUNCE_TIME_FOR_SCREEN_READER_ANNOUNCER = 1000;
const RESIZE_STEP_VALUE = 10;

const handles = { right: true };
const handleStyles = {
  right: {
    // eslint-disable-next-line
    right: '-14px',
    marginTop: token('space.150', '12px'),
  },
};

const getResizerHandleHeight = (
  tableRef: HTMLTableElement | undefined,
): HandleSize | undefined => {
  const tableHeight = tableRef?.clientHeight ?? 0;
  /*
    - One row table height (minimum possible table height) ~ 45px
    - Two row table height ~ 90px
    - Three row table height ~ 134px

    In the if below we need to use:
    - > 46 because the height of the table can be a float number like 45.44.
    - < 96 is the height of large resize handle.
  */
  if (tableHeight >= 96) {
    return 'large';
  }

  if (tableHeight > 46) {
    return 'medium';
  }

  return 'small';
};

const getResizerMinWidth = (node: PMNode) => {
  const currentColumnCount = getColgroupChildrenLength(node);
  const minColumnWidth =
    currentColumnCount <= 3
      ? currentColumnCount * COLUMN_MIN_WIDTH
      : 3 * COLUMN_MIN_WIDTH;
  // add an extra pixel as the scale table logic will scale columns to be tableContainerWidth - 1
  // the table can't scale past its min-width, so instead restrict table container min width to avoid that situation
  return minColumnWidth + 1;
};

/**
 * When guidelines are outside the viewport, filter them out, do not show
 * So the guideline container won't make the fabric-editor-popup-scroll-parent overflow
 * @param guidelines
 * @param containerWidth editorWidth
 */
const getVisibleGuidelines = (
  guidelines: GuidelineConfig[],
  containerWidth: number,
) => {
  return guidelines.filter((guideline) => {
    return (
      guideline.position &&
      guideline.position.x !== undefined &&
      typeof guideline.position.x === 'number' &&
      Math.abs(guideline.position.x * 2) <
        containerWidth + TABLE_GUIDELINE_VISIBLE_ADJUSTMENT
    );
  });
};

export const TableResizer = ({
  children,
  width,
  maxWidth,
  containerWidth,
  updateWidth,
  onResizeStop,
  onResizeStart,
  editorView,
  getPos,
  node,
  tableRef,
  displayGuideline,
  attachAnalyticsEvent,
  displayGapCursor,
  tablePreserveWidth,
}: PropsWithChildren<TableResizerImprovementProps>) => {
  const currentGap = useRef(0);
  // track resizing state - use ref over state to avoid re-render
  const isResizing = useRef(false);
  const areResizeMetaKeysPressed = useRef(false);

  const resizerRef = useRef<ResizerNextHandler>(null);

  // used to reposition tooltip when table is resizing via keyboard
  const updateTooltip = React.useRef<() => void>();
  const [snappingEnabled, setSnappingEnabled] = useState(false);

  // we don't want to update aria-live region on each width change, it might provide bad experience for screen reader users
  const [screenReaderResizeInformation, setScreenReaderResizeInformation] =
    useState<{
      type: ResizeAction;
      width: number;
    }>({
      type: 'none',
      width,
    });

  const { formatMessage } = useIntl();
  const screenReaderResizeAnnouncerMessages = {
    increase: formatMessage(messages.tableSizeIncreaseScreenReaderInformation, {
      newWidth: screenReaderResizeInformation.width,
    }),
    decrease: formatMessage(messages.tableSizeDecreaseScreenReaderInformation, {
      newWidth: screenReaderResizeInformation.width,
    }),
    none: '',
  };

  const isTableSelected =
    findTable(editorView.state?.selection)?.pos === getPos();

  const resizerMinWidth = getResizerMinWidth(node);
  const handleSize = getResizerHandleHeight(tableRef);
  const { isWholeTableInDanger } = getPluginState(editorView.state);

  const { startMeasure, endMeasure, countFrames } = useMeasureFramerate();

  const updateActiveGuidelines = useCallback(
    ({ gap, keys }: { gap: number; keys: string[] }) => {
      if (gap !== currentGap.current) {
        currentGap.current = gap;
        const visibleGuidelines = getVisibleGuidelines(
          defaultGuidelines,
          containerWidth,
        );
        displayGuideline(
          getGuidelinesWithHighlights(
            gap,
            TABLE_SNAP_GAP,
            keys,
            visibleGuidelines,
          ),
        );
      }
    },
    [displayGuideline, containerWidth],
  );

  const guidelineSnaps = useMemo(
    () =>
      snappingEnabled
        ? {
            x: defaultSnappingWidths,
          }
        : undefined,
    [snappingEnabled],
  );

  useEffect(() => {
    return () => {
      // only bring back the cursor if this table was deleted - i.e. if a user was resizing, then another
      // deleted this table
      if (isResizing.current) {
        const {
          dispatch,
          state: { tr },
        } = editorView;
        displayGapCursor(true);
        displayGuideline([]);
        tr.setMeta(tableWidthPluginKey, { resizing: false });
        dispatch(tr);
      }
    };
  }, [editorView, displayGuideline, displayGapCursor]);

  const handleResizeStart = useCallback(() => {
    startMeasure();
    isResizing.current = true;
    const {
      dispatch,
      state: { tr },
    } = editorView;
    displayGapCursor(false);
    tr.setMeta(tableWidthPluginKey, { resizing: true });
    tr.setMeta(META_KEYS.OVERFLOW_TRIGGER, {
      name: TABLE_OVERFLOW_CHANGE_TRIGGER.RESIZED,
    });

    dispatch(tr);

    const visibleGuidelines = getVisibleGuidelines(
      defaultGuidelines,
      containerWidth,
    );
    setSnappingEnabled(displayGuideline(visibleGuidelines));
    if (
      getBooleanFF('platform.editor.resizing-table-height-improvement') &&
      onResizeStart
    ) {
      onResizeStart();
    }
  }, [
    displayGapCursor,
    displayGuideline,
    editorView,
    startMeasure,
    onResizeStart,
    containerWidth,
  ]);

  const handleResize = useCallback(
    (originalState, delta) => {
      countFrames();
      const newWidth = originalState.width + delta.width;
      let pos: number | undefined;
      try {
        pos = getPos();
      } catch (e) {
        return;
      }
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
        tablePreserveWidth,
      );

      updateActiveGuidelines(
        findClosestSnap(
          newWidth,
          defaultSnappingWidths,
          defaultGuidelines,
          TABLE_HIGHLIGHT_GAP,
          TABLE_HIGHLIGHT_TOLERANCE,
        ),
      );

      updateWidth(newWidth);

      return newWidth;
    },
    [
      editorView,
      getPos,
      node,
      tableRef,
      updateWidth,
      updateActiveGuidelines,
      countFrames,
      tablePreserveWidth,
    ],
  );

  const scheduleResize = useMemo(() => rafSchd(handleResize), [handleResize]);

  const handleResizeStop = useCallback<HandleResize>(
    (originalState, delta) => {
      isResizing.current = false;
      const newWidth = originalState.width + delta.width;
      const { state, dispatch } = editorView;
      const pos = getPos();

      let tr = state.tr.setMeta(tableWidthPluginKey, { resizing: false });
      const frameRateSamples = endMeasure();

      if (frameRateSamples.length > 0) {
        const resizeFrameRatePayloads = generateResizeFrameRatePayloads({
          docSize: state.doc.nodeSize,
          frameRateSamples,
          originalNode: node,
        });
        resizeFrameRatePayloads.forEach((payload) => {
          attachAnalyticsEvent(payload)?.(tr);
        });
      }

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
          tablePreserveWidth,
        )(tr);

        const scaledNode = tr.doc.nodeAt(pos)!;

        attachAnalyticsEvent(
          generateResizedPayload({
            originalNode: node,
            resizedNode: scaledNode,
          }),
        )?.(tr);
      }
      displayGapCursor(true);
      dispatch(tr);

      // Hide guidelines when resizing stops
      displayGuideline([]);
      updateWidth(newWidth);
      scheduleResize.cancel();

      if (
        getBooleanFF('platform.editor.resizing-table-height-improvement') &&
        onResizeStop
      ) {
        onResizeStop();
      }

      return newWidth;
    },
    [
      displayGapCursor,
      updateWidth,
      editorView,
      getPos,
      node,
      tableRef,
      scheduleResize,
      displayGuideline,
      attachAnalyticsEvent,
      endMeasure,
      onResizeStop,
      tablePreserveWidth,
    ],
  );

  const handleTableSizeChangeOnKeypress = useCallback(
    (step: number) => {
      const newWidth = width + step;

      if (newWidth > maxWidth || newWidth < resizerMinWidth) {
        return;
      }
      handleResizeStop(
        { width: width, x: 0, y: 0, height: 0 },
        { width: step, height: 0 },
      );
    },
    [width, handleResizeStop, maxWidth, resizerMinWidth],
  );

  const handleEscape = useCallback((): void => {
    editorView?.focus();
  }, [editorView]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      const isBracketKey =
        event.code === 'BracketRight' || event.code === 'BracketLeft';

      const metaKey = browser.mac ? event.metaKey : event.ctrlKey;

      if (event.altKey || metaKey || event.shiftKey) {
        areResizeMetaKeysPressed.current = true;
      }

      if (event.altKey && metaKey) {
        if (isBracketKey) {
          event.preventDefault();
          handleTableSizeChangeOnKeypress(
            event.code === 'BracketRight'
              ? RESIZE_STEP_VALUE
              : -RESIZE_STEP_VALUE,
          );
        }
      } else if (!areResizeMetaKeysPressed.current) {
        handleEscape();
      }
    },
    [handleEscape, handleTableSizeChangeOnKeypress],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent): void => {
      if (event.altKey || event.metaKey) {
        areResizeMetaKeysPressed.current = false;
      }
      return;
    },
    [areResizeMetaKeysPressed],
  );

  useLayoutEffect(() => {
    if (getBooleanFF('platform.editor.a11y-table-resizing_uapcv')) {
      if (!resizerRef.current) {
        return;
      }
      const resizeHandleThumbEl = resizerRef.current.getResizerThumbEl();

      const globalKeyDownHandler = (event: KeyboardEvent): void => {
        const metaKey = browser.mac ? event.metaKey : event.ctrlKey;

        if (!isTableSelected) {
          return;
        }
        if (
          event.altKey &&
          event.shiftKey &&
          metaKey &&
          event.code === 'KeyR'
        ) {
          event.preventDefault();

          if (!resizeHandleThumbEl) {
            return;
          }
          resizeHandleThumbEl.focus();
          resizeHandleThumbEl.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        }
      };

      const editorViewDom = editorView?.dom as HTMLElement | undefined;
      editorViewDom?.addEventListener('keydown', globalKeyDownHandler);
      resizeHandleThumbEl?.addEventListener('keydown', handleKeyDown);
      resizeHandleThumbEl?.addEventListener('keyup', handleKeyUp);
      return () => {
        editorViewDom?.removeEventListener('keydown', globalKeyDownHandler);
        resizeHandleThumbEl?.removeEventListener('keydown', handleKeyDown);
        resizeHandleThumbEl?.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [
    resizerRef,
    editorView,
    handleResizeStop,
    isTableSelected,
    handleKeyDown,
    handleKeyUp,
  ]);

  useLayoutEffect(() => {
    if (getBooleanFF('platform.editor.a11y-table-resizing_uapcv')) {
      updateTooltip.current?.();
    }
  }, [width]);

  useEffect(() => {
    if (getBooleanFF('platform.editor.a11y-table-resizing_uapcv')) {
      const debouncedSetWidth = debounce(
        setScreenReaderResizeInformation,
        DEBOUNCE_TIME_FOR_SCREEN_READER_ANNOUNCER,
      );
      debouncedSetWidth((prevState) => {
        let type: ResizeAction = 'none';
        if (prevState.width > width) {
          type = 'decrease';
        }

        if (prevState.width < width) {
          type = 'increase';
        }

        return {
          type,
          width,
        };
      });

      return () => {
        debouncedSetWidth.cancel();
      };
    }
  }, [width]);

  return (
    <>
      <ResizerNext
        ref={resizerRef}
        enable={handles}
        width={width}
        handleAlignmentMethod="sticky"
        handleSize={handleSize}
        handleStyles={handleStyles}
        handleResizeStart={handleResizeStart}
        handleResize={scheduleResize}
        handleResizeStop={handleResizeStop}
        resizeRatio={2}
        minWidth={resizerMinWidth}
        maxWidth={maxWidth}
        snapGap={TABLE_SNAP_GAP}
        snap={guidelineSnaps}
        handlePositioning="adjacent"
        isHandleVisible={isTableSelected}
        needExtendedResizeZone={!isTableSelected}
        appearance={
          isTableSelected && isWholeTableInDanger ? 'danger' : undefined
        }
        handleHighlight="shadow"
        handleTooltipContent={
          getBooleanFF('platform.editor.a11y-table-resizing_uapcv')
            ? ({ update }) => {
                updateTooltip.current = update;
                return (
                  <ToolTipContent
                    description={formatMessage(messages.resizeTable)}
                    keymap={focusTableResizer}
                  />
                );
              }
            : formatMessage(messages.resizeTable)
        }
      >
        {children}
      </ResizerNext>
      {getBooleanFF('platform.editor.a11y-table-resizing_uapcv') && (
        <div className="assistive" role="status">
          {
            screenReaderResizeAnnouncerMessages[
              screenReaderResizeInformation.type
            ]
          }
        </div>
      )}
    </>
  );
};
