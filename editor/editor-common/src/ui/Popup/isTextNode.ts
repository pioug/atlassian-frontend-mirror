export function isTextNode(elem: HTMLElement | Element): boolean {
	return elem && elem.nodeType === 3;
}
