import type { RefObject } from 'react';

import { setInitialFocus } from './internal/set-initial-focus';

/**
 * Sets the initial focus of a layer, with the same rules as `Popover` (see `setInitialFocus`):
 *
 * - If an element inside `container` already has focus (for example a React `autoFocus` field),
 *   focus stays there, also when there is an `initialFocusRef` target.
 * - Otherwise focus moves by `role`: the `initialFocusRef` target, else the role default (for
 *   `dialog` and `alertdialog`, the first `[autofocus]` element, else the first focusable element).
 *   A combobox that controls the layer keeps focus.
 *
 * `applied` is `true` when focus was already inside `container`, or when a target was found and
 * focused. `target` is that element.
 */
export function applyInitialFocus({
	container,
	initialFocusRef,
	role,
}: {
	container: HTMLElement;
	initialFocusRef?: RefObject<HTMLElement | null>;
	role: string | undefined;
}): { applied: boolean; target: HTMLElement | null } {
	return setInitialFocus({ container, initialFocusRef, role });
}
