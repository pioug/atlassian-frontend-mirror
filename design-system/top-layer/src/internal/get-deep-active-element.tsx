// The focused element, inside shadow roots too.
export function getDeepActiveElement({ root }: { root: Document | ShadowRoot }): Element | null {
	const activeElement = root.activeElement;
	const shadowRoot = activeElement?.shadowRoot;
	if (shadowRoot?.activeElement) {
		return getDeepActiveElement({ root: shadowRoot });
	}
	return activeElement;
}
