/** @jsx jsx */
import {
  ElementType,
  Fragment,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { css, Global, jsx } from '@emotion/react';
import { bindAll, UnbindFn } from 'bind-event-listener';
import rafSchd from 'raf-schd';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { UNSAFE_useMediaQuery as useMediaQuery } from '@atlaskit/primitives/responsive';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  IS_SIDEBAR_DRAGGING,
  MIN_LEFT_SIDEBAR_DRAG_THRESHOLD,
  RESIZE_CONTROL_SELECTOR,
  VAR_LEFT_SIDEBAR_WIDTH,
} from '../../common/constants';
import {
  getLeftPanelWidth,
  getLeftSidebarPercentage,
} from '../../common/utils';
import {
  LeftSidebarState,
  SidebarResizeContext,
} from '../../controllers/sidebar-resize-context';
/* import useUpdateCssVar from '../../controllers/use-update-css-vars'; */

import GrabArea from './grab-area';
import ResizeButton from './resize-button';
import Shadow from './shadow';
import { ResizeButtonProps, ResizeControlProps } from './types';

const cssSelector = { [RESIZE_CONTROL_SELECTOR]: true };

const resizeControlStyles = css({
  position: 'absolute',
  insetBlockEnd: 0,
  insetBlockStart: 0,
  insetInlineStart: '100%',
  outline: 'none',
});

const showResizeButtonStyles = css({
  '--ds--resize-button--opacity': 1,
});

// @ts-expect-error adding `!important` to style rules is currently a type error
const globalResizingStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '*': {
    // Setting the cursor to be `ew-resize` on all elements so that even if the user
    // pointer slips off the resize handle, the cursor will still be the resize cursor
    cursor: 'ew-resize !important',

    // Blocking selection while resizing
    // Notes:
    // - This prevents a user selection being caused by resizing
    // - Safari + Firefox → all good
    // - Chrome → This will undo the current selection while resizing (not ideal)
    //   - The current selection will resume after resizing
    userSelect: 'none !important',
  },
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  iframe: {
    // Disabling pointer events on iframes when resizing
    // as iframes will swallower user events when the user is over them
    pointerEvents: 'none !important',
  },
  // Note: We _could_ also disable `pointer-events` on all elements during resizing.
  // However, to minimize risk we are just disabling `pointer-events` on iframes
  // as that change is actually needed to fix resizing with iframes
});

