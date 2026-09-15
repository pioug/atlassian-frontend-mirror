/**
 * The `anchor-name` an element already carries, or `null`. Computed as well as
 * inline, so a name set from a STYLESHEET is found: a minted inline name would
 * otherwise override it for every other rule anchored to that element.
 * `anchor-name` is a list and `position-anchor` takes one ident, so the first
 * name is the one to anchor to.
 */
export function getExistingAnchorName(element: HTMLElement): string | null {
	const declared =
		element.style.getPropertyValue('anchor-name') ||
		getComputedStyle(element).getPropertyValue('anchor-name');
	const first = declared.split(',')[0].trim();
	return first !== '' && first !== 'none' ? first : null;
}
