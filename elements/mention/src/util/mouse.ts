import { MouseEvent } from 'react';

export interface Position {
  x: number;
  y: number;
}

export function mouseLocation(event: MouseEvent<any>): Position {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

// Used to prevent invalid mouse move detection on scroll
// lastPosition is object (x, y)
export function actualMouseMove(
  oldPosition: Position | undefined,
  newPosition: Position,
): boolean {
  if (
    !oldPosition ||
    oldPosition.x !== newPosition.x ||
    oldPosition.y !== newPosition.y
  ) {
    return true;
  }
  return false;
}

export function leftClick(event: MouseEvent<any>): boolean {
  return (
    event.button === 0 &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  );
}
