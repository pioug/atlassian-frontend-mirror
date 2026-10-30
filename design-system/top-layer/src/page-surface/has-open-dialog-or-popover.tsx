import { isModalDialog } from '../internal/escape-ownership/is-modal-dialog';
import { getOpenClosablePopovers } from '../internal/get-open-closable-popovers';

/**
 * Returns `true` when an open `<dialog>`, or an open `Popover` that has an `onClose`, is inside
 * `within` (the whole document by default). Tooltips and popovers without `onClose` never count.
 * Pass `type: 'modal'` to count only modal dialogs.
 *
 * Top-layer surfaces render inline, so a surface opened from inside an element is a DOM descendant
 * of that element. That makes `within` the replacement for open layer observer namespaces.
 *
 * It answers "is a closable layer open?" (for example to hold a flyout open, pause grid keyboard
 * navigation, or call `requestClosePopovers()`), not "which layer takes this Escape?". That rule
 * (in `Dialog`, `useManualLightDismiss` and `useCloseOnUnclaimedEscape`) also counts tooltips, auto
 * popovers without `onClose` and manual popovers with `useManualLightDismiss` (for example
 * Spotlight), and skips a non-modal `<dialog>` without `closedby`. For a page surface that closes
 * on Escape, use `useCloseOnUnclaimedEscape`.
 *
 * Call it at event time. A `keydown` listener still sees a popover that the same Escape press is
 * about to close. A `Dialog` can close during the Escape keydown, before a later `window` listener
 * runs. The `Dialog` calls `preventDefault()` first, so to ignore an Escape that a layer took, also
 * skip `event.defaultPrevented`.
 */
export function hasOpenDialogOrPopover({
	within = document,
	type,
}: {
	within?: ParentNode;
	type?: 'modal';
} = {}): boolean {
	const dialogs = Array.from(within.querySelectorAll('dialog'));

	if (type === 'modal') {
		return dialogs.some((dialog) => isModalDialog({ element: dialog }));
	}

	if (dialogs.some((dialog) => dialog.open)) {
		return true;
	}

	return getOpenClosablePopovers({ within }).some(
		(popover) => popover.getAttribute('role') !== 'tooltip',
	);
}
