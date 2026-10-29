/**
 * `true` for an open modal `<dialog>`.
 */
export function isModalDialog({ element }: { element: HTMLDialogElement }): boolean {
	if (!element.open) {
		return false;
	}
	// Some DOM implementations throw on `:modal`.
	try {
		return element.matches(':modal');
	} catch {
		return false;
	}
}
