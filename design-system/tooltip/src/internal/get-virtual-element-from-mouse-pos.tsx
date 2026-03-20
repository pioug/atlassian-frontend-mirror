import type { VirtualElement } from '@popperjs/core';

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
