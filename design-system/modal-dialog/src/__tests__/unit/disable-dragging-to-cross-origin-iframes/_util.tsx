import { fireEvent } from '@testing-library/dom';

export function depressPointer(element: HTMLElement): void {
	fireEvent.pointerDown(element);
	fireEvent.mouseDown(element);
}

export function releasePointer(element: HTMLElement): void {
	fireEvent.pointerUp(element);
	fireEvent.mouseUp(element);
}
