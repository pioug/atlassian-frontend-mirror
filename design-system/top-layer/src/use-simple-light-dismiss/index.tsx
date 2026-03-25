import { type RefObject, useEffect, useRef } from 'react';

import { bind } from 'bind-event-listener';

import { type TPopoverCloseReason } from '../popover/types';

type TUseSimpleLightDismissOptions = {
	/**
	 * Ref to the popover element. Clicks inside this element will not trigger dismiss.
	 */
	popoverRef: RefObject<HTMLElement | null>;

	/**
	 * Whether the popover is currently open.
	 * Listeners are only bound when `isOpen` is `true`.
	 */
	isOpen: boolean;

	/**
	 * Called when a light-dismiss event occurs.
	 *
	 * - `reason: 'escape'` — the user pressed the Escape key.
	 * - `reason: 'light-dismiss'` — the user clicked outside the popover.
	 *
	 * **Note:** This hook provides simple, standalone light dismiss that does not
	 * participate in the browser's `popover="auto"` dismiss stack. Every active
	 * instance will fire independently — if multiple popovers use this hook,
	 * they will all receive dismiss events.
	 */
	onClose: (args: { reason: TPopoverCloseReason }) => void;
};

/**
 * Simple light-dismiss hook for `popover="manual"` elements.
 *
 * Provides Escape-to-close and click-outside-to-close behavior without
 * relying on the browser's `popover="auto"` light-dismiss stack.
 *
 * **No stacking awareness:** This hook does not track a popover stack.
 * If multiple manual popovers are open and all use this hook, a single
 * Escape press or outside click will dismiss **all of them simultaneously**.
 * This is by design — the hook is intentionally simple for cases where
 * only one manual popover is open at a time.
 *
 * For stacked/nested popovers that should dismiss one-at-a-time, use
 * `popover="auto"` mode instead, which provides native stack-aware
 * light dismiss via the browser's top-layer stack.
 */
export function useSimpleLightDismiss({
	popoverRef,
	isOpen,
	onClose,
}: TUseSimpleLightDismissOptions): void {
	// Keep a stable ref to onClose so the effect doesn't re-bind on every render.
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- binding to document for light dismiss
		const unbindEscape = bind(document, {
			type: 'keydown',
			listener: (event: KeyboardEvent) => {
				if (event.key === 'Escape') {
					onCloseRef.current({ reason: 'escape' });
				}
			},
		});

		// Listen for click-outside in the **capture** phase.
		//
		// The click that opened the popover propagates in bubble phase
		// (trigger onClick → setIsOpen(true) → React render → useEffect).
		// By the time this effect runs, the opening click has finished
		// bubbling. A capture-phase listener added now cannot retroactively
		// fire for that event — it only fires for *future* clicks.
		//
		// This avoids the need for timestamp guards or deferred binding.
		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- binding to document for light dismiss
		const unbindClickOutside = bind(document, {
			type: 'click',
			listener: (event: MouseEvent) => {
				const el = popoverRef.current;
				if (!el) {
					return;
				}

				// If the click target is inside the popover, don't dismiss.
				if (event.target instanceof Node && el.contains(event.target)) {
					return;
				}

				onCloseRef.current({ reason: 'light-dismiss' });
			},
			options: { capture: true },
		});

		return () => {
			unbindEscape();
			unbindClickOutside();
		};
	}, [isOpen, popoverRef]);
}

export type { TUseSimpleLightDismissOptions };
