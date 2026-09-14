import { getClosestLayer } from './get-closest-layer';
import type { TFocusableFilter } from './types';

const focusableExclusions = [
	'[tabindex="-1"]',
	':disabled',
	'[aria-disabled="true"]',
	'[aria-hidden="true"]',
];
const exclusionSelector = focusableExclusions.map((selector) => `:not(${selector})`).join('');

const focusableSelector = [
	'a[href]',
	'area[href]',
	'input:not([type="hidden"])',
	'select',
	'textarea',
	'button',
	'iframe',
	'audio[controls]',
	'video[controls]',
	'[contenteditable]:not([contenteditable="false"])',
	'[tabindex]',
]
	.map((selector) => `${selector}${exclusionSelector}`)
	.join(',');

function isVisible(element: HTMLElement): boolean {
	// Visibility filtering must not break focus navigation when the API is unsupported.
	if (typeof element.checkVisibility !== 'function') {
		return true;
	}

	try {
		// Exclude elements hidden by display, content-visibility or visibility because
		// they cannot receive focus. Offscreen, occluded and opacity-zero elements can
		// receive focus, so they intentionally remain included.
		return element.checkVisibility({ checkVisibilityCSS: true });
	} catch {
		return true;
	}
}

/**
 * Returns all focusable HTMLElements within the container, optionally filtered.
 * Elements with `tabindex="-1"` are excluded because they can be focused
 * programmatically but are not sequential focus navigation destinations.
 *
 * Focusables that belong to a nested top-layer scope (a `[popover]` or
 * `<dialog>` descendant of the container) are excluded - those elements
 * are owned by the inner layer's focus management. The container itself
 * is allowed to be a popover/dialog; only nested ones are filtered.
 */
export function getFocusables({
	container,
	filter,
}: {
	container: HTMLElement;
	filter?: TFocusableFilter;
}): HTMLElement[] {
	const containerLayer = getClosestLayer({ element: container });

	return Array.from(container.querySelectorAll(focusableSelector)).filter(
		(element): element is HTMLElement => {
			if (!(element instanceof HTMLElement)) {
				return false;
			}
			if (getClosestLayer({ element }) !== containerLayer) {
				return false;
			}
			if (element.closest('[inert]')) {
				return false;
			}
			if (!isVisible(element)) {
				return false;
			}
			return !filter || filter(element, container);
		},
	);
}
