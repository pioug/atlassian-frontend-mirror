// This file is mostly a copy paste of the testing helpers from the Pragmatic drag and drop hitbox package

import type { Input } from '@atlaskit/pragmatic-drag-and-drop/types';

export function getDefaultInput(overrides: Partial<Input> = {}): Input {
	const defaults: Input = {
		// user input
		altKey: false,
		button: 0,
		buttons: 0,
		ctrlKey: false,
		metaKey: false,
		shiftKey: false,

		// coordinates
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
	};

	return {
		...defaults,
		...overrides,
	};
}

export function getRect(box: {
	top: number;
	bottom: number;
	left: number;
	right: number;
}): DOMRect {
	return DOMRect.fromRect({
		x: box.left,
		y: box.top,
		width: box.right - box.left,
		height: box.bottom - box.top,
	});
}
