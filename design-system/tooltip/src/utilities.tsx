import type { VirtualElement } from '@popperjs/core';

export interface FakeMouseElement {
	getBoundingClientRect: () => {
		top: number;
		left: number;
		bottom: number;
		right: number;
		width: number;
		height: number;
	};
	clientWidth: number;
	clientHeight: number;
}

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

export function getVirtualElementFromMousePos(
	mousePos: {
		clientX: number;
		clientY: number;
	},
	{
		targetElement,
		tooltipPosition,
	}: { targetElement: HTMLElement; tooltipPosition: 'mouse' | 'mouse-x' | 'mouse-y' },
): VirtualElement {
	if (tooltipPosition === 'mouse') {
		return {
			getBoundingClientRect: () =>
				DOMRect.fromRect({
					x: mousePos.clientX,
					y: mousePos.clientY,
					width: 0,
					height: 0,
				}),
		};
	}

	const targetRect = targetElement.getBoundingClientRect();

	if (tooltipPosition === 'mouse-x') {
		return {
			getBoundingClientRect: () =>
				DOMRect.fromRect({
					x: mousePos.clientX,
					y: targetRect.top,
					width: 0,
					height: targetRect.height,
				}),
		};
	}

	if (tooltipPosition === 'mouse-y') {
		return {
			getBoundingClientRect: () =>
				DOMRect.fromRect({
					x: targetRect.left,
					y: mousePos.clientY,
					width: targetRect.width,
					height: 0,
				}),
		};
	}

	throw new Error(`Invalid tooltip position for virtual element: ${tooltipPosition}`);
}
