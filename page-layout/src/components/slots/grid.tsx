/** @jsx jsx */
import {
  Children,
  isValidElement,
  useEffect,
  ReactNode,
  MouseEvent,
} from 'react';
import { jsx } from '@emotion/core';
import { Global, css } from '@emotion/core';

import { SlotWidthProps, SlotHeightProps } from '../../common/types';
import ResizeControl from '../resize-control';
import {
  getGridStateFromStorage,
  removeFromGridStateInStorage,
} from '../../common/utils';
import {
  LEFT_PANEL_WIDTH,
  RIGHT_PANEL_WIDTH,
  BANNER_HEIGHT,
  TOP_NAVIGATION_HEIGHT,
  LEFT_SIDEBAR_WIDTH,
  RIGHT_SIDEBAR_WIDTH,
  IS_SIDEBAR_COLLAPSED,
  IS_SIDEBAR_DRAGGING,
  IS_FLYOUT_OPEN,
  LEFT_SIDEBAR_FLYOUT,
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  LEFT_SIDEBAR_FLYOUT_WIDTH,
  MAIN_SELECTOR,
  LEFT_SIDEBAR_SELECTOR,
  DIMENSIONS,
} from '../../common/constants';
import {
  gridStyles,
  contentStyles,
  bannerStyles,
  leftSidebarStyles,
  fixedRightSidebarInnerStyles,
  fixedLeftSidebarInnerStyles,
  topNavigationStyles,
  mainStyles,
  rightPanelStyles,
  rightSidebarStyles,
  leftPanelStyles,
} from './styles';
import { usePageLayoutGrid } from '../../controllers';

const SlotDimensions = ({
  variableName,
  value,
}: {
  variableName: string;
  value?: number;
}) => (
  <Global
    styles={css`
      :root {
        --${variableName}: ${value}px;
      }
    `}
  />
);

const resolveDimension = (
  key: typeof DIMENSIONS[number],
  dimension: number = 0,
  shouldPersist: boolean = false,
) => {
  if (shouldPersist) {
    const cachedGridState = getGridStateFromStorage('gridState');

    return cachedGridState &&
      Object.keys(cachedGridState).length > 0 &&
      cachedGridState[key]
      ? cachedGridState[key]
      : dimension;
  }

  return dimension;
};

const PageLayout = ({
  children,
  testId,
}: {
  children: ReactNode;
  testId?: string;
}) => {
  useEffect(() => {
    return () => {
      removeFromGridStateInStorage('gridState');
    };
  }, []);

  return (
    <div data-testid={testId} css={gridStyles}>
      <Global
        styles={css`
          :root {
            --${LEFT_PANEL_WIDTH}: 0px;
            --${LEFT_SIDEBAR_WIDTH}: 0px;
            --${RIGHT_SIDEBAR_WIDTH}: 0px;
            --${RIGHT_PANEL_WIDTH}: 0px;
            --${TOP_NAVIGATION_HEIGHT}: 0px;
            --${BANNER_HEIGHT}: 0px;
            --${LEFT_SIDEBAR_FLYOUT}: ${LEFT_SIDEBAR_FLYOUT_WIDTH}px;
          }

          [${IS_SIDEBAR_DRAGGING}] {
            user-select: none !important;
          }
      `}
      />
      {children}
    </div>
  );
};

const Content = (props: { children: ReactNode; testId?: string }) => {
  const { children, testId } = props;

  return (
    <div data-testid={testId} css={contentStyles}>
      {children}
    </div>
  );
};

const Banner = (props: SlotHeightProps) => {
  const {
    children,
    height,
    isFixed = true,
    shouldPersistHeight,
    testId,
  } = props;

  const bannerHeight = resolveDimension(
    BANNER_HEIGHT,
    height,
    shouldPersistHeight,
  );

  usePageLayoutGrid({ [BANNER_HEIGHT]: bannerHeight });
  useEffect(() => {
    return () => {
      removeFromGridStateInStorage('gridState', BANNER_HEIGHT);
      document.documentElement.style.removeProperty(`--${BANNER_HEIGHT}`);
    };
  }, []);

  return (
    <div css={bannerStyles(isFixed)} data-testid={testId}>
      <SlotDimensions variableName={BANNER_HEIGHT} value={bannerHeight} />
      {children}
    </div>
  );
};

const TopNavigation = (props: SlotHeightProps) => {
  const {
    children,
    height,
    isFixed = true,
    shouldPersistHeight,
    testId,
  } = props;

  const topNavigationHeight = resolveDimension(
    TOP_NAVIGATION_HEIGHT,
    height,
    shouldPersistHeight,
  );

  usePageLayoutGrid({ [TOP_NAVIGATION_HEIGHT]: topNavigationHeight });
  useEffect(() => {
    return () => {
      removeFromGridStateInStorage('gridState', TOP_NAVIGATION_HEIGHT);
      document.documentElement.style.removeProperty(
        `--${TOP_NAVIGATION_HEIGHT}`,
      );
    };
  }, []);

  return (
    <div css={topNavigationStyles(isFixed)} data-testid={testId}>
      <SlotDimensions
        variableName={TOP_NAVIGATION_HEIGHT}
        value={topNavigationHeight}
      />
      {children}
    </div>
  );
};

const mainSelector = {
  [MAIN_SELECTOR]: 'true',
};
const Main = (props: SlotWidthProps) => {
  const { children, testId } = props;

  return (
    <div data-testid={testId} {...mainSelector} css={mainStyles}>
      {children}
    </div>
  );
};

