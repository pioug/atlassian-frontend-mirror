import { useEffect, useState } from 'react';

import { isReducedMotion, mediumDurationMs } from '@atlaskit/motion';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  DEFAULT_SIDEBAR_WIDTH,
  IS_SIDEBAR_COLLAPSED,
  IS_SIDEBAR_COLLAPSING,
  LEFT_PANEL_WIDTH,
  LEFT_SIDEBAR_EXPANDED_WIDTH,
  LEFT_SIDEBAR_FLYOUT_WIDTH,
  LEFT_SIDEBAR_WIDTH,
} from '../common/constants';
import {
  getGridStateFromStorage,
  mergeGridStateIntoStorage,
} from '../common/utils';

import { UsePageLayoutResize } from './types';

import { usePageLayoutGrid } from './index';

const usePageLayoutResize = (): UsePageLayoutResize => {
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

  return {
    isLeftSidebarCollapsed,
    expandLeftSidebar: () => {
      setGridState({
        ...gridState,
        [LEFT_SIDEBAR_WIDTH]: Math.max(
          getGridStateFromStorage(LEFT_SIDEBAR_EXPANDED_WIDTH),
          LEFT_SIDEBAR_FLYOUT_WIDTH,
        ),
      });
      setIsLeftSidebarCollapsed(false);
      document.documentElement.removeAttribute(IS_SIDEBAR_COLLAPSED);
    },
    collapseLeftSidebar: () => {
      setGridState({
        ...gridState,
        [LEFT_SIDEBAR_WIDTH]: COLLAPSED_LEFT_SIDEBAR_WIDTH,
      });
      setIsLeftSidebarCollapsed(true);
      document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSING, 'true'),
        setTimeout(
          () => {
            document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSED, 'true');
            document.documentElement.removeAttribute(IS_SIDEBAR_COLLAPSING);
          },
          isReducedMotion() ? 0 : mediumDurationMs,
        );
    },
    setLeftSidebarWidth: width => {
      setGridState({
        ...gridState,
        [LEFT_SIDEBAR_WIDTH]: width,
      });
      mergeGridStateIntoStorage('expandedLeftSidebarWidth', width);
    },
    getLeftSidebarWidth: () => {
      return getGridStateFromStorage('gridState')[LEFT_SIDEBAR_WIDTH] || 0;
    },
    getLeftPanelWidth: () => {
      return getGridStateFromStorage('gridState')[LEFT_PANEL_WIDTH] || 0;
    },
  };
};

export default usePageLayoutResize;
