import { defineMessages } from 'react-intl';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';

import commonMessages from '../../messages';
import { Command, CommandDispatch } from '../../types/command';
import {
  FloatingToolbarDropdown,
  FloatingToolbarHandler,
  FloatingToolbarItem,
} from '../floating-toolbar/types';

import { clearHoverSelection, hoverTable } from './commands';
import {
  deleteTableWithAnalytics,
  toggleHeaderColumnWithAnalytics,
  toggleHeaderRowWithAnalytics,
  toggleNumberColumnWithAnalytics,
  insertRowWithAnalytics,
  deleteRowsWithAnalytics,
  mergeCellsWithAnalytics,
  splitCellWithAnalytics,
  deleteColumnsWithAnalytics,
  emptyMultipleCellsWithAnalytics,
  insertColumnWithAnalytics,
  wrapTableInExpandWithAnalytics,
} from './commands-with-analytics';
import { getPluginState } from './pm-plugins/plugin-factory';
import { pluginKey as tableResizingPluginKey } from './pm-plugins/table-resizing';
import {
  ColumnResizingPluginState,
  ToolbarMenuConfig,
  ToolbarMenuState,
  ToolbarMenuContext,
  PluginConfig,
  TableCssClassName,
} from './types';
import { checkIfNumberColumnEnabled } from './utils';
import { isReferencedSource } from './utils/referentiality';
import { INPUT_METHOD } from '../analytics';
import {
  findCellRectClosestToPos,
  findTable,
  getSelectionRect,
  isSelectionType,
} from '@atlaskit/editor-tables/utils';
import { EditorState } from 'prosemirror-state';
import { canMergeCells } from './transforms';
import { splitCell } from '@atlaskit/editor-tables/utils';
import tableMessages from './ui/messages';
import { messages as ContextualMenuMessages } from './ui/FloatingContextualMenu/ContextualMenu';
import { Rect } from '@atlaskit/editor-tables/table-map';
import { findParentDomRefOfType } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { closestElement } from '../../utils/dom';

export const messages = defineMessages({
  tableOptions: {
    id: 'fabric.editor.tableOptions',
    defaultMessage: 'Table options',
    description: 'Opens a menu with additional table options',
  },
  headerRow: {
    id: 'fabric.editor.headerRow',
    defaultMessage: 'Header row',
    description: 'Marks the first table row as a header row',
  },
  headerColumn: {
    id: 'fabric.editor.headerColumn',
    defaultMessage: 'Header column',
    description: 'Marks the first table column as a header row',
  },
  numberedColumn: {
    id: 'fabric.editor.numberedColumn',
    defaultMessage: 'Numbered column',
    description: 'Adds an auto-numbering column to your table',
  },
  collapseTable: {
    id: 'fabric.editor.collapseTable',
    defaultMessage: 'Collapse table',
    description: 'Wraps table in an expand',
  },
});

export const getToolbarMenuConfig = (
  config: ToolbarMenuConfig,
  state: ToolbarMenuState,
  { formatMessage }: ToolbarMenuContext,
): FloatingToolbarItem<Command> => {
  const options = [
    {
      id: 'editor.table.headerRow',
      title: formatMessage(messages.headerRow),
      onClick: toggleHeaderRowWithAnalytics(),
      selected: state.isHeaderRowEnabled,
      hidden: !config.allowHeaderRow,
    },
    {
      id: 'editor.table.headerColumn',
      title: formatMessage(messages.headerColumn),
      onClick: toggleHeaderColumnWithAnalytics(),
      selected: state.isHeaderColumnEnabled,
      hidden: !config.allowHeaderColumn,
    },
    {
      id: 'editor.table.numberedColumn',
      title: formatMessage(messages.numberedColumn),
      onClick: toggleNumberColumnWithAnalytics(),
      selected: state.isNumberColumnEnabled,
      hidden: !config.allowNumberColumn,
    },
    {
      id: 'editor.table.collapseTable',
      title: formatMessage(messages.collapseTable),
      onClick: wrapTableInExpandWithAnalytics(),
      selected: !!state.isTableCollapsed,
      disabled: !state.canCollapseTable,
      hidden: !config.allowCollapse,
    },
  ];

  return {
    id: 'editor.table.tableOptions',
    type: 'dropdown',
    title: formatMessage(messages.tableOptions),
    hidden: options.every((option) => option.hidden),
    options,
  };
};

