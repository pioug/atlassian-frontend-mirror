import { canTakeFocus } from '../../focus/can-take-focus';

/**
 * The browser's `[autofocus]` step, for an attribute that the content set after the show. Does
 * nothing if focus moved since the show.
 */
export function runAutofocusStep({
	element,
	focusAfterShow,
}: {
	element: HTMLElement;
	focusAfterShow: Element | null;
}): void {
	const { activeElement } = element.ownerDocument;
	if (activeElement !== focusAfterShow) {
		return;
	}
	const autofocusElement = Array.from(element.querySelectorAll<HTMLElement>('[autofocus]')).find(
		(candidate) => canTakeFocus({ element: candidate }),
	);
	if (autofocusElement && autofocusElement !== activeElement) {
		autofocusElement.focus();
	}
}
