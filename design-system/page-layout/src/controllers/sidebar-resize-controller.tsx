import React, { FC, useEffect, useRef, useState } from 'react';

import debounce from 'lodash.debounce';

import { isReducedMotion } from '@atlaskit/motion';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  DEFAULT_SIDEBAR_WIDTH,
  IS_SIDEBAR_COLLAPSED,
  IS_SIDEBAR_COLLAPSING,
  LEFT_PANEL_WIDTH,
  LEFT_SIDEBAR_EXPANDED_WIDTH,
  LEFT_SIDEBAR_FLYOUT,
  LEFT_SIDEBAR_FLYOUT_WIDTH,
  LEFT_SIDEBAR_SELECTOR,
  LEFT_SIDEBAR_WIDTH,
} from '../common/constants';
import { SidebarResizeControllerProps } from '../common/types';
import {
  getGridStateFromStorage,
  mergeGridStateIntoStorage,
} from '../common/utils';

import {
  SidebarResizeContext,
  SidebarResizeContextValue,
} from './sidebar-resize-context';

import { usePageLayoutGrid } from './index';

type Callback = () => void;
const noop = () => {};
const handleDataAttributesAndCb = (
  callback: Callback = noop,
  isLeftSidebarCollapsed: boolean,
) => {
  isLeftSidebarCollapsed &&
    document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSED, 'true');
  document.documentElement.removeAttribute(IS_SIDEBAR_COLLAPSING);
  callback();
};
export const SidebarResizeController: FC<SidebarResizeControllerProps> = ({
  children,
  onExpand,
  onCollapse,
  resetFlyout,
}) => {
  const cachedCollapsedState =
    getGridStateFromStorage('isLeftSidebarCollapsed') || false;

  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(
    cachedCollapsedState,
  );

  const cachedGridState = getGridStateFromStorage('gridState') || {};
  const cachedLeftSidebarWidth =
    getGridStateFromStorage(LEFT_SIDEBAR_EXPANDED_WIDTH) ||
    DEFAULT_SIDEBAR_WIDTH;

  const [gridState, setGridState] = usePageLayoutGrid({
    [LEFT_SIDEBAR_WIDTH]: cachedGridState[LEFT_SIDEBAR_WIDTH],
  });
  const firstRun = useRef(false);

  useEffect(() => {
    // Don't attach event listener on first run
    if (firstRun.current && !isReducedMotion()) {
      document
        .querySelector(`[${LEFT_SIDEBAR_SELECTOR}]`)!
        .addEventListener('transitionend', function transitionEventHandler(
          event,
        ) {
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
        });
    }

    if (!firstRun.current) {
      firstRun.current = true;
    }
  }, [isLeftSidebarCollapsed, onCollapse, onExpand]);

  useEffect(() => {
    mergeGridStateIntoStorage('isLeftSidebarCollapsed', isLeftSidebarCollapsed);
    mergeGridStateIntoStorage(
      LEFT_SIDEBAR_EXPANDED_WIDTH,
      getGridStateFromStorage(LEFT_SIDEBAR_EXPANDED_WIDTH) ||
        gridState[LEFT_SIDEBAR_WIDTH] ||
        DEFAULT_SIDEBAR_WIDTH,
    );
  }, [
    cachedGridState,
    isLeftSidebarCollapsed,
    cachedLeftSidebarWidth,
    gridState,
  ]);

  const context: SidebarResizeContextValue = {
    isLeftSidebarCollapsed,

    expandLeftSidebar: debounce(() => {
      setGridState({
        ...gridState,
        [LEFT_SIDEBAR_WIDTH]: Math.max(
          getGridStateFromStorage(LEFT_SIDEBAR_EXPANDED_WIDTH),
          LEFT_SIDEBAR_FLYOUT_WIDTH,
        ),
      });
      resetFlyout();
      setIsLeftSidebarCollapsed(false);
      document.documentElement.removeAttribute(IS_SIDEBAR_COLLAPSED);

      // onTransitionEnd isn't triggered when a user prefers reduced motion
      isReducedMotion() && handleDataAttributesAndCb(onExpand, false);
    }, 250),

    collapseLeftSidebar: debounce(() => {
      setGridState({
        ...gridState,
        [LEFT_SIDEBAR_WIDTH]: COLLAPSED_LEFT_SIDEBAR_WIDTH,
        [LEFT_SIDEBAR_FLYOUT]: gridState[LEFT_SIDEBAR_WIDTH],
      });
      setIsLeftSidebarCollapsed(true);
      document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSING, 'true');

      // onTransitionEnd isn't triggered when a user prefers reduced motion
      isReducedMotion() && handleDataAttributesAndCb(onCollapse, true);
    }, 250),

    setLeftSidebarWidth: width => {
      setGridState({
        ...gridState,
        [LEFT_SIDEBAR_WIDTH]: width,
      });
      mergeGridStateIntoStorage(LEFT_SIDEBAR_EXPANDED_WIDTH, width);
    },

    getLeftSidebarWidth: () => {
      return getGridStateFromStorage('gridState')[LEFT_SIDEBAR_WIDTH] || 0;
    },

    getLeftPanelWidth: () => {
      return getGridStateFromStorage('gridState')[LEFT_PANEL_WIDTH] || 0;
    },
  };

  return (
    <SidebarResizeContext.Provider value={context}>
      {children}
    </SidebarResizeContext.Provider>
  );
};
