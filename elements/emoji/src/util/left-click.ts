import type { MouseEvent } from 'react';

export function leftClick(reactEvent: MouseEvent<any>): boolean {
	return (
		reactEvent.button === 0 &&
		!reactEvent.altKey &&
		!reactEvent.ctrlKey &&
		!reactEvent.metaKey &&
		!reactEvent.shiftKey
	);
}
