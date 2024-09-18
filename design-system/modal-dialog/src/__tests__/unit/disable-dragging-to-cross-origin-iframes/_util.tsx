import { fireEvent } from '@testing-library/dom';

export function depressPointer(element: HTMLElement) {
	fireEvent.pointerDown(element);
	fireEvent.mouseDown(element);
}

export function releasePointer(element: HTMLElement) {
	fireEvent.pointerUp(element);
	fireEvent.mouseUp(element);
}
