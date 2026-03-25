import { type RefObject, useEffect } from 'react';

import { getFirstFocusable } from '../focus/focus';

/**
 * Determines the correct element to receive initial focus within a popover,
 * based on its ARIA role.
 *
 * Focus rules by role (per WAI-ARIA APG):
 * - `dialog` / `alertdialog`: first element with `[autofocus]`, or first focusable element
 * - `menu`: first menu item (`[role="menuitem|menuitemcheckbox|menuitemradio"]`)
 * - `listbox`: first selected option (`[aria-selected="true"]`), or first option (`[role="option"]`)
 * - `tooltip`: no focus movement (tooltips are informational)
 * - no role / other roles: no focus movement
 *
 * Note: React 18's `autoFocus` JSX prop does NOT set the HTML `autofocus`
 * attribute — it only calls `.focus()` imperatively during commit, which
 * has no effect on hidden popover content. Consumers must set the native
 * attribute via a ref callback (e.g. `node.setAttribute('autofocus', '')`).
 * React 19+ reflects the JSX prop as the HTML attribute automatically.
 */
function getInitialFocusTarget({ container }: { container: HTMLElement }): HTMLElement | null {
	const role = container.getAttribute('role');

	if (role === 'dialog' || role === 'alertdialog') {
		// Prefer element with the native HTML autofocus attribute.
		const autofocusEl = container.querySelector<HTMLElement>('[autofocus]');
		if (autofocusEl) {
			return autofocusEl;
		}
		// Fall back to first focusable element
		return getFirstFocusable({ container });
	}

	if (role === 'menu') {
		// Initial focus placement is the extent of what top-layer provides
		// for menus. All subsequent keyboard navigation (arrow keys, Home/End,
		// type-ahead, Enter/Space, submenu coordination) is the responsibility
		// of the consumer component (e.g. dropdown-menu), because menu keyboard
		// behavior varies by context (orientation, nesting, item type, control
		// pattern). See: notes/outputs/menu-keyboard-decision.md
		return getFirstFocusable({ container });
	}

	if (role === 'listbox') {
		// Prefer selected option, fall back to first focusable
		const selectedOption = container.querySelector<HTMLElement>(
			'[role="option"][aria-selected="true"]',
		);
		if (selectedOption) {
			return selectedOption;
		}
		return getFirstFocusable({ container });
	}

	// tooltip, no role, or other roles: no focus movement
	return null;
}

/**
 * Moves focus into a popover element when it opens, based on its ARIA role.
 *
 * This implements WCAG 2.4.3 (Focus Order) initial focus placement:
 * - `dialog` / `alertdialog` → focus first focusable (or `[autofocus]`)
 * - `menu` → focus first menu item
 * - `listbox` → focus selected or first option
 * - `tooltip` / no role → no focus movement
 *
 * The role is read from the element's `role` attribute (not passed as a prop),
 * following the same pattern as `useFocusWrap`.
 *
 * Always call this hook unconditionally. Focus is only moved when `isOpen`
 * transitions to `true` and the role requires it.
 */
export function useInitialFocus({
	elementRef,
	isOpen,
	role,
}: {
	elementRef: RefObject<HTMLElement | null>;
	isOpen: boolean;
	role: string | undefined;
}): void {
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const el = elementRef.current;
		if (!el) {
			return;
		}

		// Use requestAnimationFrame to ensure the popover is fully rendered
		// and visible in the top layer before attempting to move focus.
		// showPopover() is called in useLayoutEffect (which runs before this
		// useEffect), so by the time the RAF fires after the next paint the
		// element is guaranteed to be in the top layer.
		const rafId = requestAnimationFrame(() => {
			getInitialFocusTarget({ container: el })?.focus();
		});

		return () => {
			cancelAnimationFrame(rafId);
		};
		// We intentionally depend on `role` even though `getInitialFocusTarget`
		// reads from the DOM attribute. This ensures the effect re-runs if
		// the role prop changes while the popover is open.
	}, [elementRef, isOpen, role]);
}
