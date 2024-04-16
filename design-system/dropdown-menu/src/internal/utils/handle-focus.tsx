import {
  KEY_DOWN,
  KEY_END,
  KEY_HOME,
  KEY_TAB,
  KEY_UP,
} from '@atlaskit/ds-lib/keycodes';

import { Action, FocusableElement } from '../../types';

const actionMap: { [key: string]: Action } = {
  [KEY_DOWN]: 'next',
  [KEY_UP]: 'prev',
  [KEY_HOME]: 'first',
  [KEY_END]: 'last',
};

/**
 * `currentFocusedIdx + 1` will not work if the next focusable element
 * is disabled. So, we need to iterate through the following menu items
 * to find one that isn't disabled. If all following elements are disabled,
 * return undefined.
 */
const getNextFocusableElement = (
  refs: FocusableElement[],
  currentFocusedIdx: number,
) => {
  while (currentFocusedIdx + 1 < refs.length) {
    const isDisabled = refs[currentFocusedIdx + 1].hasAttribute('disabled');

    if (!isDisabled) {
      return refs[currentFocusedIdx + 1];
    }
    currentFocusedIdx++;
  }
};

/**
 * `currentFocusedIdx - 1` will not work if the prev focusable element
 * is disabled. So, we need to iterate through the previous menu items
 * to find one that isn't disabled. If all previous elements are disabled,
 * return undefined.
 */
const getPrevFocusableElement = (
  refs: FocusableElement[],
  currentFocusedIdx: number,
) => {
  while (currentFocusedIdx > 0) {
    const isDisabled = refs[currentFocusedIdx - 1].hasAttribute('disabled');

    if (!isDisabled) {
      return refs[currentFocusedIdx - 1];
    }
    currentFocusedIdx--;
  }
};

export default function handleFocus(
  refs: Array<FocusableElement>,
  isLayerDisabled: () => boolean,
  onClose: (e: KeyboardEvent) => void,
) {
  return (e: KeyboardEvent) => {
    const currentFocusedIdx = refs.findIndex(
      (el: HTMLButtonElement | HTMLAnchorElement) =>
        document.activeElement?.isSameNode(el),
    );
    if (isLayerDisabled()) {
      // if nested dropdown isOpen we need to close on Tab key press
      if (e.key === KEY_TAB && !e.shiftKey) {
        onClose(e);
      }

      // if it is a nested dropdown and the level of the given dropdown is not the current level,
      // we don't need to have focus on it
      return;
    }
    const action = actionMap[e.key];

    switch (action) {
      case 'next':
        // Always cancelling the event to prevent scrolling
        e.preventDefault();
        if (currentFocusedIdx < refs.length - 1) {
          const nextFocusableElement = getNextFocusableElement(
            refs,
            currentFocusedIdx,
          );
          nextFocusableElement?.focus();
        } else {
          const firstFocusableElement = getNextFocusableElement(refs, -1);
          firstFocusableElement?.focus();
        }
        break;

      case 'prev':
        // Always cancelling the event to prevent scrolling
        e.preventDefault();
        if (currentFocusedIdx > 0) {
          const prevFocusableElement = getPrevFocusableElement(
            refs,
            currentFocusedIdx,
          );

          prevFocusableElement?.focus();
        } else {
          const lastFocusableElement = getPrevFocusableElement(
            refs,
            refs.length,
          );
          lastFocusableElement?.focus();
        }
        break;

      case 'first':
        e.preventDefault();
        // Search for first non-disabled element if first element is disabled
        const nextFocusableElement = getNextFocusableElement(refs, -1);
        nextFocusableElement?.focus();
        break;

      case 'last':
        e.preventDefault();
        // Search for last non-disabled element if last element is disabled
        const prevFocusableElement = getPrevFocusableElement(refs, refs.length);
        prevFocusableElement?.focus();
        break;

      default:
        return;
    }
  };
}
