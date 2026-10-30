import { type RefObject, useRef } from 'react';

import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';

import { getFirstFocusable } from '../focus/get-first-focusable';
import { type TPhase } from './use-animated-visibility';

/**
 * `<input>` types that count as text-like. Other types (`button`, `checkbox`,
 * `submit` and so on) do not. A missing `type` attribute means `text` (HTML
 * spec), so `isTextboxLikeElement` maps it to `text` before the lookup.
 */
const TEXT_LIKE_INPUT_TYPES = new Set(['text', 'search', 'email', 'url', 'tel', 'password']);

/**
 * Returns `true` for `role="combobox"`, `role="textbox"`, a `<textarea>`, a
 * `contentEditable` element, or an `<input>` with a text-like `type`.
 */
function isTextboxLikeElement({ element }: { element: HTMLElement }): boolean {
	const role = element.getAttribute('role');
	if (role === 'combobox' || role === 'textbox') {
		return true;
	}
	// `tagName` is uppercase for HTML elements, but can be mixed case for XML
	// and SVG elements.
	const tagName = element.tagName.toLowerCase();
	if (tagName === 'textarea') {
		return true;
	}
	if (element.isContentEditable) {
		return true;
	}
	if (tagName === 'input') {
		const type = (element.getAttribute('type') ?? 'text').toLowerCase();
		return TEXT_LIKE_INPUT_TYPES.has(type);
	}
	return false;
}

/**
 * Returns `true` when the focused element is a combobox that controls the
 * popup.
 *
 * In the WAI-ARIA APG combobox pattern, DOM focus stays on the combobox while
 * its popup (listbox, grid, tree, menu or dialog) is open. Navigation in the
 * popup uses `aria-activedescendant` or keyboard events that the combobox
 * passes on. It never moves DOM focus.
 *
 * The focused element must be textbox-like (see `isTextboxLikeElement`). One
 * of its `aria-controls` IDs (or legacy `aria-owns` IDs, when there is no
 * `aria-controls`) must reference the popup `container`, an element that
 * contains it, or an element inside it. This finds the combobox in both
 * layouts:
 *
 * - The combobox is inside the popup `container`.
 * - The combobox is outside the popup `container`. For example, `react-select`
 *   portals its listbox away from its input.
 *
 * See https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
function isComboboxControllingPopup({ container }: { container: HTMLElement }): boolean {
	const ownerDocument = container.ownerDocument;
	const activeElement = ownerDocument.activeElement;
	if (!(activeElement instanceof HTMLElement)) {
		return false;
	}

	if (!isTextboxLikeElement({ element: activeElement })) {
		return false;
	}

	// `aria-controls` and `aria-owns` are IDREFS (a space-separated list of
	// IDs), so check each ID. A combobox can control this popup and another
	// element (for example a status region) at the same time.
	const idRefs =
		activeElement.getAttribute('aria-controls') ?? activeElement.getAttribute('aria-owns');
	if (!idRefs) {
		return false;
	}

	// The "element inside the container" match is for wrappers such as
	// `react-select`. Its input references a listbox that the wrapped library
	// renders inside the Popover host. The `listbox` role is on that element,
	// not on the host.
	const referencedIds = idRefs.split(/\s+/).filter((id) => id !== '');
	return referencedIds.some((id) => {
		const referencedElement = ownerDocument.getElementById(id);
		if (!referencedElement) {
			return false;
		}
		return (
			referencedElement === container ||
			referencedElement.contains(container) ||
			container.contains(referencedElement)
		);
	});
}

/**
 * The `initialFocusRef` override target, when it is inside the popover. A
 * target outside the popover (or not in the DOM) is ignored, so the role
 * default applies.
 */
function getOverrideTarget({
	container,
	initialFocusRef,
}: {
	container: HTMLElement;
	initialFocusRef: RefObject<HTMLElement | null> | undefined;
}): HTMLElement | null {
	const target = initialFocusRef?.current;
	if (target && container.contains(target)) {
		return target;
	}
	return null;
}

