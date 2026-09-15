export function isNativeElementOpen({ element }: { element: HTMLElement }): boolean {
	if (element instanceof HTMLDialogElement) {
		return element.open;
	}

	// Some DOM implementations throw for unsupported pseudo-classes.
	try {
		return element.matches(':popover-open');
	} catch {
		return false;
	}
}
