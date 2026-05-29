import React, { isValidElement, type ReactNode, useCallback } from 'react';

import { Slot } from '../internal/slot';

import { type TPopupTriggerProps } from './types';
import { usePopupContext } from './use-popup-context';

/**
 * Wraps a single trigger element via `cloneElement`. Attaches aria
 * attributes, the toggle handler, and the anchor-name. `aria-haspopup`
 * is derived from `Popup.Content`'s role via context.
 *
 * Child constraints: must be a single ref-forwarding element. The child's
 * `onClick` is composed (runs after); other event handlers are NOT.
 * Children using Compiled's `css` prop swallow injected props - use
 * `Popup.TriggerFunction` for these cases or any time you need handler
 * composition.
 */
export function PopupTrigger({ children }: TPopupTriggerProps): ReactNode {
	const { triggerRef, popoverRef, popoverId, popupState, ariaHasPopup } = usePopupContext();

	const childOnClick = isValidElement<{ onClick?: (event: React.MouseEvent) => void }>(children)
		? children.props.onClick
		: undefined;

	// Use a ref to track the latest isOpen value so the click handler
	// does not need isOpen in its dependency array (which would recreate
	// the handler on every open/close, breaking cloneElement identity).
	const isOpenRef = React.useRef(popupState === 'open' || popupState === 'animating-open');
	isOpenRef.current = popupState === 'open' || popupState === 'animating-open';

	const handleClick = useCallback(
		(event: React.MouseEvent) => {
			const popoverEl = popoverRef.current;
			if (popoverEl) {
				// `popover="auto"` light-dismiss can close the popover BEFORE
				// our click handler runs, so trust React's isOpen rather than
				// DOM state. If React still thinks it is closed, open it; if
				// it was open, the browser already closed it.
				if (!isOpenRef.current) {
					try {
						popoverEl.showPopover();
					} catch {
						// Element may be disconnected; ignore.
					}
				}
			}

			childOnClick?.(event);
		},
		[popoverRef, childOnClick],
	);

	return (
		<Slot
			ref={triggerRef}
			onClick={handleClick}
			// aria-expanded stays true throughout entry and exit animations so screen readers
			// don't announce the popup as closed while it's still visible, and consumers
			// relying on aria-expanded to show/hide trigger UI don't lose the anchor mid-animation.
			aria-expanded={
				popupState === 'open' ||
				popupState === 'animating-open' ||
				popupState === 'animating-closed'
			}
			aria-controls={popoverId}
			aria-haspopup={ariaHasPopup}
		>
			{children}
		</Slot>
	);
}
