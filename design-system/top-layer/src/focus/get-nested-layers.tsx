/**
 * The layers (`[popover]` or `<dialog>`) inside `container`, at any depth.
 */
export function getNestedLayers({ container }: { container: Element }): Element[] {
	return Array.from(container.querySelectorAll('[popover], dialog'));
}
