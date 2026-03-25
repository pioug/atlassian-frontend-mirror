import React, { createContext, type MutableRefObject, type RefObject, useContext } from 'react';

import { type TAriaHasPopupValue } from '../internal/role-types';
import { type TPopoverCloseReason } from '../popover/types';

import { type TPlacementOptions } from './types';

export type TPopupContextValue = {
	/**
	 * Auto-generated ID for the popover content element (used for aria-controls).
	 */
	popoverId: string;
	/**
	 * Requested placement.
	 */
	placement: TPlacementOptions;
	/**
	 * Called when the popover is dismissed via light dismiss.
	 * `null` when mode is 'manual' (no light dismiss).
	 */
	onClose: ((args: { reason: TPopoverCloseReason }) => void) | null;
	/**
	 * Mutable ref to the trigger element (set by Popup.Trigger / Popup.TriggerFunction).
	 */
	triggerRef: MutableRefObject<HTMLElement | null>;
	/**
	 * Ref to the popover content element (set by Popup.Content).
	 */
	popoverRef: RefObject<HTMLDivElement | null>;
	/**
	 * Whether the popover is currently open.
	 */
	isOpen: boolean;
	/**
	 * Set the open state (internal context sync).
	 */
	setIsOpen: (open: boolean) => void;
	/**
	 * Consumer's onOpenChange callback, forwarded to the Popover.
	 */
	onOpenChange?: (args: { isOpen: boolean; element: HTMLDivElement }) => void;
	/**
	 * Native popover mode. Flows from the Popup root to Content via context.
	 */
	mode: 'auto' | 'hint' | 'manual';
	/**
	 * The `aria-haspopup` value derived from the content's role.
	 *
	 * Set by `Popup.Content` via `setAriaHasPopup` when it renders.
	 * Read by `Popup.Trigger` / `Popup.TriggerFunction` to set
	 * the correct `aria-haspopup` on the trigger element.
	 *
	 * This flows the content's role to the trigger without requiring
	 * the consumer to specify the role in two places. The trigger
	 * renders with the default ('dialog') on first paint; Content's
	 * layout effect updates it before the browser paints.
	 */
	ariaHasPopup: TAriaHasPopupValue;
	/**
	 * Updates `ariaHasPopup` — called by Content on mount/role change.
	 */
	setAriaHasPopup: (value: TAriaHasPopupValue) => void;
	/**
	 * Test ID prefix.
	 */
	testId?: string;
	/**
	 * Forces the JavaScript positioning fallback even when the browser
	 * supports CSS Anchor Positioning. Useful for testing fallback
	 * behavior in any environment, including production.
	 */
	forceFallbackPositioning?: boolean;
};

const PopupContext: React.Context<TPopupContextValue | null> = createContext<TPopupContextValue | null>(null);

/**
 * __Popup provider__
 *
 * Provides shared popup state (placement, popoverId, triggerRef,
 * isOpen, onClose) to compound child components such as `Popup.Trigger` and
 * `Popup.Content`.
 */
export const PopupProvider: React.Provider<TPopupContextValue | null> = PopupContext.Provider;

/**
 * Returns the nearest `Popup` context value.
 *
 * Throws if called outside of a `<Popup>` compound component.
 */
export function usePopupContext(): TPopupContextValue {
	const ctx = useContext(PopupContext);
	if (ctx === null) {
		throw new Error('@atlaskit/top-layer: Popup compound components must be used within <Popup>.');
	}
	return ctx;
}

/**
 * Returns the popup context if available, or `null` when used outside `<Popup>`.
 *
 * Used by `PopupContent` to support standalone usage (e.g. tooltip)
 * where values are passed as props instead of coming from a compound component.
 */
export function useMaybePopupContext(): TPopupContextValue | null {
	return useContext(PopupContext);
}
