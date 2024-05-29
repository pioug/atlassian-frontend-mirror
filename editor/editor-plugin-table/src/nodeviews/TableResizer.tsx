import type { PropsWithChildren } from 'react';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import rafSchd from 'raf-schd';
import { useIntl } from 'react-intl-next';

import type { TableEventPayload } from '@atlaskit/editor-common/analytics';
import { TABLE_OVERFLOW_CHANGE_TRIGGER } from '@atlaskit/editor-common/analytics';
import { getGuidelinesWithHighlights } from '@atlaskit/editor-common/guideline';
import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import {
  focusTableResizer,
  ToolTipContent,
} from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import type { HandleResize, HandleSize } from '@atlaskit/editor-common/resizer';
import { ResizerNext } from '@atlaskit/editor-common/resizer';
import { browser } from '@atlaskit/editor-common/utils';
import { chainCommands } from '@atlaskit/editor-prosemirror/commands';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { findTable } from '@atlaskit/editor-tables/utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import {
  setTableAlignmentWithTableContentWithPos,
  updateWidthToWidest,
} from '../commands/misc';
import { META_KEYS } from '../pm-plugins/table-analytics';
import {
  COLUMN_MIN_WIDTH,
  getColgroupChildrenLength,
  previewScaleTable,
  scaleTable,
  TABLE_MAX_WIDTH,
} from '../pm-plugins/table-resizing/utils';
import { pluginKey as tableWidthPluginKey } from '../pm-plugins/table-width';
import type { PluginInjectionAPI, TableSharedStateInternal } from '../types';
import {
  TABLE_GUIDELINE_VISIBLE_ADJUSTMENT,
  TABLE_HIGHLIGHT_GAP,
  TABLE_HIGHLIGHT_TOLERANCE,
  TABLE_SNAP_GAP,
} from '../ui/consts';
import {
  ALIGN_CENTER,
  ALIGN_START,
  normaliseAlignment,
} from '../utils/alignment';
import {
  generateResizedPayload,
  generateResizeFrameRatePayloads,
  useMeasureFramerate,
} from '../utils/analytics';
import {
  defaultGuidelines,
  defaultGuidelinesForPreserveTable,
} from '../utils/guidelines';
import {
  defaultSnappingWidths,
  defaultTablePreserveSnappingWidths,
  findClosestSnap,
} from '../utils/snapping';

interface TableResizerProps {
  width: number;
  maxWidth: number;
  containerWidth: number;
  lineLength: number;
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
  pluginInjectionApi?: PluginInjectionAPI;
  isTableScalingEnabled?: boolean;
  isTableAlignmentEnabled?: boolean;
  isWholeTableInDanger?: boolean;
}

export interface TableResizerImprovementProps extends TableResizerProps {
  onResizeStop?: () => void;
  onResizeStart?: () => void;
}

type ResizerNextHandler = React.ElementRef<typeof ResizerNext>;

const RESIZE_STEP_VALUE = 10;

const FULL_WIDTH_EDITOR_CONTENT_WIDTH = 1800;

