import { Position, VerticalPosition } from './types';

export const isNumber = (x: unknown): x is number =>
  typeof x === 'number' && !isNaN(x) && isFinite(x);

export const isVerticalPosition = (pos: Position): pos is VerticalPosition => {
  return isNumber(pos.x);
};
