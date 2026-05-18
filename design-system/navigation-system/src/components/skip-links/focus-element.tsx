import { bind } from 'bind-event-listener';

/**
 * Used for moving focus to the corresponding slot or custom target after clicking on a skip link.
 */
export function focusElement(element: HTMLElement): void {
	/**
	 * Elements without an explicit `tabindex` attribute are not guaranteed to be focusable:
	 * https://html.spec.whatwg.org/multipage/interaction.html#attr-tabindex
	 *
	 * Our slots are not interactive, so this is required.
	 *
	 * In the future we may want to check if there is an existing `tabindex` attribute,
	 * as custom skip linked elements might already have one.
	 */
	element.setAttribute('tabindex', '-1');

	/**
	 * Cleanup the `tabindex` attribute we set when the slot or custom target loses focus.
	 *
	 * This is preferable to always having `tabindex="-1"` because always applying the tab index can:
	 *
	 * - mess with click events
	 * - potentially cause a focus ring to be always visible
	 */
	bind(element, {
		type: 'blur',
		listener() {
			element.removeAttribute('tabindex');
		},
		options: {
			// Using a one-time listener so it cleans itself up
			once: true,
		},
	});

	/**
	 * Move focus to the slot or custom target.
	 *
	 * Calling `.focus()` will also scroll the element into view:
	 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
	 */
	element.focus({
		// Forces the focus ring to appear after moving focus to the slot
		// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#focusvisible
		// @ts-expect-error - new and not in types yet
		focusVisible: true,
	});
}
