import { useMemo } from 'react';

/**
 * Returns the direction of the element's text.
 *
 * Because any element within the hierarchy can have the [`dir` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir)
 * set, we can't simply check the attribute on one element, the root document element or the current element's parent.
 *
 * Instead, we are using the [CSS `direction` property](https://developer.mozilla.org/en-US/docs/Web/CSS/direction) to determine the
 * current computed direction value.
 */
export const useTextDirection = (element: HTMLElement): 'ltr' | 'rtl' =>
	useMemo(() => {
		const { direction } = window.getComputedStyle(element);

		return direction === 'rtl' ? 'rtl' : 'ltr';
	}, [element]);
