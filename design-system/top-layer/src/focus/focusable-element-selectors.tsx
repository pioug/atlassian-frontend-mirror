/**
 * Elements that the browser can focus (focusable areas), when they are enabled, rendered and not
 * inert. `getFocusables` narrows these to the Tab order; `canTakeFocus` uses them as they are.
 */
export const focusableElementSelectors: readonly string[] = [
	'a[href]',
	'area[href]',
	'input:not([type="hidden"])',
	'select',
	'textarea',
	'button',
	'iframe',
	'audio[controls]',
	'video[controls]',
	'[contenteditable]:not([contenteditable="false"])',
	'[tabindex]',
];
