import { type RefObject, useEffect, useRef } from 'react';

import { getFirstFocusable } from '../focus/get-first-focusable';

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
 * attribute - it only calls `.focus()` imperatively during commit, which
 * has no effect on hidden popover content. Consumers must set the native
 * attribute via a ref callback (e.g. `node.setAttribute('autofocus', '')`).
 * React 19+ reflects the JSX prop as the HTML attribute automatically.
 */
function getInitialFocusTarget({
	container,
	role,
}: {
	container: HTMLElement;
	role: string | undefined;
}): HTMLElement | null {
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
 * Follows the WAI-ARIA APG initial-focus patterns for each role:
 * - `dialog` / `alertdialog` → focus first focusable (or `[autofocus]`)
 * - `menu` → focus first menu item
 * - `listbox` → focus selected or first option
 * - `tooltip` / no role → no focus movement (focus must remain on trigger;
 *   moving focus into the tooltip would dismiss it)
 *
 * Role is taken from the typed `role` prop - this is the consumer's contract
 * and is not subject to drift from a directly-mutated DOM attribute.
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
	// Track the most recently scheduled RAF so a rapid `isOpen → false → true`
	// transition can cancel the previous frame before its closure runs against
	// a stale popover element. Without this, the RAF queued during the first
	// open could fire after the second open had begun and focus the wrong
	// instance.
	const pendingRafRef = useRef<number | null>(null);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const el = elementRef.current;
		if (!el) {
			return;
		}

		// Cancel any RAF queued by the previous open cycle.
		if (pendingRafRef.current !== null) {
			cancelAnimationFrame(pendingRafRef.current);
		}

		// Use requestAnimationFrame to ensure the popover is fully rendered
		// and visible in the top layer before attempting to move focus.
		// showPopover() is called in useLayoutEffect (which runs before this
		// useEffect), so by the time the RAF fires after the next paint the
		// element is guaranteed to be in the top layer.
		const rafId = requestAnimationFrame(() => {
			pendingRafRef.current = null;
			// Verify the element we captured is still the live popover. In
			// rapid-toggle scenarios the ref may already point to a different
			// instance - skip rather than focus the wrong popover.
			if (elementRef.current !== el) {
				return;
			}
			getInitialFocusTarget({ container: el, role })?.focus();
		});
		pendingRafRef.current = rafId;

		return () => {
			cancelAnimationFrame(rafId);
			if (pendingRafRef.current === rafId) {
				pendingRafRef.current = null;
			}
		};
	}, [elementRef, isOpen, role]);
}
