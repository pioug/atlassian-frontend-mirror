import React from 'react';
import { RefObject } from 'react';
import classnames from 'classnames';
import { Resizable, ResizeDirection } from 're-resizable';
import { MediaSingleLayout } from '@atlaskit/adf-schema';
import { gridTypeForLayout } from '../../../grid';
import { snapTo, handleSides } from './utils';
import { Props as ResizableMediaSingleProps, EnabledHandles } from './types';
import {
  mediaSingleClassName,
  akMediaSingleResizeZIndex,
} from '@atlaskit/editor-common';

interface ReResizableNumberSize {
  width: number;
  height: number;
}

type ResizerProps = ResizableMediaSingleProps & {
  selected: boolean;
  enable: EnabledHandles;
  calcNewSize: (
    newWidth: number,
    stop: boolean,
  ) => { layout: MediaSingleLayout; width: number | null };
  snapPoints: number[];
  scaleFactor?: number;
  highlights: (width: number, snapPoints: number[]) => number[] | string[];
  handleResizeStart?: (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => boolean;
};

type ResizerState = {
  isResizing: boolean;
};
export default class Resizer extends React.Component<
  ResizerProps,
  ResizerState
> {
  resizable: RefObject<Resizable>;
  state = {
    isResizing: false,
  };

  constructor(props: ResizerProps) {
    super(props);
    this.resizable = React.createRef();
  }

  handleResizeStart = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    const {
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
      const newHighlights = highlights(width, snapPoints);
      displayGrid(
        newHighlights.length > 0,
        gridTypeForLayout(layout),
        newHighlights,
      );
    });
  };

  handleResize = (
    _event: MouseEvent | TouchEvent,
    _direction: ResizeDirection,
    _elementRef: HTMLDivElement,
    delta: ReResizableNumberSize,
  ) => {
    const {
      highlights,
      calcNewSize,
      scaleFactor,
      snapPoints,
      displayGrid,
      layout,
      updateSize,
    } = this.props;

    const resizable = this.resizable.current;
    if (!resizable || !resizable.state.original || !this.state.isResizing) {
      return;
    }

    let newWidth = Math.max(
      resizable.state.original.width + delta.width * (scaleFactor || 1),
      snapPoints[0],
    );
    newWidth = Math.min(newWidth, snapPoints[snapPoints.length - 1]);

    const newSize = calcNewSize(newWidth, false);
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

  handleResizeStop = (
    _event: MouseEvent | TouchEvent,
    _direction: ResizeDirection,
    _elementRef: HTMLElement,
    delta: ReResizableNumberSize,
  ) => {
    const {
      highlights,
      calcNewSize,
      snapPoints,
      displayGrid,
      layout,
      updateSize,
    } = this.props;

    const resizable = this.resizable.current;
    if (!resizable || !resizable.state.original || !this.state.isResizing) {
      return;
    }

    let newWidth = Math.max(
      resizable.state.original.width + delta.width,
      snapPoints[0],
    );
    newWidth = Math.min(newWidth, snapPoints[snapPoints.length - 1]);

    const snapWidth = snapTo(newWidth, snapPoints);
    const newSize = calcNewSize(snapWidth, true);
    const newHighlights = highlights(newWidth, snapPoints);

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
    handleSides.forEach(side => {
      handles[side] = `mediaSingle-resize-handle-${side}`;
      handleStyles[side] = {
        width: '24px',
        [side]: '-13px',
        zIndex: akMediaSingleResizeZIndex,
      };
    });

    // Ideally, Resizable would let you pass in the component rather than
    // the div. For now, we just apply the same styles using CSS
    return (
      <Resizable
        ref={this.resizable}
        size={{
          width: this.props.width,
          height: 'auto',
        }}
        className={classnames(
          mediaSingleClassName,
          `image-${this.props.layout}`,
          this.props.className,
          {
            'is-resizing': this.state.isResizing,
            'not-resized': !this.props.pctWidth,
            'mediaSingle-selected': this.props.selected,
            'media-wrapped':
              this.props.layout === 'wrap-left' ||
              this.props.layout === 'wrap-right',
          },
        )}
        handleWrapperClass={'mediaSingle-resize-wrapper'}
        handleClasses={handles}
        handleStyles={handleStyles}
        enable={this.props.enable}
        onResize={this.handleResize}
        onResizeStop={this.handleResizeStop}
        onResizeStart={this.handleResizeStart}
      >
        {this.props.children}
      </Resizable>
    );
  }
}
