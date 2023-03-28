import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { bind } from 'bind-event-listener';

import __noop from '@atlaskit/ds-lib/noop';

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
export const FocusManagerContext = createContext<{
  menuItemRefs: FocusableElement[];
  registerRef: (ref: FocusableElement) => void;
}>({
  menuItemRefs: [],
  registerRef: __noop,
});

/**
 * Focus manager logic
 */
const FocusManager: FC<{ children: ReactNode }> = ({ children }) => {
  const menuItemRefs = useRef<FocusableElement[]>([]);
  const registerRef = useCallback((ref: FocusableElement) => {
    if (ref && !menuItemRefs.current.includes(ref)) {
      menuItemRefs.current.push(ref);
    }
  }, []);

  // Intentionally rebinding on each render
  useEffect(() => {
    return bind(window, {
      type: 'keydown',
      listener: handleFocus(menuItemRefs.current),
    });
  });

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
