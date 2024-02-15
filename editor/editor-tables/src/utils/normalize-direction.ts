import type { MoveOptions } from '../types';

export function normalizeDirection(
  origin: number,
  target: number,
  options?: MoveOptions,
): 'start' | 'end' {
  const dir = origin < target ? 'end' : 'start';
  const override = (options?.direction ?? 0) < 0 ? 'start' : 'end';
  return options?.tryToFit && !!options?.direction ? override : dir;
}
