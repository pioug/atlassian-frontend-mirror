import { type RefObject, useEffect, useRef } from 'react';

import { bind } from 'bind-event-listener';

import { hasOpenDialogOrPopover } from './has-open-dialog-or-popover';

type TUseCloseOnUnclaimedEscapeOptions = {
	/**
	 * The listener is bound only while this is `true`. Pass the open state of the surface. A
	 * missing value (for example from an unmocked feature gate in a test) binds no listener.
	 */
	isEnabled: boolean;

	/**
	 * Called when Escape asks the surface to close. Set the surface to closed in response. The
	 * hook does not hide anything itself.
	 */
	onClose: (args: { event: KeyboardEvent }) => void;

	/**
	 * Optional extra check. Return `false` to keep the surface open for this Escape (for
	 * example while a text field has focus). It runs after the built-in checks, so it can keep
	 * the surface open, but it cannot make it close.
	 */
	shouldClose?: (args: { event: KeyboardEvent }) => boolean;

	/**
	 * Listen on this element instead of `document`. Escape then only closes the surface while
	 * focus is inside the element, and only open dialogs and popovers inside the element keep it open.
	 *
	 * The hook reads `targetRef.current` when `isEnabled` becomes `true`. The element must be
	 * mounted at that time. If it is not, no listener is bound.
	 */
	targetRef?: RefObject<HTMLElement | null>;
};

/**
 * Closes a page surface (for example a side panel) on Escape.
 *
 * Do not use it for a `Popover` or a `Dialog`. The browser and `Dialog` already close them on
 * Escape.
 *
 * The browser closes top-layer surfaces on Escape itself. A surface that is not in the top layer
 * needs its own `keydown` listener, and that listener also receives the Escape that closes an open
 * popover or dialog. This hook calls `onClose` only for an unclaimed Escape. An Escape is claimed
 * when:
 *
 * - `event.defaultPrevented` is `true`. Something already handled this Escape.
 * - `event.repeat` is `true`. A held key closes one surface per key press.
 * - An open dialog or popover is inside the target (`document` by default). See
 *   `hasOpenDialogOrPopover`. The browser closes it after the `keydown` event, so it is still open when this listener runs.
 * - `shouldClose` returns `false`.
 *
 * Every bound surface makes its own decision. Two open page surfaces both close on one Escape.
 */
export function useCloseOnUnclaimedEscape({
	isEnabled,
	onClose,
	shouldClose,
	targetRef,
}: TUseCloseOnUnclaimedEscapeOptions): void {
	// Keep the latest callbacks so the listener does not re-bind on every render.
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;
	const shouldCloseRef = useRef(shouldClose);
	shouldCloseRef.current = shouldClose;

	useEffect(() => {
		if (!isEnabled) {
			return;
		}

		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- page surfaces listen on the document by default
		const target: HTMLElement | Document | null = targetRef ? targetRef.current : document;
		if (!target) {
			return;
		}

		return bind(target, {
			type: 'keydown',
			listener(event: KeyboardEvent) {
				if (event.key !== 'Escape' || event.defaultPrevented || event.repeat) {
					return;
				}

				if (hasOpenDialogOrPopover({ within: target })) {
					return;
				}

				if (shouldCloseRef.current && !shouldCloseRef.current({ event })) {
					return;
				}

				onCloseRef.current({ event });
			},
		});
	}, [isEnabled, targetRef]);
}
