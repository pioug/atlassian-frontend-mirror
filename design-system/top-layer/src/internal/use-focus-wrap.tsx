import { type RefObject, useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { getFirstFocusable } from '../focus/get-first-focusable';
import { getLastFocusable } from '../focus/get-last-focusable';
import { getNextFocusable } from '../focus/get-next-focusable';
import { isNestedLayerFocused } from '../focus/is-nested-layer-focused';
import { type TPhase } from './use-animated-visibility';

/**
 * Returns `true` for the roles that wrap Tab focus, per the WAI-ARIA APG:
 *
 * - `dialog`: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 * - `alertdialog`: same keyboard pattern as `dialog`
 *
 * `menu` is not included. A menu is a composite widget
 * (https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within):
 * arrow keys move focus inside it, and Tab moves focus out of it.
 *
 * Menu keyboard behavior (arrow keys, Home and End, type-ahead, Enter and
 * Space) changes with orientation, nesting, item type and control pattern
 * (menu button or menubar), so this hook cannot do it for all menus. The
 * consumer (for example `dropdown-menu`) owns it.
 *
 * See `notes/decisions/menu-keyboard.md`.
 */
function roleRequiresFocusWrap({ role }: { role: string | undefined }): boolean {
	return role === 'dialog' || role === 'alertdialog';
}

/**
 * Wraps Tab and Shift+Tab focus inside the element when its role requires it
 * (`dialog`, `alertdialog`).
 *
 * While the element is visible, the hook intercepts Tab and Shift+Tab (with
 * `preventDefault`) and moves focus to the next or previous focusable element
 * in the element. Focus wraps around at both ends.
 *
 * The hook only handles Tab. It does not change Escape or light dismiss.
 *
 * Always call this hook unconditionally. It attaches the listener only while
 * the phase is not `'closed'` and the role requires focus wrapping.
 */
export function useFocusWrap({
	elementRef,
	role,
	phase,
}: {
	elementRef: RefObject<HTMLElement | null>;
	role: string | undefined;
	/**
	 * Current visibility phase. The Tab listener is attached in every phase
	 * except `'closed'`, so it stays attached during the exit animation.
	 */
	phase: TPhase;
}): void {
	const isVisible = phase !== 'closed';
	useEffect(() => {
		const element = elementRef.current;
		if (!element || !roleRequiresFocusWrap({ role }) || !isVisible) {
			return;
		}

		const unbind = bind(element, {
			type: 'keydown',
			listener: (event: KeyboardEvent) => {
				if (event.key !== 'Tab') {
					return;
				}

				// While focus is in a nested layer, that layer handles Tab.
				if (isNestedLayerFocused({ container: element })) {
					return;
				}

				// Stop the browser focus move. This hook moves focus itself.
				event.preventDefault();

				const direction = event.shiftKey ? 'backwards' : 'forwards';

				const nextFocusable = getNextFocusable({ container: element, direction });
				if (nextFocusable) {
					nextFocusable.focus();
					return;
				}

				// Focus is not inside the element, or the element has no focusable
				// elements. Move focus to the first or last focusable element, based
				// on the direction.
				const fallback =
					direction === 'forwards'
						? getFirstFocusable({ container: element })
						: getLastFocusable({ container: element });

				fallback?.focus();
			},
			options: { capture: true },
		});

		return unbind;
	}, [elementRef, role, isVisible]);
}
