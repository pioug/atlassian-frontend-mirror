import React, { Component, KeyboardEvent, MouseEvent, ReactNode } from 'react';

import PropTypes from 'prop-types';

import { FocusItem, ItemId } from '../../types';
import { focusManagerContext } from '../../util/contextNamespace';
import { KEY_DOWN, KEY_TAB, KEY_UP } from '../../util/keys';

interface Props {
  /** Causes first registered item to receive focus */
  autoFocus?: boolean;
  children?: ReactNode;
  close?: (args: {
    event: MouseEvent | KeyboardEvent;
    source?: 'click' | 'keydown';
  }) => void;
}

export default class DropdownItemFocusManager extends Component<Props> {
  static childContextTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    [focusManagerContext]: PropTypes.object,
  };

  getChildContext() {
    return {
      [focusManagerContext]: {
        itemFocused: this.handleItemFocused,
        registerItem: this.handleItemRegistered,
        deregisterItem: this.handleItemDeregistered,
        updateItem: this.handleItemUpdated,
      },
    };
  }

  registeredItems: Array<FocusItem> = [];

  focusedItemId?: ItemId;

  handleItemRegistered = (itemId: ItemId, itemNode: HTMLElement) => {
    this.registeredItems.push({ itemId, itemNode });

    if (this.props.autoFocus && this.registeredItems.length === 1) {
      this.focusedItemId = itemId;
      itemNode.focus();
    }
  };

  handleItemDeregistered = (itemId: ItemId): void => {
    this.registeredItems = this.registeredItems.filter(
      (item) => item.itemId !== itemId,
    );
  };

  handleItemFocused = (itemId: ItemId): void => {
    this.focusedItemId = itemId;
  };

  handleItemUpdated = (itemId: ItemId, itemNode: HTMLElement) => {
    let matchingIndex = -1;
    for (let i = 0; i < this.registeredItems.length; i++) {
      if (this.registeredItems[i].itemId === itemId) {
        matchingIndex = i;
        break;
      }
    }

    if (matchingIndex === -1) {
      this.handleItemRegistered(itemId, itemNode);
      return;
    }

    this.registeredItems[matchingIndex].itemNode = itemNode;
    if (this.focusedItemIndex() === matchingIndex) {
      itemNode.focus();
    }
  };

  focusedItemIndex = (): number => {
    const { focusedItemId, registeredItems } = this;
    for (let i = 0; i < registeredItems.length; i++) {
      if (registeredItems[i].itemId === focusedItemId) {
        return i;
      }
    }
    return -1;
  };

  handleKeyboard = (event: KeyboardEvent): void => {
    const { key, shiftKey } = event;
    const focusedItemIndex = this.focusedItemIndex();
    if (key === KEY_UP || key === KEY_DOWN) {
      // We prevent default here to avoid page scrolling when up/down
      // pressed while dropdown is focused.
      event.preventDefault();

      if (focusedItemIndex < 0) {
        return;
      }

      const nextItemIndex =
        key === KEY_UP
          ? Math.max(0, focusedItemIndex - 1)
          : Math.min(this.registeredItems.length - 1, focusedItemIndex + 1);
      this.registeredItems[nextItemIndex].itemNode.focus();
    }

    if (key === KEY_TAB) {
      if (!shiftKey && focusedItemIndex === this.registeredItems.length - 1) {
        if (this.props.close) {
          this.props.close({ event, source: 'keydown' });
        }
      }

      if (shiftKey && focusedItemIndex === 0) {
        if (this.props.close) {
          this.props.close({ event, source: 'keydown' });
        }
      }
    }
  };

  render() {
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    return <div onKeyDown={this.handleKeyboard}>{this.props.children}</div>;
  }
}
