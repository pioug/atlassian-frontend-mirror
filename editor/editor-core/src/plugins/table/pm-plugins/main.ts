import {
  EditorState,
  Plugin,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import {
  findParentDomRefOfType,
  findParentNodeOfType,
  findTable,
} from 'prosemirror-utils';
import { DecorationSet, EditorView } from 'prosemirror-view';

import { browser } from '@atlaskit/editor-common';
import { Dispatch } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';

import { createTableView } from '../nodeviews/table';
import {
  addBoldInEmptyHeaderCells,
  clearHoverSelection,
  setTableRef,
} from '../commands';
import { PluginConfig, TableCssClassName as ClassName } from '../types';
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
import { findControlsHoverDecoration, updateResizeHandles } from '../utils';
import { fixTables } from '../transforms';
import { getPluginState, pluginKey } from './plugin-factory';
import { createPluginState } from './plugin-factory';
import { defaultTableSelection } from './default-table-selection';

let isBreakoutEnabled: boolean | undefined;
let isDynamicTextSizingEnabled: boolean | undefined;
let isFullWidthModeEnabled: boolean | undefined;
let wasFullWidthModeEnabled: boolean | undefined;

export const createPlugin = (
  dispatch: Dispatch,
  portalProviderAPI: PortalProviderAPI,
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
    decorationSet: DecorationSet.empty,
    isFullWidthModeEnabled,
    isHeaderRowEnabled: !!pluginConfig.allowHeaderRow,
    isHeaderColumnEnabled: false,
    ...defaultTableSelection,
  });

  return new Plugin({
    state: state,
    key: pluginKey,
    appendTransaction: (
      transactions: Transaction[],
      oldState: EditorState,
      newState: EditorState,
    ) => {
      const tr = transactions.find(tr => tr.getMeta('uiEvent') === 'cut');
      if (tr) {
        // "fixTables" removes empty rows as we don't allow that in schema
        const updatedTr = handleCut(tr, oldState, newState);
        return fixTables(updatedTr) || updatedTr;
      }
      if (transactions.find(tr => tr.docChanged)) {
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
          let tableRef;
          let tableNode;
          if (pluginState.editorHasFocus) {
            const parent = findParentDomRefOfType(
              state.schema.nodes.table,
              domAtPos,
            )(selection);
            if (parent) {
              tableRef = (parent as HTMLElement).querySelector('table');
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
      };
    },
    props: {
      decorations: state => getPluginState(state).decorationSet,

      handleClick: ({ state, dispatch }, _pos, event: MouseEvent) => {
        const { decorationSet } = getPluginState(state);
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

      nodeViews: {
        table: (node, view, getPos) =>
          createTableView(node, view, getPos, portalProviderAPI, {
            isBreakoutEnabled,
            dynamicTextSizing: isDynamicTextSizingEnabled,
            isFullWidthModeEnabled,
            wasFullWidthModeEnabled,
          }),
      },

      handleDOMEvents: {
        focus: handleFocus,
        blur: handleBlur,
        mousedown: handleMouseDown,
        mouseover: whenTableInFocus(handleMouseOver),
        mouseleave: whenTableInFocus(handleMouseLeave),
        mouseout: whenTableInFocus(handleMouseOut),
        mousemove: whenTableInFocus(handleMouseMove),
        click: whenTableInFocus(handleClick),
      },

      handleTripleClick,
    },
  });
};