const handles = { right: true };
const handleStyles = {
  right: {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
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
  const minColumnWidth = Math.min(3, currentColumnCount) * COLUMN_MIN_WIDTH;
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
  lineLength,
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
  isTableScalingEnabled,
  isTableAlignmentEnabled,
  isWholeTableInDanger,
  pluginInjectionApi,
}: PropsWithChildren<TableResizerImprovementProps>) => {
  const currentGap = useRef(0);
  // track resizing state - use ref over state to avoid re-render
  const isResizing = useRef(false);
  const areResizeMetaKeysPressed = useRef(false);
  const resizerRef = useRef<ResizerNextHandler>(null);
  const { tableState } = useSharedPluginState(pluginInjectionApi, ['table']);
  const { widthToWidest } = tableState as TableSharedStateInternal;

  // used to reposition tooltip when table is resizing via keyboard
  const updateTooltip = React.useRef<() => void>();
  const [snappingEnabled, setSnappingEnabled] = useState(false);

  const { formatMessage } = useIntl();

  const isTableSelected =
    findTable(editorView.state?.selection)?.pos === getPos();

  const resizerMinWidth = getResizerMinWidth(node);
  const handleSize = getResizerHandleHeight(tableRef);

  const { startMeasure, endMeasure, countFrames } = useMeasureFramerate();

  const excludeGuidelineConfig = useMemo(
    () => ({
      innerGuidelines: !!isTableAlignmentEnabled,
      breakoutPoints: !!(
        isTableAlignmentEnabled && tableState?.isFullWidthModeEnabled
      ),
    }),
    [tableState, isTableAlignmentEnabled],
  );

  const updateActiveGuidelines = useCallback(
    ({ gap, keys }: { gap: number; keys: string[] }) => {
      if (gap !== currentGap.current) {
        currentGap.current = gap;
        const visibleGuidelines = getVisibleGuidelines(
          isTableScalingEnabled
            ? defaultGuidelinesForPreserveTable(
                containerWidth,
                excludeGuidelineConfig,
              )
            : defaultGuidelines,
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
    [
      isTableScalingEnabled,
      excludeGuidelineConfig,
      containerWidth,
      displayGuideline,
    ],
  );

  const guidelineSnaps = useMemo(
    () =>
      snappingEnabled
        ? {
            x: isTableScalingEnabled
              ? defaultTablePreserveSnappingWidths(
                  containerWidth,
                  excludeGuidelineConfig,
                )
              : defaultSnappingWidths,
          }
        : undefined,
    [
      snappingEnabled,
      isTableScalingEnabled,
      excludeGuidelineConfig,
      containerWidth,
    ],
  );

  const switchToCenterAlignment = useCallback(
    (pos, node, newWidth, state, dispatch) => {
      if (
        isTableAlignmentEnabled &&
        node &&
        node.attrs.layout === ALIGN_START &&
        newWidth > lineLength &&
        lineLength < FULL_WIDTH_EDITOR_CONTENT_WIDTH && // We don't want to switch alignment in Full-width editor
        isResizing.current
      ) {
        const tableNodeWithPos = { pos, node };
        const tr = setTableAlignmentWithTableContentWithPos(
          ALIGN_CENTER,
          tableNodeWithPos,
        )(state);

        if (tr) {
          dispatch(tr);
        }

        return true;
      }

      return false;
    },
    [lineLength, isTableAlignmentEnabled, isResizing],
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
        tr.setMeta(tableWidthPluginKey, {
          resizing: false,
          tableLocalId: '',
          tableRef: null,
        });
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

    tr.setMeta(tableWidthPluginKey, {
      resizing: true,
      tableLocalId: node.attrs.localId,
      tableRef: tableRef,
    });
    tr.setMeta(META_KEYS.OVERFLOW_TRIGGER, {
      name: TABLE_OVERFLOW_CHANGE_TRIGGER.RESIZED,
    });

    dispatch(tr);

    const visibleGuidelines = getVisibleGuidelines(
      isTableScalingEnabled
        ? defaultGuidelinesForPreserveTable(
            containerWidth,
            excludeGuidelineConfig,
          )
        : defaultGuidelines,
      containerWidth,
    );

    setSnappingEnabled(displayGuideline(visibleGuidelines));
    if (onResizeStart) {
      onResizeStart();
    }
  }, [
    startMeasure,
    editorView,
    displayGapCursor,
    node.attrs.localId,
    tableRef,
    isTableScalingEnabled,
    excludeGuidelineConfig,
    containerWidth,
    displayGuideline,
    onResizeStart,
  ]);

  const handleResize = useCallback(
    (originalState: any, delta: any) => {
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
        isTableScalingEnabled,
      );

      const closestSnap = findClosestSnap(
        newWidth,
        isTableScalingEnabled
          ? defaultTablePreserveSnappingWidths(
              containerWidth,
              excludeGuidelineConfig,
            )
          : defaultSnappingWidths,
        isTableScalingEnabled
          ? defaultGuidelinesForPreserveTable(
              containerWidth,
              excludeGuidelineConfig,
            )
          : defaultGuidelines,
        TABLE_HIGHLIGHT_GAP,
        TABLE_HIGHLIGHT_TOLERANCE,
      );

      updateActiveGuidelines(closestSnap);

      // When snapping to the full width guideline, resize the table to be 1800px
      const { state, dispatch } = editorView;
      const currentTableNodeLocalId = node?.attrs?.localId ?? '';

      const fullWidthGuideline = defaultGuidelinesForPreserveTable(
        containerWidth,
        excludeGuidelineConfig,
      ).filter((guideline) => guideline.isFullWidth)[0];

      const isFullWidthGuidelineActive = closestSnap.keys.includes(
        fullWidthGuideline.key,
      );
      const shouldUpdateWidthToWidest =
        !!isTableScalingEnabled && isFullWidthGuidelineActive;

      chainCommands(
        (state, dispatch) => {
          return switchToCenterAlignment(pos, node, newWidth, state, dispatch);
        },
        updateWidthToWidest({
          [currentTableNodeLocalId]: shouldUpdateWidthToWidest,
        }),
      )(state, dispatch);

      updateWidth(shouldUpdateWidthToWidest ? TABLE_MAX_WIDTH : newWidth);

      return newWidth;
    },
    [
      countFrames,
      isTableScalingEnabled,
      excludeGuidelineConfig,
      tableRef,
      node,
      editorView,
      updateActiveGuidelines,
      containerWidth,
      updateWidth,
      getPos,
      switchToCenterAlignment,
    ],
  );

  const scheduleResize = useMemo(() => rafSchd(handleResize), [handleResize]);

  const handleResizeStop = useCallback<HandleResize>(
    (originalState, delta) => {
      isResizing.current = false;
      let newWidth = originalState.width + delta.width;
      const { state, dispatch } = editorView;
      const pos = getPos();
      const currentTableNodeLocalId = node?.attrs?.localId ?? '';
      newWidth =
        widthToWidest &&
        currentTableNodeLocalId &&
        widthToWidest[currentTableNodeLocalId]
          ? TABLE_MAX_WIDTH
          : newWidth;

      let tr = state.tr.setMeta(tableWidthPluginKey, {
        resizing: false,
        tableLocalId: '',
        tableRef: null,
      });
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
          isTableScalingEnabled,
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

      if (getBooleanFF('platform.editor.a11y-table-resizing_uapcv')) {
        if (delta.width < 0) {
          pluginInjectionApi?.accessibilityUtils?.actions.ariaNotify(
            formatMessage(messages.tableSizeDecreaseScreenReaderInformation, {
              newWidth: newWidth,
            }),
          );
        } else if (delta.width > 0) {
          pluginInjectionApi?.accessibilityUtils?.actions.ariaNotify(
            formatMessage(messages.tableSizeIncreaseScreenReaderInformation, {
              newWidth: newWidth,
            }),
          );
        }
      }

      // Hide guidelines when resizing stops
      displayGuideline([]);
      updateWidth(newWidth);
      scheduleResize.cancel();

      if (onResizeStop) {
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
      isTableScalingEnabled,
      widthToWidest,
      formatMessage,
      pluginInjectionApi,
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

  const resizeRatio =
    !isTableAlignmentEnabled ||
    (isTableAlignmentEnabled &&
      normaliseAlignment(node.attrs.layout) === ALIGN_CENTER)
      ? 2
      : 1;

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
        resizeRatio={resizeRatio}
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
    </>
  );
};
