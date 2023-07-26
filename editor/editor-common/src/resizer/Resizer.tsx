import React, { PropsWithChildren, useMemo, useRef, useState } from 'react';

import classnames from 'classnames';
import { HandleComponent, Resizable, ResizeDirection } from 're-resizable';

import { token } from '@atlaskit/tokens';

import {
  resizerHandleLeftClassName,
  resizerHandlerClassName,
  resizerHandleRightClassName,
  resizerHandleStickyClassName,
  resizerHandleZIndex,
  resizerItemClassName,
} from '../styles/shared/resizer';

import {
  Dimensions,
  EnabledHandles,
  HandleAlignmentMethod,
  HandleHeightSizeType,
  HandlePositioning,
  HandleResize,
  HandleResizeStart,
  HandleStyles,
  Snap,
} from './types';

export type ResizerProps = {
  // Enables resizing in left and/or right direction and enables handles
  enable: EnabledHandles;
  // initial width for now as Resizer is using defaultSize.
  width: number;
  // Resizer lifecycle callbacks:
  handleResizeStart: HandleResizeStart;
  handleResize: HandleResize;
  handleResizeStop: HandleResize;
  // positions handles closer or further away from the resizable element default: 13px.
  innerPadding?: number;
  // sets classes for handles
  // eg: handleClassName={'node-handle'} will become 'node-handle-right' and/or 'node-handle-left'
  handleClassName?: string;
  // sets class name for the resizable component on top of default styles
  // (resizerItemClassName in packages/editor/editor-common/src/styles/shared/resizer.ts)
  className?: string;
  minWidth?: number;
  maxWidth?: number;

  handleWrapperStyle?: React.CSSProperties;
  handleComponent?: HandleComponent;
  handleStyles?: HandleStyles;
  handlePositioning?: HandlePositioning;
  handleHeightSize?: HandleHeightSizeType;
  handleMarginTop?: number;

  // The snap property is used to specify absolute pixel values that resizing should snap to.
  // x and y are both optional, allowing you to only include the axis you want to define. Defaults to null.
  snap?: Snap;
  // The snapGap property is used to specify the minimum gap required in order to move to the next snapping target.
  // Defaults to 0 which means that snap targets are always used.
  snapGap?: number;
  // This is the method that should be used by the resizer when positioning the handles
  handleAlignmentMethod?: HandleAlignmentMethod;
  // Ratio that will scale the delta by
  resizeRatio?: number;
};

export default function ResizerNext(
  props: PropsWithChildren<ResizerProps>,
): JSX.Element {
  const [isResizing, setIsResizing] = useState(false);
  const resizable = useRef<Resizable>(null);

  const {
    width,
    children,
    handleClassName,
    className,
    handleResize,
    handleResizeStart,
    handleResizeStop,
    handleHeightSize = 'medium',
    handleAlignmentMethod = 'center',
    handlePositioning = 'overlap',
    handleStyles,
    resizeRatio = 1,
    innerPadding,
    snap,
    ...otherProps
  } = props;

  const onResizeStart = React.useCallback(
    (
      event:
        | React.MouseEvent<HTMLDivElement>
        | React.TouchEvent<HTMLDivElement>,
    ) => {
      // prevent creating a drag event on Firefox
      event.preventDefault();

      setIsResizing(true);
      handleResizeStart();
    },
    [handleResizeStart],
  );

  const onResize = React.useCallback(
    (
      _event: MouseEvent | TouchEvent,
      _direction: ResizeDirection,
      _elementRef: HTMLDivElement,
      delta: Dimensions,
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
      delta: Dimensions,
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

      setIsResizing(false);
      handleResizeStop(originalState, delta);
    },
    [handleResizeStop],
  );

  const handles = {
    left: classnames(resizerHandlerClassName[handleHeightSize], {
      [`${handleClassName}-left`]: !!handleClassName,
      [resizerHandleLeftClassName]: !handleClassName,
      [resizerHandleStickyClassName]: handleAlignmentMethod === 'sticky',
    }),
    right: classnames(resizerHandlerClassName[handleHeightSize], {
      [`${handleClassName}-right`]: !!handleClassName,
      [resizerHandleRightClassName]: !handleClassName,
      [resizerHandleStickyClassName]: handleAlignmentMethod === 'sticky',
    }),
  };

  const baseHandleStyles: React.CSSProperties = {
    width:
      handlePositioning === 'adjacent'
        ? token('space.250', '20px')
        : token('space.300', '24px'),
    // eslint-disable-next-line
    marginTop: Number.isFinite(props?.handleMarginTop)
      ? `${props.handleMarginTop}px`
      : undefined,
    zIndex: resizerHandleZIndex,
    pointerEvents: 'auto',
    alignItems: handlePositioning === 'adjacent' ? 'center' : undefined,
  };

  const offset = Number.isFinite(innerPadding)
    ? `-${innerPadding}px`
    : handlePositioning === 'adjacent'
    ? `calc(${baseHandleStyles.width} * -1)`
    : `calc(${baseHandleStyles.width} * -0.5)`;

  const nextHandleStyles: HandleStyles = {
    left: {
      ...baseHandleStyles,
      // eslint-disable-next-line
      left: offset,
      ...handleStyles?.left,
    },
    right: {
      ...baseHandleStyles,
      // eslint-disable-next-line
      right: offset,
      ...handleStyles?.right,
    },
  };

  const resizerClassName = classnames(className, resizerItemClassName, {
    'is-resizing': isResizing,
  });

  // snapGap is usually a constant, if snap.x?.length is 0 and snapGap has a value resizer cannot be resized
  const snapGap = useMemo(() => {
    if (!snap || (snap.x?.length === 0 && snap.x?.length === 0)) {
      return undefined;
    }
    return props.snapGap;
  }, [snap, props.snapGap]);

  return (
    <Resizable
      ref={resizable}
      size={{
        width, // just content itself (no paddings)
        height: 'auto',
      }}
      className={resizerClassName}
      handleClasses={handles}
      handleStyles={nextHandleStyles}
      onResizeStart={onResizeStart}
      onResize={onResize}
      onResizeStop={onResizeStop}
      resizeRatio={resizeRatio}
      snapGap={snapGap}
      snap={snap}
      {...otherProps}
    >
      {children}
    </Resizable>
  );
}
