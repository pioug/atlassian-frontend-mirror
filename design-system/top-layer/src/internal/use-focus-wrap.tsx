import { type RefObject, useEffect } from 'react';

import { bind } from 'bind-event-listener';

import { getFirstFocusable } from '../focus/get-first-focusable';
import { getLastFocusable } from '../focus/get-last-focusable';
import { getNextFocusable } from '../focus/get-next-focusable';
import { isFocusOwningLayer } from '../focus/is-focus-owning-layer';
import { isNestedLayerFocused } from '../focus/is-nested-layer-focused';
import { roleRequiresFocusWrap } from '../focus/role-requires-focus-wrap';
import { type TLayerRole } from './role-types';
import { type TPhase } from './use-animated-visibility';

/**
 * Wraps Tab and Shift+Tab focus inside the element when its role requires it
 * (`dialog`, `alertdialog`): A → B → C → A, with no stop on `<body>`.
 *
 * Nested layers follow the role rule (see `getFocusables`). The hook steps aside
 * while focus is in a nested layer that wraps its own Tab.
 *
 * The listener runs in the capture phase, so a Tab listener inside the element
 * sees the new `document.activeElement`. Use `event.target` there.
 *
 * Always call this hook unconditionally. See `notes/decisions/role-and-focus.md`.
 */
export function useFocusWrap({
	elementRef,
	role,
	phase,
}: {
	elementRef: RefObject<HTMLElement | null>;
	role: TLayerRole | undefined;
	/**
	 * Current visibility phase. The Tab listener is attached in every phase
	 * except `'closed'`, so it stays attached during the exit animation.
	 */
	phase: TPhase;
}): void {
	const isVisible = phase !== 'closed';
	useEffect(() => {
		const element = elementRef.current;
		if (!element || !roleRequiresFocusWrap({ role }) || !isVisible) {
			return;
		}

		const unbind = bind(element, {
			type: 'keydown',
			listener: (event: KeyboardEvent) => {
				if (event.key !== 'Tab') {
					return;
				}

				// A nested dialog wraps its own Tab.
				if (
					isNestedLayerFocused({
						container: element,
						layerFilter: (layer) => isFocusOwningLayer({ layer }),
					})
				) {
					return;
				}

				// Stop the browser focus move. This hook moves focus itself.
				event.preventDefault();

				const direction = event.shiftKey ? 'backwards' : 'forwards';

				const nextFocusable = getNextFocusable({ container: element, direction });
				if (nextFocusable) {
					nextFocusable.focus();
					return;
				}

				// Focus is not inside the element, or the element has no focusable
				// elements. Move focus to the first or last focusable element, based
				// on the direction.
				const fallback =
					direction === 'forwards'
						? getFirstFocusable({ container: element })
						: getLastFocusable({ container: element });

				fallback?.focus();
			},
			options: { capture: true },
		});

		return unbind;
	}, [elementRef, role, isVisible]);
}
