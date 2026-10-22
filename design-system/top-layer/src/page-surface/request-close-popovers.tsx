import { requestCloseEventName } from '../internal/closable-popover-contract';
import { getOpenClosablePopovers } from '../internal/get-open-closable-popovers';

/**
 * Asks every open closable popover inside `within` (the whole document by
 * default) to close. Each one calls its `onClose` with
 * `reason: 'programmatic'`; the owner decides whether to set `isOpen` to
 * `false`. Nothing is hidden directly, so controlled consumers stay in sync.
 *
 * Dialogs are not asked to close: closing a dialog from outside would bypass
 * the consumer's close handling.
 */
export function requestClosePopovers({ within = document }: { within?: ParentNode } = {}): void {
	getOpenClosablePopovers({ within }).forEach((element) => {
		element.dispatchEvent(new Event(requestCloseEventName));
	});
}
