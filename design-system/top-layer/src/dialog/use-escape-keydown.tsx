import { type RefObject, useEffect } from 'react';

import { bindAll } from 'bind-event-listener';

import { getDeepActiveElement } from '../internal/get-deep-active-element';

function isOpenPopover(node: EventTarget): boolean {
	try {
		return (
			node instanceof HTMLElement && node.hasAttribute('popover') && node.matches(':popover-open')
		);
	} catch {
		// `:popover-open` is unsupported in some environments (e.g. jsdom without a polyfill).
		return false;
	}
}

// `auto` and `hint` popovers take Escape (light dismiss). A `manual` popover does not. The property
// normalizes the attribute (a bare `popover` is `auto`, values are case-insensitive).
function isOpenLightDismissPopover(node: EventTarget): boolean {
	return (
		node instanceof HTMLElement &&
		(node.popover === 'auto' || node.popover === 'hint') &&
		isOpenPopover(node)
	);
}

// An open light-dismiss popover in the dialog takes the Escape, even with focus outside it.
// If the dialog canceled the keydown, the browser would not close the popover.
// `querySelectorAll` does not search shadow roots, so a popover inside a shadow root is missed
// (ADS does not use shadow roots).
function hasOpenChildPopover(dialog: HTMLDialogElement): boolean {
	return Array.from(dialog.querySelectorAll('[popover]')).some(isOpenLightDismissPopover);
}

// Focus is on `<body>` when the focused element was removed, or after `blur()`.
function isFocusOnBody({ event }: { event: KeyboardEvent }): boolean {
	return event.target instanceof HTMLBodyElement || event.target instanceof HTMLHtmlElement;
}

// The nearest `<dialog>` that contains the node, crossing shadow roots.
function getNearestDialog({ node }: { node: Node | null }): HTMLDialogElement | null {
	if (!node) {
		return null;
	}
	if (node instanceof HTMLDialogElement) {
		return node;
	}
	if (node instanceof ShadowRoot) {
		return getNearestDialog({ node: node.host });
	}
	return getNearestDialog({ node: node.parentNode });
}

/**
 * The dialog owns the Escape when:
 * - it is the nearest layer that takes Escape (a `<dialog>`, or an open `auto` or `hint` popover)
 *   on the composed path from the focused element, or
 * - focus is on `<body>`, and focus was last in this dialog (`wasLastFocused`).
 *
 * And it has no open light-dismiss child popover.
 */
function isOwnEscape({
	dialog,
	event,
	wasLastFocused,
}: {
	dialog: HTMLDialogElement;
	event: KeyboardEvent;
	wasLastFocused: boolean;
}): boolean {
	if (hasOpenChildPopover(dialog)) {
		return false;
	}
	if (isFocusOnBody({ event })) {
		return wasLastFocused;
	}
	const layer = event
		.composedPath()
		.find((node) => node instanceof HTMLDialogElement || isOpenLightDismissPopover(node));
	return layer === dialog;
}

/**
 * Takes each Escape meant for the open dialog and calls `onEscape` once per key press.
 *
 * The dialog has `closedby="none"`, so the browser does not close it on Escape. This hook gives
 * the dialog the Escape that a native modal `<dialog>` would get (`closedby="closerequest"`).
 * The dialog takes an Escape when focus is in it and not in a nested dialog or an open `auto` or
 * `hint` popover, or when focus is on `<body>` and was last in this dialog. A `manual` popover
 * does not take Escape, so an Escape in it goes to the dialog.
 * An open light-dismiss child popover, or an inner handler that called `preventDefault()`, gets
 * the Escape first.
 */
export function useEscapeKeydown({
	dialogRef,
	isMounted,
	onEscape,
}: {
	dialogRef: RefObject<HTMLDialogElement | null>;
	isMounted: boolean;
	onEscape: () => void;
}): void {
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!isMounted || !dialog) {
			return;
		}

		/**
		 * Whether focus was last in this dialog (and not in a nested dialog).
		 *
		 * Only the top modal can hold focus (the rest of the page is inert), so the dialog that
		 * focus was last in is the top modal. Recorded on `focusin`: removing the focused element
		 * fires no event in Firefox and WebKit, so the value stays on the dialog focus left.
		 * The dialog is already open here (`showModal()` runs in a layout effect), so start from
		 * the current focus.
		 */
		let wasLastFocused =
			getNearestDialog({ node: getDeepActiveElement({ root: dialog.ownerDocument }) }) === dialog;
		let isOwn = false;
		return bindAll(window, [
			{
				type: 'focusin',
				listener(event) {
					// At `window`, `event.target` is retargeted to the shadow host. The first node on the
					// composed path is the focused element inside the shadow root.
					const target = event.composedPath()[0] ?? event.target;
					wasLastFocused = target instanceof Node && getNearestDialog({ node: target }) === dialog;
				},
				options: { capture: true },
			},
			{
				// Capture: the child popover is still open here.
				type: 'keydown',
				listener(event) {
					if (event.key === 'Escape') {
						isOwn = isOwnEscape({ dialog, event, wasLastFocused });
					}
				},
				options: { capture: true },
			},
			{
				// Bubble: inner handlers run first.
				type: 'keydown',
				listener(event) {
					// `defaultPrevented`: an inner handler took this Escape, so one press undoes one thing (as
					// native `<dialog>`). Legacy ModalDialog closes anyway; that changes when the flag rolls out.
					if (
						event.key !== 'Escape' ||
						!isOwn ||
						event.defaultPrevented ||
						event.isComposing ||
						!dialog.open
					) {
						return;
					}
					/**
					 * Stops the browser's close request. With `closedby="none"`, the request would skip this
					 * dialog and go to the next close watcher in its group (for example a parent `auto`
					 * popover, which would close). In browsers without `closedby`, it would fire `cancel`.
					 */
					event.preventDefault();
					// A held key repeats `keydown`. Ask once per key press.
					if (event.repeat) {
						return;
					}
					onEscape();
				},
			},
		]);
	}, [dialogRef, isMounted, onEscape]);
}
