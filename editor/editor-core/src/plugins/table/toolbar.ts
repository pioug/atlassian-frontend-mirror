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
} from './commands-with-analytics';
import { getPluginState, pluginKey } from './pm-plugins/plugin-factory';
import { pluginKey as tableResizingPluginKey } from './pm-plugins/table-resizing';
import {
  ColumnResizingPluginState,
  TablePluginState,
  ToolbarMenuConfig,
  ToolbarMenuState,
  ToolbarMenuContext,
  PluginConfig,
} from './types';
import { checkIfNumberColumnEnabled } from './utils';
import { INPUT_METHOD } from '../analytics';
import {
  findCellRectClosestToPos,
  getSelectionRect,
  isSelectionType,
} from '@atlaskit/editor-tables/utils';
import { EditorState } from 'prosemirror-state';
import { canMergeCells } from './transforms';
import { splitCell } from '@atlaskit/editor-tables/utils';
import tableMessages from './ui/messages';
import { messages as ContextualMenuMessages } from './ui/FloatingContextualMenu/ContextualMenu';
import { Rect } from '@atlaskit/editor-tables/table-map';

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
});

export const getToolbarMenuConfig = (
  config: ToolbarMenuConfig,
  state: ToolbarMenuState,
  { formatMessage }: ToolbarMenuContext,
): FloatingToolbarItem<Command> => {
  const options = [
    {
      title: formatMessage(messages.headerRow),
      onClick: toggleHeaderRowWithAnalytics(),
      selected: state.isHeaderRowEnabled,
      hidden: !config.allowHeaderRow,
    },
    {
      title: formatMessage(messages.headerColumn),
      onClick: toggleHeaderColumnWithAnalytics(),
      selected: state.isHeaderColumnEnabled,
      hidden: !config.allowHeaderColumn,
    },
    {
      title: formatMessage(messages.numberedColumn),
      onClick: toggleNumberColumnWithAnalytics(),
      selected: state.isNumberColumnEnabled,
      hidden: !config.allowNumberColumn,
    },
  ];

  return {
    type: 'dropdown',
    title: formatMessage(messages.tableOptions),
    hidden: options.every(option => option.hidden),
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
      title: formatMessage(tableMessages.insertColumn),
      onClick: (state: EditorState, dispatch?: CommandDispatch) => {
        const selectionRect = getClosestSelectionRect(state);
        const index = selectionRect?.right;
        if (index) {
          insertColumnWithAnalytics(INPUT_METHOD.FLOATING_TB, index)(
            state,
            dispatch,
          );
        }
        return true;
      },
      selected: false,
      disabled: false,
    },
    {
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
      title: formatMessage(tableMessages.removeColumns, {
        0: numberOfColumns,
      }),
      onClick: (state: EditorState, dispatch?: CommandDispatch) => {
        const selectionRect = getClosestSelectionRect(state);
        if (selectionRect) {
          deleteColumnsWithAnalytics(INPUT_METHOD.FLOATING_TB, selectionRect)(
            state,
            dispatch,
          );
        }
        return true;
      },
      selected: false,
      disabled: false,
    },
    {
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
      title: formatMessage(ContextualMenuMessages.mergeCells),
      onClick: mergeCellsWithAnalytics(),
      selected: false,
      disabled: !canMergeCells(editorState.tr),
    },
    {
      title: formatMessage(ContextualMenuMessages.splitCell),
      onClick: splitCellWithAnalytics(),
      selected: false,
      disabled: !splitCell(editorState),
    },
    {
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

export const getToolbarConfig: FloatingToolbarHandler = (
  state,
  { formatMessage },
) => {
  const tableState: TablePluginState | undefined = pluginKey.getState(state);
  const resizeState:
    | ColumnResizingPluginState
    | undefined = tableResizingPluginKey.getState(state);

  if (tableState && tableState.tableRef && tableState.pluginConfig) {
    const { pluginConfig } = tableState;
    const menu = getToolbarMenuConfig(
      {
        allowHeaderRow: pluginConfig.allowHeaderRow,
        allowHeaderColumn: pluginConfig.allowHeaderColumn,
        allowNumberColumn: pluginConfig.allowNumberColumn,
      },
      {
        isHeaderColumnEnabled: tableState.isHeaderColumnEnabled,
        isHeaderRowEnabled: tableState.isHeaderRowEnabled,
        isNumberColumnEnabled: checkIfNumberColumnEnabled(state),
      },
      {
        formatMessage,
      },
    );

    const cellItems = getCellItems(pluginConfig, state, { formatMessage });

    return {
      title: 'Table floating controls',
      getDomRef: () => tableState.tableWrapperTarget!,
      nodeType: state.schema.nodes.table,
      offset: [0, 3],
      items: [
        menu,
        separator(menu.hidden),
        ...cellItems,
        {
          type: 'button',
          appearance: 'danger',
          icon: RemoveIcon,
          onClick: deleteTableWithAnalytics(),
          disabled: !!resizeState && !!resizeState.dragging,
          onMouseEnter: hoverTable(true),
          onMouseLeave: clearHoverSelection(),
          title: formatMessage(commonMessages.remove),
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
