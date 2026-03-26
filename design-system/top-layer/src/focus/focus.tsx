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
		focused: focusable.join(':focus,') + ':focus',
	};
})();

/**
 * An optional callback to restrict which focusable elements are included.
 * Return `true` to include the element, `false` to skip it.
 */
export type TFocusableFilter = (element: HTMLElement, container: HTMLElement) => boolean;

/**
 * Returns all focusable HTMLElements within the container, optionally filtered.
 *
 * Note: this searches the full subtree and does not stop at nested
 * popover/dialog boundaries. In practice this is fine because nested
 * popovers are not rendered until they are opened, so their content
 * is not in the DOM when the parent's initial focus runs. If that
 * assumption changes, this would need to be scoped to the current layer.
 */
function getFocusables({
	container,
	filter,
}: {
	container: HTMLElement;
	filter?: TFocusableFilter;
}): HTMLElement[] {
	return Array.from(container.querySelectorAll(selectors.focusable))
		.filter((el): el is HTMLElement => el instanceof HTMLElement)
		.filter((el) => !filter || filter(el, container));
}

/**
 * Returns the first focusable element within the container.
 */
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
