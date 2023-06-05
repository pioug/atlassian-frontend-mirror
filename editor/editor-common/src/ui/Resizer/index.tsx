import React, { PropsWithChildren, RefObject } from 'react';

import classnames from 'classnames';
import { HandleComponent, Resizable, ResizeDirection } from 're-resizable';

import {
  resizerHandleLeftClassName,
  resizerHandlePadding,
  resizerHandlerClassName,
  resizerHandleRightClassName,
  resizerHandleStickyClassName,
  resizerHandleZIndex,
  resizerItemClassName,
} from '../../styles/shared/resizer';

import {
  EnabledHandles,
  HandleAlignmentMethod,
  HandleResize,
  HandlerHeightSizeType,
  HandleStyles,
} from './types';

export interface ResizableNumberSize {
  width: number;
  height: number;
}

export type ResizerProps = {
  // Enables resizing in left and/or right direction and enables handles
  enable: EnabledHandles;
  // initial width for now as Resizer is using defaultSize.
  width: number;

  // Resizer lifecycle callbacks:
  //    1. handleResizeStart returns new width based on calculation in parent component
  handleResizeStart: () => number;
  //    2. handleResize returns new width based on calculation in parent component
  handleResize: HandleResize;
  //    3. handleResizeStop returns new width based on calculation in parent component
  handleResizeStop: HandleResize;

  // positions handles closer or further away from the resizable element
  // if not provided is set to 13px.
  innerPadding?: number;

  // Props to add:
  // sets classes for handles
  // eg: handleClassName={'node-handle'} will become 'node-handle-right' and/or 'node-handle-left'
  handleClassName?: string;
  // sets class name for the resizable component
  // if not provided Resizer class will be used
  // (resizerItemClassName in packages/editor/editor-common/src/styles/shared/resizer.ts)
  className?: string;
  minWidth?: number;
  maxWidth?: number;

  // These are currently used in media to fix media-specific bugs and they likely will be required to be added
  // But we can remove them until it's clear how we want to use them.
  handleWrapperStyle?: React.CSSProperties;
  handleComponent?: HandleComponent;

  handlerHeightSize?: HandlerHeightSizeType;

  // This is the method that should be used by the resizer when positioning the handles
  handleAlignmentMethod?: HandleAlignmentMethod;
};

export default function ResizerNext(
  props: PropsWithChildren<ResizerProps>,
): JSX.Element {
  const resizable: RefObject<Resizable> = React.useRef(null);

  const {
    handleResize,
    handleResizeStart,
    handleResizeStop,
    handlerHeightSize = 'medium',
    handleAlignmentMethod = 'center',
  } = props;

  const onResizeStart = React.useCallback(
    (
      event:
        | React.MouseEvent<HTMLDivElement>
        | React.TouchEvent<HTMLDivElement>,
    ) => {
      // prevent creating a drag event on Firefox
      event.preventDefault();

      handleResizeStart();
    },
    [handleResizeStart],
  );

  const onResize = React.useCallback(
    (
      _event: MouseEvent | TouchEvent,
      _direction: ResizeDirection,
      _elementRef: HTMLDivElement,
      delta: ResizableNumberSize,
    ) => {
      const resizableCurrent = resizable.current;
      if (!resizableCurrent || !resizableCurrent.state.original) {
        return;
      }

      const originalState = {
        x: resizableCurrent.state.original.x,
        y: resizableCurrent.state.original.y,
        width: resizableCurrent.state.original.width,
        height: resizableCurrent.state.original.height,
      };
      handleResize(originalState, delta);
    },
    [handleResize],
  );

  const onResizeStop = React.useCallback(
    (
      _event: MouseEvent | TouchEvent,
      _direction: ResizeDirection,
      _elementRef: HTMLElement,
      delta: ResizableNumberSize,
    ) => {
      const resizableCurrent = resizable.current;
      if (!resizableCurrent || !resizableCurrent.state.original) {
        return;
      }

      const originalState = {
        x: resizableCurrent.state.original.x,
        y: resizableCurrent.state.original.y,
        width: resizableCurrent.state.original.width,
        height: resizableCurrent.state.original.height,
      };

      handleResizeStop(originalState, delta);
    },
    [handleResizeStop],
  );

  const handles: Record<string, string> = {
    left: classnames({
      [`${props.handleClassName}-left`]: !!props.handleClassName,
      [resizerHandleLeftClassName]: !props.handleClassName,
      [resizerHandlerClassName[handlerHeightSize]]: true,
      [resizerHandleStickyClassName]: handleAlignmentMethod === 'sticky',
    }),
    right: classnames({
      [`${props.handleClassName}-right`]: !!props.handleClassName,
      [resizerHandleRightClassName]: !props.handleClassName,
      [resizerHandlerClassName[handlerHeightSize]]: true,
      [resizerHandleStickyClassName]: handleAlignmentMethod === 'sticky',
    }),
  };

  const innerPadding = props.innerPadding || resizerHandlePadding;
  const handleStyles: HandleStyles = {
    left: {
      width: '24px',
      left: `-${innerPadding}px`,
      zIndex: resizerHandleZIndex,
      pointerEvents: 'auto',
    },
    right: {
      width: '24px',
      right: `-${innerPadding}px`,
      zIndex: resizerHandleZIndex,
      pointerEvents: 'auto',
    },
  };

  const className = classnames(props.className, resizerItemClassName);

  return (
    <Resizable
      ref={resizable}
      size={{
        width: props.width, // just content itself (no paddings)
        height: 'auto',
      }}
      maxWidth={props.maxWidth}
      minWidth={props.minWidth}
      className={className}
      enable={props.enable}
      handleClasses={handles}
      handleStyles={handleStyles}
      handleWrapperStyle={props.handleWrapperStyle} //  is used to override the style of resize handles wrapper, needed for media when it is selected and caption appears makes sure the handlers won't jump.
      handleComponent={props.handleComponent} // in media was added as a workaround to fix Up arrow key bug when media has caption and the cursor is place below the image. Our epic has a separate ticket to address this problem.
      onResizeStart={onResizeStart}
      onResize={onResize}
      onResizeStop={onResizeStop}
    >
      {props.children}
    </Resizable>
  );
}
