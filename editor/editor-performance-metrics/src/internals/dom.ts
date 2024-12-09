import type { UserEventCategory, ViewportDimension } from './types';

export function getViewportDimensions(): ViewportDimension {
	const w = window.innerWidth;
	const h = window.innerHeight;

	return {
		w,
		h,
	};
}

export function searchAncestors(
	element: HTMLElement | null | undefined,
	validate: (e: HTMLElement) => 'found' | 'abort' | 'continue',
) {
	if (!element) {
		return false;
	}

	const x = validate(element);

	if (x === 'abort') {
		return false;
	} else if (x === 'found') {
		return element;
	}

	return searchAncestors(element.parentElement, validate);
}

const UserEventsCategoryMap: Map<Exclude<UserEventCategory, 'other'>, string[]> = new Map([
	[
		'mouse',
		[
			'click',
			'dblclick',
			'mousedown',
			'mouseup',
			'mouseenter',
			'mouseleave',
			'mousemove',
			'mouseover',
			'mouseout',
			'contextmenu',
		],
	],

	['keyboard', ['keydown', 'keypress', 'keyup', 'input', 'beforeinput']],
	['form', ['focus', 'blur', 'change', 'input', 'submit', 'reset', 'select']],
	['clipboard', ['copy', 'cut', 'paste']],
	['drag-and-drop', ['drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop']],
	['page-resize', ['resize']],
	['scroll', ['scroll', 'wheel']],
	['touch', ['touchstart', 'touchmove', 'touchend', 'touchcancel']],
]);

export function getEventCategory(eventName: string): UserEventCategory {
	for (const [category, events] of UserEventsCategoryMap) {
		if (events.includes(eventName)) {
			return category;
		}
	}

	return 'other';
}
