import React, { Component, ReactNode } from 'react';

import PropTypes from 'prop-types';

import { Behaviors, CachedItem, ItemId } from '../../types';
import {
  selectionCacheContext,
  selectionManagerContext,
} from '../../util/contextNamespace';

interface Props {
  behavior: Behaviors;
  groupId: string;
  children?: ReactNode;
}

export default class DropdownItemSelectionManager extends Component<Props> {
  static childContextTypes = {
    [selectionManagerContext]: PropTypes.object,
  };

  static contextTypes = {
    [selectionCacheContext]: PropTypes.object.isRequired,
  };

  getChildContext() {
    return {
      [selectionManagerContext]: {
        isItemSelected: (itemId: ItemId) =>
          this.context[selectionCacheContext].isItemSelected(
            this.props.groupId,
            itemId,
          ),
        itemClicked: this.handleItemClicked,
        setItemSelected: this.setItemSelected,
      },
    };
  }

  setItemSelected = (
    itemId: ItemId,
    isSelected?: boolean,
    defaultSelected?: boolean,
  ) => {
    const { behavior, groupId } = this.props;

    const setSelected = (finalBool: boolean) => {
      if (behavior === 'checkbox' || behavior === 'menuitemcheckbox') {
        this.setCheckboxItemSelected(itemId, finalBool);
      } else if (behavior === 'radio' || behavior === 'menuitemradio') {
        this.setRadioItemSelected(itemId, finalBool);
      }
    };

    // If a radio or checkbox item has defaultSelected set on it, that it will try to set its
    // selected state to true each time it mounts (which happens whenever the dropdown is re-
    // opened by the user. The following check makes sure that the defaultSelected behaviour
    // only applies on the first mount of the radio/checkbox.

    if (typeof isSelected === 'boolean') {
      // If isSelected is explicitly provided, set it to that
      setSelected(isSelected);
    } else if (defaultSelected) {
      if (!this.hasAlreadyAppliedDefaultSelected(itemId)) {
        // If using defaultSelected and this is first mount, select the item
        setSelected(true);
        this.context[selectionCacheContext].markItemAsDefaultApplied(
          groupId,
          itemId,
        );
      } else {
        // If using defaultSelected and not first mount, set isSelected to cached value
        setSelected(this.isItemSelectedInCache(itemId));
      }
    } else {
      setSelected(this.isItemSelectedInCache(itemId));
    }
  };

  setCheckboxItemSelected = (itemId: ItemId, isSelected: boolean) => {
    const { [selectionCacheContext]: cache } = this.context;
    const alreadySelected: [CachedItem] = cache.itemsInGroup(
      this.props.groupId,
    );
    const isAlreadySelected = cache.isItemSelected(this.props.groupId, itemId);
    if (isSelected && !isAlreadySelected) {
      this.updateCacheContextWithSelections([
        ...alreadySelected,
        { id: itemId, groupId: this.props.groupId },
      ]);
    } else if (!isSelected && isAlreadySelected) {
      const withoutCurrentItem = alreadySelected.filter(
        (item) => item.id !== itemId,
      );
      this.updateCacheContextWithSelections(withoutCurrentItem);
    }
  };

  setRadioItemSelected = (itemId: ItemId, isSelected: boolean) => {
    const { [selectionCacheContext]: cache } = this.context;
    const isAlreadySelected = cache.isItemSelected(this.props.groupId, itemId);
    if (isAlreadySelected && !isSelected) {
      this.updateCacheContextWithSelections([]);
    } else if (!isAlreadySelected && isSelected) {
      this.updateCacheContextWithSelections([
        { id: itemId, groupId: this.props.groupId },
      ]);
    }
  };

  isItemSelectedInCache = (itemId: ItemId): boolean =>
    this.context[selectionCacheContext].isItemSelected(
      this.props.groupId,
      itemId,
    );

  handleItemClicked = (clickedItemId: ItemId) => {
    const { behavior } = this.props;

    if (behavior === 'checkbox' || behavior === 'menuitemcheckbox') {
      this.handleCheckboxItemClicked(clickedItemId);
    } else if (behavior === 'radio' || behavior === 'menuitemradio') {
      this.handleRadioItemClicked(clickedItemId);
    }
  };

  hasAlreadyAppliedDefaultSelected = (itemId: ItemId) =>
    this.context[selectionCacheContext].hasItemAlreadyHadDefaultSelectedApplied(
      this.props.groupId,
      itemId,
    );

  handleCheckboxItemClicked = (clickedItemId: ItemId) => {
    const { [selectionCacheContext]: cache } = this.context;
    const itemsInGroup: [CachedItem] = cache.itemsInGroup(this.props.groupId);

    const newSelections = cache.isItemSelected(
      this.props.groupId,
      clickedItemId,
    )
      ? itemsInGroup.filter((item) => item.id !== clickedItemId)
      : [...itemsInGroup, { id: clickedItemId, groupId: this.props.groupId }];

    this.updateCacheContextWithSelections(newSelections);
  };

  handleRadioItemClicked = (clickedItemId: ItemId) => {
    this.updateCacheContextWithSelections([
      { id: clickedItemId, groupId: this.props.groupId },
    ]);
  };

  updateCacheContextWithSelections = (itemSelections: Array<CachedItem>) => {
    this.context[selectionCacheContext].itemSelectionsChanged(
      this.props.groupId,
      itemSelections,
    );
  };

  render() {
    return <div>{this.props.children}</div>;
  }
}
