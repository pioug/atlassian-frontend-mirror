import React, {
  FC,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import debounce from 'lodash/debounce';

import { isReducedMotion } from '@atlaskit/motion';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  DEFAULT_LEFT_SIDEBAR_WIDTH,
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
  });

  const { isLeftSidebarCollapsed } = leftSidebarState;

  const firstRun = useRef(false);
  useEffect(() => {
    const $leftSidebar = document.querySelector(
      `${getPageLayoutSlotCSSSelector('left-sidebar')}`,
    );
    // Don't attach event listener on first run
    if ($leftSidebar && firstRun.current && !isReducedMotion()) {
      $leftSidebar.addEventListener(
        'transitionend',
        function transitionEventHandler(event) {
          if (
            (event as TransitionEvent).propertyName === 'width' &&
            event.target &&
            (event.target as HTMLDivElement).matches(
              `${getPageLayoutSlotCSSSelector('left-sidebar')}`,
            )
          ) {
            handleDataAttributesAndCb(
              isLeftSidebarCollapsed ? onCollapse : onExpand,
              isLeftSidebarCollapsed,
              leftSidebarState,
            );
            // Make sure multiple event handlers do not get attached
            document
              .querySelector(`${getPageLayoutSlotCSSSelector('left-sidebar')}`)!
              .removeEventListener('transitionend', transitionEventHandler);
          }
        },
      );
    }

    if (!firstRun.current) {
      firstRun.current = true;
    }
  }, [isLeftSidebarCollapsed, leftSidebarState, onCollapse, onExpand]);

  const context: SidebarResizeContextValue = useMemo(
    () => ({
      isLeftSidebarCollapsed,

      expandLeftSidebar: debounce(() => {
        const { lastLeftSidebarWidth, isResizing } = leftSidebarState;

        if (isResizing) {
          return;
        }

        const width = Math.max(
          lastLeftSidebarWidth,
          DEFAULT_LEFT_SIDEBAR_WIDTH,
        );

        const updatedLeftSidebarState = {
          isLeftSidebarCollapsed: false,
          isFlyoutOpen: false,
          leftSidebarWidth: width,
          lastLeftSidebarWidth,
          isResizing,
        };
        setLeftSidebarState(updatedLeftSidebarState);

        // onTransitionEnd isn't triggered when a user prefers reduced motion
        if (isReducedMotion()) {
          handleDataAttributesAndCb(onExpand, false, updatedLeftSidebarState);
        }
      }, 200),

      collapseLeftSidebar: debounce(
        (
          event?: MouseEvent | KeyboardEvent,
          collapseWithoutTransition?: boolean,
        ) => {
          const { leftSidebarWidth, isResizing } = leftSidebarState;
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
          };
          setLeftSidebarState(updatedLeftSidebarState);

          // onTransitionEnd isn't triggered when a user prefers reduced motion
          if (collapseWithoutTransition || isReducedMotion()) {
            handleDataAttributesAndCb(
              onCollapse,
              true,
              updatedLeftSidebarState,
            );
          }
        },
        200,
      ),

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