let timeout: number;
const setFlyoutIsOpen = (event: MouseEvent) => {
  clearTimeout(timeout);
  timeout = window.setTimeout(() => {
    if (document.documentElement.hasAttribute(IS_SIDEBAR_COLLAPSED)) {
      document.documentElement.setAttribute(IS_FLYOUT_OPEN, 'true');
    }
  }, 500);
};
const removeFlyoutIsOpen = () => {
  document.documentElement.removeAttribute(IS_FLYOUT_OPEN);
  clearTimeout(timeout);
};
const leftSidebarSelector = {
  [LEFT_SIDEBAR_SELECTOR]: true,
};

const LeftSidebar = (props: SlotWidthProps) => {
  const {
    children,
    width,
    isFixed = true,
    shouldPersistWidth = true,
    testId,
  } = props;

  let isResizeable = false;
  Children.forEach(children, component => {
    if (isResizeable || !isValidElement(component)) {
      return;
    }

    isResizeable = component.type === ResizeControl;
  });
  const resizeableProps = isResizeable
    ? {
        onMouseEnter: setFlyoutIsOpen,
        onMouseLeave: removeFlyoutIsOpen,
      }
    : null;

  const cachedCollapsedState = isResizeable
    ? !!getGridStateFromStorage('isLeftSidebarCollapsed')
    : false;

  const leftSidebarWidth = cachedCollapsedState
    ? COLLAPSED_LEFT_SIDEBAR_WIDTH
    : resolveDimension(LEFT_SIDEBAR_WIDTH, width, shouldPersistWidth);

  usePageLayoutGrid({ [LEFT_SIDEBAR_WIDTH]: leftSidebarWidth });
  useEffect(() => {
    if (isResizeable && cachedCollapsedState) {
      document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSED, 'true');
    }
    return () => {
      removeFromGridStateInStorage('gridState', LEFT_SIDEBAR_WIDTH);
      document.documentElement.style.removeProperty(`--${LEFT_SIDEBAR_WIDTH}`);
    };
  }, [cachedCollapsedState, isResizeable]);

  return (
    <div
      css={leftSidebarStyles(isFixed)}
      {...leftSidebarSelector}
      data-testid={testId}
      {...resizeableProps}
    >
      <SlotDimensions
        variableName={LEFT_SIDEBAR_WIDTH}
        value={leftSidebarWidth}
      />
      <div css={fixedLeftSidebarInnerStyles(isFixed)}>{children}</div>
    </div>
  );
};

const RightSidebar = (props: SlotWidthProps) => {
  const { children, width, isFixed, shouldPersistWidth, testId } = props;

  const rightSidebarWidth = resolveDimension(
    RIGHT_SIDEBAR_WIDTH,
    width,
    shouldPersistWidth,
  );

  usePageLayoutGrid({ [RIGHT_SIDEBAR_WIDTH]: rightSidebarWidth });
  useEffect(() => {
    return () => {
      removeFromGridStateInStorage('gridState', RIGHT_SIDEBAR_WIDTH);
      document.documentElement.style.removeProperty(`--${RIGHT_SIDEBAR_WIDTH}`);
    };
  }, []);

  return (
    <div data-testid={testId} css={rightSidebarStyles(isFixed)}>
      <SlotDimensions
        variableName={RIGHT_SIDEBAR_WIDTH}
        value={rightSidebarWidth}
      />
      <div css={fixedRightSidebarInnerStyles(isFixed)}>{children}</div>
    </div>
  );
};

const LeftPanel = (props: SlotWidthProps) => {
  const { children, isFixed, width, shouldPersistWidth, testId } = props;

  const leftPanelWidth = resolveDimension(
    LEFT_PANEL_WIDTH,
    width,
    shouldPersistWidth,
  );

  usePageLayoutGrid({ [LEFT_PANEL_WIDTH]: leftPanelWidth });
  useEffect(() => {
    return () => {
      removeFromGridStateInStorage('gridState', LEFT_PANEL_WIDTH);
      document.documentElement.style.removeProperty(`--${LEFT_PANEL_WIDTH}`);
    };
  }, []);

  return (
    <div css={leftPanelStyles(isFixed)} data-testid={testId}>
      <SlotDimensions variableName={LEFT_PANEL_WIDTH} value={leftPanelWidth} />
      {children}
    </div>
  );
};

const RightPanel = (props: SlotWidthProps) => {
  const { children, isFixed, width, shouldPersistWidth, testId } = props;

  const rightPanelWidth = resolveDimension(
    RIGHT_PANEL_WIDTH,
    width,
    shouldPersistWidth,
  );

  usePageLayoutGrid({ [RIGHT_PANEL_WIDTH]: rightPanelWidth });
  useEffect(() => {
    return () => {
      removeFromGridStateInStorage('gridState', RIGHT_PANEL_WIDTH);
      document.documentElement.style.removeProperty(`--${RIGHT_PANEL_WIDTH}`);
    };
  }, []);

  return (
    <div css={rightPanelStyles(isFixed)} data-testid={testId}>
      <SlotDimensions
        variableName={RIGHT_PANEL_WIDTH}
        value={rightPanelWidth}
      />
      {children}
    </div>
  );
};

export {
  PageLayout,
  Banner,
  TopNavigation,
  Content,
  Main,
  RightSidebar,
  LeftSidebar,
  RightPanel,
  LeftPanel,
};
