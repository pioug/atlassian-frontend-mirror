/** @jsx jsx */
import { MouseEvent, useEffect, useRef, useState } from 'react';

import { jsx } from '@emotion/core';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  FLYOUT_DELAY,
  IS_SIDEBAR_COLLAPSED,
  LEFT_SIDEBAR_EXPANDED_WIDTH,
  LEFT_SIDEBAR_FLYOUT,
  LEFT_SIDEBAR_SELECTOR,
  LEFT_SIDEBAR_WIDTH,
  RESIZE_BUTTON_SELECTOR,
} from '../../common/constants';
import { LeftSidebarProps } from '../../common/types';
import {
  getGridStateFromStorage,
  removeFromGridStateInStorage,
  resolveDimension,
} from '../../common/utils';
import { usePageLayoutGrid } from '../../controllers';
import { SidebarResizeController } from '../../controllers/sidebar-resize-controller';
import ResizeControl from '../resize-control';

import {
  fixedLeftSidebarInnerStyles,
  leftSidebarStyles,
} from './left-sidebar-styles';
import SlotDimensions from './slot-dimensions';

const leftSidebarSelector = {
  [LEFT_SIDEBAR_SELECTOR]: true,
};

const LeftSidebar = (props: LeftSidebarProps) => {
  const {
    children,
    width,
    isFixed = true,
    shouldPersistWidth = true,
    resizeButtonLabel,
    overrides,
    onExpand,
    onCollapse,
    onResizeStart,
    onResizeEnd,
    onFlyoutExpand,
    onFlyoutCollapse,
    testId,
  } = props;

  const flyoutTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const cachedCollapsedState = !!getGridStateFromStorage(
    'isLeftSidebarCollapsed',
  );

  const leftSidebarWidth = cachedCollapsedState
    ? COLLAPSED_LEFT_SIDEBAR_WIDTH
    : resolveDimension(LEFT_SIDEBAR_WIDTH, width, shouldPersistWidth);

  usePageLayoutGrid({
    [LEFT_SIDEBAR_WIDTH]: leftSidebarWidth,
    [LEFT_SIDEBAR_FLYOUT]:
      getGridStateFromStorage(LEFT_SIDEBAR_EXPANDED_WIDTH) || width,
  });
  useEffect(() => {
    if (cachedCollapsedState) {
      document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSED, 'true');
    }

    return () => {
      removeFromGridStateInStorage('gridState', LEFT_SIDEBAR_WIDTH);
      document.documentElement.style.removeProperty(`--${LEFT_SIDEBAR_WIDTH}`);
    };
  }, [cachedCollapsedState]);

  const onMouseEnter = (event: MouseEvent) => {
    const isMouseOnResizeButton =
      (event.target as Element).matches(`[${RESIZE_BUTTON_SELECTOR}]`) ||
      (event.target as Element).matches(`[${RESIZE_BUTTON_SELECTOR}] *`);

    if (isFlyoutOpen || isMouseOnResizeButton) {
      return;
    }

    event.persist();
    flyoutTimerRef.current && clearTimeout(flyoutTimerRef.current);

    const isLeftSidebarCollapsed = document.documentElement.hasAttribute(
      IS_SIDEBAR_COLLAPSED,
    );

    if (isLeftSidebarCollapsed) {
      flyoutTimerRef.current = setTimeout(() => {
        setIsFlyoutOpen(true);
        onFlyoutExpand && onFlyoutExpand();
      }, FLYOUT_DELAY);
    }
  };

  const resetFlyout = () => isFlyoutOpen && setIsFlyoutOpen(false);

  const onMouseLeave = () => {
    flyoutTimerRef.current && clearTimeout(flyoutTimerRef.current);

    if (!isFlyoutOpen) {
      return;
    }

    const isLeftSidebarCollapsed = document.documentElement.hasAttribute(
      IS_SIDEBAR_COLLAPSED,
    );

    if (isLeftSidebarCollapsed) {
      onFlyoutCollapse && onFlyoutCollapse();
      resetFlyout();
    }
  };

  return (
    <SidebarResizeController
      onExpand={onExpand}
      onCollapse={onCollapse}
      resetFlyout={resetFlyout}
    >
      <div
        css={leftSidebarStyles(isFixed, isFlyoutOpen)}
        data-testid={testId}
        onMouseOver={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...leftSidebarSelector}
      >
        <SlotDimensions
          variableName={LEFT_SIDEBAR_WIDTH}
          value={leftSidebarWidth}
        />
        <div css={fixedLeftSidebarInnerStyles(isFixed, isFlyoutOpen)}>
          {children}
          <ResizeControl
            testId={testId}
            resizeButtonLabel={resizeButtonLabel}
            overrides={overrides}
            onCollapse={onCollapse}
            onExpand={onExpand}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
          />
        </div>
      </div>
    </SidebarResizeController>
  );
};

export default LeftSidebar;
