/* eslint-disable @atlaskit/design-system/prefer-primitives */
/** @jsx jsx */
/** @jsxFrag */
import React, { useEffect, useState } from 'react';

import { jsx } from '@emotion/react';
import type {
  IntlShape,
  MessageDescriptor,
  WrappedComponentProps,
} from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { DropdownMenuSharedCssClassName } from '@atlaskit/editor-common/styles';
import type {
  Command,
  GetEditorContainerWidth,
} from '@atlaskit/editor-common/types';
import { withOuterListeners } from '@atlaskit/editor-common/ui';
import {
  backgroundPaletteTooltipMessages,
  cellBackgroundColorPalette,
  ColorPalette,
  getSelectedRowAndColumnFromPalette,
} from '@atlaskit/editor-common/ui-color';
import {
  ArrowKeyNavigationProvider,
  ArrowKeyNavigationType,
} from '@atlaskit/editor-common/ui-menu';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { closestElement } from '@atlaskit/editor-common/utils';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import type { Rect } from '@atlaskit/editor-tables/table-map';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
  findCellRectClosestToPos,
  getSelectionRect,
  isSelectionType,
} from '@atlaskit/editor-tables/utils';
import EditorBackgroundColorIcon from '@atlaskit/icon/glyph/editor/background-color';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import Toggle from '@atlaskit/toggle';

import { clearHoverSelection, hoverColumns, hoverRows } from '../../commands';
import {
  setColorWithAnalytics,
  toggleHeaderColumnWithAnalytics,
  toggleHeaderRowWithAnalytics,
  toggleNumberColumnWithAnalytics,
} from '../../commands-with-analytics';
import { toggleDragMenu } from '../../pm-plugins/drag-and-drop/commands';
import { getPluginState } from '../../pm-plugins/drag-and-drop/plugin-factory';
import { getPluginState as getTablePluginState } from '../../pm-plugins/plugin-factory';
import type { PluginConfig, TableDirection } from '../../types';
import { TableCssClassName as ClassName } from '../../types';
import {
  checkIfHeaderColumnEnabled,
  checkIfHeaderRowEnabled,
  checkIfNumberColumnEnabled,
  getMergedCellsPositions,
  getSelectedColumnIndexes,
  getSelectedRowIndexes,
  hasMergedCellsInColumn,
  hasMergedCellsInRow,
} from '../../utils';
import type {
  DragMenuConfig,
  DragMenuOptionIdType,
} from '../../utils/drag-menu';
import { getDragMenuConfig } from '../../utils/drag-menu';
import { colorPalletteColumns } from '../consts';

import { DropdownMenu } from './DropdownMenu';
import {
  cellColourPreviewStyles,
  dragMenuBackgroundColorStyles,
  elementBeforeIconStyles,
  toggleStyles,
} from './styles';

type DragMenuProps = {
  direction?: TableDirection;
  index?: number;
  target?: Element;
  tableNode?: PmNode;
  editorView: EditorView;
  isOpen?: boolean;
  targetCellPosition?: number;
  pluginConfig?: PluginConfig;
  getEditorContainerWidth: GetEditorContainerWidth;
  editorAnalyticsAPI?: EditorAnalyticsAPI;
  fitWidth?: number;
  fitHeight?: number;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  tablePreserveWidth?: boolean;
};

type PluralOptionType = 'noOfCols' | 'noOfRows' | 'noOfCells' | null;
interface MessageType {
  message: MessageDescriptor;
  plural: PluralOptionType;
}

