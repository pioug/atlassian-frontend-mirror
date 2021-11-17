import { KEY_DOWN, KEY_END, KEY_HOME, KEY_UP } from '@atlaskit/ds-lib/keycodes';

import { Action, FocusableElement } from '../../types';

const actionMap: { [key: string]: Action } = {
  [KEY_DOWN]: 'next',
  [KEY_UP]: 'prev',
  [KEY_HOME]: 'first',
  [KEY_END]: 'last',
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
          refs[currentFocusedIdx + 1].focus();
        }
        break;

      case 'prev':
        if (currentFocusedIdx > 0) {
          e.preventDefault();
          refs[currentFocusedIdx - 1].focus();
        }
        break;

      case 'first':
        e.preventDefault();
        refs[0].focus();
        break;

      case 'last':
        e.preventDefault();
        refs[refs.length - 1].focus();
        break;

      default:
        return;
    }
  };
}
