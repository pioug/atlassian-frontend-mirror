/** @jsx jsx */
import { jsx } from '@emotion/react';

import { TableSortOrder as SortOrder } from '@atlaskit/custom-steps';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
  addColumnAfter,
  addRowAfter,
  backspace,
  tooltip,
} from '@atlaskit/editor-common/keymaps';
import commonMessages, {
  tableMessages as messages,
} from '@atlaskit/editor-common/messages';
import type {
  Command,
  CommandDispatch,
  ConfirmDialogOptions,
  DropdownOptionT,
  FloatingToolbarDropdown,
  FloatingToolbarHandler,
  FloatingToolbarItem,
  GetEditorContainerWidth,
  GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';
import {
  cellBackgroundColorPalette,
  DEFAULT_BORDER_COLOR,
} from '@atlaskit/editor-common/ui-color';
import {
  closestElement,
  getChildrenInfo,
  getNodeName,
  isReferencedSource,
} from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentDomRefOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import { Rect, TableMap } from '@atlaskit/editor-tables/table-map';
import {
  findCellRectClosestToPos,
  findTable,
  getSelectionRect,
  isSelectionType,
  splitCell,
} from '@atlaskit/editor-tables/utils';
import DistributeColumnIcon from '@atlaskit/icon/glyph/editor/layout-three-equal';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import TableOptionsIcon from '@atlaskit/icon/glyph/preferences';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import {
  clearHoverSelection,
  hoverColumns,
  hoverMergedCells,
  hoverRows,
  hoverTable,
  removeDescendantNodes,
} from './commands';
import {
  deleteColumnsWithAnalytics,
  deleteRowsWithAnalytics,
  deleteTableWithAnalytics,
  distributeColumnsWidthsWithAnalytics,
  emptyMultipleCellsWithAnalytics,
  insertColumnWithAnalytics,
  insertRowWithAnalytics,
  mergeCellsWithAnalytics,
  setColorWithAnalytics,
  sortColumnWithAnalytics,
  splitCellWithAnalytics,
  toggleHeaderColumnWithAnalytics,
  toggleHeaderRowWithAnalytics,
  toggleNumberColumnWithAnalytics,
  wrapTableInExpandWithAnalytics,
} from './commands-with-analytics';
import { getPluginState } from './pm-plugins/plugin-factory';
import { pluginKey as tableResizingPluginKey } from './pm-plugins/table-resizing';
import { getNewResizeStateFromSelectedColumns } from './pm-plugins/table-resizing/utils/resize-state';
import { pluginKey as tableWidthPluginKey } from './pm-plugins/table-width';
import { canMergeCells } from './transforms';
import type {
  PluginConfig,
  ToolbarMenuConfig,
  ToolbarMenuContext,
  ToolbarMenuState,
} from './types';
import { TableCssClassName } from './types';
import { FullWidthDisplay } from './ui/TableFullWidthLabel';
import {
  getMergedCellsPositions,
  getSelectedColumnIndexes,
  getSelectedRowIndexes,
} from './utils';

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

  if (
    state.isDragAndDropEnabled &&
    getBooleanFF('platform.editor.table.new-cell-context-menu-styling')
  ) {
    return {
      id: 'editor.table.tableOptions',
      type: 'dropdown',
      testId: 'table_options',
      icon: TableOptionsIcon,
      title: formatMessage(messages.tableOptions),
      hidden: options.every((option) => option.hidden),
      options,
    };
  } else {
    return {
      id: 'editor.table.tableOptions',
      type: 'dropdown',
      testId: 'table_options',
      title: formatMessage(messages.tableOptions),
      hidden: options.every((option) => option.hidden),
      options,
    };
  }
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
  isTableScalingEnabled = false,
): FloatingToolbarDropdown<Command> => {
  const { top, bottom, right, left } = initialSelectionRect;
  const numberOfColumns = right - left;
  const numberOfRows = bottom - top;
  const pluginState = getPluginState(editorState);

  const options: DropdownOptionT<Command>[] = [
    {
      id: 'editor.table.insertColumn',
      title: formatMessage(messages.insertColumn),
      onClick: (
        state: EditorState,
        dispatch?: CommandDispatch,
        view?: EditorView,
      ) => {
        const selectionRect = getClosestSelectionRect(state);
        const index = selectionRect?.right;
        if (index) {
          insertColumnWithAnalytics(editorAnalyticsAPI, isTableScalingEnabled)(
            INPUT_METHOD.FLOATING_TB,
            index,
          )(state, dispatch, view);
        }
        return true;
      },
      selected: false,
      disabled: false,
      elemAfter: <div css={shortcutStyle}>{tooltip(addColumnAfter)}</div>,
    },
    {
      id: 'editor.table.insertRow',
      title: formatMessage(messages.insertRow),
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
      title: formatMessage(messages.removeColumns, {
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
      title: formatMessage(messages.removeRows, {
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
      title: formatMessage(messages.mergeCells),
      onClick: mergeCellsWithAnalytics(editorAnalyticsAPI)(
        INPUT_METHOD.FLOATING_TB,
      ),
      selected: false,
      disabled: !canMergeCells(editorState.tr),
    },
    {
      id: 'editor.table.splitCell',
      title: formatMessage(messages.splitCell),
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
          isTableScalingEnabled,
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
      title: formatMessage(messages.distributeColumns),
      onClick: distributeColumnWidths,
      selected: false,
      disabled: !wouldChange,
    });
  }

  if (pluginState?.pluginConfig?.allowColumnSorting) {
    const hasMergedCellsInTable =
      getMergedCellsPositions(editorState.tr).length > 0;
    const warning = hasMergedCellsInTable
      ? formatMessage(messages.canNotSortTable)
      : undefined;

    options.push({
      id: 'editor.table.sortColumnAsc',
      title: formatMessage(messages.sortColumnASC),
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
      title: formatMessage(messages.sortColumnDESC),
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
    title: formatMessage(messages.clearCells, {
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
    title: formatMessage(messages.cellOptions),
    options,
    // Increased dropdown item width to prevent labels from being truncated
    dropdownWidth: 230,
    showSelected: false,
  };
};

export const getClosestSelectionRect = (
  state: EditorState,
): Rect | undefined => {
  const selection = state.selection;
  return isSelectionType(selection, 'cell')
    ? getSelectionRect(selection)!
    : findCellRectClosestToPos(selection.$from);
};

export const getClosestSelectionOrTableRect = (
  state: EditorState,
): Rect | undefined => {
  const selection = state.selection;
  const tableObject = findTable(state.selection);
  if (!tableObject) {
    return;
  }
  const map = TableMap.get(tableObject.node);
  const tableRect = new Rect(0, 0, map.width, map.height);

  return isSelectionType(selection, 'cell')
    ? getSelectionRect(selection)!
    : tableRect;
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
    const resizeState = tableResizingPluginKey.getState(state);
    const tableWidthState = tableWidthPluginKey.getState(state);

    // We don't want to show floating toolbar while resizing the table
    const isWidthResizing = tableWidthState?.resizing;

    const { isTableScalingEnabled, widthToWidest } = pluginState;

    if (isTableScalingEnabled && isWidthResizing && widthToWidest) {
      const { stickyScrollbar } = getEditorFeatureFlags();

      const nodeType = state.schema.nodes.table;
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
      const fullWidthLabel = {
        id: 'editor.table.fullWidthLabel',
        type: 'custom',
        fallback: [],
        render: () => {
          return <FullWidthDisplay key={'full-width-label'} />;
        },
      } as FloatingToolbarItem<Command>;

      return {
        title: 'Table floating label',
        getDomRef,
        nodeType,
        key: 'full-width-label',
        offset: [0, 18],
        absoluteOffset: stickyScrollbar ? { top: -6 } : { top: 0 },
        zIndex: akEditorFloatingPanelZIndex + 1, // Place the context menu slightly above the others
        items: [fullWidthLabel],
        scrollable: true,
      };
    }

    if (tableObject && pluginState.editorHasFocus && !isWidthResizing) {
      const nodeType = state.schema.nodes.table;
      const menu = getToolbarMenuConfig(
        config,
        pluginState,
        intl,
        editorAnalyticsAPI,
      );

      const { isTableScalingEnabled = false } = getPluginState(state);

      let cellItems: Array<FloatingToolbarItem<Command>>;
      cellItems = pluginState.isDragAndDropEnabled
        ? []
        : getCellItems(
            state,
            getEditorView(),
            intl,
            getEditorContainerWidth,
            editorAnalyticsAPI,
            isTableScalingEnabled,
          );

      let columnSettingsItems;
      columnSettingsItems =
        pluginState.isDragAndDropEnabled &&
        getBooleanFF('platform.editor.table.new-cell-context-menu-styling')
          ? getColumnSettingItems(
              state,
              getEditorView(),
              intl,
              getEditorContainerWidth,
              editorAnalyticsAPI,
              isTableScalingEnabled,
            )
          : [];
      const colorPicker = getColorPicker(state, menu, intl, editorAnalyticsAPI);

      // Check if we need to show confirm dialog for delete button
      let confirmDialog;

      if (isReferencedSource(state, tableObject.node)) {
        const localSourceName = intl.formatMessage(messages.unnamedSource);

        confirmDialog = (): ConfirmDialogOptions => ({
          title: intl.formatMessage(messages.deleteElementTitle),
          okButtonLabel: intl.formatMessage(
            messages.confirmDeleteLinkedModalOKButton,
          ),
          message: intl.formatMessage(
            messages.confirmDeleteLinkedModalMessage,
            {
              nodeName: getNodeName(state, tableObject.node) || localSourceName,
            },
          ),
          messagePrefix: intl.formatMessage(
            messages.confirmDeleteLinkedModalMessagePrefix,
          ),
          isReferentialityDialog: true,
          getChildrenInfo: () => getChildrenInfo(state, tableObject.node),
          checkboxLabel: intl.formatMessage(messages.confirmModalCheckboxLabel),
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

      const { stickyScrollbar } = getEditorFeatureFlags();

      return {
        title: 'Table floating controls',
        getDomRef,
        nodeType,
        offset: [0, 18],
        absoluteOffset: stickyScrollbar ? { top: -6 } : { top: 0 },
        zIndex: akEditorFloatingPanelZIndex + 1, // Place the context menu slightly above the others
        items: [
          menu,
          separator(menu.hidden),
          ...cellItems,
          ...columnSettingsItems,
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
  state: EditorState,
  view: EditorView | null,
  { formatMessage }: ToolbarMenuContext,
  getEditorContainerWidth: GetEditorContainerWidth,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
  isTableScalingEnabled = false,
): Array<FloatingToolbarItem<Command>> => {
  const initialSelectionRect = getClosestSelectionRect(state);
  if (initialSelectionRect) {
    const cellOptions = getToolbarCellOptionsConfig(
      state,
      view,
      initialSelectionRect,
      { formatMessage },
      getEditorContainerWidth,
      editorAnalyticsAPI,
      isTableScalingEnabled,
    );
    return [cellOptions, separator(cellOptions.hidden!)];
  }
  return [];
};

export const getDistributeConfig =
  (
    getEditorContainerWidth: GetEditorContainerWidth,
    editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
    isTableScalingEnabled = false,
  ): Command =>
  (state, dispatch, editorView) => {
    const selectionOrTableRect = getClosestSelectionOrTableRect(state);
    if (!editorView || !selectionOrTableRect) {
      return false;
    }
    const newResizeStateWithAnalytics = getNewResizeStateFromSelectedColumns(
      selectionOrTableRect,
      state,
      editorView.domAtPos.bind(editorView),
      getEditorContainerWidth,
      isTableScalingEnabled,
    );

    if (newResizeStateWithAnalytics) {
      distributeColumnsWidthsWithAnalytics(editorAnalyticsAPI)(
        INPUT_METHOD.FLOATING_TB,
        newResizeStateWithAnalytics,
      )(state, dispatch);
      return true;
    }
    return false;
  };

// this create the button group for distribute column and also fixed column width
// fixed column button should be in this function call in the future
const getColumnSettingItems = (
  editorState: EditorState,
  editorView: EditorView | undefined | null,
  { formatMessage }: ToolbarMenuContext,
  getEditorContainerWidth: GetEditorContainerWidth,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
  isTableScalingEnabled = false,
): Array<FloatingToolbarItem<Command>> => {
  const pluginState = getPluginState(editorState);
  const selectionOrTableRect = getClosestSelectionOrTableRect(editorState);

  if (!selectionOrTableRect || !editorView) {
    return [];
  }

  const newResizeStateWithAnalytics = getNewResizeStateFromSelectedColumns(
    selectionOrTableRect,
    editorState,
    editorView.domAtPos.bind(editorView),
    getEditorContainerWidth,
    isTableScalingEnabled,
  );

  const wouldChange = newResizeStateWithAnalytics?.changed ?? false;

  if (
    pluginState?.pluginConfig?.allowDistributeColumns &&
    pluginState.isDragAndDropEnabled
  ) {
    return [
      {
        id: 'editor.table.distributeColumns',
        type: 'button',
        title: formatMessage(messages.distributeColumns),
        icon: DistributeColumnIcon,
        onClick: (state, dispatch, view) =>
          getDistributeConfig(
            getEditorContainerWidth,
            editorAnalyticsAPI,
            isTableScalingEnabled,
          )(state, dispatch, view),
        disabled: !wouldChange,
      },
      {
        type: 'separator',
      },
    ];
  }
  return [];
};

const getColorPicker = (
  state: EditorState,
  menu: FloatingToolbarItem<Command>,
  { formatMessage }: ToolbarMenuContext,
  editorAnalyticsAPI: EditorAnalyticsAPI | null | undefined,
): Array<FloatingToolbarItem<Command>> => {
  const { targetCellPosition, pluginConfig } = getPluginState(state);
  if (!pluginConfig.allowBackgroundColor) {
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
      title: formatMessage(messages.cellBackground),
      type: 'select',
      isAriaExpanded: true,
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
