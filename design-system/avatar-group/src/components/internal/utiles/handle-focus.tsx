import { KEY_DOWN, KEY_END, KEY_HOME, KEY_UP } from '@atlaskit/ds-lib/keycodes';

import { type Action, type FocusableElement } from '../../types';

const actionMap: { [key: string]: Action } = {
  [KEY_DOWN]: 'next',
  [KEY_UP]: 'prev',
  [KEY_HOME]: 'first',
  [KEY_END]: 'last',
};

/**
 * currentFocusedIdx + 1 will not work if the next focusable element
 * is disabled. So, we need to iterate through the following menu items
 * to find one that isn't disabled. If all following elements are disabled,
 * return undefined.
 */
const getNextFocusableElement = (
  refs: FocusableElement[],
  currentFocusedIdx: number,
) => {
  while (currentFocusedIdx + 1 < refs.length) {
    const isDisabled =
      refs[currentFocusedIdx + 1].getAttribute('disabled') !== null;

    if (!isDisabled) {
      return refs[currentFocusedIdx + 1];
    }
    currentFocusedIdx++;
  }
};

/**
 * currentFocusedIdx - 1 will not work if the prev focusable element
 * is disabled. So, we need to iterate through the previous menu items
 * to find one that isn't disabled. If all previous elements are disabled,
 * return undefined.
 */
const getPrevFocusableElement = (
  refs: FocusableElement[],
  currentFocusedIdx: number,
) => {
  while (currentFocusedIdx > 0) {
    const isDisabled =
      refs[currentFocusedIdx - 1].getAttribute('disabled') !== null;

    if (!isDisabled) {
      return refs[currentFocusedIdx - 1];
    }
    currentFocusedIdx--;
  }
};

export default function handleFocus(refs: Array<FocusableElement>) {
  return (e: KeyboardEvent) => {
    const currentFocusedIdx = refs.findIndex(
      (el: HTMLButtonElement | HTMLAnchorElement) =>
        document.activeElement?.isSameNode(el),
    );

    const action = actionMap[e.key];

    switch (action) {
      case 'next':
        if (currentFocusedIdx < refs.length - 1) {
          e.preventDefault();
          const nextFocusableElement = getNextFocusableElement(
            refs,
            currentFocusedIdx,
          );

          nextFocusableElement && nextFocusableElement.focus();
        }
        break;

      case 'prev':
        if (currentFocusedIdx > 0) {
          e.preventDefault();
          const prevFocusableElement = getPrevFocusableElement(
            refs,
            currentFocusedIdx,
          );

          prevFocusableElement && prevFocusableElement.focus();
        }
        break;

      case 'first':
        e.preventDefault();
        // Search for first non-disabled element if first element is disabled
        const nextFocusableElement = getNextFocusableElement(refs, -1);
        nextFocusableElement && nextFocusableElement.focus();
        break;

      case 'last':
        e.preventDefault();
        // Search for last non-disabled element if last element is disabled
        const prevFocusableElement = getPrevFocusableElement(refs, refs.length);
        prevFocusableElement && prevFocusableElement.focus();
        break;

      default:
        return;
    }
  };
}
