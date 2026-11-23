import { isNativeElementOpen } from '../is-native-element-open';

/**
 * Hides the open popovers inside `element`, innermost first, as hiding an `auto` popover hides the
 * `auto` popovers inside it. Each inner `Popover` tells its owner through `onClose`
 * (`light-dismiss`). A modal `<dialog>` inside is left alone: it makes the page around it inert.
 */
export function hideOpenPopoversInside({ element }: { element: HTMLElement }): void {
	const openPopovers = Array.from(element.querySelectorAll<HTMLElement>('[popover]')).filter(
		(popover) => isNativeElementOpen({ element: popover }),
	);
	// Document order puts an outer popover before the popovers inside it.
	openPopovers.reverse().forEach((popover) => {
		try {
			popover.hidePopover();
		} catch {}
	});
}
