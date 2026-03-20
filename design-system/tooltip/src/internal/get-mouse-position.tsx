import type { FakeMouseElement } from '../types';

export function getMousePosition(mouseCoordinates: {
	top: number;
	left: number;
}): FakeMouseElement {
	const safeMouse = mouseCoordinates || { top: 0, left: 0 };
	const getBoundingClientRect = () => ({
		top: safeMouse.top,
		left: safeMouse.left,
		bottom: safeMouse.top,
		right: safeMouse.left,
		width: 0,
		height: 0,
	});

	return {
		getBoundingClientRect,
		clientWidth: 0,
		clientHeight: 0,
	};
}
