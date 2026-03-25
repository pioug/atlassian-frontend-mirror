import React, { useCallback, useId, useRef, useState } from 'react';

import { type TAriaHasPopupValue } from '../internal/role-types';
import { type TPopoverCloseReason } from '../popover/types';

import { PopupProvider, type TPopupContextValue } from './popup-context';
import { type TPopupProps } from './types';

/**
 * Popup compound — trigger + popover content.
 *
 * Use when a button opens anchored content (dropdown, menu, dialog).
 * The browser manages visibility via `togglePopover()` — the consumer
 * never manages `isOpen`. For custom trigger lifecycles (hover, timers,
 * external state), use `Popover` directly instead.
 *
 * Provides context (triggerRef, placement, isOpen, onClose, mode) that
 * `Popup.Content` reads and forwards to the underlying `Popover`.
 */
export function PopupRoot(props: TPopupProps): React.ReactElement {
	const { placement, children, testId, forceFallbackPositioning, onOpenChange } = props;

	const mode = props.mode ?? 'auto';
	const onClose = mode === 'manual' ? null : props.onClose;

	const id = useId();
	// Regex is intentional — `replaceAll` is not available in our supported
	// browser matrix. `useId()` returns IDs containing colons (e.g. `:r1:`)
	// which are invalid in CSS selectors and `popover` target attributes.
	const sanitizedId = id.replace(/:/g, '');
	const popoverId = `popover-${sanitizedId}`;

	const triggerRef = useRef<HTMLElement | null>(null);
	const popoverRef = useRef<HTMLDivElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
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
		onClose: mode === 'manual' ? null : handleClose,
		triggerRef,
		popoverRef,
		isOpen,
		setIsOpen,
		onOpenChange,
		mode,
		ariaHasPopup,
		setAriaHasPopup,
		testId,
		forceFallbackPositioning,
	};

	return <PopupProvider value={contextValue}>{children}</PopupProvider>;
}
