/** @jsx jsx */
import { MouseEvent, useEffect } from 'react';

import { jsx } from '@emotion/core';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  IS_FLYOUT_OPEN,
  IS_SIDEBAR_COLLAPSED,
  LEFT_SIDEBAR_SELECTOR,
  LEFT_SIDEBAR_WIDTH,
} from '../../common/constants';
import { LeftSidebarProps } from '../../common/types';
import {
  getGridStateFromStorage,
  removeFromGridStateInStorage,
  resolveDimension,
} from '../../common/utils';
import { usePageLayoutGrid } from '../../controllers';
import ResizeControl from '../resize-control';

import SlotDimensions from './slot-dimensions';
import { fixedLeftSidebarInnerStyles, leftSidebarStyles } from './styles';

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
  if (document.documentElement.hasAttribute(IS_SIDEBAR_COLLAPSED)) {
    document.documentElement.removeAttribute(IS_FLYOUT_OPEN);
    clearTimeout(timeout);
  }
};
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
    testId,
  } = props;

  const cachedCollapsedState = !!getGridStateFromStorage(
    'isLeftSidebarCollapsed',
  );

  const leftSidebarWidth = cachedCollapsedState
    ? COLLAPSED_LEFT_SIDEBAR_WIDTH
    : resolveDimension(LEFT_SIDEBAR_WIDTH, width, shouldPersistWidth);

  usePageLayoutGrid({ [LEFT_SIDEBAR_WIDTH]: leftSidebarWidth });
  useEffect(() => {
    if (cachedCollapsedState) {
      document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSED, 'true');
    }

    return () => {
      removeFromGridStateInStorage('gridState', LEFT_SIDEBAR_WIDTH);
      document.documentElement.style.removeProperty(`--${LEFT_SIDEBAR_WIDTH}`);
    };
  }, [cachedCollapsedState]);

  return (
    <div
      css={leftSidebarStyles(isFixed)}
      data-testid={testId}
      onMouseEnter={setFlyoutIsOpen}
      onMouseLeave={removeFlyoutIsOpen}
      {...leftSidebarSelector}
    >
      <SlotDimensions
        variableName={LEFT_SIDEBAR_WIDTH}
        value={leftSidebarWidth}
      />
      <div css={fixedLeftSidebarInnerStyles(isFixed)}>
        {children}
        <ResizeControl
          testId={testId}
          resizeButtonLabel={resizeButtonLabel}
          overrides={overrides}
          onExpand={onExpand}
          onCollapse={onCollapse}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
        />
      </div>
    </div>
  );
};

export default LeftSidebar;
