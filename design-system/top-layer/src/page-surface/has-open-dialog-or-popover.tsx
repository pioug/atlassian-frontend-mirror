import { getOpenClosablePopovers } from '../internal/get-open-closable-popovers';

function isModalDialog({ element }: { element: Element }): boolean {
	if (!(element instanceof HTMLDialogElement) || !element.open) {
		return false;
	}
	// Some DOM implementations throw for unsupported pseudo-classes.
	try {
		return element.matches(':modal');
	} catch {
		return false;
	}
}

/**
 * Returns `true` when an open `<dialog>`, or an open `Popover` that has an
 * `onClose`, is inside `within` (the whole document by default). Tooltips and
 * popovers without `onClose` never count. Pass `type: 'modal'` to only count modal dialogs.
 *
 * Top-layer surfaces render inline, so a surface opened from inside an
 * element is a DOM descendant of that element. That makes `within` the
 * replacement for open layer observer namespaces.
 *
 * Call it at event time. A `keydown` listener still sees a popover that the
 * same Escape press is about to close. A `Dialog` can close during the Escape
 * keydown, before a later `window` listener runs. It calls `preventDefault()`
 * first, so to ignore an Escape that an overlay took, also skip
 * `event.defaultPrevented`.
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
		return dialogs.some((element) => isModalDialog({ element }));
	}

	if (dialogs.some((element) => element.open)) {
		return true;
	}

	return getOpenClosablePopovers({ within }).some(
		(element) => element.getAttribute('role') !== 'tooltip',
	);
}
