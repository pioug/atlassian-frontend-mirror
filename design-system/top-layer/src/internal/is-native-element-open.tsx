/**
 * `true` when `element` is open in the DOM: an open `<dialog>`, or a popover that matches
 * `:popover-open`. This is the browser state, not the `isOpen` prop.
 */
export function isNativeElementOpen({ element }: { element: HTMLElement }): boolean {
	if (element instanceof HTMLDialogElement) {
		return element.open;
	}

	// Some DOM implementations throw on `:popover-open`.
	try {
		return element.matches(':popover-open');
	} catch {
		return false;
	}
}
