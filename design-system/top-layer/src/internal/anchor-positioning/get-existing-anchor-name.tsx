/**
 * The `anchor-name` an element already carries, or `null`. Reads the computed
 * value as well as the inline one, so a name set from a STYLESHEET is found: a
 * new inline name would otherwise override it for every other rule anchored
 * to that element. `anchor-name` is a list and `position-anchor` takes one ident,
 * so the first name is the one to anchor to.
 */
export function getExistingAnchorName({ element }: { element: HTMLElement }): string | null {
	const anchorNames =
		element.style.getPropertyValue('anchor-name') ||
		getComputedStyle(element).getPropertyValue('anchor-name');
	const firstAnchorName = anchorNames.split(',')[0].trim();
	return firstAnchorName !== '' && firstAnchorName !== 'none' ? firstAnchorName : null;
}
