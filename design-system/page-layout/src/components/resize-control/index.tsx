/** @jsx jsx */
import {
  ElementType,
  MouseEvent as ReactMouseEvent,
  useRef,
  useState,
} from 'react';

import { jsx } from '@emotion/core';
import rafSchd from 'raf-schd';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  IS_SIDEBAR_DRAGGING,
  LEFT_SIDEBAR_WIDTH,
  MIN_LEFT_SIDEBAR_DRAG_THRESHOLD,
  RESIZE_CONTROL_SELECTOR,
} from '../../common/constants';
import { getLeftPanelWidth } from '../../common/utils';
import { usePageLayoutResize } from '../../controllers/sidebar-resize-context';
/* import useUpdateCssVar from '../../controllers/use-update-css-vars'; */

import GrabArea from './grab-area';
import ResizeButton from './resize-button';
import { resizeControlCSS, resizeIconButtonCSS, shadowCSS } from './styles';
import { ResizeButtonProps, ResizeControlProps } from './types';

const cssSelector = { [RESIZE_CONTROL_SELECTOR]: true };
const noop = () => {};
const Shadow = ({ testId }: { testId?: string }) => (
  <div data-testid={testId} css={shadowCSS} />
);

const ResizeControl = ({
  testId,
  overrides,
  resizeButtonLabel = '',
  onResizeStart,
  onResizeEnd,
}: ResizeControlProps) => {
  const {
    expandLeftSidebar,
    collapseLeftSidebar,
    leftSidebarState,
    setLeftSidebarState,
  } = usePageLayoutResize();
  const { isLeftSidebarCollapsed } = leftSidebarState;
  const x = useRef(leftSidebarState[LEFT_SIDEBAR_WIDTH]);
  // Distance of mouse from left sidebar onMouseDown
  let offset = useRef(0);
  const [isDragFinished, setIsDragFinished] = useState(true);

  const toggleSideBar = (e: ReactMouseEvent) => {
    if (!isDragFinished) {
      return;
    }

    if (isLeftSidebarCollapsed) {
      expandLeftSidebar();
    } else {
      collapseLeftSidebar();
    }
  };

  const onMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (isLeftSidebarCollapsed) return;

    offset.current =
      event.clientX -
      leftSidebarState[LEFT_SIDEBAR_WIDTH] -
      getLeftPanelWidth();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.documentElement.setAttribute(IS_SIDEBAR_DRAGGING, 'true');

    onResizeStart && onResizeStart();
  };

  const cancelDrag = (shouldCollapse?: boolean) => {
    onMouseMove.cancel();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.documentElement.removeAttribute(IS_SIDEBAR_DRAGGING);
    requestAnimationFrame(() => setIsDragFinished(true));
    offset.current = 0;

    collapseLeftSidebar(true);
  };

  const onMouseMove = rafSchd((event: MouseEvent) => {
    // Allow the sidebar to be 50% of the available page width
    const maxWidth = Math.round(window.innerWidth / 2);
    const leftPanelWidth = getLeftPanelWidth();
    const { leftSidebarWidth } = leftSidebarState;
    const invalidDrag = event.clientX < 0;

    if (invalidDrag) {
      cancelDrag();
    }
    const delta = Math.max(
      Math.min(
        event.clientX - leftSidebarWidth - leftPanelWidth,
        maxWidth - leftSidebarWidth - leftPanelWidth,
      ),
      COLLAPSED_LEFT_SIDEBAR_WIDTH - leftSidebarWidth - leftPanelWidth,
    );

    x.current = Math.max(
      leftSidebarWidth + delta - offset.current,
      COLLAPSED_LEFT_SIDEBAR_WIDTH,
    );

    document.documentElement.style.setProperty(
      `--${LEFT_SIDEBAR_WIDTH}`,
      `${x.current}px`,
    );
    setIsDragFinished(false);
  });

  const cleanupAfterResize = () => {
    x.current = 0;
    offset.current = 0;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const onMouseUp = () => {
    if (isLeftSidebarCollapsed) return;

    document.documentElement.removeAttribute(IS_SIDEBAR_DRAGGING);
    onMouseMove.cancel();

    requestAnimationFrame(() => {
      setIsDragFinished(true);
      onResizeEnd && onResizeEnd();
    });

    // If it is dragged to below the threshold,
    // collapse the navigation
    if (x.current < MIN_LEFT_SIDEBAR_DRAG_THRESHOLD) {
      document.documentElement.style.setProperty(
        `--${LEFT_SIDEBAR_WIDTH}`,
        `${COLLAPSED_LEFT_SIDEBAR_WIDTH}px`,
      );
      collapseLeftSidebar(true);
      cleanupAfterResize();
      return;
    }

    // If it is dragged to position in between the
    // min threshold and default width
    // expand the nav to the default width
    if (
      x.current > MIN_LEFT_SIDEBAR_DRAG_THRESHOLD &&
      x.current < DEFAULT_LEFT_SIDEBAR_WIDTH
    ) {
      document.documentElement.style.setProperty(
        `--${LEFT_SIDEBAR_WIDTH}`,
        `${DEFAULT_LEFT_SIDEBAR_WIDTH}px`,
      );
      setLeftSidebarState({
        ...leftSidebarState,
        [LEFT_SIDEBAR_WIDTH]: DEFAULT_LEFT_SIDEBAR_WIDTH,
        lastLeftSidebarWidth: DEFAULT_LEFT_SIDEBAR_WIDTH,
      });
      cleanupAfterResize();
      return;
    }

    // otherwise resize it to the desired width
    setLeftSidebarState({
      ...leftSidebarState,
      [LEFT_SIDEBAR_WIDTH]: x.current,
      lastLeftSidebarWidth: x.current,
    });
    cleanupAfterResize();
  };

  const resizeButton = {
    render: (
      Component: ElementType<ResizeButtonProps>,
      props: ResizeButtonProps,
    ) => <Component {...props} />,
    ...(overrides && overrides.ResizeButton),
  };

  return (
    <div {...cssSelector} css={resizeControlCSS}>
      <Shadow testId={testId && `${testId}-shadow`} />
      <GrabArea
        onMouseDown={onMouseDown}
        onClick={!isLeftSidebarCollapsed ? toggleSideBar : noop}
        testId={testId && `${testId}-grab-area`}
        isLeftSidebarCollapsed={isLeftSidebarCollapsed}
      />
      {resizeButton.render(ResizeButton, {
        css: resizeIconButtonCSS(isLeftSidebarCollapsed),
        isLeftSidebarCollapsed,
        label: resizeButtonLabel,
        onClick: toggleSideBar,
        testId: testId && `${testId}-resize-button`,
      })}
    </div>
  );
};

export default ResizeControl;
