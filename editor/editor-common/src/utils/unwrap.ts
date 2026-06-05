/**
 * Takes all children out from wrapped el and puts them directly inside
 * the parent el, at the wrapped el's position
 */
export function unwrap(parent: HTMLElement, wrapped: HTMLElement): void {
	const docsFragment = document.createDocumentFragment();
	Array.from(wrapped.children).forEach((child: Node) => {
		docsFragment.appendChild(child);
	});
	parent.replaceChild(docsFragment, wrapped);
}
