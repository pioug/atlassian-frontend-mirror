import React, { type ReactNode, type RefCallback, useCallback, useMemo } from 'react';

import { type TAriaHasPopupValue } from '../internal/role-types';

import { usePopupContext } from './popup-context';

/**
 * Props passed to the `TriggerFunction` render-prop child.
 */
export type TTriggerFunctionRenderProps = {
	/**
	 * Ref callback to attach to the trigger element. Sets `triggerRef` in
	 * popup context for anchor positioning and `togglePopover`.
	 */
	ref: RefCallback<HTMLElement>;
	/**
	 * Whether the popover content is currently visible.
	 * Use for `aria-expanded` and conditional styling.
	 */
	isOpen: boolean;
	/**
	 * ID of the popover content element. Use for `aria-controls`.
	 */
	popoverId: string;
	/**
	 * Toggle the popover open/closed via the native Popover API.
	 *
	 * Calling `toggle()` invokes `popoverEl.togglePopover()` on the
	 * underlying content element. This hides the imperative DOM API
	 * behind a stable function reference.
	 */
	toggle: () => void;
	/**
	 * Pre-composed ARIA attributes for the trigger element.
	 *
	 * Spread these onto your trigger: `{...ariaAttributes}`.
	 *
	 * Contains:
	 * - `aria-expanded`: whether the popover is open
	 * - `aria-controls`: ID of the popover content
	 * - `aria-haspopup`: derived from the content's ARIA role via context
	 *
	 * **Note on `aria-haspopup`:** When the content's role maps to a specific
	 * popup type (`'menu'`, `'dialog'`, `'listbox'`, etc.), the corresponding
	 * string value is used. For unmapped roles, the value is `true` (boolean).
	 * React serialises `aria-haspopup={true}` as `aria-haspopup="true"` in the
	 * DOM, which is the correct default per the HTML spec. The values can be
	 * spread directly onto trigger elements without conversion.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions -- maps to multiple aria-* attributes as a structured object
	ariaAttributes: {
		'aria-expanded': boolean;
		'aria-controls': string;
		'aria-haspopup': TAriaHasPopupValue;
	};
};

type TPopupTriggerFunctionProps = {
	/**
	 * Render-prop function that receives trigger props.
	 *
	 * Unlike `Popup.Trigger`, this does not use `cloneElement` — the consumer
	 * is responsible for spreading ref, ARIA attributes, and attaching `toggle`
	 * to the appropriate event(s).
	 *
	 * @example
	 * ```tsx
	 * <Popup.TriggerFunction>
	 *   {({ ref, toggle, ariaAttributes }) => (
	 *     <button ref={ref} onClick={toggle} {...ariaAttributes}>
	 *       Open menu
	 *     </button>
	 *   )}
	 * </Popup.TriggerFunction>
	 * ```
	 *
	 * **Note:** This sub-component uses a render-prop pattern and is not
	 * compatible with React Server Components (RSC). It must be used
	 * inside a client component boundary (`'use client'`).
	 */
	children: (props: TTriggerFunctionRenderProps) => ReactNode;
};

/**
 * Render-prop alternative to `Popup.Trigger`.
 *
 * Use when you need full control over the trigger element — for example,
 * to compose your own trigger with custom event handlers, wrap a third-party
 * component, or build a trigger from multiple elements.
 *
 * `Popup.Trigger` uses `cloneElement` internally, which limits composability.
 * `Popup.TriggerFunction` hands you the raw props and lets you wire them up.
 *
 * **Note:** This sub-component uses a render-prop pattern and is not
 * compatible with React Server Components (RSC). It must be used inside
 * a client component boundary (`'use client'`).
 *
 * @example
 * ```tsx
 * <Popup placement={{ edge: 'end' }} onClose={handleClose}>
 *   <Popup.TriggerFunction>
 *     {({ ref, toggle, ariaAttributes }) => (
 *       <button ref={ref} onClick={toggle} {...ariaAttributes}>
 *         Open
 *       </button>
 *     )}
 *   </Popup.TriggerFunction>
 *   <Popup.Content role="dialog" label="My popup">
 *     Content
 *   </Popup.Content>
 * </Popup>
 * ```
 */
export function PopupTriggerFunction({ children }: TPopupTriggerFunctionProps): React.ReactNode {
	const { triggerRef, popoverRef, popoverId, isOpen, ariaHasPopup } = usePopupContext();

	const ref: RefCallback<HTMLElement> = useCallback(
		(node: HTMLElement | null) => {
			triggerRef.current = node;
		},
		[triggerRef],
	);

	const toggle = useCallback(() => {
		const popoverEl = popoverRef.current;
		if (popoverEl) {
			popoverEl.togglePopover();
		}
	}, [popoverRef]);

	const ariaAttributes = useMemo(() => ({
		'aria-expanded': isOpen,
		'aria-controls': popoverId,
		'aria-haspopup': ariaHasPopup,
	}), [isOpen, popoverId, ariaHasPopup]);

	return children({ ref, isOpen, popoverId, toggle, ariaAttributes });
}
