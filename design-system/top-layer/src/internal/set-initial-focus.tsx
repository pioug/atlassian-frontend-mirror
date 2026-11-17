import type { RefObject } from 'react';

import { getInitialFocusTarget } from './get-initial-focus-target';

export type TInitialFocusResult = { applied: boolean; target: HTMLElement | null };

/**
 * The focused element when it is inside `container`. Focus on `container` itself does not count.
 */
function getFocusedDescendant({ container }: { container: HTMLElement }): HTMLElement | null {
	const { activeElement } = container.ownerDocument;
	if (
		activeElement instanceof HTMLElement &&
		activeElement !== container &&
		container.contains(activeElement)
	) {
		return activeElement;
	}
	return null;
}

/**
 * Sets the initial focus of a layer. All the initial focus rules are here:
 *
 * 1. **Focus is already inside: do nothing.** The content took focus (React `autoFocus`, or a
 *    `focus()` call in a ref callback or an effect), or the user moved it there. This comes before
 *    an `initialFocusRef` target too. Focus on the container itself does not count: a wrapper can
 *    put focus there while its content loads.
 * 2. **Otherwise, focus the target for the role** (see `getInitialFocusTarget`): the combobox rule
 *    first, then the `initialFocusRef` target, then the role default. For `dialog` and
 *    `alertdialog`, the role default is the first `[autofocus]` element, else the first focusable
 *    element.
 *
 * `applied` is `true` when step 1 found focus inside, or when step 2 found a target and called
 * `focus()` on it.
 */
export function setInitialFocus({
	container,
	initialFocusRef,
	role,
}: {
	container: HTMLElement;
	initialFocusRef: RefObject<HTMLElement | null> | undefined;
	role: string | undefined;
}): TInitialFocusResult {
	const focusedDescendant = getFocusedDescendant({ container });
	/**
	 * Edge case: a close and a reopen in the same task (before a paint). The content stays mounted,
	 * so focus can still be inside from the last open, and it stays there. Browsers differ:
	 *
	 * - Chromium and Firefox, `auto` popover: the close returns focus to the trigger, so the reopen
	 *   takes initial focus (for example the first menu item).
	 * - WebKit, or a `manual` popover: focus is still inside, so it stays on the element that had it
	 *   (for example the item that the user pressed).
	 *
	 * Either way focus is inside the open layer. A later reopen (after a paint) always takes initial
	 * focus: by then every browser has moved focus out of the closed layer.
	 */
	if (focusedDescendant) {
		return { applied: true, target: focusedDescendant };
	}

	const target = getInitialFocusTarget({ container, initialFocusRef, role });
	if (!target) {
		return { applied: false, target: null };
	}

	target.focus();

	return { applied: true, target };
}
