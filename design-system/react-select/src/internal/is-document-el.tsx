export function isDocumentElement(el: HTMLElement | typeof window): el is typeof window {
	return [document.documentElement, document.body, window].indexOf(el) > -1;
}
