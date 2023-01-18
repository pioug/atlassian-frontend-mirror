/** @jsx jsx */
import { jsx } from '@emotion/react';
import { defineMessages } from 'react-intl-next';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import commonMessages from '@atlaskit/editor-common/messages';
import type {
  Command,
  CommandDispatch,
  ConfirmDialogOptions,
  DropdownOptionT,
  FloatingToolbarDropdown,
  FloatingToolbarHandler,
  FloatingToolbarItem,
  GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

import {
  clearHoverSelection,
  hoverTable,
  hoverColumns,
  hoverRows,
  removeDescendantNodes,
  hoverMergedCells,
} from './commands';
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
  sortColumnWithAnalytics,
  setColorWithAnalytics,
  distributeColumnsWidthsWithAnalytics,
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
import {
  getMergedCellsPositions,
  getSelectedColumnIndexes,
  getSelectedRowIndexes,
} from './utils';
import {
  isReferencedSource,
  getChildrenInfo,
  getNodeName,
} from '@atlaskit/editor-common/utils';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
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
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';

import { Rect } from '@atlaskit/editor-tables/table-map';
import { findParentDomRefOfType } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { closestElement } from '@atlaskit/editor-common/utils';
import {
  addColumnAfter,
  addRowAfter,
  tooltip,
  backspace,
} from '@atlaskit/editor-common/keymaps';
import { getNewResizeStateFromSelectedColumns } from './pm-plugins/table-resizing/utils/resize-state';
import { TableSortOrder as SortOrder } from '@atlaskit/adf-schema/steps';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import {
  cellBackgroundColorPalette,
  DEFAULT_BORDER_COLOR,
} from '@atlaskit/editor-common/ui-color';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';

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
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
): FloatingToolbarItem<Command> => {
  const options = [
    {
      id: 'editor.table.headerRow',
      title: formatMessage(messages.headerRow),
      onClick: toggleHeaderRowWithAnalytics(editorAnalyticsAPI),
      selected: state.isHeaderRowEnabled,
      hidden: !config.allowHeaderRow,
    },
    {
      id: 'editor.table.headerColumn',
      title: formatMessage(messages.headerColumn),
      onClick: toggleHeaderColumnWithAnalytics(editorAnalyticsAPI),
      selected: state.isHeaderColumnEnabled,
      hidden: !config.allowHeaderColumn,
    },
    {
      id: 'editor.table.numberedColumn',
      title: formatMessage(messages.numberedColumn),
      onClick: toggleNumberColumnWithAnalytics(editorAnalyticsAPI),
      selected: state.isNumberColumnEnabled,
      hidden: !config.allowNumberColumn,
    },
    {
      id: 'editor.table.collapseTable',
      title: formatMessage(messages.collapseTable),
      onClick: wrapTableInExpandWithAnalytics(editorAnalyticsAPI),
      selected: !!state.isTableCollapsed,
      disabled: !state.canCollapseTable,
      hidden: !config.allowCollapse,
    },
  ];

  return {
    id: 'editor.table.tableOptions',
    type: 'dropdown',
    testId: 'table_options',
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
  editorView: EditorView | undefined | null,
  initialSelectionRect: Rect,
  { formatMessage }: ToolbarMenuContext,
  getEditorContainerWidth: GetEditorContainerWidth,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
): FloatingToolbarDropdown<Command> => {
  const { top, bottom, right, left } = initialSelectionRect;
  const numberOfColumns = right - left;
  const numberOfRows = bottom - top;
  const pluginState = getPluginState(editorState);

  const options: DropdownOptionT<Command>[] = [
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
          insertColumnWithAnalytics(
            getEditorContainerWidth,
            editorAnalyticsAPI,
          )(INPUT_METHOD.FLOATING_TB, index)(state, dispatch, view);
        }
        return true;
      },
      selected: false,
      disabled: false,
      elemAfter: <div css={shortcutStyle}>{tooltip(addColumnAfter)}</div>,
    },
    {
      id: 'editor.table.insertRow',
      title: formatMessage(tableMessages.insertRow),
      onClick: (state: EditorState, dispatch?: CommandDispatch) => {
        const selectionRect = getClosestSelectionRect(state);
        const index = selectionRect?.bottom;
        if (index) {
          insertRowWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.FLOATING_TB, {
            index,
            moveCursorToInsertedRow: true,
          })(state, dispatch);
        }
        return true;
      },
      selected: false,
      disabled: false,
      elemAfter: <div css={shortcutStyle}>{tooltip(addRowAfter)}</div>,
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
          deleteColumnsWithAnalytics(editorAnalyticsAPI)(
            INPUT_METHOD.FLOATING_TB,
            selectionRect,
          )(state, dispatch, view);
        }
        return true;
      },
      onFocus: highlightColumnsHandler,
      onBlur: clearHoverSelection(),
      onMouseOver: highlightColumnsHandler,
      onMouseLeave: clearHoverSelection(),
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
          deleteRowsWithAnalytics(editorAnalyticsAPI)(
            INPUT_METHOD.FLOATING_TB,
            selectionRect,
            false,
          )(state, dispatch);
        }
        return true;
      },
      onFocus: highlightRowsHandler,
      onBlur: clearHoverSelection(),
      onMouseOver: highlightRowsHandler,
      onMouseLeave: clearHoverSelection(),
      selected: false,
      disabled: false,
    },
    {
      id: 'editor.table.mergeCells',
      title: formatMessage(ContextualMenuMessages.mergeCells),
      onClick: mergeCellsWithAnalytics(editorAnalyticsAPI)(
        INPUT_METHOD.FLOATING_TB,
      ),
      selected: false,
      disabled: !canMergeCells(editorState.tr),
    },
    {
      id: 'editor.table.splitCell',
      title: formatMessage(ContextualMenuMessages.splitCell),
      onClick: splitCellWithAnalytics(editorAnalyticsAPI)(
        INPUT_METHOD.FLOATING_TB,
      ),
      selected: false,
      disabled: !splitCell(editorState),
    },
  ];

  if (pluginState?.pluginConfig?.allowDistributeColumns) {
    const newResizeStateWithAnalytics = editorView
      ? getNewResizeStateFromSelectedColumns(
          initialSelectionRect,
          editorState,
          editorView.domAtPos.bind(editorView),
          getEditorContainerWidth,
        )
      : undefined;
    const wouldChange = newResizeStateWithAnalytics?.changed ?? false;

    const distributeColumnWidths: Command = (state, dispatch) => {
      if (newResizeStateWithAnalytics) {
        distributeColumnsWidthsWithAnalytics(editorAnalyticsAPI)(
          INPUT_METHOD.FLOATING_TB,
          newResizeStateWithAnalytics,
        )(state, dispatch);
        return true;
      }
      return false;
    };

    options.push({
      id: 'editor.table.distributeColumns',
      title: formatMessage(ContextualMenuMessages.distributeColumns),
      onClick: distributeColumnWidths,
      selected: false,
      disabled: !wouldChange,
    });
  }

  if (pluginState?.pluginConfig?.allowColumnSorting) {
    const hasMergedCellsInTable =
      getMergedCellsPositions(editorState.tr).length > 0;
    const warning = hasMergedCellsInTable
      ? formatMessage(ContextualMenuMessages.canNotSortTable)
      : undefined;

    options.push({
      id: 'editor.table.sortColumnAsc',
      title: formatMessage(ContextualMenuMessages.sortColumnASC),
      onMouseOver: (state: EditorState, dispatch?: CommandDispatch) => {
        if (getMergedCellsPositions(state.tr).length !== 0) {
          hoverMergedCells()(state, dispatch);
          return true;
        }
        return false;
      },
      onMouseOut: (state: EditorState, dispatch?: CommandDispatch) => {
        clearHoverSelection()(state, dispatch);
        return true;
      },
      onClick: (state: EditorState, dispatch?: CommandDispatch) => {
        sortColumnWithAnalytics(editorAnalyticsAPI)(
          INPUT_METHOD.FLOATING_TB,
          initialSelectionRect.left,
          SortOrder.ASC,
        )(state, dispatch);
        return true;
      },
      selected: false,
      disabled: hasMergedCellsInTable,
      tooltip: warning,
    });

    options.push({
      id: 'editor.table.sortColumnDesc',
      title: formatMessage(ContextualMenuMessages.sortColumnDESC),
      onMouseOver: (state: EditorState, dispatch?: CommandDispatch) => {
        if (getMergedCellsPositions(state.tr).length !== 0) {
          hoverMergedCells()(state, dispatch);
          return true;
        }
        return false;
      },
      onMouseOut: (state: EditorState, dispatch?: CommandDispatch) => {
        clearHoverSelection()(state, dispatch);
        return true;
      },
      onClick: (state: EditorState, dispatch?: CommandDispatch) => {
        sortColumnWithAnalytics(editorAnalyticsAPI)(
          INPUT_METHOD.FLOATING_TB,
          initialSelectionRect.left,
          SortOrder.DESC,
        )(state, dispatch);
        return true;
      },
      selected: false,
      disabled: hasMergedCellsInTable,
      tooltip: warning,
    });
  }

  options.push({
    id: 'editor.table.clearCells',
    title: formatMessage(ContextualMenuMessages.clearCells, {
      0: Math.max(numberOfColumns, numberOfRows),
    }),
    onClick: (state: EditorState, dispatch?: CommandDispatch) => {
      const { targetCellPosition } = getPluginState(state);
      emptyMultipleCellsWithAnalytics(editorAnalyticsAPI)(
        INPUT_METHOD.FLOATING_TB,
        targetCellPosition,
      )(state, dispatch);
      return true;
    },
    selected: false,
    disabled: false,
    elemAfter: <div css={shortcutStyle}>{tooltip(backspace)}</div>,
  });

  return {
    id: 'editor.table.cellOptions',
    testId: 'cell_options',
    type: 'dropdown',
    title: formatMessage(tableMessages.cellOptions),
    options,
    // Increased dropdown item width to prevent labels from being truncated
    dropdownWidth: 230,
    showSelected: false,
  };
};

