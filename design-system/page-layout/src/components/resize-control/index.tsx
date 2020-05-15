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
  IS_SIDEBAR_DRAGGING,
  LEFT_SIDEBAR_FLYOUT_WIDTH,
  MIN_LEFT_SIDEBAR_DRAG_THRESHOLD,
  RESIZE_CONTROL_SELECTOR,
} from '../../common/constants';
import { usePageLayoutResize } from '../../controllers/sidebar-resize-context';

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
  const x = useRef(0);
  // Distance of mouse from left sidebar onMouseDown
  let offset = useRef(0);
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

    if (isLeftSidebarCollapsed) {
      expandLeftSidebar();
    } else {
      collapseLeftSidebar();
    }
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
        event.clientX - leftSidebarWidth - leftPanelWidth,
        maxWidth - leftSidebarWidth - leftPanelWidth,
      ),
      COLLAPSED_LEFT_SIDEBAR_WIDTH - leftSidebarWidth - leftPanelWidth,
    );

    x.current = Math.max(
      leftSidebarWidth + delta - offset.current,
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
    offset.current = 0;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    requestAnimationFrame(() => {
      setIsDragFinished(true);
      onResizeEnd && onResizeEnd();
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

    const leftSidebarWidth = getLeftSidebarWidth();
    const leftPanelWidth = getLeftPanelWidth();
    offset.current = event.clientX - leftSidebarWidth - leftPanelWidth;

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

    shouldCollapse ? collapseLeftSidebar() : expandLeftSidebar();
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
