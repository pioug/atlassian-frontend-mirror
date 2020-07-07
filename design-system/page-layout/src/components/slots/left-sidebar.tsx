/** @jsx jsx */
import { MouseEvent, useEffect, useRef } from 'react';

import { jsx } from '@emotion/core';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  FLYOUT_DELAY,
  LEFT_SIDEBAR_FLYOUT,
  LEFT_SIDEBAR_SELECTOR,
  LEFT_SIDEBAR_WIDTH,
  RESIZE_BUTTON_SELECTOR,
} from '../../common/constants';
import { LeftSidebarProps } from '../../common/types';
import {
  getGridStateFromStorage,
  mergeGridStateIntoStorage,
  resolveDimension,
} from '../../common/utils';
import {
  publishGridState,
  usePageLayoutResize,
  useSkipLinks,
} from '../../controllers';
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
    width = DEFAULT_LEFT_SIDEBAR_WIDTH,
    isFixed = true,
    resizeButtonLabel,
    resizeGrabAreaLabel,
    overrides,
    onExpand,
    onCollapse,
    onResizeStart,
    onResizeEnd,
    onFlyoutExpand,
    onFlyoutCollapse,
    testId,
    id,
    skipLinkTitle,
  } = props;

  const flyoutTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const { leftSidebarState, setLeftSidebarState } = usePageLayoutResize();
  const {
    isFlyoutOpen,
    isLeftSidebarCollapsed,
    leftSidebarWidth,
    lastLeftSidebarWidth,
  } = leftSidebarState;

  const leftSidebarWidthOnMount = isLeftSidebarCollapsed
    ? COLLAPSED_LEFT_SIDEBAR_WIDTH
    : resolveDimension(LEFT_SIDEBAR_WIDTH, width, true);

  const { registerSkipLink, unregisterSkipLink } = useSkipLinks();

  // Update state from cache on mount
  useEffect(() => {
    const cachedCollapsedState =
      getGridStateFromStorage('isLeftSidebarCollapsed') || false;
    const cachedGridState = getGridStateFromStorage('gridState') || {};

    let leftSidebarWidth = cachedGridState[LEFT_SIDEBAR_FLYOUT]
      ? Math.max(
          cachedGridState[LEFT_SIDEBAR_FLYOUT],
          DEFAULT_LEFT_SIDEBAR_WIDTH,
        )
      : DEFAULT_LEFT_SIDEBAR_WIDTH;
    const lastLeftSidebarWidth = cachedGridState[LEFT_SIDEBAR_FLYOUT]
      ? Math.max(
          cachedGridState[LEFT_SIDEBAR_FLYOUT],
          DEFAULT_LEFT_SIDEBAR_WIDTH,
        )
      : DEFAULT_LEFT_SIDEBAR_WIDTH;

    if (cachedCollapsedState) {
      leftSidebarWidth = COLLAPSED_LEFT_SIDEBAR_WIDTH;
    }

    setLeftSidebarState({
      isFlyoutOpen: false,
      isLeftSidebarCollapsed: cachedCollapsedState,
      leftSidebarWidth,
      lastLeftSidebarWidth,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every time other than mount,
  // update the local storage and css variables.
  const notFirstRun = useRef(false);
  useEffect(() => {
    if (notFirstRun.current) {
      publishGridState({
        [LEFT_SIDEBAR_WIDTH]: leftSidebarWidth || leftSidebarWidthOnMount,
        [LEFT_SIDEBAR_FLYOUT]: lastLeftSidebarWidth,
      });
      mergeGridStateIntoStorage(
        'isLeftSidebarCollapsed',
        isLeftSidebarCollapsed,
      );
    }

    if (!notFirstRun.current) {
      notFirstRun.current = true;
    }

    return () => {
      unregisterSkipLink(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeftSidebarCollapsed, leftSidebarWidth, id]);

  const onMouseEnter = (event: MouseEvent) => {
    const isMouseOnResizeButton =
      (event.target as Element).matches(`[${RESIZE_BUTTON_SELECTOR}]`) ||
      (event.target as Element).matches(`[${RESIZE_BUTTON_SELECTOR}] *`);

    if (isFlyoutOpen || isMouseOnResizeButton) {
      return;
    }

    event.persist();
    flyoutTimerRef.current && clearTimeout(flyoutTimerRef.current);

    if (isLeftSidebarCollapsed) {
      flyoutTimerRef.current = setTimeout(() => {
        setLeftSidebarState({ ...leftSidebarState, isFlyoutOpen: true });
        onFlyoutExpand && onFlyoutExpand();
      }, FLYOUT_DELAY);
    }
  };

  const onMouseLeave = () => {
    flyoutTimerRef.current && clearTimeout(flyoutTimerRef.current);

    if (!isFlyoutOpen) {
      return;
    }

    if (isLeftSidebarCollapsed) {
      onFlyoutCollapse && onFlyoutCollapse();
      setLeftSidebarState({ ...leftSidebarState, isFlyoutOpen: false });
    }
  };

  if (id && skipLinkTitle) {
    registerSkipLink({ id, skipLinkTitle });
  }

  return (
    <div
      css={leftSidebarStyles(isFixed, isFlyoutOpen)}
      data-testid={testId}
      onMouseOver={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...leftSidebarSelector}
      id={id}
    >
      <SlotDimensions
        variableName={LEFT_SIDEBAR_WIDTH}
        value={leftSidebarWidthOnMount}
      />
      <div
        css={fixedLeftSidebarInnerStyles(
          isFixed,
          isFlyoutOpen,
          isLeftSidebarCollapsed,
        )}
      >
        {children}
        <ResizeControl
          testId={testId}
          resizeGrabAreaLabel={resizeGrabAreaLabel}
          resizeButtonLabel={resizeButtonLabel}
          overrides={overrides}
          onCollapse={onCollapse}
          onExpand={onExpand}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
          leftSidebarState={leftSidebarState}
          setLeftSidebarState={setLeftSidebarState}
        />
      </div>
    </div>
  );
};

export default LeftSidebar;
