import React from 'react';
import { RefObject } from 'react';
import classnames from 'classnames';
import { Resizable, ResizeDirection } from 're-resizable';
import { RichMediaLayout } from '@atlaskit/adf-schema';
import { gridTypeForLayout } from '../../plugins/grid';
import { snapTo, handleSides } from './utils';
import { Props as ResizableMediaSingleProps, EnabledHandles } from './types';
import { richMediaClassName } from '@atlaskit/editor-common';
import { akRichMediaResizeZIndex } from '@atlaskit/editor-shared-styles';
import {
  DispatchAnalyticsEvent,
  MediaEventPayload,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../plugins/analytics';

const getResizeAnalyticsEvent = (
  type: string | undefined,
  size: number | null,
  layout: string,
): MediaEventPayload => {
  const actionSubject =
    type === 'embed' ? ACTION_SUBJECT.EMBEDS : ACTION_SUBJECT.MEDIA_SINGLE;
  return {
    action: ACTION.EDITED,
    actionSubject,
    actionSubjectId: ACTION_SUBJECT_ID.RESIZED,
    attributes: {
      size,
      layout,
    },
    eventType: EVENT_TYPE.UI,
  };
};

export interface ResizableNumberSize {
  width: number;
  height: number;
}

export type ResizerProps = Omit<
  ResizableMediaSingleProps,
  'height' | 'width'
> & {
  selected?: boolean;
  enable: EnabledHandles;
  calcNewSize: (
    newWidth: number,
    stop: boolean,
  ) => { layout: RichMediaLayout; width: number | null };
  snapPoints: number[];
  scaleFactor?: number;
  highlights: (width: number, snapPoints: number[]) => number[] | string[];
  handleResizeStart?: (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => boolean;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  nodeType?: 'media' | 'embed';
  innerPadding?: number;
  height?: number;
  width: number;
  ratio?: string;
};

export type ResizerState = {
  isResizing: boolean;
};

const getWidthFromSnapPoints = (
  width: number,
  snapPoints: number[],
): number => {
  if (snapPoints.length) {
    return Math.min(
      Math.max(width, snapPoints[0]),
      snapPoints[snapPoints.length - 1],
    );
  }

  return width;
};

export default class Resizer extends React.Component<
  ResizerProps,
  ResizerState
> {
  resizable: RefObject<Resizable> = React.createRef();

  state = {
    isResizing: false,
  };

  private handleResizeStart = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    const {
      innerPadding = 0,
      handleResizeStart,
      highlights,
      displayGrid,
      layout,
      width,
      snapPoints,
    } = this.props;

    // prevent creating a drag event on Firefox
    event.preventDefault();
    if (handleResizeStart && !handleResizeStart(event)) {
      return false;
    }

    this.setState({ isResizing: true }, () => {
      const newHighlights = highlights(width + innerPadding, snapPoints);
      displayGrid(
        newHighlights.length > 0,
        gridTypeForLayout(layout),
        newHighlights,
      );
    });
  };

  private handleResize = (
    _event: MouseEvent | TouchEvent,
    _direction: ResizeDirection,
    _elementRef: HTMLDivElement,
    delta: ResizableNumberSize,
  ) => {
    const {
      highlights,
      calcNewSize,
      scaleFactor,
      snapPoints,
      displayGrid,
      layout,
      updateSize,
      innerPadding = 0,
    } = this.props;
    const resizable = this.resizable.current;
    const { isResizing } = this.state;
    if (!resizable || !resizable.state.original || !isResizing) {
      return;
    }
    const newWidth = getWidthFromSnapPoints(
      resizable.state.original.width + delta.width * (scaleFactor || 1),
      snapPoints,
    );
    const newSize = calcNewSize(newWidth + innerPadding, false);
    if (newSize.layout !== layout) {
      updateSize(newSize.width, newSize.layout);
    }

    const newHighlights = highlights(newWidth, snapPoints);
    displayGrid(
      newHighlights.length > 0,
      gridTypeForLayout(newSize.layout),
      newHighlights,
    );
    resizable.updateSize({ width: newWidth, height: 'auto' });
    resizable.setState({ isResizing: true });
  };

  private handleResizeStop = (
    _event: MouseEvent | TouchEvent,
    _direction: ResizeDirection,
    _elementRef: HTMLElement,
    delta: ResizableNumberSize,
  ) => {
    const {
      highlights,
      calcNewSize,
      snapPoints,
      displayGrid,
      layout,
      updateSize,
      dispatchAnalyticsEvent,
      nodeType,
    } = this.props;
    const resizable = this.resizable.current;
    const { isResizing } = this.state;
    if (!resizable || !resizable.state.original || !isResizing) {
      return;
    }

    const newWidth = getWidthFromSnapPoints(
      resizable.state.original.width + delta.width,
      snapPoints,
    );
    const snapWidth = snapTo(newWidth, snapPoints);
    const newSize = calcNewSize(snapWidth, true);
    const newHighlights = highlights(newWidth, snapPoints);

    if (dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent(
        getResizeAnalyticsEvent(nodeType, newSize.width, newSize.layout),
      );
    }
    // show committed grid size
    displayGrid(
      newHighlights.length > 0,
      gridTypeForLayout(newSize.layout),
      newHighlights,
    );

    this.setState({ isResizing: false }, () => {
      updateSize(newSize.width, newSize.layout);
      displayGrid(false, gridTypeForLayout(layout));
    });
  };

  render() {
    const handleStyles: Record<string, {}> = {};
    const handles: Record<string, string> = {};
    const {
      innerPadding = 0,
      width,
      pctWidth,
      selected,
      layout,
      enable,
      children,
      ratio,
    } = this.props;
    const { isResizing } = this.state;
    handleSides.forEach((side) => {
      handles[side] = `richMedia-resize-handle-${side}`;
      handleStyles[side] = {
        width: '24px',
        [side]: `${-13 - innerPadding}px`,
        zIndex: akRichMediaResizeZIndex,
        pointerEvents: 'auto',
      };
    });
    const className = classnames(
      richMediaClassName,
      `image-${layout}`,
      this.props.className,
      {
        'is-resizing': isResizing,
        'not-resized': !pctWidth,
        'richMedia-selected': selected,
        'rich-media-wrapped': layout === 'wrap-left' || layout === 'wrap-right',
      },
    );

    let handleWrapperStyle: React.CSSProperties | undefined;
    if (ratio) {
      handleWrapperStyle = {
        position: 'absolute',
        width: '100%',
        paddingBottom: `${ratio}%`,
        top: 0,
        pointerEvents: 'none',
      };
    }

    // Ideally, Resizable would let you pass in the component rather than
    // the div. For now, we just apply the same styles using CSS
    return (
      <Resizable
        ref={this.resizable}
        size={{
          width, // just content itself (no paddings)
          height: 'auto',
        }}
        className={className}
        handleClasses={handles}
        handleStyles={handleStyles}
        handleWrapperStyle={handleWrapperStyle}
        enable={enable}
        onResize={this.handleResize}
        onResizeStop={this.handleResizeStop}
        onResizeStart={this.handleResizeStart}
      >
        {children}
      </Resizable>
    );
  }
}
