/** @jsx jsx */
import { useRef, useState, MouseEvent as ReactMouseEvent } from 'react';
import { jsx } from '@emotion/core';
import rafSchd from 'raf-schd';

import { usePageLayoutResize } from '../../controllers';
import GrabArea from './grab-area';
import ResizeButton from './resize-button';
import { resizeControlCSS, resizeIconButtonCSS, shadowCSS } from './styles';
import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  LEFT_SIDEBAR_FLYOUT_WIDTH,
  MIN_LEFT_SIDEBAR_DRAG_THRESHOLD,
  IS_SIDEBAR_DRAGGING,
  IS_FLYOUT_OPEN,
  RESIZE_CONTROL_SELECTOR,
} from '../../common/constants';

const cssSelector = { [RESIZE_CONTROL_SELECTOR]: true };
const noop = () => {};
const Shadow = ({ testId }: { testId?: string }) => (
  <div data-testid={testId} css={shadowCSS} />
);

const ResizeControl = ({ testId }: { testId?: string }) => {
  const x = useRef(0);
  const [isDragFinished, setIsDragFinished] = useState(true);
  const {
    isLeftSidebarCollapsed,
    expandLeftSidebar,
    collapseLeftSidebar,
    setLeftSidebarWidth,
    getLeftSidebarWidth,
    getLeftPanelWidth,
  } = usePageLayoutResize();

  const toggleSideBar = (e: ReactMouseEvent) => {
    if (!isDragFinished) {
      return;
    }
    document.documentElement.removeAttribute(IS_FLYOUT_OPEN);
    isLeftSidebarCollapsed ? expandLeftSidebar() : collapseLeftSidebar();
  };

  const onMouseMove = rafSchd((event: MouseEvent) => {
    // Allow the sidebar to be 50% of the available page width
    const maxWidth = Math.round(window.innerWidth / 2);
    const leftSidebarWidth = getLeftSidebarWidth();
    const leftPanelWidth = getLeftPanelWidth();
    const invalidDrag = event.clientX < 0;

    if (invalidDrag) {
      cancelDrag(true);
    }

    const delta = Math.max(
      Math.min(
        event.pageX - leftSidebarWidth - leftPanelWidth,
        maxWidth - leftSidebarWidth - leftPanelWidth,
      ),
      COLLAPSED_LEFT_SIDEBAR_WIDTH - leftSidebarWidth - leftPanelWidth,
    );

    x.current = Math.max(
      leftSidebarWidth + delta,
      COLLAPSED_LEFT_SIDEBAR_WIDTH,
    );

    setIsDragFinished(false);
    setLeftSidebarWidth(x.current);
  });

  const onMouseUp = () => {
    if (isLeftSidebarCollapsed) return;
    document.documentElement.removeAttribute(IS_SIDEBAR_DRAGGING);

    onMouseMove.cancel();
    x.current = 0;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    requestAnimationFrame(() => {
      setIsDragFinished(true);
    });

    if (getLeftSidebarWidth() < MIN_LEFT_SIDEBAR_DRAG_THRESHOLD) {
      collapseLeftSidebar();
    }
    if (
      getLeftSidebarWidth() > MIN_LEFT_SIDEBAR_DRAG_THRESHOLD &&
      getLeftSidebarWidth() < LEFT_SIDEBAR_FLYOUT_WIDTH
    ) {
      expandLeftSidebar();
    }
  };

  const onMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (isLeftSidebarCollapsed) return;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.documentElement.setAttribute(IS_SIDEBAR_DRAGGING, 'true');
  };

  const cancelDrag = (shouldCollapse?: boolean) => {
    onMouseMove.cancel();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.documentElement.removeAttribute(IS_SIDEBAR_DRAGGING);
    requestAnimationFrame(() => setIsDragFinished(true));

    shouldCollapse ? collapseLeftSidebar() : expandLeftSidebar();
  };

  return (
    <div {...cssSelector} css={resizeControlCSS}>
      <Shadow testId={testId && `${testId}-shadow`} />
      <GrabArea
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={!isLeftSidebarCollapsed ? toggleSideBar : noop}
        testId={testId && `${testId}-grab-area`}
      />
      <ResizeButton
        css={resizeIconButtonCSS(isLeftSidebarCollapsed)}
        isLeftSidebarCollapsed={isLeftSidebarCollapsed}
        label="Toggle navigation"
        onClick={toggleSideBar}
        testId={testId && `${testId}-resize-button`}
      />
    </div>
  );
};

export default ResizeControl;
