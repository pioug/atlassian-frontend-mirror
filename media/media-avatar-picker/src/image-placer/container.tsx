/**
 * The Container is responsible for implementing the mouse/touch events.
 * This way, you can still move the image without clicking directly on it.
 */
import React from 'react';
import { ContainerWrapper } from './styled';
import { Vector2 } from '@atlaskit/media-ui';

export interface ImagePlacerContainerProps {
  width: number;
  height: number;
  margin: number;
  onDragStart: () => void;
  onDragMove: (delta: Vector2) => void;
  onWheel: (delta: number) => void;
}

export class ImagePlacerContainer extends React.Component<
  ImagePlacerContainerProps,
  {}
> {
  private dragClientStart?: Vector2;

  UNSAFE_componentWillMount() {
    if (this.isTouch) {
      document.addEventListener('touchmove', this.onTouchMove);
      document.addEventListener('touchend', this.onMouseUp);
      document.addEventListener('touchcancel', this.onMouseUp);
    } else {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
  }

  componentWillUnmount() {
    if (this.isTouch) {
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onMouseUp);
      document.removeEventListener('touchcancel', this.onMouseUp);
    } else {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  get isDragging() {
    return this.dragClientStart !== undefined;
  }

  get isTouch() {
    return window.hasOwnProperty('ontouchstart');
  }

  onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 2) {
      return;
    }
    this.dragClientStart = new Vector2(e.clientX, e.clientY);
    this.props.onDragStart();
  };

  onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches.length >= 1) {
      const touch = e.touches[0];
      this.dragClientStart = new Vector2(touch.clientX, touch.clientY);
      this.props.onDragStart();
    }
  };

  onMouseMove = (e: MouseEvent) => {
    const { dragClientStart } = this;
    if (dragClientStart) {
      const delta = new Vector2(
        e.clientX - dragClientStart.x,
        e.clientY - dragClientStart.y,
      );
      this.props.onDragMove(delta);
    }
  };

  onTouchMove = (e: TouchEvent) => {
    const { dragClientStart } = this;
    if (e.touches && e.touches.length >= 1) {
      const touch = e.touches[0];
      if (touch && dragClientStart) {
        const delta = new Vector2(
          touch.clientX - dragClientStart.x,
          touch.clientY - dragClientStart.y,
        );
        this.props.onDragMove(delta);
      }
    }
  };

  onMouseUp = () => {
    delete this.dragClientStart;
  };

  onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    this.props.onWheel(e.deltaY);
  };

  render() {
    const isTouch = this.isTouch;
    const { width, height, children, margin } = this.props;
    const onMouseDown = isTouch ? undefined : this.onMouseDown;
    const onTouchStart = isTouch ? this.onTouchStart : undefined;

    return (
      <ContainerWrapper
        width={width}
        height={height}
        margin={margin}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onWheel={this.onWheel}
      >
        {children}
      </ContainerWrapper>
    );
  }
}