const MapDragMenuOptionIdToMessage: Record<DragMenuOptionIdType, MessageType> =
  {
    add_row_above: {
      message: messages.addRowAbove,
      plural: null,
    },
    add_row_below: {
      message: messages.addRowBelow,
      plural: null,
    },
    add_column_left: {
      message: messages.addColumnLeft,
      plural: null,
    },
    add_column_right: {
      message: messages.addColumnRight,
      plural: null,
    },
    distribute_columns: {
      message: messages.distributeColumns,
      plural: 'noOfCols',
    },
    clear_cells: {
      message: messages.clearCells,
      plural: 'noOfCells',
    },
    delete_row: {
      message: messages.removeRows,
      plural: 'noOfRows',
    },
    delete_column: {
      message: messages.removeColumns,
      plural: 'noOfCols',
    },
    move_column_left: {
      message: messages.moveColumnLeft,
      plural: 'noOfCols',
    },
    move_column_right: {
      message: messages.moveColumnRight,
      plural: 'noOfCols',
    },
    move_row_up: {
      message: messages.moveRowUp,
      plural: 'noOfRows',
    },
    move_row_down: {
      message: messages.moveRowDown,
      plural: 'noOfRows',
    },
    sort_column_asc: {
      message: messages.sortColumnIncreasing,
      plural: null,
    },
    sort_column_desc: {
      message: messages.sortColumnDecreasing,
      plural: null,
    },
  };

const groupedDragMenuConfig: DragMenuOptionIdType[][] = [
  [
    'add_row_above',
    'add_row_below',
    'add_column_left',
    'add_column_right',
    'distribute_columns',
    'clear_cells',
    'delete_row',
    'delete_column',
  ],
  ['move_column_left', 'move_column_right', 'move_row_up', 'move_row_down'],
  ['sort_column_asc', 'sort_column_desc'],
];

const convertToDropdownItems = (
  dragMenuConfig: DragMenuConfig[],
  formatMessage: IntlShape['formatMessage'],
  selectionRect?: Rect,
) => {
  let menuItemsArr: MenuItem[][] = [...Array(groupedDragMenuConfig.length)].map(
    () => [],
  );
  let menuCallback: { [key: string]: Command } = {};
  dragMenuConfig.forEach((item) => {
    const menuGroupIndex = groupedDragMenuConfig.findIndex((group) =>
      group.includes(item.id),
    );

    if (menuGroupIndex === -1) {
      return;
    }

    const isPlural = Boolean(MapDragMenuOptionIdToMessage[item.id]?.plural);
    let plural = 0;

    if (isPlural && selectionRect) {
      const { top, bottom, right, left } = selectionRect;
      switch (
        MapDragMenuOptionIdToMessage[item.id].plural as PluralOptionType
      ) {
        case 'noOfCols': {
          plural = right - left;
          break;
        }
        case 'noOfRows': {
          plural = bottom - top;
          break;
        }
        case 'noOfCells': {
          plural = Math.max(right - left, bottom - top);
          break;
        }
      }
    }

    const options = isPlural ? { 0: plural } : undefined;

    menuItemsArr[menuGroupIndex].push({
      key: item.id,
      content: formatMessage(
        MapDragMenuOptionIdToMessage[item.id].message,
        options,
      ),
      value: { name: item.id },
      isDisabled: item.disabled,
      elemBefore: item.icon ? (
        <span css={elementBeforeIconStyles}>
          <item.icon
            label={formatMessage(
              MapDragMenuOptionIdToMessage[item.id].message,
              options,
            )}
          />
        </span>
      ) : undefined,
      elemAfter: item.keymap ? (
        <div css={shortcutStyle}>{item.keymap}</div>
      ) : undefined,
    });
    item.onClick && (menuCallback[item.id] = item.onClick);
  });

  const menuItems = menuItemsArr.reduce((acc, curr) => {
    curr?.length > 0 && acc.push({ items: curr });
    return acc;
  }, [] as { items: MenuItem[] }[]);
  return { menuItems, menuCallback };
};

const ColorPaletteWithListeners = withOuterListeners(ColorPalette);

