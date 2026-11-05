import { type RefObject, useEffect } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

/**
 * Moves keyboard and screen reader focus to the given element (the Close button) when the help
 * panel opens, instead of leaving it on a large generic container.
 *
 * - The move is deferred by one task so it runs after any embedding application has finished
 *   focusing its own wrapper element when the panel opens.
 * - Focus is only moved while it is unclaimed: on `<body>`, or on an ancestor wrapper of the
 *   element. If the user (or the host) has already focused something else, focus is left alone.
 *
 * Behind the `jfp_a11y_fix_help_panel_initial_focus` feature gate.
 *
 * @param elementRef - Ref to the element that should receive focus when the panel opens
 *
 * @example
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useFocusOnOpen(buttonRef);
 * return <Button ref={buttonRef} />;
 */
export function useFocusOnOpen(elementRef: RefObject<HTMLElement | null>): void {
	useEffect(() => {
		if (!fg('jfp_a11y_fix_help_panel_initial_focus')) {
			return;
		}

		const timeoutId = setTimeout(() => {
			const element = elementRef.current;
			if (!element) {
				return;
			}

			const { activeElement, body } = element.ownerDocument;
			const isFocusUnclaimed =
				!activeElement || activeElement === body || activeElement.contains(element);

			// preventScroll: the panel is fixed to the side, so focusing must not scroll the page
			if (isFocusUnclaimed) {
				element.focus({ preventScroll: true });
			}
		}, 0);

		return () => clearTimeout(timeoutId);
	}, [elementRef]);
}
