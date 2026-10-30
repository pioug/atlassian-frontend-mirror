import { type RefObject, useCallback, useEffect } from 'react';

import { bind } from 'bind-event-listener';

import {
	KEY_DOWN,
	KEY_END,
	KEY_HOME,
	KEY_LEFT,
	KEY_RIGHT,
	KEY_TAB,
	KEY_UP,
} from '@atlaskit/ds-lib/keycodes';

import { getFirstFocusable } from '../focus/get-first-focusable';
import { getLastFocusable } from '../focus/get-last-focusable';
import { getNextFocusable } from '../focus/get-next-focusable';
import { type TFocusableFilter } from '../focus/types';

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
	 * Called on `Tab` and `Shift+Tab`. Close the menu in response.
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
 * menu handles its own keys.
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

			const focusedElement = container.ownerDocument.activeElement;
			if (!isFocusedElementAtThisLevel({ focusedElement, container, filter })) {
				return;
			}

			if (event.key === KEY_DOWN) {
				// Prevent page scroll while navigating menu items.
				event.preventDefault();
				getNextFocusable({ container, direction: 'forwards', filter })?.focus();
				return;
			}

			if (event.key === KEY_UP) {
				// Prevent page scroll while navigating menu items.
				event.preventDefault();
				getNextFocusable({ container, direction: 'backwards', filter })?.focus();
				return;
			}

			if (event.key === KEY_HOME) {
				// Prevent browser default (e.g. scrolling to top of page).
				event.preventDefault();
				getFirstFocusable({ container, filter })?.focus();
				return;
			}

			if (event.key === KEY_END) {
				// Prevent browser default (e.g. scrolling to bottom of page).
				event.preventDefault();
				getLastFocusable({ container, filter })?.focus();
				return;
			}

			if (event.key === KEY_TAB) {
				onClose();
				return;
			}

			// Nested menus (WAI-ARIA menu pattern): ArrowRight on an item with `aria-haspopup` opens
			// its submenu.
			if (event.key === KEY_RIGHT) {
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
			if (event.key === KEY_LEFT) {
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
		[containerRef, onClose, onNestedOpen, onNestedClose, filter],
	);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || !isEnabled) {
			return;
		}

		return bind(container, {
			type: 'keydown',
			listener: handleKeyDown,
		});
	}, [containerRef, handleKeyDown, isEnabled]);
}
