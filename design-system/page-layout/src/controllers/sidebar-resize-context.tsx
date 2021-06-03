import {
  createContext,
  KeyboardEvent,
  MouseEvent,
  useContext,
  useEffect,
} from 'react';

const noop = () => {};

export type LeftSidebarState = {
  isFlyoutOpen: boolean;
  isResizing: boolean;
  isLeftSidebarCollapsed: boolean;
  leftSidebarWidth: number;
  lastLeftSidebarWidth: number;
  flyoutLockCount: number;
};

export type SidebarResizeContextValue = {
  isLeftSidebarCollapsed: boolean;
  expandLeftSidebar: () => void;
  collapseLeftSidebar: (
    event?: MouseEvent | KeyboardEvent,
    collapseWithoutTransition?: boolean,
  ) => void;
  leftSidebarState: LeftSidebarState;
  setLeftSidebarState: (
    value:
      | LeftSidebarState
      | ((prevState: LeftSidebarState) => LeftSidebarState),
  ) => void;
};

const leftSidebarState = {
  isFlyoutOpen: false,
  isResizing: false,
  isLeftSidebarCollapsed: false,
  leftSidebarWidth: 0,
  lastLeftSidebarWidth: 0,
  flyoutLockCount: 0,
};
export const SidebarResizeContext = createContext<SidebarResizeContextValue>({
  isLeftSidebarCollapsed: false,
  expandLeftSidebar: noop,
  collapseLeftSidebar: noop,
  leftSidebarState,
  setLeftSidebarState: noop,
});

export const usePageLayoutResize = () => {
  const { setLeftSidebarState, ...context } = useContext(SidebarResizeContext);
  return context;
};

/**
 * **WARNING:** This hook is intended as a temporary solution and
 * is likely to be removed in a future version of page-layout.
 *
 * ---
 *
 * This hook will prevent the left sidebar from automatically collapsing
 * when it is in a flyout state.
 *
 * The intended use case for this hook is to allow popup menus in the
 * left sidebar to be usable while it is in a flyout state.
 *
 * ## Usage
 * The intended usage is to use this hook within the popup component
 * you are rendering. This way the left sidebar will be locked for
 * as long as the popup is open.
 */

export const useLeftSidebarFlyoutLock = () => {
  const { setLeftSidebarState } = useContext(SidebarResizeContext);

  useEffect(() => {
    setLeftSidebarState((current) => ({
      ...current,
      flyoutLockCount: current.flyoutLockCount + 1,
    }));
    return () => {
      setLeftSidebarState((current) => ({
        ...current,
        flyoutLockCount: current.flyoutLockCount - 1,
      }));
    };
  }, [setLeftSidebarState]);
};
