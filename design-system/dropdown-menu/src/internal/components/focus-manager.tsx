import React, { createContext, FC, useCallback, useRef } from 'react';

import useKeydownEvent from '@atlaskit/ds-lib/use-keydown-event';

import { FocusableElement } from '../../types';
import handleFocus from '../utils/handle-focus';

/**
 *
 *
 * Context provider which maintains the list of focusable elements and a method to
 * register new menu items.
 * This list drives the keyboard navgation of the menu.
 *
 */
export const FocusManagerContext = createContext({
  menuItemRefs: [] as FocusableElement[],
  registerRef: (ref: FocusableElement) => {},
});

/**
 * Focus manager logic
 */
const FocusManager: FC = ({ children }) => {
  const menuItemRefs = useRef<FocusableElement[]>([]);
  const registerRef = useCallback((ref: FocusableElement) => {
    if (ref && !menuItemRefs.current.includes(ref)) {
      menuItemRefs.current.push(ref);
    }
  }, []);

  useKeydownEvent(handleFocus(menuItemRefs.current));

  const contextValue = {
    menuItemRefs: menuItemRefs.current,
    registerRef,
  };

  return (
    <FocusManagerContext.Provider value={contextValue}>
      {children}
    </FocusManagerContext.Provider>
  );
};

export default FocusManager;
