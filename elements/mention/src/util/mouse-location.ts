import { type MouseEvent } from 'react';

import type { Position } from './mouse';

export function mouseLocation(event: MouseEvent<any>): Position {
	return {
		x: event.clientX,
		y: event.clientY,
	};
}
