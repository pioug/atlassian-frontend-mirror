import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import debounce from 'lodash.debounce';

import { isReducedMotion } from '@atlaskit/motion';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  IS_SIDEBAR_COLLAPSED,
  IS_SIDEBAR_COLLAPSING,
  LEFT_SIDEBAR_SELECTOR,
} from '../common/constants';
import { SidebarResizeControllerProps } from '../common/types';

import {
  SidebarResizeContext,
  SidebarResizeContextValue,
} from './sidebar-resize-context';

type Callback = () => void;
const noop = () => {};
const handleDataAttributesAndCb = (
  callback: Callback = noop,
  isLeftSidebarCollapsed: boolean,
) => {
  if (isLeftSidebarCollapsed) {
    document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSED, 'true');
  } else {
    document.documentElement.removeAttribute(IS_SIDEBAR_COLLAPSED);
  }
  document.documentElement.removeAttribute(IS_SIDEBAR_COLLAPSING);
  callback();
};

export const SidebarResizeController: FC<SidebarResizeControllerProps> = ({
  children,
  onLeftSidebarExpand: onExpand,
  onLeftSidebarCollapse: onCollapse,
}) => {
  const [leftSidebarState, setLeftSidebarState] = useState({
    isFlyoutOpen: false,
    isLeftSidebarCollapsed: false,
    leftSidebarWidth: 0,
    lastLeftSidebarWidth: 0,
  });

  const { isLeftSidebarCollapsed } = leftSidebarState;

  const firstRun = useRef(false);
  useEffect(() => {
    const $leftSidebar = document.querySelector(`[${LEFT_SIDEBAR_SELECTOR}]`);
    // Don't attach event listener on first run
    if ($leftSidebar && firstRun.current && !isReducedMotion()) {
      $leftSidebar.addEventListener(
        'transitionend',
        function transitionEventHandler(event) {
          if (
            (event as TransitionEvent).propertyName === 'width' &&
            event.target &&
            (event.target as HTMLDivElement).matches(
              `[${LEFT_SIDEBAR_SELECTOR}]`,
            )
          ) {
            handleDataAttributesAndCb(
              isLeftSidebarCollapsed ? onCollapse : onExpand,
              isLeftSidebarCollapsed,
            );
            // Make sure multiple event handlers do not get attached
            document
              .querySelector(`[${LEFT_SIDEBAR_SELECTOR}]`)!
              .removeEventListener('transitionend', transitionEventHandler);
          }
        },
      );
    }

    if (!firstRun.current) {
      firstRun.current = true;
    }
  }, [isLeftSidebarCollapsed, onCollapse, onExpand]);

  const context: SidebarResizeContextValue = useMemo(
    () => ({
      isLeftSidebarCollapsed,

      expandLeftSidebar: debounce(() => {
        const { lastLeftSidebarWidth } = leftSidebarState;
        const width = Math.max(
          lastLeftSidebarWidth,
          DEFAULT_LEFT_SIDEBAR_WIDTH,
        );
        document.documentElement.removeAttribute(IS_SIDEBAR_COLLAPSED);

        setLeftSidebarState({
          isLeftSidebarCollapsed: false,
          isFlyoutOpen: false,
          leftSidebarWidth: width,
          lastLeftSidebarWidth,
        });

        // onTransitionEnd isn't triggered when a user prefers reduced motion
        isReducedMotion() && handleDataAttributesAndCb(onExpand, false);
      }, 200),

      collapseLeftSidebar: debounce(() => {
        const { leftSidebarWidth } = leftSidebarState;
        // data-attribute is used as a CSS selector to sync the hiding/showing
        // of the nav contents with expand/collapse animation
        document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSING, 'true');
        setLeftSidebarState({
          isLeftSidebarCollapsed: true,
          isFlyoutOpen: false,
          leftSidebarWidth: COLLAPSED_LEFT_SIDEBAR_WIDTH,
          lastLeftSidebarWidth: leftSidebarWidth,
        });

        // onTransitionEnd isn't triggered when a user prefers reduced motion
        isReducedMotion() && handleDataAttributesAndCb(onCollapse, true);
      }, 200),

      leftSidebarState,
      setLeftSidebarState,
    }),
    [isLeftSidebarCollapsed, leftSidebarState, onExpand, onCollapse],
  );

  return (
    <SidebarResizeContext.Provider value={context}>
      {children}
    </SidebarResizeContext.Provider>
  );
};
