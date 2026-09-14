import type { Position } from './mouse';

// Used to prevent invalid mouse move detection on scroll
// lastPosition is object (x, y)
export function actualMouseMove(oldPosition: Position | undefined, newPosition: Position): boolean {
	if (!oldPosition || oldPosition.x !== newPosition.x || oldPosition.y !== newPosition.y) {
		return true;
	}
	return false;
}