/**
 * Returns the element that takes focus when the popover opens, or `null` to
 * leave focus where it is. The role defaults follow the WAI-ARIA APG:
 *
 * - `dialog` / `alertdialog`: the first `[autofocus]` element, or else the
 *   first focusable element.
 * - `menu`: the first focusable element (normally the first menu item).
 * - `listbox`: the selected option (`[aria-selected="true"]`), or else the
 *   first option, or else the first focusable element.
 * - `tooltip`: no focus move. A tooltip is informational, so focus stays on
 *   the trigger.
 * - Other roles and no role: no focus move.
 *
 * For `dialog`, `alertdialog`, `menu` and `listbox`, an `initialFocusRef`
 * target inside the popover comes before the role default.
 *
 * Combobox carve-out: when a focused combobox controls the popover, focus
 * stays on the combobox (see `isComboboxControllingPopup`). For `dialog` and
 * `alertdialog`, this applies only when the combobox is outside the dialog.
 *
 * React 18 note: the `autoFocus` JSX prop does not set the HTML `autofocus`
 * attribute. It only calls `.focus()` during commit, which has no effect on
 * hidden popover content. Consumers must set the attribute in a ref callback
 * (for example `node.setAttribute('autofocus', '')`). React 19 and later set
 * the attribute from the JSX prop.
 */
function getInitialFocusTarget({
	container,
	initialFocusRef,
	role,
}: {
	container: HTMLElement;
	initialFocusRef: RefObject<HTMLElement | null> | undefined;
	role: string | undefined;
}): HTMLElement | null {
	// In each role branch, the combobox carve-out decides whether focus moves.
	// The override target, then the role default, decides where. Each branch
	// runs its own carve-out check, because the dialog branch adds a condition.
	if (role === 'dialog' || role === 'alertdialog') {
		// A combobox can control a dialog popup (APG). But a combobox inside the
		// dialog must not stop the dialog from taking focus. For example, the
		// `datetime-picker` dialog contains a `react-select`. Its input references
		// a listbox inside the dialog, so `isComboboxControllingPopup` matches it.
		// Focus stays on a combobox only when the combobox is outside the dialog.
		if (
			!container.contains(container.ownerDocument.activeElement) &&
			isComboboxControllingPopup({ container })
		) {
			return null;
		}
		const overrideTarget = getOverrideTarget({ container, initialFocusRef });
		if (overrideTarget) {
			return overrideTarget;
		}
		const autofocusElement = container.querySelector<HTMLElement>('[autofocus]');
		if (autofocusElement) {
			return autofocusElement;
		}
		return getFirstFocusable({ container });
	}

	if (role === 'menu') {
		if (isComboboxControllingPopup({ container })) {
			return null;
		}
		const overrideTarget = getOverrideTarget({ container, initialFocusRef });
		if (overrideTarget) {
			return overrideTarget;
		}
		// Top layer only sets the initial focus in a menu. The consumer (for
		// example `dropdown-menu`) owns all other menu keyboard behavior (arrow
		// keys, Home and End, type-ahead, Enter and Space, submenus), because it
		// changes with orientation, nesting, item type and control pattern. See
		// `notes/decisions/menu-keyboard.md`.
		return getFirstFocusable({ container });
	}

	if (role === 'listbox') {
		if (isComboboxControllingPopup({ container })) {
			return null;
		}
		const overrideTarget = getOverrideTarget({ container, initialFocusRef });
		if (overrideTarget) {
			return overrideTarget;
		}
		// Match `[role="option"]`, not `getFirstFocusable`. APG listbox options
		// use `tabindex="-1"` (roving tabindex), and `getFirstFocusable` skips
		// those elements. Options can still take focus from script.
		const selectedOption = container.querySelector<HTMLElement>(
			'[role="option"][aria-selected="true"]',
		);
		if (selectedOption) {
			return selectedOption;
		}
		const firstOption = container.querySelector<HTMLElement>('[role="option"]');
		if (firstOption) {
			return firstOption;
		}
		// A listbox with no options can still contain a focusable element, for
		// example an empty-state action.
		return getFirstFocusable({ container });
	}

	// `tooltip`, other roles and no role: no focus move.
	return null;
}

