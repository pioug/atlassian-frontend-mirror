import React, {
  FC,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { bind } from 'bind-event-listener';

import noop from '@atlaskit/ds-lib/noop';
import { isReducedMotion } from '@atlaskit/motion';
import { UNSAFE_useMediaQuery as useMediaQuery } from '@atlaskit/primitives/responsive';

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
const handleDataAttributesAndCb = (
  callback: Callback = noop,
  leftSidebarState: LeftSidebarState,
) => {
  document.documentElement.removeAttribute(IS_SIDEBAR_COLLAPSING);
  callback(leftSidebarState);
};

const leftSidebarSelector = getPageLayoutSlotCSSSelector('left-sidebar');

type Transition = {
  action: 'collapse' | 'expand';
  abort: () => void;
  complete: () => void;
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SidebarResizeController: FC<SidebarResizeControllerProps> = ({
  children,
  onLeftSidebarExpand: onExpand,
  onLeftSidebarCollapse: onCollapse,
}) => {
  const [leftSidebarState, setLeftSidebarState] = useState<LeftSidebarState>({
    isFlyoutOpen: false,
    isResizing: false,
    isLeftSidebarCollapsed: false,
    leftSidebarWidth: 0,
    lastLeftSidebarWidth: 0,
    flyoutLockCount: 0,
    isFixed: true,
  });

  const {
    leftSidebarWidth,
    lastLeftSidebarWidth,
    isResizing,
    flyoutLockCount,
    isFixed,
    isLeftSidebarCollapsed,
    isFlyoutOpen,
  } = leftSidebarState;

  // We put the latest callbacks into a ref so we can always have the latest
  // functions in our transitionend listeners
  const stableRef = useRef({ onExpand, onCollapse });
  useEffect(() => {
    stableRef.current = { onExpand, onCollapse };
  }, [onExpand, onCollapse]);

  const transition = useRef<Transition | null>(null);
  const mobileMediaQuery = useMediaQuery('below.sm');

  const isOpen = mobileMediaQuery?.matches
    ? isFlyoutOpen
    : !isLeftSidebarCollapsed;

  const expandLeftSidebar = useCallback(() => {
    if (isOpen) {
      return;
    }

    // If the user is at a mobile viewport when this runs, we handle it differently
    // We don't expand at mobile widths; instead we use a flyout which is treated the same otherwise
    if (mobileMediaQuery?.matches) {
      const flyoutOpenSidebarState = {
        isResizing: false,
        isLeftSidebarCollapsed: true,
        leftSidebarWidth: COLLAPSED_LEFT_SIDEBAR_WIDTH,
        lastLeftSidebarWidth: leftSidebarWidth,
        isFlyoutOpen: true,
        flyoutLockCount: 0,
        isFixed,
      };

      setLeftSidebarState(flyoutOpenSidebarState);

      // Flush the desktop transitions, cleanup, and call the `onExpand` still
      transition.current?.complete();
      handleDataAttributesAndCb(
        stableRef.current.onExpand,
        flyoutOpenSidebarState,
      );

      return;
    }

    if (
      isResizing ||
      !isLeftSidebarCollapsed ||
      // already expanding
      transition.current?.action === 'expand'
    ) {
      return;
    }

    // flush existing transition
    transition.current?.complete();

    const width = Math.max(lastLeftSidebarWidth, DEFAULT_LEFT_SIDEBAR_WIDTH);

    const updatedLeftSidebarState = {
      isLeftSidebarCollapsed: false,
      isFlyoutOpen: false,
      leftSidebarWidth: width,
      lastLeftSidebarWidth,
      isResizing,
      flyoutLockCount,
      isFixed,
    };

    setLeftSidebarState(updatedLeftSidebarState);

    function finish() {
      handleDataAttributesAndCb(
        stableRef.current.onExpand,
        updatedLeftSidebarState,
      );
    }

    const sidebar = document.querySelector(leftSidebarSelector);
    // onTransitionEnd isn't triggered when a user prefers reduced motion
    if (isReducedMotion() || !sidebar) {
      finish();
      return;
    }

    const unbindEvent = bind(sidebar, {
      type: 'transitionend',
      listener(event: Event) {
        if (
          event.target === sidebar &&
          (event as TransitionEvent).propertyName === 'width'
        ) {
          transition.current?.complete();
        }
      },
    });
    const value: Transition = {
      action: 'expand',
      complete: () => {
        value.abort();
        finish();
      },
      abort: () => {
        unbindEvent();
        transition.current = null;
      },
    };
    transition.current = value;
  }, [
    isOpen,
    mobileMediaQuery,
    isResizing,
    isLeftSidebarCollapsed,
    lastLeftSidebarWidth,
    flyoutLockCount,
    isFixed,
    leftSidebarWidth,
  ]);

  const collapseLeftSidebar = useCallback(
    (
      event?: MouseEvent | KeyboardEvent,
      collapseWithoutTransition?: boolean,
    ) => {
      if (!isOpen) {
        return;
      }

      // If the user is at a mobile viewport when this runs, we handle it differently
      // We don't collapse at mobile widths; instead we close the flyout.
      if (mobileMediaQuery?.matches) {
        const flyoutCloseSidebarState = {
          isResizing: false,
          isLeftSidebarCollapsed: true,
          leftSidebarWidth: COLLAPSED_LEFT_SIDEBAR_WIDTH,
          lastLeftSidebarWidth,
          isFlyoutOpen: false,
          flyoutLockCount: 0,
          isFixed,
        };

        setLeftSidebarState(flyoutCloseSidebarState);

        // Flush the desktop transitions, cleanup, and call the `onCollapse` still
        transition.current?.complete();
        handleDataAttributesAndCb(
          stableRef.current.onCollapse,
          flyoutCloseSidebarState,
        );

        return;
      }

      if (
        isResizing ||
        isLeftSidebarCollapsed ||
        // already collapsing
        transition.current?.action === 'collapse'
      ) {
        return;
      }

      // flush existing transition
      transition.current?.complete();

      // data-attribute is used as a CSS selector to sync the hiding/showing
      // of the nav contents with expand/collapse animation
      document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSING, 'true');
      const updatedLeftSidebarState = {
        isLeftSidebarCollapsed: true,
        isFlyoutOpen: false,
        leftSidebarWidth: COLLAPSED_LEFT_SIDEBAR_WIDTH,
        lastLeftSidebarWidth: leftSidebarWidth,
        isResizing,
        flyoutLockCount,
        isFixed,
      };

      setLeftSidebarState(updatedLeftSidebarState);

      function finish() {
        handleDataAttributesAndCb(
          stableRef.current.onCollapse,
          updatedLeftSidebarState,
        );
      }

      const sidebar = document.querySelector(leftSidebarSelector);

      // onTransitionEnd isn't triggered when a user prefers reduced motion
      if (collapseWithoutTransition || isReducedMotion() || !sidebar) {
        finish();
        return;
      }

      const unbindEvent = bind(sidebar, {
        type: 'transitionend',
        listener(event: Event) {
          if (
            sidebar === event.target &&
            (event as TransitionEvent).propertyName === 'width'
          ) {
            transition.current?.complete();
          }
        },
      });

      const value: Transition = {
        action: 'collapse',
        complete: () => {
          value.abort();
          finish();
        },
        abort: () => {
          unbindEvent();
          transition.current = null;
        },
      };

      transition.current = value;
    },
    [
      isOpen,
      mobileMediaQuery,
      isResizing,
      isLeftSidebarCollapsed,
      leftSidebarWidth,
      flyoutLockCount,
      isFixed,
      lastLeftSidebarWidth,
    ],
  );

  /**
   * Conditionally toggle the expanding or collapsing the sidebars.
   * This supports our mobile flyout mode as well.
   */
  const toggleLeftSidebar = useCallback(
    (
      event?: MouseEvent | KeyboardEvent,
      collapseWithoutTransition?: boolean,
    ) => {
      if (isOpen) {
        collapseLeftSidebar(event, collapseWithoutTransition);
      } else {
        expandLeftSidebar();
      }
    },
    [isOpen, expandLeftSidebar, collapseLeftSidebar],
  );

  // Make sure we finish any lingering transitions when unmounting
  useEffect(function mount() {
    return function unmount() {
      transition.current?.abort();
    };
  }, []);

  const context: SidebarResizeContextValue = useMemo(
    () => ({
      isLeftSidebarCollapsed: !isOpen, // Technically this isn't quite true, but with mobile it's a bit safer if products are using this to roll their own collapse/expand
      expandLeftSidebar,
      collapseLeftSidebar,
      leftSidebarState,
      setLeftSidebarState,
      toggleLeftSidebar,
    }),
    [
      isOpen,
      expandLeftSidebar,
      collapseLeftSidebar,
      leftSidebarState,
      toggleLeftSidebar,
    ],
  );

  return (
    <SidebarResizeContext.Provider value={context}>
      {children}
    </SidebarResizeContext.Provider>
  );
};
