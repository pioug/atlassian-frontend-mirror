import { isDocumentElement } from './is-document-el';

export function scrollTo(el: HTMLElement | typeof window, top: number): void {
	// with a scroll distance, we perform scroll on the element
	if (isDocumentElement(el)) {
		window.scrollTo(0, top);
		return;
	}

	el.scrollTop = top;
}
