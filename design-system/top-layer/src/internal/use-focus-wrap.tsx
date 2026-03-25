import { type RefObject, useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { getFirstFocusable, getLastFocusable, getNextFocusable } from '../focus/focus';

/**
 * Roles that require focus wrapping per WAI-ARIA APG.
 *
 * - `dialog`: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 * - `alertdialog`: same keyboard pattern as dialog
 *
 * `menu` is intentionally excluded. Menus are composite widgets
 * (https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within)
 * that manage their own internal keyboard navigation via arrow keys,
 * not Tab. Tab/Shift+Tab should move focus OUT of a menu entirely.
 *
 * Menu keyboard behavior (arrow keys, Home/End, type-ahead, Enter/Space)
 * is context-dependent — it varies by orientation, nesting depth, item
 * type, and control pattern (menu button vs menubar). This makes it
 * impossible to implement generically here. The consumer component
 * (e.g. `dropdown-menu`) owns all menu keyboard navigation.
 *
 * See: notes/outputs/menu-keyboard-decision.md
 */
function roleRequiresFocusWrap(role: string | undefined): boolean {
	return role === 'dialog' || role === 'alertdialog';
}

/**
 * Wraps Tab/Shift+Tab focus within a popover element when its role
 * semantically requires it (dialog, alertdialog).
 *
 * While the popover is open, Tab and Shift+Tab are intercepted
 * (via `preventDefault`) and remapped to cycle through focusable
 * elements within the container using wrapping navigation.
 *
 * Light dismiss (Escape, click outside) continues to work natively
 * via `popover="auto"` — this hook only intercepts Tab.
 *
 * Always call this hook unconditionally. The listener is only
 * attached when the role requires focus wrapping, and is cleaned
 * up and re-evaluated when the role changes.
 */
export function useFocusWrap({
	elementRef,
	role,
}: {
	elementRef: RefObject<HTMLElement | null>;
	role: string | undefined;
}): void {
	useEffect(() => {
		const el = elementRef.current;
		if (!el || !roleRequiresFocusWrap(role)) {
			return;
		}

		const unbind = bind(el, {
			type: 'keydown',
			listener: (event: KeyboardEvent) => {
				if (event.key !== 'Tab') {
					return;
				}

				event.preventDefault();

				const direction = event.shiftKey ? 'backwards' : 'forwards';

				// Try to move to the next/previous focusable element relative
				// to the currently focused element within the container.
				const next = getNextFocusable({ container: el, direction });

				if (next) {
					next.focus();
					return;
				}

				// Nothing is currently focused inside the container (or the
				// focused element isn't in the focusable list). Fall back to
				// the first or last focusable element depending on direction.
				const fallback =
					direction === 'forwards'
						? getFirstFocusable({ container: el })
						: getLastFocusable({ container: el });

				if (fallback) {
					fallback.focus();
				}
			},
			options: { capture: true },
		});

		return unbind;
	}, [elementRef, role]);
}
