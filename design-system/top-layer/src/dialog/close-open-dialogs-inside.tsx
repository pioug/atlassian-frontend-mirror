/**
 * Closes the open `<dialog>`s inside `element`, innermost first. An open modal inside a closed dialog
 * is not visible, but it still makes the rest of the page inert.
 *
 * Native closes only: an inner `Dialog` does not open again inside a closed layer, and its owner gets
 * no `onClose` (the close is not a request). Its `beforetoggle` and `toggle` listeners run its exit
 * as for any native close.
 *
 * Does not look inside shadow roots: a layer in a shadow root is not supported (see
 * `useSyncNativeOpen`).
 */
export function closeOpenDialogsInside({ element }: { element: HTMLElement }): void {
	const openDialogs = Array.from(element.querySelectorAll('dialog')).filter(
		(dialog) => dialog.open,
	);
	// Document order puts an outer dialog before the dialogs inside it.
	openDialogs.reverse().forEach((dialog) => {
		dialog.close();
	});
}
