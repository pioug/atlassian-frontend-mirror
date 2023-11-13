/** @jsx jsx */
import { jsx } from '@emotion/react';

import type {
  Command,
  GetEditorContainerWidth,
} from '@atlaskit/editor-common/types';
import {
  ArrowKeyNavigationType,
  DropdownMenu,
} from '@atlaskit/editor-common/ui-menu';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
  findCellRectClosestToPos,
  getSelectionRect,
  isSelectionType,
} from '@atlaskit/editor-tables/utils';
import { token } from '@atlaskit/tokens';

import { clearHoverSelection, hoverColumns, hoverRows } from '../../commands';
import { toggleDragMenu } from '../../pm-plugins/drag-and-drop/commands';
import { getPluginState } from '../../pm-plugins/drag-and-drop/plugin-factory';
import type { PluginConfig, TableDirection } from '../../types';
import { getSelectedColumnIndexes, getSelectedRowIndexes } from '../../utils';
import type { DragMenuConfig } from '../../utils/drag-menu';
import { getDragMenuConfig } from '../../utils/drag-menu';
import { dragMenuDropdownWidth } from '../consts';

type DragMenuProps = {
  direction?: TableDirection;
  index?: number;
  tableRef?: HTMLTableElement;
  tableNode?: PmNode;
  editorView: EditorView;
  isOpen?: boolean;
  targetCellPosition?: number;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  pluginConfig?: PluginConfig;
  getEditorContainerWidth: GetEditorContainerWidth;
};

const groupedDragMenuConfig = [
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

const convertToDropdownItems = (dragMenuConfig: DragMenuConfig[]) => {
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
    menuItemsArr[menuGroupIndex].push({
      key: item.id,
      content: item.title,
      value: { name: item.id },
      isDisabled: item.disabled,
      elemBefore: item.icon ? (
        <div
          style={{
            marginRight: token('space.negative.075', '-6px'),
            display: 'flex',
          }}
        >
          <item.icon label={item.title} />
        </div>
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

export const DragMenu = ({
  direction = 'row',
  index,
  isOpen,
  editorView,
  tableNode,
  mountPoint,
  boundariesElement,
  scrollableElement,
  targetCellPosition,
  getEditorContainerWidth,
}: DragMenuProps) => {
  const tableMap = tableNode ? TableMap.get(tableNode) : undefined;

  const { state, dispatch } = editorView;
  const { selection } = state;
  const selectionRect = isSelectionType(selection, 'cell')
    ? getSelectionRect(selection)!
    : findCellRectClosestToPos(selection.$from);

  const dragMenuConfig = getDragMenuConfig(
    direction,
    getEditorContainerWidth,
    tableMap,
    index,
    targetCellPosition,
    selectionRect,
  );

  const { menuItems, menuCallback } = convertToDropdownItems(dragMenuConfig);

  /**
   * This function is to check if the menu should be closed or not.
   * As when continously clicking on drag handle on different rows/columns,
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
      (previousOpenState === true && previousDragMenuDirection !== direction) ||
      (previousOpenState === true &&
        previousDragMenuDirection === direction &&
        previousDragMenuIndex !== index)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const closeMenu = () => {
    const { state, dispatch } = editorView;
    if (shouldCloseMenu(state)) {
      toggleDragMenu(false, direction, index)(state, dispatch);
    }
  };

  const handleMenuItemActivated = ({ item }: { item: MenuItem }) => {
    menuCallback[item.value.name]?.(state, dispatch);
    closeMenu();
  };

  const handleItemMouseEnter = ({ item }: { item: MenuItem }) => {
    if (!selectionRect || !item.value.name?.startsWith('delete')) {
      return;
    }

    (item.value.name === 'delete_column'
      ? hoverColumns(getSelectedColumnIndexes(selectionRect), true)
      : hoverRows(getSelectedRowIndexes(selectionRect), true))(state, dispatch);
  };

  const handleItemMouseLeave = ({ item }: { item: any }) => {
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

  if (!menuItems) {
    return null;
  }

  return (
    <DropdownMenu
      mountTo={mountPoint}
      //This needs be removed when the a11y is completely handled
      //Disabling key navigation now as it works only partially
      arrowKeyNavigationProviderOptions={{
        type: ArrowKeyNavigationType.MENU,
        disableArrowKeyNavigation: true,
      }}
      items={menuItems}
      isOpen={isOpen}
      onOpenChange={closeMenu}
      onItemActivated={handleMenuItemActivated}
      onMouseEnter={handleItemMouseEnter}
      onMouseLeave={handleItemMouseLeave}
      fitWidth={dragMenuDropdownWidth}
      boundariesElement={boundariesElement}
      section={{ hasSeparator: true }}
    />
  );
};