const getClosestSelectionRect = (state: EditorState): Rect | undefined => {
  const selection = state.selection;
  return isSelectionType(selection, 'cell')
    ? getSelectionRect(selection)!
    : findCellRectClosestToPos(selection.$from);
};

export const getToolbarConfig =
  (
    getEditorContainerWidth: GetEditorContainerWidth,
    editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
    getEditorFeatureFlags: GetEditorFeatureFlags,
    getEditorView: () => EditorView | null,
  ) =>
  (config: PluginConfig): FloatingToolbarHandler =>
  (state, intl) => {
    const tableObject = findTable(state.selection);
    const pluginState = getPluginState(state);
    const resizeState: ColumnResizingPluginState | undefined =
      tableResizingPluginKey.getState(state);
    if (tableObject && pluginState.editorHasFocus) {
      const nodeType = state.schema.nodes.table;
      const menu = getToolbarMenuConfig(
        config,
        pluginState,
        intl,
        editorAnalyticsAPI,
      );

      const { tableCellOptionsInFloatingToolbar } =
        getEditorFeatureFlags() || {};
      const cellItems = getCellItems(
        config,
        state,
        getEditorView(),
        intl,
        getEditorContainerWidth,
        editorAnalyticsAPI,
        tableCellOptionsInFloatingToolbar,
      );
      const colorPicker = getColorPicker(
        state,
        menu,
        intl,
        getEditorContainerWidth,
        editorAnalyticsAPI,
        tableCellOptionsInFloatingToolbar,
      );

      // Check if we need to show confirm dialog for delete button
      let confirmDialog;

      if (isReferencedSource(state, tableObject.node)) {
        confirmDialog = (): ConfirmDialogOptions => ({
          title: intl.formatMessage(tableMessages.deleteElementTitle),
          okButtonLabel: intl.formatMessage(
            tableMessages.confirmDeleteLinkedModalOKButton,
          ),
          message: intl.formatMessage(
            tableMessages.confirmDeleteLinkedModalMessage,
            { nodeName: getNodeName(state, tableObject.node) },
          ),
          messagePrefix: intl.formatMessage(
            tableMessages.confirmDeleteLinkedModalMessagePrefix,
          ),
          isReferentialityDialog: true,
          getChildrenInfo: () => getChildrenInfo(state, tableObject.node),
          checkboxLabel: intl.formatMessage(
            tableMessages.confirmModalCheckboxLabel,
          ),
          onConfirm: (isChecked = false) =>
            clickWithCheckboxHandler(isChecked, tableObject.node),
        });
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
        zIndex: akEditorFloatingPanelZIndex + 1, // Place the context menu slightly above the others
        items: [
          menu,
          separator(menu.hidden),
          ...cellItems,
          ...colorPicker,
          {
            type: 'extensions-placeholder',
            separator: 'end',
          },
          {
            type: 'copy-button',
            items: [
              {
                state,
                formatMessage: intl.formatMessage,
                nodeType,
                onMouseEnter: hoverTable(false, true),
                onMouseLeave: clearHoverSelection(),
                onFocus: hoverTable(false, true),
                onBlur: clearHoverSelection(),
              },
              { type: 'separator' },
            ],
          },
          {
            id: 'editor.table.delete',
            type: 'button',
            appearance: 'danger',
            icon: RemoveIcon,
            onClick: deleteTableWithAnalytics(editorAnalyticsAPI),
            disabled: !!resizeState && !!resizeState.dragging,
            onMouseEnter: hoverTable(true),
            onFocus: hoverTable(true),
            onBlur: clearHoverSelection(),
            onMouseLeave: clearHoverSelection(),
            title: intl.formatMessage(commonMessages.remove),
            focusEditoronEnter: true,
            confirmDialog,
          },
        ],
        scrollable: true,
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
  view: EditorView | null,
  { formatMessage }: ToolbarMenuContext,
  getEditorContainerWidth: GetEditorContainerWidth,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
  tableCellOptionsInFloatingToolbar?: boolean,
): Array<FloatingToolbarItem<Command>> => {
  if (
    pluginConfig.allowCellOptionsInFloatingToolbar ||
    tableCellOptionsInFloatingToolbar
  ) {
    const initialSelectionRect = getClosestSelectionRect(state);
    if (initialSelectionRect) {
      const cellOptions = getToolbarCellOptionsConfig(
        state,
        view,
        initialSelectionRect,
        { formatMessage },
        getEditorContainerWidth,
        editorAnalyticsAPI,
      );
      return [cellOptions, separator(cellOptions.hidden!)];
    }
  }
  return [];
};

const getColorPicker = (
  state: EditorState,
  menu: FloatingToolbarItem<Command>,
  { formatMessage }: ToolbarMenuContext,
  getEditorContainerWidth: GetEditorContainerWidth,
  editorAnalyticsAPI: EditorAnalyticsAPI | null | undefined,
  tableCellOptionsInFloatingToolbar?: boolean,
): Array<FloatingToolbarItem<Command>> => {
  const { targetCellPosition, pluginConfig } = getPluginState(state);
  if (
    !pluginConfig.allowBackgroundColor ||
    !tableCellOptionsInFloatingToolbar
  ) {
    return [];
  }
  const node = targetCellPosition
    ? state.doc.nodeAt(targetCellPosition)
    : undefined;
  const currentBackground = node?.attrs?.background || '#ffffff';
  const defaultPalette = cellBackgroundColorPalette.find(
    (item) => item.value === currentBackground,
  ) || {
    label: 'Custom',
    value: currentBackground,
    border: DEFAULT_BORDER_COLOR,
  };

  return [
    {
      id: 'editor.table.colorPicker',
      title: formatMessage(ContextualMenuMessages.cellBackground),
      type: 'select',
      selectType: 'color',
      defaultValue: defaultPalette,
      options: cellBackgroundColorPalette,
      onChange: (option: any) =>
        setColorWithAnalytics(editorAnalyticsAPI)(
          INPUT_METHOD.FLOATING_TB,
          option.value,
          targetCellPosition,
        ),
    },
    separator(menu.hidden),
  ];
};

const clickWithCheckboxHandler =
  (
    isChecked: boolean,
    node?: PMNode,
    editorAnalyticsAPI?: EditorAnalyticsAPI | undefined | null,
  ): Command =>
  (state, dispatch) => {
    if (!node) {
      return false;
    }

    if (!isChecked) {
      return deleteTableWithAnalytics(editorAnalyticsAPI)(state, dispatch);
    } else {
      removeDescendantNodes(node)(state, dispatch);
    }
    return true;
  };

const highlightRowsHandler = (
  state: EditorState,
  dispatch?: CommandDispatch,
) => {
  const selectionRect = getClosestSelectionRect(state);
  if (selectionRect) {
    hoverRows(getSelectedRowIndexes(selectionRect), true)(state, dispatch);
    return true;
  }
  return false;
};

const highlightColumnsHandler = (
  state: EditorState,
  dispatch?: CommandDispatch,
) => {
  const selectionRect = getClosestSelectionRect(state);
  if (selectionRect) {
    hoverColumns(getSelectedColumnIndexes(selectionRect), true)(
      state,
      dispatch,
    );
    return true;
  }
  return false;
};