/**
 * Moves focus into a popover when it opens. `getInitialFocusTarget` picks the
 * target from the popover role.
 *
 * `role` comes from the typed prop, not from the DOM attribute. The prop is the
 * consumer contract, and a script can change the attribute.
 *
 * Always call this hook unconditionally. Focus moves when the phase changes to
 * a visible phase from `closed` or `exiting`:
 *
 * - `closed → entering` (open with animation). The host element has just
 *   mounted, and the layout effect that calls `showPopover()` has run, so the
 *   element is in the top layer. Focus moves before the entry animation ends,
 *   because the WAI-ARIA APG expects focus on the new menu or dialog the
 *   instant it opens.
 * - `closed → open` (open without animation).
 * - `exiting → entering`, or `exiting → open` without animation (reopen before
 *   the exit ends). When the user closes the popover (Escape, close button,
 *   light dismiss), the browser moves focus back to the trigger in
 *   `hidePopover()`. A reopen before the exit ends does not pass through
 *   `closed`. Without this case, the popover is visible again with focus
 *   still on the trigger.
 *
 * Other phase changes, such as `entering → open` and `open → exiting`, do not
 * move focus.
 *
 * Known limitation: a consumer moves focus to a different element in the
 * popover, then sets `isOpen` to `false` and back to `true` from code, with no
 * user close. This hook then focuses the role default again (for example the
 * first menu item), as on `closed → entering`. The case is rare, so this is
 * acceptable. See `notes/architecture/focus.md`.
 *
 * Timing: the hook runs in a layout effect, so focus moves in the same task as
 * the open, before the browser paints. Call it AFTER the layout effect that
 * calls `showPopover()`: React runs a component's layout effects in source
 * order, and a hidden popover cannot take focus.
 *
 * Set the `initialFocusRef` target before then: in a ref callback, in a
 * child's layout effect, or during render. A child's `useEffect` runs later,
 * so the hook does not see that target.
 *
 * If a browser needs a paint before `focus()` works on an element that just
 * entered the top layer, wrap the `focus()` call in one
 * `requestAnimationFrame`. In the callback, check again that `elementRef`
 * still points at the same element.
 */
export function useInitialFocus({
	elementRef,
	initialFocusRef,
	phase,
	role,
}: {
	elementRef: RefObject<HTMLElement | null>;
	/**
	 * Consumer-chosen initial focus target. For a role that moves focus, it
	 * takes focus instead of the role default when the popover contains it.
	 * The combobox carve-out still applies. Other roles, and no role, ignore it.
	 */
	initialFocusRef?: RefObject<HTMLElement | null>;
	/**
	 * Current visibility phase from `useAnimatedVisibility`. Focus moves when
	 * the phase changes from `'closed'` or `'exiting'` to a visible phase.
	 */
	phase: TPhase;
	role: string | undefined;
}): void {
	// Start at `'closed'`, so a popover that mounts open also takes focus.
	const prevPhaseRef = useRef<TPhase>('closed');

	useLayoutEffect(() => {
		const prevPhase = prevPhaseRef.current;
		prevPhaseRef.current = phase;

		// Move focus only when the popover is visible and the previous phase was
		// `'closed'` (open) or `'exiting'` (reopen before the exit ends).
		if (phase === 'closed') {
			return;
		}
		if (prevPhase !== 'closed' && prevPhase !== 'exiting') {
			return;
		}

		const element = elementRef.current;
		if (!element) {
			return;
		}

		getInitialFocusTarget({ container: element, initialFocusRef, role })?.focus();
	}, [elementRef, initialFocusRef, phase, role]);
}
