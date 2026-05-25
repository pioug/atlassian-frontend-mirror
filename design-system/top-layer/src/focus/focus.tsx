/**
 * Focusable element selectors and navigation helpers.
 *
 * Uses CSS selectors to discover focusable elements within a container,
 * avoiding the need for a manual registration system. Disabled elements
 * (both HTML `disabled` attribute and `aria-disabled="true"`) and elements
 * with `tabindex="-1"` are excluded automatically.
 *
 * All public functions accept an optional `filter` callback to further
 * restrict which focusable elements are included.
 */

import { getDocument } from '@atlaskit/browser-apis';

const selectors = (() => {
	// Common exclusion filter applied to every selector.
	const not = ':not([tabindex="-1"]):not([aria-disabled="true"]):not([aria-hidden="true"])';
	const notDisabled = `:not([disabled])${not}`;

	const focusable = [
		`a[href]${not}`,
		`area[href]${not}`,
		`input${notDisabled}:not([type="hidden"])`,
		`select${notDisabled}`,
		`textarea${notDisabled}`,
		`button${notDisabled}`,
		`iframe${not}`,
		`audio[controls]${not}`,
		`video[controls]${not}`,
		`[contenteditable]:not([contenteditable="false"])${not}`,
		`[tabindex]${notDisabled}${not}`,
	];

	return {
		focusable: focusable.join(','),
		// Build the `:focus` selector
		focused: focusable.map((selector) => `${selector}:focus`).join(','),
	};
})();

const topLayerSelector = '[popover], dialog, [role="dialog"], [role="alertdialog"]';

/**
 * Returns true when `element` and `container` resolve to the same nearest
 * top-layer host (or both resolve to `null`, meaning the document layer).
 */
function isInSameLayer({
	element,
	container,
}: {
	element: HTMLElement;
	container: HTMLElement;
}): boolean {
	const elementLayer = element.closest(topLayerSelector);
	const containerLayer = container.closest(topLayerSelector);
	// Both elements are in the "document" layer
	if (!elementLayer && !containerLayer) {
		return true;
	}
	return elementLayer === containerLayer;
}

/**
 * Returns `true` when `document.activeElement` is inside a nested top-layer
 * descendant of `container` (a `[popover]`, `<dialog>`, `[role="dialog"]` or
 * `[role="alertdialog"]` that is itself a descendant of `container`).
 */
export function isNestedLayerFocused({ container }: { container: HTMLElement }): boolean {
	const focused = getDocument()?.activeElement;

	if (!(focused instanceof HTMLElement)) {
		return false;
	}

	// Cannot be in a nested layer if it is not in the container
	if (!container.contains(focused)) {
		return false;
	}

	// If not in the same layer, must be in a nested layer
	return !isInSameLayer({ element: focused, container });
}

/**
 * An optional callback to restrict which focusable elements are included.
 * Return `true` to include the element, `false` to skip it.
 */
export type TFocusableFilter = (element: HTMLElement, container: HTMLElement) => boolean;

/**
 * Returns all focusable HTMLElements within the container, optionally filtered.
 *
 * Focusables that belong to a nested top-layer scope (a `[popover]` or
 * `<dialog>` descendant of the container) are excluded - those elements
 * are owned by the inner layer's focus management. The container itself
 * is allowed to be a popover/dialog; only nested ones are filtered.
 */
function getFocusables({
	container,
	filter,
}: {
	container: HTMLElement;
	filter?: TFocusableFilter;
}): HTMLElement[] {
	return Array.from(container.querySelectorAll(selectors.focusable))
		.filter((element): element is HTMLElement => element instanceof HTMLElement)
		.filter((element) => isInSameLayer({ element, container }))
		.filter((element) => !filter || filter(element, container));
}

/**
 * Returns the first focusable element within the container.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getFirstFocusable({
	container,
	filter,
}: {
	container: HTMLElement;
	filter?: TFocusableFilter;
}): HTMLElement | null {
	const items = getFocusables({ container, filter });
	return items.length > 0 ? items[0] : null;
}

/**
 * Returns the last focusable element within the container.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getLastFocusable({
	container,
	filter,
}: {
	container: HTMLElement;
	filter?: TFocusableFilter;
}): HTMLElement | null {
	const items = getFocusables({ container, filter });
	return items.length > 0 ? items[items.length - 1] : null;
}

/**
 * Returns the next focusable element in the given direction relative to the
 * currently focused element within the container. Wraps around at both ends.
 *
 * Returns `null` if there is no focused element within the container or if
 * the focused element is not in the list of focusable elements.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getNextFocusable({
	container,
	direction,
	filter,
}: {
	container: HTMLElement;
	direction: 'forwards' | 'backwards';
	filter?: TFocusableFilter;
}): HTMLElement | null {
	const all = getFocusables({ container, filter });
	const current = container.querySelector(selectors.focused);
	if (!(current instanceof HTMLElement)) {
		return null;
	}
	const index = all.indexOf(current);
	if (index === -1) {
		return null;
	}
	const nextIndex: number = (() => {
		if (direction === 'forwards') {
			return (index + 1) % all.length;
		}
		const proposed = index - 1;
		// if going into negative numbers, loop back to the last item
		return proposed < 0 ? all.length - 1 : proposed;
	})();

	return all[nextIndex] ?? null;
}
