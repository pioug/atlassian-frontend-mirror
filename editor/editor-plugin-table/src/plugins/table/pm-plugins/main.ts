import type { IntlShape } from 'react-intl-next';

import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type {
  DispatchAnalyticsEvent,
  EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import { insideTable } from '@atlaskit/editor-common/core-utils';
import type {
  Dispatch,
  EventDispatcher,
} from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  transformSliceToRemoveOpenBodiedExtension,
  transformSliceToRemoveOpenExpand,
  transformSliceToRemoveOpenLayoutNodes,
} from '@atlaskit/editor-common/transforms';
import type {
  GetEditorContainerWidth,
  GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';
import { browser, closestElement } from '@atlaskit/editor-common/utils';
import type {
  EditorState,
  TextSelection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import {
  findParentDomRefOfType,
  findParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { findTable } from '@atlaskit/editor-tables/utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import {
  addBoldInEmptyHeaderCells,
  clearHoverSelection,
  setTableRef,
} from '../commands';
import {
  removeResizeHandleDecorations,
  transformSliceRemoveCellBackgroundColor,
  transformSliceToAddTableHeaders,
  transformSliceToRemoveColumnsWidths,
} from '../commands/misc';
import {
  handleBlur,
  handleClick,
  handleCut,
  handleFocus,
  handleMouseDown,
  handleMouseLeave,
  handleMouseMove,
  handleMouseOut,
  handleMouseOver,
  handleTripleClick,
  whenTableInFocus,
  withCellTracking,
} from '../event-handlers';
import { createTableView } from '../nodeviews/table';
import TableCell from '../nodeviews/TableCell';
import TableRow from '../nodeviews/TableRow';
import { pluginKey as decorationsPluginKey } from '../pm-plugins/decorations/plugin';
import { fixTables, replaceSelectedTable } from '../transforms';
import type {
  ElementContentRects,
  InvalidNodeAttr,
  PluginConfig,
  PluginInjectionAPI,
} from '../types';
import { TableCssClassName as ClassName } from '../types';
import {
  findControlsHoverDecoration,
  transformSliceToCorrectEmptyTableCells,
  transformSliceToFixHardBreakProblemOnCopyFromCell,
  transformSliceToRemoveOpenTable,
  updateResizeHandles,
} from '../utils';
import { isHeaderRowRequired } from '../utils/paste';

import {
  defaultHoveredCell,
  defaultTableSelection,
} from './default-table-selection';
import { createPluginState, getPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';

export const createPlugin = (
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  dispatch: Dispatch,
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  pluginConfig: PluginConfig,
  getEditorContainerWidth: GetEditorContainerWidth,
  getEditorFeatureFlags: GetEditorFeatureFlags,
  getIntl: () => IntlShape,
  breakoutEnabled?: boolean,
  tableResizingEnabled?: boolean,
  fullWidthModeEnabled?: boolean,
  previousFullWidthModeEnabled?: boolean,
  dragAndDropEnabled?: boolean,
  editorAnalyticsAPI?: EditorAnalyticsAPI,
  pluginInjectionApi?: PluginInjectionAPI,
) => {
  const state = createPluginState(dispatch, {
    pluginConfig,
    insertColumnButtonIndex: undefined,
    insertRowButtonIndex: undefined,
    isFullWidthModeEnabled: fullWidthModeEnabled,
    isBreakoutEnabled: breakoutEnabled,
    wasFullWidthModeEnabled: previousFullWidthModeEnabled,
    isTableResizingEnabled: tableResizingEnabled,
    isHeaderRowEnabled: !!pluginConfig.allowHeaderRow,
    isHeaderColumnEnabled: false,
    isDragAndDropEnabled: dragAndDropEnabled,
    ...defaultHoveredCell,
    ...defaultTableSelection,
    getIntl,
  });

  let elementContentRects: ElementContentRects = {};

  const observer = window?.ResizeObserver
    ? new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.target.id) {
            return;
          }
          elementContentRects[entry.target.id] = entry.contentRect;
        });
      })
    : undefined;

  // Used to prevent invalid table cell spans being reported more than once per editor/document
  const invalidTableIds: string[] = [];
  let editorViewRef: EditorView | null = null;
  const getCurrentEditorState = (): EditorState | null => {
    const editorView = editorViewRef;
    if (!editorView) {
      return null;
    }

    return editorView.state;
  };
  return new SafePlugin({
    state: state,
    key: pluginKey,
    appendTransaction: (
      transactions: readonly Transaction[],
      oldState: EditorState,
      newState: EditorState,
    ) => {
      const tr = transactions.find((tr) => tr.getMeta('uiEvent') === 'cut');

      function reportInvalidTableCellSpanAttrs(
        invalidNodeAttr: InvalidNodeAttr,
      ) {
        if (invalidTableIds.find((id) => id === invalidNodeAttr.tableLocalId)) {
          return;
        }

        invalidTableIds.push(invalidNodeAttr.tableLocalId);

        dispatchAnalyticsEvent({
          action: ACTION.INVALID_DOCUMENT_ENCOUNTERED,
          actionSubject: ACTION_SUBJECT.EDITOR,
          eventType: EVENT_TYPE.OPERATIONAL,
          attributes: {
            nodeType: invalidNodeAttr.nodeType,
            reason: `${invalidNodeAttr.attribute}: ${invalidNodeAttr.reason}`,
            tableLocalId: invalidNodeAttr.tableLocalId,
            spanValue: invalidNodeAttr.spanValue,
          },
        });
      }

      if (tr) {
        // "fixTables" removes empty rows as we don't allow that in schema
        const updatedTr = handleCut(
          tr,
          oldState,
          newState,
          editorAnalyticsAPI,
          editorViewRef || undefined,
        );
        return fixTables(updatedTr) || updatedTr;
      }
      if (transactions.find((tr) => tr.docChanged)) {
        return fixTables(newState.tr, reportInvalidTableCellSpanAttrs);
      }
    },
    view: (editorView: EditorView) => {
      const domAtPos = editorView.domAtPos.bind(editorView);
      editorViewRef = editorView;

      return {
        update: (view: EditorView) => {
          const { state, dispatch } = view;
          const { selection } = state;
          const pluginState = getPluginState(state);
          let tableRef: HTMLTableElement | undefined;
          let tableNode;
          if (pluginState.editorHasFocus) {
            const parent = findParentDomRefOfType(
              state.schema.nodes.table,
              domAtPos,
            )(selection);
            if (parent) {
              tableRef =
                (parent as HTMLElement).querySelector<HTMLTableElement>(
                  'table',
                ) || undefined;
            }

            tableNode = findTable(state.selection);
          }

          if (pluginState.tableRef !== tableRef) {
            setTableRef(tableRef)(state, dispatch);
          }

          // Removes updateResizeHandles
          if (
            getBooleanFF(
              'platform.editor.table-remove-update-resize-handles_djvab',
            )
          ) {
          } else {
            if (pluginState.tableNode !== tableNode) {
              updateResizeHandles(tableRef);
            }
          }

          if (pluginState.editorHasFocus && pluginState.tableRef) {
            const { $cursor } = state.selection as TextSelection;
            if ($cursor) {
              // Only update bold when it's a cursor
              const tableCellHeader = findParentNodeOfType(
                state.schema.nodes.tableHeader,
              )(state.selection);

              if (tableCellHeader) {
                addBoldInEmptyHeaderCells(tableCellHeader)(state, dispatch);
              }
            }
          } else if (pluginState.isResizeHandleWidgetAdded) {
            removeResizeHandleDecorations()(state, dispatch);
          }
        },
        destroy: () => {
          if (observer) {
            observer.disconnect();
          }
        },
      };
    },
    props: {
      transformPasted(slice) {
        const editorState = getCurrentEditorState();
        if (!editorState) {
          return slice;
        }

        const { schema } = editorState;

        // if we're pasting to outside a table or outside a table
        // header, ensure that we apply any table headers to the first
        // row of content we see, if required
        if (!insideTable(editorState) && isHeaderRowRequired(editorState)) {
          slice = transformSliceToAddTableHeaders(slice, schema);
        }

        slice = transformSliceToFixHardBreakProblemOnCopyFromCell(
          slice,
          schema,
        );

        // We do this separately, so it also applies to drag/drop events
        // This needs to go before `transformSliceToRemoveOpenExpand`
        slice = transformSliceToRemoveOpenLayoutNodes(slice, schema);

        // If a partial paste of expand, paste only the content
        // This needs to go before `transformSliceToRemoveOpenTable`
        slice = transformSliceToRemoveOpenExpand(slice, schema);

        /** If a partial paste of table, paste only table's content */
        slice = transformSliceToRemoveOpenTable(slice, schema);

        /** If a partial paste of bodied extension, paste only text */
        slice = transformSliceToRemoveOpenBodiedExtension(slice, schema);

        slice = transformSliceToCorrectEmptyTableCells(slice, schema);

        if (!pluginConfig.allowColumnResizing) {
          slice = transformSliceToRemoveColumnsWidths(slice, schema);
        }

        // If we don't allow background on cells, we need to remove it
        // from the paste slice
        if (!pluginConfig.allowBackgroundColor) {
          slice = transformSliceRemoveCellBackgroundColor(slice, schema);
        }

        return slice;
      },
      handleClick: ({ state, dispatch }, _pos, event: MouseEvent) => {
        const decorationSet = decorationsPluginKey.getState(state);
        if (findControlsHoverDecoration(decorationSet).length) {
          clearHoverSelection()(state, dispatch);
        }

        // ED-6069: workaround for Chrome given a regression introduced in prosemirror-view@1.6.8
        // Returning true prevents that updateSelection() is getting called in the commit below:
        // @see https://github.com/ProseMirror/prosemirror-view/commit/33fe4a8b01584f6b4103c279033dcd33e8047b95
        if (browser.chrome && event.target) {
          const targetClassList = (event.target as HTMLElement).classList;

          if (
            targetClassList.contains(ClassName.CONTROLS_BUTTON) ||
            targetClassList.contains(ClassName.CONTEXTUAL_MENU_BUTTON)
          ) {
            return true;
          }
        }

        return false;
      },
      handleScrollToSelection: (view: EditorView) => {
        // when typing into a sticky header cell, we don't want to scroll
        // back to the top of the table if the user has already scrolled down
        const { tableHeader } = view.state.schema.nodes;
        const domRef = findParentDomRefOfType(
          tableHeader,
          view.domAtPos.bind(view),
        )(view.state.selection);

        const maybeTr = closestElement(domRef as HTMLElement | undefined, 'tr');
        return maybeTr ? maybeTr.classList.contains('sticky') : false;
      },
      handleTextInput: ({ state, dispatch }, _from, _to, text) => {
        const tr = replaceSelectedTable(
          state,
          text,
          INPUT_METHOD.KEYBOARD,
          editorAnalyticsAPI,
        );
        if (tr.selectionSet) {
          dispatch(tr);
          return true;
        }
        return false;
      },
      nodeViews: {
        table: (node, view, getPos) =>
          createTableView(
            node,
            view,
            getPos,
            portalProviderAPI,
            eventDispatcher,
            getEditorContainerWidth,
            getEditorFeatureFlags,
            pluginInjectionApi,
          ),
        tableRow: (node, view, getPos) =>
          new TableRow(node, view, getPos, eventDispatcher),
        tableCell: (node, view, getPos) =>
          new TableCell(node, view, getPos, eventDispatcher, observer),
        tableHeader: (node, view, getPos) =>
          new TableCell(node, view, getPos, eventDispatcher, observer),
      },
      handleDOMEvents: {
        focus: handleFocus,
        blur: handleBlur,
        mousedown: withCellTracking(handleMouseDown),
        mouseover: whenTableInFocus(withCellTracking(handleMouseOver)),
        mouseleave: whenTableInFocus(handleMouseLeave),
        mouseout: whenTableInFocus(handleMouseOut),
        mousemove: whenTableInFocus(handleMouseMove, elementContentRects),
        click: whenTableInFocus(handleClick),
      },

      handleTripleClick,
    },
  });
};