export const DragMenu = React.memo(
  ({
    direction = 'row',
    index,
    target,
    isOpen,
    editorView,
    tableNode,
    targetCellPosition,
    getEditorContainerWidth,
    editorAnalyticsAPI,
    pluginConfig,
    intl: { formatMessage },
    fitHeight,
    fitWidth,
    mountPoint,
    scrollableElement,
    boundariesElement,
    tablePreserveWidth,
  }: DragMenuProps & WrappedComponentProps) => {
    const { state, dispatch } = editorView;
    const { selection } = state;
    const tableMap = tableNode ? TableMap.get(tableNode) : undefined;
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const { isKeyboardModeActive } = getPluginState(state);

    const selectionRect = isSelectionType(selection, 'cell')
      ? getSelectionRect(selection)!
      : findCellRectClosestToPos(selection.$from);

    const hasMergedCells =
      direction === 'row' ? hasMergedCellsInRow : hasMergedCellsInColumn;

    const shouldMoveDisabled =
      index !== undefined && hasMergedCells(index)(selection);

    const hasMergedCellsInTable = getMergedCellsPositions(state.tr).length > 0;
    const allowBackgroundColor = pluginConfig?.allowBackgroundColor ?? false;

    const dragMenuConfig = getDragMenuConfig(
      direction,
      getEditorContainerWidth,
      !shouldMoveDisabled,
      hasMergedCellsInTable,
      editorView,
      tableMap,
      index,
      targetCellPosition,
      selectionRect,
      editorAnalyticsAPI,
      pluginConfig?.isHeaderRowRequired,
      tablePreserveWidth,
    );

    const { menuItems, menuCallback } = convertToDropdownItems(
      dragMenuConfig,
      formatMessage,
      selectionRect,
    );

    const handleSubMenuRef = (ref: HTMLDivElement | null) => {
      const parent = closestElement(
        editorView.dom as HTMLElement,
        '.fabric-editor-popup-scroll-parent',
      );
      if (!(parent && ref)) {
        return;
      }
      const boundariesRect = parent.getBoundingClientRect();
      const rect = ref.getBoundingClientRect();
      if (rect.left + rect.width > boundariesRect.width) {
        ref.style.left = `-${rect.width}px`;
      }
    };

    const setColor = (color: string) => {
      const { targetCellPosition } = getTablePluginState(editorView.state);
      const { state, dispatch } = editorView;
      setColorWithAnalytics(editorAnalyticsAPI)(
        INPUT_METHOD.CONTEXT_MENU,
        color,
        targetCellPosition,
      )(state, dispatch);
      closeMenu();
      setIsSubmenuOpen(false);
    };

    const createBackgroundColorMenuItem = () => {
      const { targetCellPosition } = getTablePluginState(editorView.state);
      const node = targetCellPosition
        ? state.doc.nodeAt(targetCellPosition)
        : null;
      const background = hexToEditorBackgroundPaletteColor(
        node?.attrs?.background || '#ffffff',
      );

      const { selectedRowIndex, selectedColumnIndex } =
        getSelectedRowAndColumnFromPalette(
          cellBackgroundColorPalette,
          background,
          colorPalletteColumns,
        );

      return {
        key: 'background',
        content: formatMessage(messages.backgroundColor),
        value: { name: 'background' },
        elemBefore: (
          <span css={elementBeforeIconStyles}>
            <EditorBackgroundColorIcon
              label={formatMessage(messages.backgroundColor)}
              size="medium"
            />
          </span>
        ),
        elemAfter: (
          <div
            className={DropdownMenuSharedCssClassName.SUBMENU}
            css={dragMenuBackgroundColorStyles}
          >
            <div
              css={cellColourPreviewStyles(background)}
              className={ClassName.DRAG_SUBMENU_ICON}
            />
            {isSubmenuOpen && (
              <div className={ClassName.DRAG_SUBMENU} ref={handleSubMenuRef}>
                <ArrowKeyNavigationProvider
                  type={ArrowKeyNavigationType.COLOR}
                  selectedRowIndex={selectedRowIndex}
                  selectedColumnIndex={selectedColumnIndex}
                  handleClose={() => {
                    const keyboardEvent = new KeyboardEvent('keydown', {
                      key: 'ArrowDown',
                      bubbles: true,
                    });
                    setIsSubmenuOpen(false);
                    (target as HTMLElement)?.focus();
                    target?.dispatchEvent(keyboardEvent);
                  }}
                  isPopupPositioned={true}
                  isOpenedByKeyboard={isKeyboardModeActive}
                >
                  <ColorPaletteWithListeners
                    cols={colorPalletteColumns}
                    onClick={(color) => {
                      setColor(color);
                    }}
                    selectedColor={background}
                    paletteOptions={{
                      palette: cellBackgroundColorPalette,
                      paletteColorTooltipMessages:
                        backgroundPaletteTooltipMessages,
                      hexToPaletteColor: hexToEditorBackgroundPaletteColor,
                    }}
                  />
                </ArrowKeyNavigationProvider>
              </div>
            )}
          </div>
        ),
      } as MenuItem;
    };

    const toggleHeaderColumn = () => {
      toggleHeaderColumnWithAnalytics(editorAnalyticsAPI)(state, dispatch);
    };

    const toggleHeaderRow = () => {
      toggleHeaderRowWithAnalytics(editorAnalyticsAPI)(state, dispatch);
    };

    const toggleRowNumbers = () => {
      toggleNumberColumnWithAnalytics(editorAnalyticsAPI)(state, dispatch);
    };

    const createHeaderRowColumnMenuItem = (direction: TableDirection) => {
      return direction === 'column'
        ? ({
            key: 'header_column',
            content: formatMessage(messages.headerColumn),
            value: { name: 'header_column' },
            elemAfter: (
              <div css={toggleStyles}>
                <Toggle
                  id="toggle-header-column"
                  onChange={toggleHeaderColumn}
                  isChecked={checkIfHeaderColumnEnabled(selection)}
                />
              </div>
            ),
          } as MenuItem)
        : ({
            key: 'header_row',
            content: formatMessage(messages.headerRow),
            value: { name: 'header_row' },
            elemAfter: (
              <div css={toggleStyles}>
                <Toggle
                  id="toggle-header-row"
                  onChange={toggleHeaderRow}
                  isChecked={checkIfHeaderRowEnabled(selection)}
                />
              </div>
            ),
          } as MenuItem);
    };

    const createRowNumbersMenuItem = () => {
      return {
        key: 'row_numbers',
        content: formatMessage(messages.rowNumbers),
        value: { name: 'row_numbers' },
        elemAfter: (
          <div css={toggleStyles}>
            <Toggle
              id="toggle-row-numbers"
              onChange={toggleRowNumbers}
              isChecked={checkIfNumberColumnEnabled(selection)}
            />
          </div>
        ),
      } as MenuItem;
    };

    /**
     * This function is to check if the menu should be closed or not.
     * As when continously clicking on tyle handle on different rows/columns,
     * should open the menu corresponding to the position of the drag handle.
     * @returns true when the menu should be closed, false otherwise
     */
    const shouldCloseMenu = (state: EditorState) => {
      let {
        isDragMenuOpen: previousOpenState,
        dragMenuDirection: previousDragMenuDirection,
        dragMenuIndex: previousDragMenuIndex,
      } = getPluginState(state);

      // menu open but menu direction changed, means user clicked on drag handle of different row/column
      // menu open menu direction not changed, but index changed, means user clicked on drag handle of same row/column, different cells.
      // 2 scenarios above , menu should not be closed.
      if (
        (previousOpenState === true &&
          previousDragMenuDirection !== direction) ||
        (previousOpenState === true &&
          previousDragMenuDirection === direction &&
          previousDragMenuIndex !== index)
      ) {
        return false;
      } else {
        return true;
      }
    };

    const closeMenu = (focusTarget: 'editor' | 'handle' = 'handle') => {
      const { state, dispatch } = editorView;
      if (shouldCloseMenu(state)) {
        if (target && focusTarget === 'handle') {
          (target as HTMLElement | null)?.focus();
        } else {
          editorView.dom.focus();
        }
        toggleDragMenu(false, direction, index)(state, dispatch);
      }
    };

    const handleMenuItemActivated = ({ item }: { item: MenuItem }) => {
      menuCallback[item.value.name]?.(state, dispatch);

      switch (item.value.name) {
        case 'background':
          setIsSubmenuOpen(!isSubmenuOpen);
          break;
        case 'header_column':
          toggleHeaderColumn();
          break;
        case 'header_row':
          toggleHeaderRow();
          break;
        case 'row_numbers':
          toggleRowNumbers();
          break;
        default:
          break;
      }

      if (
        ['header_column', 'header_row', 'row_numbers', 'background'].indexOf(
          item.value.name,
        ) <= -1
      ) {
        closeMenu('editor');
      }
    };

    const handleItemMouseEnter = ({ item }: { item: MenuItem }) => {
      if (!selectionRect) {
        return;
      }

      if (item.value.name === 'background' && !isSubmenuOpen) {
        setIsSubmenuOpen(true);
      }

      if (!item.value.name?.startsWith('delete')) {
        return;
      }

      (item.value.name === 'delete_column'
        ? hoverColumns(getSelectedColumnIndexes(selectionRect), true)
        : hoverRows(getSelectedRowIndexes(selectionRect), true))(
        state,
        dispatch,
      );
    };

    const handleItemMouseLeave = ({ item }: { item: any }) => {
      if (item.value.name === 'background' && isSubmenuOpen) {
        setIsSubmenuOpen(false);
      }

      if (
        [
          'sort_column_asc',
          'sort_column_desc',
          'delete_column',
          'delete_row',
        ].indexOf(item.value.name) > -1
      ) {
        clearHoverSelection()(state, dispatch);
      }
    };

    useEffect(() => {
      // focus on first menu item automatically when menu renders
      // and user is using keyboard
      if (isOpen && target && isKeyboardModeActive) {
        const keyboardEvent = new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          bubbles: true,
        });
        target.dispatchEvent(keyboardEvent);
      }
    }, [isOpen, target, isKeyboardModeActive]);

    if (!menuItems) {
      return null;
    }

    if (
      allowBackgroundColor &&
      getBooleanFF('platform.editor.table.new-cell-context-menu-styling')
    ) {
      menuItems[0].items.unshift(createBackgroundColorMenuItem());
    }

    // If first row, add toggle for Header row, default is true
    // If first column, add toggle for Header column, default is false
    if (
      getBooleanFF('platform.editor.table.new-cell-context-menu-styling') &&
      index === 0
    ) {
      menuItems.push({ items: [createHeaderRowColumnMenuItem(direction)] });
    }

    // All rows, add toggle for numbered rows, default is false
    if (
      getBooleanFF('platform.editor.table.new-cell-context-menu-styling') &&
      direction === 'row'
    ) {
      index === 0
        ? menuItems[menuItems.length - 1].items.push(createRowNumbersMenuItem())
        : menuItems.push({ items: [createRowNumbersMenuItem()] });
    }

    return (
      <DropdownMenu
        disableKeyboardHandling={isSubmenuOpen}
        section={{ hasSeparator: true }}
        items={menuItems}
        onItemActivated={handleMenuItemActivated}
        onMouseEnter={handleItemMouseEnter}
        onMouseLeave={handleItemMouseLeave}
        handleClose={closeMenu}
        fitHeight={fitHeight}
        fitWidth={fitWidth}
        direction={direction}
        mountPoint={mountPoint}
        boundariesElement={boundariesElement}
        scrollableElement={scrollableElement}
      />
    );
  },
);

export default injectIntl(DragMenu);
