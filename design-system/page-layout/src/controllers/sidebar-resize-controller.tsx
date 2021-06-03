import React, {
  FC,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { isReducedMotion } from '@atlaskit/motion';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  GRAB_AREA_SELECTOR,
  IS_SIDEBAR_COLLAPSING,
} from '../common/constants';
import { SidebarResizeControllerProps } from '../common/types';
import { getPageLayoutSlotCSSSelector } from '../common/utils';

import {
  LeftSidebarState,
  SidebarResizeContext,
  SidebarResizeContextValue,
} from './sidebar-resize-context';

type Callback = (leftSidebarState: LeftSidebarState) => void;
const noop = () => {};
const handleDataAttributesAndCb = (
  callback: Callback = noop,
  isLeftSidebarCollapsed: boolean,
  leftSidebarState: LeftSidebarState,
) => {
  document.documentElement.removeAttribute(IS_SIDEBAR_COLLAPSING);
  callback(leftSidebarState);
};

export const SidebarResizeController: FC<SidebarResizeControllerProps> = ({
  children,
  onLeftSidebarExpand: onExpand,
  onLeftSidebarCollapse: onCollapse,
}) => {
  const [leftSidebarState, setLeftSidebarState] = useState({
    isFlyoutOpen: false,
    isResizing: false,
    isLeftSidebarCollapsed: false,
    leftSidebarWidth: 0,
    lastLeftSidebarWidth: 0,
    flyoutLockCount: 0,
  });

  const { isLeftSidebarCollapsed } = leftSidebarState;
  const leftSidebarSelector = getPageLayoutSlotCSSSelector('left-sidebar');

  const transitionEventHandler = useCallback((event) => {
    if (
      (event as TransitionEvent).propertyName === 'width' &&
      event.target &&
      (event.target as HTMLDivElement).matches(leftSidebarSelector)
    ) {
      const $leftSidebarResizeController = document.querySelector(
        `[${GRAB_AREA_SELECTOR}]`,
      );
      const isCollapsed =
        !!$leftSidebarResizeController &&
        $leftSidebarResizeController.hasAttribute('disabled');

      handleDataAttributesAndCb(
        isCollapsed ? onCollapse : onExpand,
        isCollapsed,
        leftSidebarState,
      );

      // Make sure multiple event handlers do not get attached
      document
        .querySelector(leftSidebarSelector)!
        .removeEventListener('transitionend', transitionEventHandler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const $leftSidebar = document.querySelector(leftSidebarSelector);
    if ($leftSidebar && !isReducedMotion()) {
      $leftSidebar.addEventListener('transitionend', transitionEventHandler);
    }
  }, [
    isLeftSidebarCollapsed,
    leftSidebarSelector,
    leftSidebarState,
    onCollapse,
    onExpand,
    transitionEventHandler,
  ]);

  const expandLeftSidebar = useCallback(() => {
    const {
      lastLeftSidebarWidth,
      isResizing,
      flyoutLockCount,
    } = leftSidebarState;

    if (isResizing) {
      return;
    }

    const width = Math.max(lastLeftSidebarWidth, DEFAULT_LEFT_SIDEBAR_WIDTH);

    const updatedLeftSidebarState = {
      isLeftSidebarCollapsed: false,
      isFlyoutOpen: false,
      leftSidebarWidth: width,
      lastLeftSidebarWidth,
      isResizing,
      flyoutLockCount,
    };
    setLeftSidebarState(updatedLeftSidebarState);

    // onTransitionEnd isn't triggered when a user prefers reduced motion
    if (isReducedMotion()) {
      handleDataAttributesAndCb(onExpand, false, updatedLeftSidebarState);
    }
  }, [leftSidebarState, onExpand]);

  const collapseLeftSidebar = useCallback(
    (
      event?: MouseEvent | KeyboardEvent,
      collapseWithoutTransition?: boolean,
    ) => {
      const {
        leftSidebarWidth,
        isResizing,
        flyoutLockCount,
      } = leftSidebarState;
      if (isResizing) {
        return;
      }
      // data-attribute is used as a CSS selector to sync the hiding/showing
      // of the nav contents with expand/collapse animation
      document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSING, 'true');
      const updatedLeftSidebarState = {
        isLeftSidebarCollapsed: true,
        isFlyoutOpen: false,
        leftSidebarWidth: COLLAPSED_LEFT_SIDEBAR_WIDTH,
        lastLeftSidebarWidth: leftSidebarWidth,
        isResizing,
        flyoutLockCount,
      };
      setLeftSidebarState(updatedLeftSidebarState);

      // onTransitionEnd isn't triggered when a user prefers reduced motion
      if (collapseWithoutTransition || isReducedMotion()) {
        handleDataAttributesAndCb(onCollapse, true, updatedLeftSidebarState);
      }
    },
    [leftSidebarState, onCollapse],
  );

  const context: SidebarResizeContextValue = useMemo(
    () => ({
      isLeftSidebarCollapsed,
      expandLeftSidebar,
      collapseLeftSidebar,
      leftSidebarState,
      setLeftSidebarState,
    }),
    [
      isLeftSidebarCollapsed,
      expandLeftSidebar,
      collapseLeftSidebar,
      leftSidebarState,
    ],
  );

  return (
    <SidebarResizeContext.Provider value={context}>
      {children}
    </SidebarResizeContext.Provider>
  );
};