const ResizeControl = ({
  testId,
  overrides,
  resizeButtonLabel = 'Current project sidebar',
  valueTextLabel = 'Width',
  resizeGrabAreaLabel = 'Resize Current Project Sidebar',
  onResizeStart,
  onResizeEnd,
}: ResizeControlProps) => {
  const {
    toggleLeftSidebar,
    collapseLeftSidebar,
    leftSidebarState,
    setLeftSidebarState,
  } = useContext(SidebarResizeContext);
  const { isLeftSidebarCollapsed } = leftSidebarState;
  const sidebarWidth = useRef(leftSidebarState[VAR_LEFT_SIDEBAR_WIDTH]);
  // Distance of mouse from left sidebar onMouseDown
  const offset = useRef(0);
  const keyboardEventTimeout = useRef<number>();
  const [isGrabAreaFocused, setIsGrabAreaFocused] = useState(false);
  const unbindEvents = useRef<UnbindFn | null>(null);
  const mobileMediaQuery = useMediaQuery('below.sm');

  // Used in some cases to ensure function references don't have to change
  // TODO: more functions could use `stableSidebarState` rather than `leftSidebarState`
  const stableSidebarState = useRef(leftSidebarState);
  useEffect(() => {
    stableSidebarState.current = leftSidebarState;
  }, [leftSidebarState]);

  const toggleSideBar = useCallback(
    (event?: ReactMouseEvent | ReactKeyboardEvent<HTMLButtonElement>) => {
      // don't cascade down to the LeftSidebarOuter
      event?.stopPropagation();

      toggleLeftSidebar();
    },
    [toggleLeftSidebar],
  );

  const onMouseDown = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (isLeftSidebarCollapsed) {
      return;
    }

    // TODO: should only a primary pointer be able to start a resize?
    // Keeping as is for now, but worth considering

    // It is possible for a mousedown to fire during a resize
    // Example: the user presses another pointer button while dragging
    if (leftSidebarState.isResizing) {
      // the resize will be cancelled by our global event listeners
      return;
    }

    offset.current =
      event.clientX -
      leftSidebarState[VAR_LEFT_SIDEBAR_WIDTH] -
      getLeftPanelWidth();

    unbindEvents.current = bindAll(window, [
      {
        type: 'mousemove',
        listener: function (event: MouseEvent) {
          onUpdateResize({ clientX: event.clientX });
        },
      },
      { type: 'mouseup', listener: onFinishResizing },
      {
        type: 'mousedown',
        // this mousedown event listener is being added in the bubble phase
        // on a higher event target than the resize handle.
        // This means that the original mousedown event that triggers a resize
        // can hit this mousedown handler. To get around that, we only call
        // `onFinishResizing` after an animation frame so we don't pick up the original event
        // Alternatives:
        // 1. Add the window 'mousedown' event listener in the capture phase
        // 👎 A 'mousedown' during a resize would trigger a new resize to start
        // 2. Do 1. and call `event.preventDefault()`, then check for `event.defaultPrevented` inside
        // the grab handle `onMouseDown`
        // 👎 Not ideal to cancel events if we don't have to
        listener: (() => {
          let hasFramePassed = false;
          requestAnimationFrame(() => {
            hasFramePassed = true;
          });

          return function listener() {
            if (hasFramePassed) {
              onFinishResizing();
            }
          };
        })(),
      },
      { type: 'visibilitychange', listener: onFinishResizing },
      // A 'click' event should never be hit as the 'mouseup' will come first and cause
      // these event listeners to be unbound. I just added 'click' for extreme safety (paranoia)
      { type: 'click', listener: onFinishResizing },
      {
        type: 'keydown',
        listener: (event: KeyboardEvent) => {
          // Can cancel resizing by pressing "Escape"
          // Will return sidebar to the same size it was before the resizing started
          if (event.key === 'Escape') {
            sidebarWidth.current = Math.max(
              leftSidebarState.lastLeftSidebarWidth,
              COLLAPSED_LEFT_SIDEBAR_WIDTH,
            );

            document.documentElement.style.setProperty(
              `--${VAR_LEFT_SIDEBAR_WIDTH}`,
              `${sidebarWidth.current}px`,
            );
            onFinishResizing();
          }
        },
      },
    ]);
    document.documentElement.setAttribute(IS_SIDEBAR_DRAGGING, 'true');

    const newLeftbarState = {
      ...leftSidebarState,
      isResizing: true,
    };

    setLeftSidebarState(newLeftbarState);
    onResizeStart && onResizeStart(newLeftbarState);
  };

  const onResizeOffLeftOfScreen = () => {
    onUpdateResize.cancel();
    unbindEvents.current?.();
    unbindEvents.current = null;
    document.documentElement.removeAttribute(IS_SIDEBAR_DRAGGING);
    offset.current = 0;

    collapseLeftSidebar(undefined, true);
  };

  // It is important that `onUpdateResize` is a stable function reference, so that:
  // 1. we ensure we are correctly throttling with `requestAnimationFrame`
  // 2. that a `onUpdateResize` will cancel the one and only pending frame
  // To help ensure `onUpdateResize` is stable, we are putting the last state into a ref
  const [onUpdateResize] = useState(() =>
    rafSchd(({ clientX }: { clientX: number }) => {
      // Allow the sidebar to be 50% of the available page width
      const maxWidth = Math.round(window.innerWidth / 2);
      const leftPanelWidth = getLeftPanelWidth();
      const leftSidebarWidth = stableSidebarState.current.leftSidebarWidth;
      const hasResizedOffLeftOfScreen = clientX < 0;

      if (hasResizedOffLeftOfScreen) {
        onResizeOffLeftOfScreen();
        return;
      }

      const delta = Math.max(
        Math.min(
          clientX - leftSidebarWidth - leftPanelWidth,
          maxWidth - leftSidebarWidth - leftPanelWidth,
        ),
        COLLAPSED_LEFT_SIDEBAR_WIDTH - leftSidebarWidth - leftPanelWidth,
      );

      sidebarWidth.current = Math.max(
        leftSidebarWidth + delta - offset.current,
        COLLAPSED_LEFT_SIDEBAR_WIDTH,
      );

      document.documentElement.style.setProperty(
        `--${VAR_LEFT_SIDEBAR_WIDTH}`,
        `${sidebarWidth.current}px`,
      );
    }),
  );

  const onFinishResizing = () => {
    if (isLeftSidebarCollapsed) {
      return;
    }

    document.documentElement.removeAttribute(IS_SIDEBAR_DRAGGING);

    // TODO: the control flow is pretty strange as the first codepath which calls `collapseLeftSidebar()`
    // does not return an updated state snapshot.
    let updatedLeftSidebarState: LeftSidebarState | null = null;

    // If it is dragged to below the threshold,
    // collapse the navigation
    if (sidebarWidth.current < MIN_LEFT_SIDEBAR_DRAG_THRESHOLD) {
      // TODO: for this codepath, `onCollapse` occurs before `onResizeEnd` which seems wrong
      document.documentElement.style.setProperty(
        `--${VAR_LEFT_SIDEBAR_WIDTH}`,
        `${COLLAPSED_LEFT_SIDEBAR_WIDTH}px`,
      );
      collapseLeftSidebar(undefined, true);
    }
    // If it is dragged to position in between the
    // min threshold and default width
    // expand the nav to the default width
    else if (
      sidebarWidth.current > MIN_LEFT_SIDEBAR_DRAG_THRESHOLD &&
      sidebarWidth.current < DEFAULT_LEFT_SIDEBAR_WIDTH
    ) {
      document.documentElement.style.setProperty(
        `--${VAR_LEFT_SIDEBAR_WIDTH}`,
        `${DEFAULT_LEFT_SIDEBAR_WIDTH}px`,
      );
      updatedLeftSidebarState = {
        ...leftSidebarState,
        isResizing: false,
        [VAR_LEFT_SIDEBAR_WIDTH]: DEFAULT_LEFT_SIDEBAR_WIDTH,
        lastLeftSidebarWidth: DEFAULT_LEFT_SIDEBAR_WIDTH,
      };
      setLeftSidebarState(updatedLeftSidebarState);
    } else {
      // otherwise resize it to the desired width
      updatedLeftSidebarState = {
        ...leftSidebarState,
        isResizing: false,
        [VAR_LEFT_SIDEBAR_WIDTH]: sidebarWidth.current,
        lastLeftSidebarWidth: sidebarWidth.current,
      };
      setLeftSidebarState(updatedLeftSidebarState);
    }

    unbindEvents.current?.();
    unbindEvents.current = null;
    onUpdateResize.cancel();
    sidebarWidth.current = 0;
    offset.current = 0;

    // TODO: no idea why this is in an animation frame
    requestAnimationFrame(() => {
      setIsGrabAreaFocused(false);
      // Note: the `collapseSidebar` codepath does not return state, so we need to pull it from the ref
      onResizeEnd?.(updatedLeftSidebarState ?? stableSidebarState.current);
    });
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (isLeftSidebarCollapsed || !isGrabAreaFocused) {
      return false;
    }

    const { key } = event;
    const isLeftOrTopArrow =
      key === 'ArrowLeft' ||
      key === 'ArrowUp' ||
      key === 'Left' ||
      key === 'Up';
    const isRightOrBottomArrow =
      key === 'ArrowRight' ||
      key === 'ArrowDown' ||
      key === 'Right' ||
      key === 'Down';

    const isSpaceOrEnter = key === 'Enter' || key === 'Spacebar' || key === ' ';
    if (isSpaceOrEnter) {
      toggleSideBar(event);
      event.preventDefault();
    }

    if (isLeftOrTopArrow || isRightOrBottomArrow) {
      event.preventDefault(); // prevent content scroll
      onResizeStart && onResizeStart(leftSidebarState);

      const step = 10;
      const stepValue = isLeftOrTopArrow ? -step : step;
      const { leftSidebarWidth } = leftSidebarState;
      const maxWidth = Math.round(window.innerWidth / 2) - getLeftPanelWidth();
      const hasModifierKey =
        event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
      let width = leftSidebarWidth + stepValue;

      if (width <= DEFAULT_LEFT_SIDEBAR_WIDTH) {
        width = DEFAULT_LEFT_SIDEBAR_WIDTH;
        document.documentElement.style.setProperty(
          `--${VAR_LEFT_SIDEBAR_WIDTH}`,
          `${DEFAULT_LEFT_SIDEBAR_WIDTH - 20}px`,
        );
      } else if (width > maxWidth) {
        width = maxWidth;
        document.documentElement.style.setProperty(
          `--${VAR_LEFT_SIDEBAR_WIDTH}`,
          `${maxWidth + 20}px`,
        );
      } else if (hasModifierKey) {
        width = isRightOrBottomArrow ? maxWidth : DEFAULT_LEFT_SIDEBAR_WIDTH;
      }

      // Nesting the setTimeout within requestAnimationFrame helps
      // the browser schedule the setTimeout call in an efficient manner
      requestAnimationFrame(() => {
        keyboardEventTimeout.current = window.setTimeout(() => {
          keyboardEventTimeout.current &&
            clearTimeout(keyboardEventTimeout.current);

          document.documentElement.style.setProperty(
            `--${VAR_LEFT_SIDEBAR_WIDTH}`,
            `${width}px`,
          );

          const updatedLeftSidebarState = {
            ...leftSidebarState,
            [VAR_LEFT_SIDEBAR_WIDTH]: width,
            lastLeftSidebarWidth: width,
          };
          setLeftSidebarState(updatedLeftSidebarState);
          onResizeEnd && onResizeEnd(updatedLeftSidebarState);
        }, 50);
      });
    }
  };

  const onFocus = useCallback(() => {
    setIsGrabAreaFocused(true);
  }, []);
  const onBlur = useCallback(() => {
    setIsGrabAreaFocused(false);
  }, []);

  const resizeButton = {
    render: (
      Component: ElementType<ResizeButtonProps>,
      props: ResizeButtonProps,
    ) => <Component {...props} />,
    ...(overrides && overrides.ResizeButton),
  };

  // This width is calculated once only on mount.
  // This means resizing the window will cause this value to be incorrect for screen reader users,
  // however this comes with a substantial performance gain and so is considered acceptable.
  const maxAriaWidth = useMemo(() => {
    const innerWidth = typeof window === 'undefined' ? 0 : window.innerWidth;
    return Math.round(innerWidth / 2) - getLeftPanelWidth();
  }, []);

  const leftSidebarPercentageExpanded = getLeftSidebarPercentage(
    leftSidebarState.leftSidebarWidth,
    maxAriaWidth,
  );

  return (
    <Fragment>
      <div
        {...cssSelector}
        css={[
          resizeControlStyles,
          (isGrabAreaFocused || isLeftSidebarCollapsed) &&
            showResizeButtonStyles,
        ]}
      >
        <Shadow testId={testId && `${testId}-shadow`} />
        {
          // Without the feature flag, always show the GrabArea
          (!getBooleanFF(
            'platform.design-system-team.responsive-page-layout-left-sidebar_p8r7g',
          ) ||
            // With the feature flag, only show the GrabArea if we're not on the mobile viewport
            (getBooleanFF(
              'platform.design-system-team.responsive-page-layout-left-sidebar_p8r7g',
            ) &&
              !mobileMediaQuery?.matches)) && (
            <GrabArea
              isDisabled={isLeftSidebarCollapsed}
              isLeftSidebarCollapsed={isLeftSidebarCollapsed}
              label={resizeGrabAreaLabel}
              valueTextLabel={valueTextLabel}
              leftSidebarPercentageExpanded={leftSidebarPercentageExpanded}
              onBlur={onBlur}
              onFocus={onFocus}
              onKeyDown={onKeyDown}
              onMouseDown={onMouseDown}
              testId={testId && `${testId}-grab-area`}
            />
          )
        }
        {resizeButton.render(ResizeButton, {
          isLeftSidebarCollapsed:
            getBooleanFF(
              'platform.design-system-team.responsive-page-layout-left-sidebar_p8r7g',
            ) && mobileMediaQuery?.matches
              ? !leftSidebarState.isFlyoutOpen
              : isLeftSidebarCollapsed,
          label: resizeButtonLabel,
          onClick: toggleSideBar,
          testId: testId && `${testId}-resize-button`,
        })}
      </div>
      {leftSidebarState.isResizing ? (
        <Global styles={globalResizingStyles} />
      ) : null}
    </Fragment>
  );
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default ResizeControl;
