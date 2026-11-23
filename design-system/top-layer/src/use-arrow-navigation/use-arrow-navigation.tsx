import { type RefObject, useCallback, useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { getFirstFocusable } from '../focus/get-first-focusable';
import { getLastFocusable } from '../focus/get-last-focusable';
import { getNextFocusable } from '../focus/get-next-focusable';
import { isInContainerLayer } from '../focus/is-in-container-layer';
import { isNestedLayerFocused } from '../focus/is-nested-layer-focused';
import { type TFocusableFilter } from '../focus/types';
import { pendingFocusReturns } from '../internal/manual-hide/pending-focus-returns';

const menuSelector = '[role="menu"]';

/**
 * Arguments for `useArrowNavigation`. See the hook for the keyboard contract.
 */
export type TUseArrowNavigationArgs = {
	/**
	 * Ref to the container element that holds the focusable items. The hook listens for `keydown`
	 * on this element.
	 */
	containerRef: RefObject<HTMLElement | null>;

	/**
	 * Called on `ArrowRight` when the focused element has `aria-haspopup`.
	 *
	 * In the WAI-ARIA menu pattern, `ArrowRight` on an item that controls a submenu opens that
	 * submenu. You decide how to open it (for example `trigger.click()` or a state update).
	 */
	onNestedOpen?: ({ trigger }: { trigger: HTMLElement }) => void;

	/**
	 * Called on `ArrowLeft` when the container is inside another `role="menu"` (a submenu).
	 *
	 * In the WAI-ARIA menu pattern, `ArrowLeft` in a submenu closes it and returns to the parent
	 * menu. You decide how to close it (for example with your close handler).
	 */
	onNestedClose?: () => void;

	/**
	 * Called on `Tab` and `Shift+Tab`, before a dialog's focus wrap. Close the
	 * menu at once (`hidePopover()`), so focus moves on from the trigger.
	 */
	onClose: () => void;

	/**
	 * When `false`, the hook does not listen for `keydown`. Default: `true`.
	 */
	isEnabled?: boolean;

	/**
	 * Restricts which focusable elements the keys move focus to.
	 *
	 * The hook also checks the focused element with it. When the focused element does not pass,
	 * the hook ignores the key. This stops a parent menu from acting on keys that belong to a
	 * nested menu.
	 *
	 * A common filter is `isAtCurrentMenuLevel`, which excludes items inside a nested `role="menu"`.
	 */
	filter?: TFocusableFilter;
};

/**
 * Whether the focused element belongs to this menu level, so the hook acts on the key. A nested
 * menu or other nested layer handles its own keys.
 */
function isFocusedElementAtThisLevel({
	focusedElement,
	container,
	filter,
}: {
	focusedElement: Element | null;
	container: HTMLElement;
	filter?: TFocusableFilter;
}): boolean {
	if (!(focusedElement instanceof HTMLElement)) {
		return true;
	}
	// A layer opened from the menu (for example a dialog with a text field) owns its keys.
	if (isNestedLayerFocused({ container })) {
		return false;
	}
	if (filter) {
		return filter(focusedElement, container);
	}
	if (container.getAttribute('role') !== 'menu') {
		return true;
	}
	return focusedElement.closest(menuSelector) === container;
}

/**
 * **Arrow key navigation for a menu container**
 *
 * Moves DOM focus between the focusable elements in `containerRef`. The keyboard contract follows
 * the WAI-ARIA APG menu pattern:
 *
 * - `ArrowDown` / `ArrowUp`: focus the next / previous item. Wraps at both ends.
 * - `Home` / `End`: focus the first / last item.
 * - `ArrowRight`: on an item with `aria-haspopup`, calls `onNestedOpen`.
 * - `ArrowLeft`: in a menu inside another `role="menu"`, calls `onNestedClose`.
 * - `Tab` / `Shift+Tab`: calls `onClose`, as in Radix UI, Headless UI, React Aria and Floating UI.
 *   There is no special case that lets `Tab` on the last item leave the menu open.
 * - `Page Up` / `Page Down`: not handled. Add your own listener if your menu needs page scrolling.
 *
 * The hook acts on a key only when the focused element belongs to this menu level, so a parent
 * menu does not act on keys that belong to a nested menu. With a `filter`, the filter decides.
 * Without one, a `role="menu"` container acts only when the closest `role="menu"` of the focused
 * element is the container.
 *
 * The hook ignores all keys while focus is in a nested layer (a `[popover]` or `<dialog>` inside
 * the container), such as a dialog that a menu item opens. That layer handles its own keys.
 *
 * @example Basic usage
 * ```tsx
 * useArrowNavigation({
 *   containerRef: menuRef,
 *   onClose: () => setIsOpen(false),
 *   isEnabled: isOpen,
 * });
 * ```
 *
 * @example With nested menu filter
 * ```tsx
 * import { isAtCurrentMenuLevel } from '@atlaskit/top-layer/is-at-current-menu-level';
 * import { useArrowNavigation } from '@atlaskit/top-layer/use-arrow-navigation/use-arrow-navigation';
 *
 * useArrowNavigation({
 *   containerRef: menuRef,
 *   onClose: () => setIsOpen(false),
 *   isEnabled: isOpen,
 *   filter: isAtCurrentMenuLevel,
 * });
 * ```
 */
export function useArrowNavigation({
	containerRef,
	onClose,
	onNestedOpen,
	onNestedClose,
	isEnabled = true,
	filter,
}: TUseArrowNavigationArgs): void {
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const container = containerRef.current;
			if (!container) {
				return;
			}

			// A nested menu already acted on this key (it prevented the default). One key acts on one
			// menu level.
			if (event.defaultPrevented) {
				return;
			}

			const focusedElement = container.ownerDocument.activeElement;
			if (!isFocusedElementAtThisLevel({ focusedElement, container, filter })) {
				return;
			}

			// Arrow keys stay in this menu level. Tab still reaches nested layers.
			const arrowKeyFilter: TFocusableFilter = (element, menu) =>
				isInContainerLayer(element, menu) && (!filter || filter(element, menu));

			if (event.key === 'ArrowDown') {
				// Prevent page scroll while navigating menu items.
				event.preventDefault();
				getNextFocusable({ container, direction: 'forwards', filter: arrowKeyFilter })?.focus();
				return;
			}

			if (event.key === 'ArrowUp') {
				// Prevent page scroll while navigating menu items.
				event.preventDefault();
				getNextFocusable({ container, direction: 'backwards', filter: arrowKeyFilter })?.focus();
				return;
			}

			if (event.key === 'Home') {
				// Prevent browser default (e.g. scrolling to top of page).
				event.preventDefault();
				getFirstFocusable({ container, filter: arrowKeyFilter })?.focus();
				return;
			}

			if (event.key === 'End') {
				// Prevent browser default (e.g. scrolling to bottom of page).
				event.preventDefault();
				getLastFocusable({ container, filter: arrowKeyFilter })?.focus();
				return;
			}

			// Nested menus (WAI-ARIA menu pattern): ArrowRight on an item with `aria-haspopup` opens
			// its submenu.
			if (event.key === 'ArrowRight') {
				if (
					onNestedOpen &&
					focusedElement instanceof HTMLElement &&
					focusedElement.hasAttribute('aria-haspopup')
				) {
					event.preventDefault();
					onNestedOpen({ trigger: focusedElement });
				}
				return;
			}

			// ArrowLeft closes this menu only if it is a submenu.
			if (event.key === 'ArrowLeft') {
				if (onNestedClose) {
					// Start from the parent, so `closest()` does not match the container itself.
					const isNested = Boolean(container.parentElement?.closest(menuSelector));
					if (isNested) {
						event.preventDefault();
						onNestedClose();
					}
				}
				return;
			}
		},
		[containerRef, onNestedOpen, onNestedClose, filter],
	);

	const handleTabKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key !== 'Tab') {
				return;
			}
			const container = containerRef.current;
			if (!container || !event.composedPath().includes(container)) {
				return;
			}
			const focusedElement = container.ownerDocument.activeElement;
			if (!isFocusedElementAtThisLevel({ focusedElement, container, filter })) {
				return;
			}
			onClose();
			// `onClose` hid the menus, which queued their focus returns. Run them now, so the Tab moves
			// on from the element that had focus when the menu opened: a key sent from script
			// (Playwright in Firefox, user-event) gets no microtask before the Tab default action.
			pendingFocusReturns.runAll();
		},
		[containerRef, onClose, filter],
	);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || !isEnabled) {
			return;
		}

		const unbindKeys = bind(container, {
			type: 'keydown',
			listener: handleKeyDown,
		});
		// Capture on the document: close before a dialog's focus wrap moves focus.
		const unbindTab = bind(container.ownerDocument, {
			type: 'keydown',
			listener: handleTabKeyDown,
			options: { capture: true },
		});

		return () => {
			unbindKeys();
			unbindTab();
		};
	}, [containerRef, handleKeyDown, handleTabKeyDown, isEnabled]);
}
