/** @jsx jsx */
import { Children, isValidElement, MouseEvent, useEffect } from 'react';

import { jsx } from '@emotion/core';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  IS_FLYOUT_OPEN,
  IS_SIDEBAR_COLLAPSED,
  LEFT_SIDEBAR_SELECTOR,
  LEFT_SIDEBAR_WIDTH,
} from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
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
  document.documentElement.removeAttribute(IS_FLYOUT_OPEN);
  clearTimeout(timeout);
};
const leftSidebarSelector = {
  [LEFT_SIDEBAR_SELECTOR]: true,
};

export default (props: SlotWidthProps) => {
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
