export function focusEditorElement(editorId: string): void {
	const parentElement = document.querySelector(`[data-focus-id="${editorId}"]`);

	if (!(parentElement instanceof HTMLElement)) {
		return;
	}

	parentElement.focus({
		preventScroll: true,
	});
}
