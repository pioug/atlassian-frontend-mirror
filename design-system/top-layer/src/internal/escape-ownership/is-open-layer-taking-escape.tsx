import { isNativeElementOpen } from '../is-native-element-open';
import { isModalDialog } from './is-modal-dialog';
import { manualEscapeLayerAttribute } from './manual-escape-layer-attribute';

/**
 * `true` when an open `<dialog>` takes Escape, as the browser decides:
 *
 * - A `Dialog` has `closedby="none"` but takes Escape itself, so it marks itself with
 *   `manualEscapeLayerAttribute` while open.
 * - With `closedby` support, `closedBy` is the computed state: `"closerequest"` for a modal dialog
 *   without the attribute, `"none"` for a non-modal one. `closedby="none"` does not take Escape
 *   even when modal: the browser sends the close request past it.
 * - Without `closedby` support (Safari 27), only a modal dialog closes on Escape.
 *
 * A dialog that does not take Escape is part of the layer around it. Counting it would stop that
 * layer from closing.
 */
function isDialogTakingEscape({ element }: { element: HTMLDialogElement }): boolean {
	if (!element.open) {
		return false;
	}
	if (element.hasAttribute(manualEscapeLayerAttribute)) {
		return true;
	}
	if (!('closedBy' in element)) {
		return isModalDialog({ element });
	}
	return element.closedBy !== 'none';
}

/**
 * `true` when `element` is an open layer that takes Escape:
 *
 * - a `<dialog>` that closes on Escape (see `isDialogTakingEscape`);
 * - an `auto` or `hint` popover (the browser closes it). The `popover` property normalizes the
 *   attribute: bare `popover` is `auto`, and case is ignored;
 * - a `manual` popover that `useManualLightDismiss` closes on Escape.
 *
 * A `manual` popover without that hook (for example a field error) does not take Escape.
 */
export function isOpenLayerTakingEscape({ element }: { element: HTMLElement }): boolean {
	if (element instanceof HTMLDialogElement) {
		return isDialogTakingEscape({ element });
	}
	if (!isNativeElementOpen({ element })) {
		return false;
	}
	if (element.popover === 'auto' || element.popover === 'hint') {
		return true;
	}
	return element.hasAttribute(manualEscapeLayerAttribute);
}
