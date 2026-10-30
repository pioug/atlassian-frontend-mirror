/**
 * Returns the closest `[popover]` or `<dialog>` element, starting at `element`
 * itself. Returns `null` when the element is not in a layer.
 */
export function getClosestLayer({ element }: { element: HTMLElement }): Element | null {
	return element.closest('[popover], dialog');
}