// Added these options for mobile. Mobile bridge translates this menu and
// relay it to the native mobile. Native mobile displays the menu
// with native widgets. It's enabled via a plugin config.
export const getToolbarCellOptionsConfig = (
  editorState: EditorState,
  initialSelectionRect: Rect,
  { formatMessage }: ToolbarMenuContext,
): FloatingToolbarDropdown<Command> => {
  const { top, bottom, right, left } = initialSelectionRect;
  const numberOfColumns = right - left;
  const numberOfRows = bottom - top;

  const options = [
    {
      id: 'editor.table.insertColumn',
      title: formatMessage(tableMessages.insertColumn),
      onClick: (
        state: EditorState,
        dispatch?: CommandDispatch,
        view?: EditorView,
      ) => {
        const selectionRect = getClosestSelectionRect(state);
        const index = selectionRect?.right;
        if (index) {
          insertColumnWithAnalytics(INPUT_METHOD.FLOATING_TB, index)(
            state,
            dispatch,
            view,
          );
        }
        return true;
      },
      selected: false,
      disabled: false,
    },
    {
      id: 'editor.table.insertRow',
      title: formatMessage(tableMessages.insertRow),
      onClick: (state: EditorState, dispatch?: CommandDispatch) => {
        const selectionRect = getClosestSelectionRect(state);
        const index = selectionRect?.bottom;
        if (index) {
          insertRowWithAnalytics(INPUT_METHOD.FLOATING_TB, {
            index,
            moveCursorToInsertedRow: true,
          })(state, dispatch);
        }
        return true;
      },
      selected: false,
      disabled: false,
    },
    {
      id: 'editor.table.removeColumns',
      title: formatMessage(tableMessages.removeColumns, {
        0: numberOfColumns,
      }),
      onClick: (
        state: EditorState,
        dispatch?: CommandDispatch,
        view?: EditorView,
      ) => {
        const selectionRect = getClosestSelectionRect(state);
        if (selectionRect) {
          deleteColumnsWithAnalytics(INPUT_METHOD.FLOATING_TB, selectionRect)(
            state,
            dispatch,
            view,
          );
        }
        return true;
      },
      selected: false,
      disabled: false,
    },
    {
      id: 'editor.table.removeRows',
      title: formatMessage(tableMessages.removeRows, {
        0: numberOfRows,
      }),
      onClick: (state: EditorState, dispatch?: CommandDispatch) => {
        const selectionRect = getClosestSelectionRect(state);
        if (selectionRect) {
          deleteRowsWithAnalytics(
            INPUT_METHOD.FLOATING_TB,
            selectionRect,
            false,
          )(state, dispatch);
        }
        return true;
      },
      selected: false,
      disabled: false,
    },
    {
      id: 'editor.table.mergeCells',
      title: formatMessage(ContextualMenuMessages.mergeCells),
      onClick: mergeCellsWithAnalytics(),
      selected: false,
      disabled: !canMergeCells(editorState.tr),
    },
    {
      id: 'editor.table.splitCell',
      title: formatMessage(ContextualMenuMessages.splitCell),
      onClick: splitCellWithAnalytics(),
      selected: false,
      disabled: !splitCell(editorState),
    },
    {
      id: 'editor.table.clearCells',
      title: formatMessage(ContextualMenuMessages.clearCells, {
        0: Math.max(numberOfColumns, numberOfRows),
      }),
      onClick: (state: EditorState, dispatch?: CommandDispatch) => {
        const { targetCellPosition } = getPluginState(state);
        emptyMultipleCellsWithAnalytics(
          INPUT_METHOD.FLOATING_TB,
          targetCellPosition,
        )(state, dispatch);
        return true;
      },
      selected: false,
      disabled: false,
    },
  ];

  return {
    id: 'editor.table.cellOptions',
    type: 'dropdown',
    title: formatMessage(tableMessages.cellOptions),
    hidden: true,
    options,
  };
};

