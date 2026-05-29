import React, { useCallback, useId, useRef, useState } from 'react';

import { type TAriaHasPopupValue } from '../internal/role-types';
import { type TPopoverCloseReason } from '../popover/types';

import { type TPopupContextValue, type TPopupState } from './popup-context';
import { PopupProvider } from './popup-provider';
import { type TPopupProps } from './types';

/**
 * Popup compound: trigger + popover content.
 *
 * Use when a button opens anchored content (dropdown, menu, dialog).
 * The browser manages visibility via `togglePopover()`; the consumer
 * never manages `isOpen`. For custom trigger lifecycles (hover, timers,
 * external state), use `Popover` directly instead.
 *
 * Provides context (triggerRef, placement, isOpen, onClose, mode) that
 * `Popup.Content` reads and forwards to the underlying `Popover`.
 */
export function PopupRoot(props: TPopupProps): React.ReactElement {
	const { children, testId, forceFallbackPositioning, onOpenChange } = props;
	// `{}` resolves to "below the trigger, centered, with `space.100` gap"
	// inside `useAnchorPosition`, which is the common case.
	const placement = props.placement ?? {};
	const mode = props.mode ?? 'auto';

	// `TPopupProps` discriminates on `mode`: `manual` types `onClose` as
	// `never`, so for manual consumers `props.onClose` is always `undefined`
	// here. No runtime guard needed; the type contract carries the rule.
	const onClose = props.onClose;

	const id = useId();
	// `useId()` returns IDs containing colons (`:r1:`), which are invalid
	// in CSS selectors and `popover` target attributes. `replaceAll` is
	// not in our browser matrix.
	const sanitizedId = id.replace(/:/g, '');
	const popoverId = `popover-${sanitizedId}`;

	const triggerRef = useRef<HTMLElement | null>(null);
	const popoverRef = useRef<HTMLDivElement | null>(null);
	const [popupState, setPopupState] = useState<TPopupState>('closed');
	// Initial seed before `Popup.Content`'s layout effect resolves the
	// real role on first paint.
	const [ariaHasPopup, setAriaHasPopup] = useState<TAriaHasPopupValue>('dialog');

	const handleClose = useCallback(
		(args: { reason: TPopoverCloseReason }) => {
			onClose?.(args);
		},
		[onClose],
	);

	const contextValue: TPopupContextValue = {
		popoverId,
		placement,
		// `null` when the consumer did not supply a handler (manual mode, or
		// auto/hint without a light-dismiss handler). `Popup.Content` reads
		// this to decide whether to forward an `onClose` to `Popover`.
		onClose: onClose ? handleClose : null,
		triggerRef,
		popoverRef,
		popupState,
		setPopupState,
		onOpenChange,
		mode,
		ariaHasPopup,
		setAriaHasPopup,
		testId,
		forceFallbackPositioning,
	};

	return <PopupProvider value={contextValue}>{children}</PopupProvider>;
}
