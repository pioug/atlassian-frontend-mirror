/**
 * Walks up DOM removing elements if they are empty until it finds
 * one that is not
 */
export function removeNestedEmptyEls(el: HTMLElement): void {
	while (el.parentElement && el.childElementCount === 0 && el.textContent === '') {
		const parentEl = el.parentElement;
		parentEl.removeChild(el);
		el = parentEl;
	}
}
