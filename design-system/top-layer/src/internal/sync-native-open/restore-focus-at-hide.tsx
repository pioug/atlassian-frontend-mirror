import { canTakeFocus } from '../../focus/can-take-focus';

/**
 * Puts focus back where it was when the layer hid, for a re-show (StrictMode, a Suspense or Activity
 * reveal): React does not run the content's `autoFocus` again. Does nothing if focus moved since the
 * show.
 */
export function restoreFocusAtHide({
	element,
	focusAfterShow,
	focusAtHide,
}: {
	element: HTMLElement;
	focusAfterShow: Element | null;
	focusAtHide: HTMLElement;
}): { focusRestored: boolean } {
	if (
		element.ownerDocument.activeElement !== focusAfterShow ||
		!element.contains(focusAtHide) ||
		!canTakeFocus({ element: focusAtHide })
	) {
		return { focusRestored: false };
	}
	focusAtHide.focus();
	return { focusRestored: true };
}
