export function getClosestLayer({ element }: { element: HTMLElement }): Element | null {
	return element.closest('[popover], dialog');
}
