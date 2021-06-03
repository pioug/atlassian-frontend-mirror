import React, { Component, ReactNode } from 'react';

import find from 'array-find';
import PropTypes from 'prop-types';

import { CachedItem, GroupId, ItemId } from '../../types';
import { selectionCacheContext } from '../../util/contextNamespace';

interface Props {
  children?: ReactNode;
}

interface State {
  lastCacheUpdate: number;
}

const isItemInList = (
  itemList: Array<CachedItem>,
  itemId: ItemId,
  groupId: GroupId,
) =>
  Boolean(
    find(itemList, (item) => item.id === itemId && item.groupId === groupId),
  );

export default class DropdownItemSelectionCache extends Component<
  Props,
  State
> {
  static childContextTypes = {
    [selectionCacheContext]: PropTypes.shape({
      isItemSelected: PropTypes.func,
      itemsInGroup: PropTypes.func,
      itemSelectionsChanged: PropTypes.func,
    }),
  };

  // Need to store selectedItemValues in state rather than component instance property
  // to ensure that re-render happens down the tree via context when selectedItemValues
  // is updated.
  state = {
    lastCacheUpdate: 0,
  };

  selectedItems: Array<CachedItem> = []; // eslint-disable-line react/sort-comp

  // If any radio/checkbox items have defaultSelected applied, we need to keep track of whether
  // each of those items has had it's state set to 'selected'. This is because when the dropdown
  // menu is closed and then opened again, all of the radio/checkbox items re-mount so they
  // try to again apply their defaultSelected status. defaultSelected should only be applied on
  // the initial mount, as users can change the value post-mount. Alternatively, products can use
  // the isSelected prop with the onClick handler to control the selected state manually if needed.
  alreadyDefaultedItems: Array<CachedItem> = []; // eslint-disable-line react/sort-comp

  getChildContext() {
    return {
      [selectionCacheContext]: {
        // This function returns true/false describing whether the supplied navigation item
        // (which must have a unique item and group ID) is currently selected - this is used
        // by radio and checkbox dropdown items to retreive their 'selected' state when they
        // re-mount, which happens when the dropdown is closed and then re-opened.
        isItemSelected: (groupId: GroupId, itemId: ItemId): boolean =>
          isItemInList(this.selectedItems, itemId, groupId),
        itemsInGroup: (groupId: GroupId) =>
          this.selectedItems.filter(
            (item: CachedItem) => item.groupId === groupId,
          ),
        itemSelectionsChanged: this.handleItemSelectionsChanged,
        hasItemAlreadyHadDefaultSelectedApplied: (
          groupId: GroupId,
          itemId: ItemId,
        ): boolean => isItemInList(this.alreadyDefaultedItems, itemId, groupId),
        markItemAsDefaultApplied: (groupId: GroupId, itemId: ItemId) => {
          this.alreadyDefaultedItems.push({ id: itemId, groupId });
        },
      },
    };
  }

  handleItemSelectionsChanged = (
    groupId: string,
    newGroupSelections: Array<CachedItem>,
  ): void => {
    const newSelectedItems: Array<CachedItem> = [
      ...this.selectedItems.filter((item) => item.groupId !== groupId),
      ...newGroupSelections,
    ];

    this.selectedItems = newSelectedItems;

    // We store selectedItems in an instance variable (this.selectedItems) instead of state,
    // because if multiple children update the cache at the same time it causes unexpected
    // behaviour due to the asynchronous behaviour of setState. So we need to trigger setState
    // with a different value to cause the children to be updated with their new selection values.
    this.setState({ lastCacheUpdate: Date.now() });
  };

  render() {
    return <div>{this.props.children}</div>;
  }
}
