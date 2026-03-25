import React, { isValidElement, type ReactNode, useCallback } from 'react';

import { Slot } from '../internal/slot';

import { usePopupContext } from './popup-context';
import { type TPopupTriggerProps } from './types';

/**
 * Wraps the trigger element. Attaches aria attributes and handles
 * click to toggle the popover. Sets the anchor-name on the trigger
 * for CSS Anchor Positioning.
 *
 * `aria-haspopup` is derived from the content's role via context
 * (set by `Popup.Content`). This ensures the trigger always matches
 * the content's semantic role without the consumer specifying it
 * in two places.
 *
 * **Limitation:** Uses `cloneElement` internally (via `Slot`), which is
 * incompatible with Compiled's `css` prop on the direct child element.
 * The `@jsx jsx` pragma transforms the child before `cloneElement` can
 * inject `onClick` and `ref` onto the DOM node, preventing the popover
 * from opening.
 *
 * If you need Compiled `css` on the trigger, use `Popup.TriggerFunction`
 * instead — it hands you raw props via a render-prop and avoids
 * `cloneElement` entirely.
 */
export function PopupTrigger({ children }: TPopupTriggerProps): ReactNode {
	const { triggerRef, popoverRef, popoverId, isOpen, ariaHasPopup } = usePopupContext();

	const childOnClick = isValidElement<{ onClick?: (e: React.MouseEvent) => void }>(children)
		? children.props.onClick
		: undefined;

	// Use a ref to track the latest isOpen value so the click handler
	// doesn't need isOpen in its dependency array (which would recreate
	// the handler on every open/close, breaking cloneElement identity).
	const isOpenRef = React.useRef(isOpen);
	isOpenRef.current = isOpen;

	const handleClick = useCallback(
		(event: React.MouseEvent) => {
			const popoverEl = popoverRef.current;
			if (popoverEl) {
				// For popover="auto", clicking the trigger (which is outside
				// the popover) can cause the browser's built-in light-dismiss
				// to fire before our click handler runs. This means by the time
				// we get here, the DOM may have already closed the popover.
				//
				// We use React's `isOpen` state (via ref) rather than the DOM
				// state to determine intent:
				// - If React thinks it was open → the user wants to close.
				//   The browser already did this via light-dismiss, so do nothing.
				// - If React thinks it was closed → the user wants to open.
				//   Call showPopover().
				if (!isOpenRef.current) {
					try {
						popoverEl.showPopover();
					} catch {
						// Already showing — safe to ignore.
					}
				}
				// When isOpenRef.current is true, the browser's light-dismiss
				// already closed the popover and fired the toggle event, which
				// will update React state via handleToggle → setIsOpen(false).
				// No action needed here.
			}

			childOnClick?.(event);
		},
		[popoverRef, childOnClick],
	);

	return (
		<Slot
			ref={triggerRef}
			onClick={handleClick}
			aria-expanded={isOpen}
			aria-controls={popoverId}
			aria-haspopup={ariaHasPopup}
		>
			{children}
		</Slot>
	);
}