const getClosestSelectionRect = (state: EditorState): Rect | undefined => {
  const selection = state.selection;
  return isSelectionType(selection, 'cell')
    ? getSelectionRect(selection)!
    : findCellRectClosestToPos(selection.$from);
};

export const getToolbarConfig = (
  config: PluginConfig,
): FloatingToolbarHandler => (state, intl) => {
  const tableObject = findTable(state.selection);
  const pluginState = getPluginState(state);
  const resizeState:
    | ColumnResizingPluginState
    | undefined = tableResizingPluginKey.getState(state);
  if (tableObject && pluginState.editorHasFocus) {
    const nodeType = state.schema.nodes.table;
    const menu = getToolbarMenuConfig(
      config,
      {
        ...pluginState,
        isNumberColumnEnabled: checkIfNumberColumnEnabled(state),
      },
      intl,
    );

    const cellItems = getCellItems(config, state, intl);

    // Check if we need to show confirm dialog for delete button
    let confirmDialog;
    const localId: string | undefined = tableObject.node.attrs.localId;

    if (localId && isReferencedSource(state, localId)) {
      confirmDialog = {
        okButtonLabel: intl.formatMessage(
          tableMessages.confirmDeleteLinkedModalOKButton,
        ),
        message: intl.formatMessage(
          tableMessages.confirmDeleteLinkedModalMessage,
        ),
      };
    }

    const getDomRef = (editorView: EditorView) => {
      let element: HTMLElement | undefined;
      const domAtPos = editorView.domAtPos.bind(editorView);
      const parent = findParentDomRefOfType(
        nodeType,
        domAtPos,
      )(state.selection);
      if (parent) {
        const tableRef =
          (parent as HTMLElement).querySelector<HTMLTableElement>('table') ||
          undefined;
        if (tableRef) {
          element =
            closestElement(
              tableRef,
              `.${TableCssClassName.TABLE_NODE_WRAPPER}`,
            ) || undefined;
        }
      }

      return element;
    };

    return {
      title: 'Table floating controls',
      getDomRef,
      nodeType,
      offset: [0, 3],
      items: [
        menu,
        separator(menu.hidden),
        ...cellItems,
        {
          type: 'extensions-placeholder',
          separator: 'end',
        },
        {
          id: 'editor.table.delete',
          type: 'button',
          appearance: 'danger',
          icon: RemoveIcon,
          onClick: deleteTableWithAnalytics(),
          disabled: !!resizeState && !!resizeState.dragging,
          onMouseEnter: hoverTable(true),
          onMouseLeave: clearHoverSelection(),
          title: intl.formatMessage(commonMessages.remove),
          confirmDialog,
        },
      ],
    };
  }
  return;
};

const separator = (hidden?: boolean): FloatingToolbarItem<Command> => {
  return {
    type: 'separator',
    hidden: hidden,
  };
};

const getCellItems = (
  pluginConfig: PluginConfig,
  state: EditorState,
  { formatMessage }: ToolbarMenuContext,
): Array<FloatingToolbarItem<Command>> => {
  if (pluginConfig.allowCellOptionsInFloatingToolbar) {
    const initialSelectionRect = getClosestSelectionRect(state);
    if (initialSelectionRect) {
      const cellOptions = getToolbarCellOptionsConfig(
        state,
        initialSelectionRect,
        { formatMessage },
      );
      return [cellOptions, separator(cellOptions.hidden!)];
    }
  }
  return [];
};
