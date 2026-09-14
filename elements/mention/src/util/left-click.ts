import { type MouseEvent } from 'react';

export function leftClick(event: MouseEvent<any>): boolean {
	return event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
}
