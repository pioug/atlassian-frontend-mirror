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

function isVisible({ element }: { element: HTMLElement }): boolean {
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
 * Returns the focusable elements in `container`, in DOM order. It excludes:
 *
 * - Elements with `tabindex="-1"`. Script can focus them, but Tab skips them.
 * - Disabled elements, and elements with `aria-disabled="true"` or
 *   `aria-hidden="true"`.
 * - Elements in an `[inert]` subtree.
 * - Elements hidden by `display`, `visibility` or `content-visibility`.
 * - Elements in a nested layer (a `[popover]` or `<dialog>` inside
 *   `container`). The nested layer manages focus for them. `container` itself
 *   can be a layer.
 * - Elements that `filter` rejects.
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
			if (!isVisible({ element })) {
				return false;
			}
			return !filter || filter(element, container);
		},
	);
}
