import {
  EditorState,
  Plugin,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import {
  findParentDomRefOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { findTable } from '@atlaskit/editor-tables/utils';
import { EditorView } from 'prosemirror-view';
import { browser } from '@atlaskit/editor-common';

import { Dispatch, EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { closestElement } from '../../../utils/dom';
import {
  addBoldInEmptyHeaderCells,
  clearHoverSelection,
  setTableRef,
} from '../commands';
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
} from '../event-handlers';
import { createTableView } from '../nodeviews/table';
import { pluginKey as decorationsPluginKey } from '../pm-plugins/decorations/plugin';
import { fixTables, replaceSelectedTable } from '../transforms';
import {
  TableCssClassName as ClassName,
  PluginConfig,
  ElementContentRects,
} from '../types';
import { findControlsHoverDecoration, updateResizeHandles } from '../utils';
import { INPUT_METHOD } from '../../analytics';

import { defaultTableSelection } from './default-table-selection';
import { createPluginState, getPluginState, pluginKey } from './plugin-factory';
import TableCellNodeView from '../nodeviews/tableCell';
import { getPosHandler } from '../../../nodeviews';

let isBreakoutEnabled: boolean | undefined;
let isDynamicTextSizingEnabled: boolean | undefined;
let isFullWidthModeEnabled: boolean | undefined;
let wasFullWidthModeEnabled: boolean | undefined;

export const createPlugin = (
  dispatch: Dispatch,
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  pluginConfig: PluginConfig,
  dynamicTextSizing?: boolean,
  breakoutEnabled?: boolean,
  fullWidthModeEnabled?: boolean,
  previousFullWidthModeEnabled?: boolean,
) => {
  isBreakoutEnabled = breakoutEnabled;
  isDynamicTextSizingEnabled = dynamicTextSizing;
  isFullWidthModeEnabled = fullWidthModeEnabled;
  wasFullWidthModeEnabled = previousFullWidthModeEnabled;

  const state = createPluginState(dispatch, {
    pluginConfig,
    insertColumnButtonIndex: undefined,
    insertRowButtonIndex: undefined,
    isFullWidthModeEnabled,
    isHeaderRowEnabled: !!pluginConfig.allowHeaderRow,
    isHeaderColumnEnabled: false,
    ...defaultTableSelection,
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

  const tableCellNodeview = pluginConfig.tableCellOptimization
    ? {
        tableCell: (
          node: ProseMirrorNode,
          view: EditorView,
          getPos: getPosHandler,
        ) => new TableCellNodeView(node, view, getPos, observer),
        tableHeader: (
          node: ProseMirrorNode,
          view: EditorView,
          getPos: getPosHandler,
        ) => new TableCellNodeView(node, view, getPos, observer),
      }
    : {};

  return new Plugin({
    state: state,
    key: pluginKey,
    appendTransaction: (
      transactions: Transaction[],
      oldState: EditorState,
      newState: EditorState,
    ) => {
      const tr = transactions.find((tr) => tr.getMeta('uiEvent') === 'cut');
      if (tr) {
        // "fixTables" removes empty rows as we don't allow that in schema
        const updatedTr = handleCut(tr, oldState, newState);
        return fixTables(updatedTr) || updatedTr;
      }
      if (transactions.find((tr) => tr.docChanged)) {
        return fixTables(newState.tr);
      }
    },
    view: (editorView: EditorView) => {
      const domAtPos = editorView.domAtPos.bind(editorView);

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

          if (pluginState.tableNode !== tableNode) {
            updateResizeHandles(tableRef);
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
      handleTextInput: ({ state, dispatch }, from, to, text) => {
        const tr = replaceSelectedTable(state, text, INPUT_METHOD.KEYBOARD);
        if (tr.selectionSet) {
          dispatch(tr);
          return true;
        }
        return false;
      },

      nodeViews: {
        //temporary flag to test tableCell optimisation
        ...(tableCellNodeview as any),
        table: (node, view, getPos) =>
          createTableView(
            node,
            view,
            getPos,
            portalProviderAPI,
            eventDispatcher,
            {
              isBreakoutEnabled,
              dynamicTextSizing: isDynamicTextSizingEnabled,
              isFullWidthModeEnabled,
              wasFullWidthModeEnabled,
            },
          ),
      },

      handleDOMEvents: {
        focus: handleFocus,
        blur: handleBlur,
        mousedown: handleMouseDown,
        mouseover: whenTableInFocus(handleMouseOver),
        mouseleave: whenTableInFocus(handleMouseLeave),
        mouseout: whenTableInFocus(handleMouseOut),
        mousemove: whenTableInFocus(handleMouseMove, elementContentRects),
        click: whenTableInFocus(handleClick),
      },

      handleTripleClick,
    },
  });
};
