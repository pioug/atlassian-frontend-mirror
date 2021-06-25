/** @jsx jsx */
import {
  MouseEvent as ReactMouseEvent,
  useContext,
  useEffect,
  useRef,
} from 'react';

import { jsx } from '@emotion/core';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  FLYOUT_DELAY,
  RESIZE_BUTTON_SELECTOR,
  VAR_LEFT_SIDEBAR_FLYOUT,
  VAR_LEFT_SIDEBAR_WIDTH,
} from '../../common/constants';
import { LeftSidebarProps } from '../../common/types';
import {
  getGridStateFromStorage,
  getPageLayoutSlotSelector,
  mergeGridStateIntoStorage,
  resolveDimension,
} from '../../common/utils';
import {
  publishGridState,
  SidebarResizeContext,
  useSkipLink,
} from '../../controllers';
import ResizeControl from '../resize-control';

import {
  fixedChildrenWrapperStyle,
  fixedLeftSidebarInnerStyles,
  leftSidebarStyles,
  resizeableChildrenWrapperStyle,
} from './left-sidebar-styles';
import SlotDimensions from './slot-dimensions';

const LeftSidebar = (props: LeftSidebarProps) => {
  const {
    children,
    width,
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
    collapsedState,
  } = props;

  const flyoutTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const mouseOverEventRef = useRef<(event: MouseEvent) => void | null>();
  const leftSideBarRef = useRef(null);

  const { leftSidebarState, setLeftSidebarState } = useContext(
    SidebarResizeContext,
  );
  const {
    isFlyoutOpen,
    isResizing,
    flyoutLockCount,
    isLeftSidebarCollapsed,
    leftSidebarWidth,
    lastLeftSidebarWidth,
  } = leftSidebarState;

  const isLocked = flyoutLockCount > 0;

  const isLockedRef = useRef(isLocked);
  const mouseXRef = useRef<number>(0);
  const handlerRef = useRef<((event: MouseEvent) => void) | null>(null);
  useEffect(() => {
    isLockedRef.current = isLocked;

    // I tried a one-time `mousemove` handler that gets attached
    // when the lock releases. This is not robust because
    // the mouse can stay still after release (e.g. using keyboard)
    // and the sidebar will erroneously stay open.
    //
    // The following solution is likely less performant but more robust.

    if (isLocked && !handlerRef.current) {
      handlerRef.current = (event: MouseEvent) => {
        mouseXRef.current = event.clientX;
      };

      document.addEventListener('mousemove', handlerRef.current);
    }

    if (!isLocked && handlerRef.current) {
      if (mouseXRef.current >= lastLeftSidebarWidth) {
        setLeftSidebarState({ ...leftSidebarState, isFlyoutOpen: false });
      }
      document.removeEventListener('mousemove', handlerRef.current);
      handlerRef.current = null;
    }

    return () => {
      if (handlerRef.current) {
        document.removeEventListener('mousemove', handlerRef.current);
      }
    };
  }, [isLocked, lastLeftSidebarWidth, leftSidebarState, setLeftSidebarState]);

  const _width = Math.max(width || 0, DEFAULT_LEFT_SIDEBAR_WIDTH);

  const collapsedStateOverrideOpen = collapsedState === 'expanded';

  let leftSidebarWidthOnMount: number;

  if (collapsedStateOverrideOpen) {
    leftSidebarWidthOnMount = resolveDimension(
      VAR_LEFT_SIDEBAR_FLYOUT,
      _width,
      !width,
    );
  } else if (isLeftSidebarCollapsed || collapsedState === 'collapsed') {
    leftSidebarWidthOnMount = COLLAPSED_LEFT_SIDEBAR_WIDTH;
  } else {
    leftSidebarWidthOnMount = resolveDimension(
      VAR_LEFT_SIDEBAR_WIDTH,
      _width,
      !width ||
        (!collapsedStateOverrideOpen &&
          getGridStateFromStorage('isLeftSidebarCollapsed')),
    );
  }

  // Update state from cache on mount
  useEffect(() => {
    const cachedCollapsedState =
      !collapsedStateOverrideOpen &&
      (collapsedState === 'collapsed' ||
        getGridStateFromStorage('isLeftSidebarCollapsed') ||
        false);

    const cachedGridState = getGridStateFromStorage('gridState') || {};

    let leftSidebarWidth =
      !width && cachedGridState[VAR_LEFT_SIDEBAR_FLYOUT]
        ? Math.max(
            cachedGridState[VAR_LEFT_SIDEBAR_FLYOUT],
            DEFAULT_LEFT_SIDEBAR_WIDTH,
          )
        : _width;

    const lastLeftSidebarWidth =
      !width && cachedGridState[VAR_LEFT_SIDEBAR_FLYOUT]
        ? Math.max(
            cachedGridState[VAR_LEFT_SIDEBAR_FLYOUT],
            DEFAULT_LEFT_SIDEBAR_WIDTH,
          )
        : _width;

    if (cachedCollapsedState) {
      leftSidebarWidth = COLLAPSED_LEFT_SIDEBAR_WIDTH;
    }

    setLeftSidebarState({
      isFlyoutOpen: false,
      isResizing,
      isLeftSidebarCollapsed: cachedCollapsedState,
      leftSidebarWidth,
      lastLeftSidebarWidth,
      flyoutLockCount: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every time other than mount,
  // update the local storage and css variables.
  const notFirstRun = useRef(false);
  useEffect(() => {
    if (notFirstRun.current) {
      publishGridState({
        [VAR_LEFT_SIDEBAR_WIDTH]: leftSidebarWidth || leftSidebarWidthOnMount,
        [VAR_LEFT_SIDEBAR_FLYOUT]: lastLeftSidebarWidth,
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
      removeMouseOverListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeftSidebarCollapsed, leftSidebarWidth, id]);

  const onMouseOver = (event: ReactMouseEvent) => {
    const isMouseOnResizeButton =
      (event.target as Element).matches(`[${RESIZE_BUTTON_SELECTOR}]`) ||
      (event.target as Element).matches(`[${RESIZE_BUTTON_SELECTOR}] *`);

    if (isFlyoutOpen || isMouseOnResizeButton || !isLeftSidebarCollapsed) {
      return;
    }

    event.persist();
    flyoutTimerRef.current && clearTimeout(flyoutTimerRef.current);

    if (!mouseOverEventRef.current) {
      mouseOverEventRef.current = (event: MouseEvent) => {
        const leftSidebar: HTMLElement | null = leftSideBarRef.current;

        if (leftSidebar === null || isLockedRef.current) {
          return;
        }

        if (
          !(leftSidebar as HTMLElement).contains(event.target as HTMLElement)
        ) {
          flyoutTimerRef.current && clearTimeout(flyoutTimerRef.current);

          onFlyoutCollapse && onFlyoutCollapse();
          setLeftSidebarState((current) => ({
            ...current,
            isFlyoutOpen: false,
          }));

          removeMouseOverListener();
        }
      };
    }

    document.addEventListener(
      'mouseover',
      mouseOverEventRef.current as EventListener,
      {
        capture: true,
        passive: true,
      } as EventListenerOptions,
    );

    flyoutTimerRef.current = setTimeout(() => {
      setLeftSidebarState((current) => ({
        ...current,
        isFlyoutOpen: true,
      }));
      onFlyoutExpand && onFlyoutExpand();
    }, FLYOUT_DELAY);
  };

  const removeMouseOverListener = () => {
    mouseOverEventRef.current &&
      document.removeEventListener(
        'mouseover',
        mouseOverEventRef.current as EventListener,
        {
          capture: true,
          passive: true,
        } as EventListenerOptions,
      );
  };

  useSkipLink(id, skipLinkTitle);

  const onMouseLeave = (event: ReactMouseEvent) => {
    const isMouseOnResizeButton =
      (event.target as Element).matches(`[${RESIZE_BUTTON_SELECTOR}]`) ||
      (event.target as Element).matches(`[${RESIZE_BUTTON_SELECTOR}] *`);

    if (
      isMouseOnResizeButton ||
      !isLeftSidebarCollapsed ||
      flyoutLockCount > 0
    ) {
      return;
    }
    onFlyoutCollapse && onFlyoutCollapse();
    setTimeout(() => {
      setLeftSidebarState((current) => ({
        ...current,
        isFlyoutOpen: false,
      }));
    }, FLYOUT_DELAY);
  };

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <div
      ref={leftSideBarRef}
      css={leftSidebarStyles(isFixed, isFlyoutOpen)}
      data-testid={testId}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      id={id}
      {...getPageLayoutSlotSelector('left-sidebar')}
    >
      <SlotDimensions
        variableName={VAR_LEFT_SIDEBAR_WIDTH}
        value={notFirstRun.current ? leftSidebarWidth : leftSidebarWidthOnMount}
      />
      <div css={fixedLeftSidebarInnerStyles(isFixed, isFlyoutOpen)}>
        <div
          css={resizeableChildrenWrapperStyle(
            isFlyoutOpen,
            isLeftSidebarCollapsed,
            !notFirstRun.current && collapsedState === 'collapsed',
          )}
        >
          <div css={fixedChildrenWrapperStyle}>{children}</div>
        </div>
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
