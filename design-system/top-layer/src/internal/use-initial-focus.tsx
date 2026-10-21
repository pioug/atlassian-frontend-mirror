import { type RefObject, useEffect, useRef } from 'react';

import { getFirstFocusable } from '../focus/get-first-focusable';
import { type TPhase } from './use-animated-visibility';

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
 *
 * Combobox pattern exception: if the popup is controlled by a focused
 * combobox-like trigger (its `aria-controls` references this popup),
 * focus stays on the textbox. This applies to `menu`, `listbox`, and to
 * `dialog` / `alertdialog` when the combobox is outside the dialog. See
 * `isComboboxControllingPopup`.
 */

/**
 * WAI-ARIA APG Combobox Pattern: when a combobox controls a popup (listbox,
 * grid, tree, menu, or dialog), DOM focus must remain on the textbox. Subsequent
 * navigation through popup items uses `aria-activedescendant` (or proxied
 * keyboard events), never DOM focus movement.
 *
 * Detects both variants in a single pass:
 * - In-popup combobox: the textbox lives inside the popup `container`
 *   (the popup is rendered as a child of the combobox wrapper).
 * - External combobox: the textbox is rendered OUTSIDE the popup
 *   (`react-select` pattern, where the listbox is portalled separately
 *   from the textbox).
 *
 * Acceptance criteria for the active element:
 * - Role / element-type filter: `role="combobox"`, `role="textbox"`,
 *   `TEXTAREA`, `contentEditable`, or `INPUT` of text-like type
 *   (`text`, `search`, `email`, `url`, `tel`, `password`, or
 *   unspecified). Non-text input types (`button`, `checkbox`, etc.)
 *   are rejected.
 * - Reference filter: `aria-controls` (or legacy `aria-owns`) IDREFS
 *   must resolve to an element that IS or CONTAINS the popup container.
 *
 * See: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
// `<input>` types treated as text-like for combobox detection.
// Non-text input types (`button`, `checkbox`, `submit`, etc.) are rejected.
// A missing `type` attribute defaults to `text` per the HTML spec, so we
// normalize that case before lookup rather than including an empty string here.
const TEXT_LIKE_INPUT_TYPES = new Set(['text', 'search', 'email', 'url', 'tel', 'password']);

function isTextboxLikeElement(element: HTMLElement): boolean {
	const role = element.getAttribute('role');
	if (role === 'combobox' || role === 'textbox') {
		return true;
	}
	// `tagName` is uppercase for HTML elements but can be mixed-case for
	// XML/SVG. Normalize once so downstream comparisons stay lowercase.
	const tag = element.tagName.toLowerCase();
	if (tag === 'textarea') {
		return true;
	}
	if (element.isContentEditable) {
		return true;
	}
	if (tag === 'input') {
		const type = (element.getAttribute('type') ?? 'text').toLowerCase();
		return TEXT_LIKE_INPUT_TYPES.has(type);
	}
	return false;
}

function isComboboxControllingPopup({ container }: { container: HTMLElement }): boolean {
	const ownerDocument = container.ownerDocument;
	const active = ownerDocument.activeElement;
	if (!(active instanceof HTMLElement)) {
		return false;
	}

	if (!isTextboxLikeElement(active)) {
		return false;
	}

	// Accept legacy `aria-owns` in addition to `aria-controls`.
	// `aria-controls` / `aria-owns` are IDREFS (space-separated list of IDs)
	// per the WAI-ARIA spec, so we must split and check membership rather
	// than comparing with strict equality. A combobox that controls both
	// this popup and another element (e.g. a results status region) must
	// still be recognised as controlling this popup.
	const idRefs = active.getAttribute('aria-controls') ?? active.getAttribute('aria-owns');
	if (!idRefs) {
		return false;
	}

	// Match if any referenced element IS, CONTAINS, or IS CONTAINED BY the
	// popup container. The "contained by" case covers wrapper-style adopters
	// like react-select, where the combobox input's `aria-controls` points at
	// a listbox element that is a descendant of the Popover host (the
	// listbox role lives on a child the wrapped library owns, not on the
	// host we render).
	const referencedIds = idRefs.split(/\s+/).filter((id) => id !== '');
	return referencedIds.some((id) => {
		const referenced = ownerDocument.getElementById(id);
		if (!referenced) {
			return false;
		}
		return (
			referenced === container || referenced.contains(container) || container.contains(referenced)
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
	// The override target, then the role default, decides where.
	if (role === 'dialog' || role === 'alertdialog') {
		// APG allows a combobox to control a dialog popup. Focus stays on the
		// combobox only when it is OUTSIDE the dialog. A dialog that contains
		// its own combobox still takes focus (see the comment below on why the
		// carve-out is per-role).
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
		// Prefer element with the native HTML autofocus attribute.
		const autofocusEl = container.querySelector<HTMLElement>('[autofocus]');
		if (autofocusEl) {
			return autofocusEl;
		}
		// Fall back to first focusable element
		return getFirstFocusable({ container });
	}

	// The combobox carve-out is kept role-specific rather than hoisted.
	// Hoisting it over-matched on dialog popups that contain a nested
	// combobox (e.g. datetime-picker's dialog hosts a react-select), where
	// the active combobox's `aria-controls` falsely matched the container
	// and suppressed the dialog's own focus contract. The dialog branch
	// above therefore skips only for a combobox outside the dialog.
	if (role === 'menu') {
		if (isComboboxControllingPopup({ container })) {
			return null;
		}
		const overrideTarget = getOverrideTarget({ container, initialFocusRef });
		if (overrideTarget) {
			return overrideTarget;
		}
		// Initial focus placement is the extent of what top-layer provides
		// for menus. All subsequent keyboard navigation (arrow keys, Home/End,
		// type-ahead, Enter/Space, submenu coordination) is the responsibility
		// of the consumer component (e.g. dropdown-menu), because menu keyboard
		// behavior varies by context (orientation, nesting, item type, control
		// pattern). See: notes/decisions/menu-keyboard.md
		return getFirstFocusable({ container });
	}

	if (role === 'listbox') {
		// ARIA Combobox Pattern: if a combobox-like textbox owns the popup
		// (in-popup or external e.g. react-select), leave focus on the
		// textbox - navigation is proxied through it.
		if (isComboboxControllingPopup({ container })) {
			return null;
		}
		const overrideTarget = getOverrideTarget({ container, initialFocusRef });
		if (overrideTarget) {
			return overrideTarget;
		}
		// Prefer the selected option, then fall back to the first option.
		// We intentionally match by `[role="option"]` rather than by
		// `getFirstFocusable`. The standard WAI-ARIA APG listbox pattern
		// renders options with `tabindex="-1"` (managed via roving
		// tabindex); `getFirstFocusable` excludes `tabindex="-1"` elements
		// and would silently lose initial focus for spec-conformant
		// listboxes. Options remain programmatically focusable.
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
		// Last resort for non-standard listboxes that render no options
		// but do contain a focusable element (e.g. an empty-state action).
		return getFirstFocusable({ container });
	}

	// tooltip, no role, or other roles: no focus movement
	return null;
}

/**
 * Moves focus into a popover element when it opens, based on its ARIA role.
 *
 * Follows the WAI-ARIA APG initial-focus patterns for each role. For the
 * roles that move focus, an `initialFocusRef` target inside the popover
 * comes first:
 * - `dialog` / `alertdialog` → focus first focusable (or `[autofocus]`)
 * - `menu` → focus first menu item
 * - `listbox` → focus selected or first option
 * - `tooltip` / no role → no focus movement (focus must remain on trigger;
 *   moving focus into the tooltip would dismiss it)
 *
 * Role is taken from the typed `role` prop - this is the consumer's contract
 * and is not subject to drift from a directly-mutated DOM attribute.
 *
 * Always call this hook unconditionally. Focus is moved on each transition
 * into a visible phase, the moment the host element first becomes visible
 * for that open intent:
 *
 * - Animated path: on `closed → entering`. The host has just been mounted
 *   and the layout effect that calls `showPopover()` / `showModal()` has
 *   already run, so the element is in the top layer. We focus before the
 *   entry transition settles to match the WAI-ARIA APG expectation that
 *   focus lands on the new menu / dialog the instant it opens, not after
 *   the CSS finishes animating.
 * - Non-animated path: on `closed → open` (the entering phase is skipped).
 * - Reopen mid-exit: on `exiting → entering`. When a user dismisses the
 *   popup (Escape, close button, light dismiss) the browser natively
 *   restores focus to the trigger as part of `hidePopover()` /
 *   `<dialog>.close()`. If the consumer reopens before the exit transition
 *   has settled, the phase machine jumps `exiting → entering` without
 *   passing through `closed`, so without this branch the popup would be
 *   visible again with focus stranded on the trigger - a keyboard usability
 *   gap for menu/dialog/listbox roles.
 *
 * Note: there is a rare programmatic path where a consumer flips `isOpen`
 * false → true without any user-initiated close gesture and had moved focus
 * to a non-default target inside the popup. In that scenario this hook
 * re-focuses the role-appropriate default (e.g. first menu item) rather
 * than preserving the consumer-chosen target. This matches the documented
 * `closed → entering` behavior and is considered acceptable given how
 * abstract the scenario is. See `notes/architecture/focus.md`.
 *
 * Pure `entering → exiting → entering` stutters where the popup never
 * reaches `closed` and the consumer toggles in the same frame are still
 * collapsed: the `prevPhase` ref guard rejects any transition whose
 * previous phase was not `closed` or `exiting`.
 *
 * Tradeoff vs the previous `requestAnimationFrame` based approach: we no
 * longer wait one paint before focusing. The element is already attached
 * and in the top layer when this effect runs (the show / hide layout
 * effect runs first), so screen-reader announcement and visible focus
 * land together. If a regression appears that needs the extra paint
 * (e.g. browsers that require a layout pass before `focus()` works on a
 * freshly promoted top-layer element), wrap the `focus()` call in a
 * single `requestAnimationFrame` here and re-add a same-element ref
 * check inside the RAF callback.
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
	 * Current visibility phase from `useAnimatedVisibility`. Initial
	 * focus is moved on the transition out of `'closed'`:
	 *
	 * - Animated path: fires on `closed → entering`, immediately after
	 *   the host element mounts and `showPopover()` / `showModal()` has
	 *   run in the preceding layout effect.
	 * - Non-animated path: fires on `closed → open` (entering phase is
	 *   skipped entirely when animation is disabled).
	 */
	phase: TPhase;
	role: string | undefined;
}): void {
	// Track the previous phase so we only focus on transitions into a
	// visible phase from either `'closed'` (fresh mount) or `'exiting'`
	// (mid-exit reopen where the browser has already restored focus to
	// the trigger). Pure `entering → exiting → entering` stutters where
	// the consumer toggles in the same frame are still collapsed.
	const prevPhaseRef = useRef<TPhase>('closed');

	useEffect(() => {
		const prevPhase = prevPhaseRef.current;
		prevPhaseRef.current = phase;

		// Only focus on transitions into a visible phase from `'closed'`
		// (fresh open) or `'exiting'` (mid-exit reopen).
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
