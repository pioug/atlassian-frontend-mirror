import React from 'react';

import type { Command } from '@atlaskit/editor-common/types';
import {
  ArrowKeyNavigationType,
  DropdownMenu,
} from '@atlaskit/editor-common/ui-menu';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables/table-map';

import { toggleDragMenu } from '../../pm-plugins/drag-and-drop/commands';
import type { PluginConfig, TableDirection } from '../../types';
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
};

const convertToDropdownItems = (dragMenuConfig: DragMenuConfig[]) => {
  let menuItems: MenuItem[] = [];
  let menuCallback: { [key: string]: Command } = {};
  dragMenuConfig.forEach((item) => {
    menuItems.push({
      key: item.id,
      content: item.title,
      value: { name: item.id },
      isDisabled: item.disabled,
    });
    item.onClick && (menuCallback[item.id] = item.onClick);
  });
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
}: DragMenuProps) => {
  const tableMap = tableNode ? TableMap.get(tableNode) : undefined;

  const dragMenuConfig = getDragMenuConfig(direction, tableMap, index);

  const { menuItems, menuCallback } = convertToDropdownItems(dragMenuConfig);

  const closeMenu = () => {
    const { state, dispatch } = editorView;
    toggleDragMenu(false)(state, dispatch);
  };

  const onMenuItemActivated = ({ item }: { item: MenuItem }) => {
    menuCallback[item.value.name]?.(editorView.state, editorView.dispatch);
    closeMenu();
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
      items={[
        {
          items: menuItems,
        },
      ]}
      isOpen={isOpen}
      onOpenChange={closeMenu}
      onItemActivated={onMenuItemActivated}
      fitWidth={dragMenuDropdownWidth}
      boundariesElement={boundariesElement}
    />
  );
};
