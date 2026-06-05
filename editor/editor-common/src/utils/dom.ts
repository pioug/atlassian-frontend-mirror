type HTMLElementIE9 = Omit<HTMLElement, 'matches'> & {
	matches?: HTMLElement['matches']; // WARNING: 'matches' is optional in IE9
	msMatchesSelector?: (selectors: string) => boolean;
};

export function closest(node: HTMLElement | null | undefined, s: string): HTMLElement | null {
	if (!node) {
		return null;
	}

	let el = node as HTMLElementIE9;
	if (!document.documentElement || !document.documentElement.contains(el)) {
		return null;
	}

	if (el.closest) {
		return el.closest(s);
	}

	do {
		const matchfn = el.matches ? el.matches : el.msMatchesSelector;
		if (matchfn && matchfn.call(el, s)) {
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			return el as HTMLElement;
		}

		el = (el.parentElement || el.parentNode) as HTMLElementIE9;
	} while (el !== null && el.nodeType === 1);
	return null;
}

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/*
 * @deprecated - Use HTMLElement.protoype.closest instead
 */
export function closestElement(
	node: HTMLElement | null | undefined,
	s: string,
): HTMLElement | null {
	return closest(node, s);
}

export type MapCallback<T, S> = (elem: S, idx: number, parent: Element) => T;

// does typescript have function templates yet?

export function mapElem<T>(elem: Element, callback: MapCallback<T, Element>): Array<T> {
	const array: Array<T> = [];

	for (let i = 0; i < elem.childElementCount; i++) {
		array.push(callback(elem.children[i], i, elem));
	}

	return array;
}

export function maphElem<T, U extends HTMLElement>(elem: U, callback: MapCallback<T, U>): Array<T> {
	return mapElem(elem, callback as MapCallback<T, Element>) as Array<T>;
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { walkUpTreeUntil } from './walkUpTreeUntil';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { unwrap } from './unwrap';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { removeNestedEmptyEls } from './removeNestedEmptyEls';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { containsClassName } from './containsClassName';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { parsePx } from './parsePx';
