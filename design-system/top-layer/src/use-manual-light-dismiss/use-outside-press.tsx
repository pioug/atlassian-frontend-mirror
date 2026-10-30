import { type RefObject, useEffect, useRef } from 'react';

import { bindAll } from 'bind-event-listener';

function isInside({ ref, target }: { ref: RefObject<HTMLElement | null>; target: Node }): boolean {
	return Boolean(ref.current?.contains(target));
}

/**
 * Calls `onOutsidePress` for a pointer press that starts and ends outside `elementRef` and
 * `additionalInsideElementRefs`. It does not use Escape ownership.
 *
 * Not stacked, as native light dismiss: one press closes every open layer it is outside. Escape
 * closes one layer per press. See `notes/decisions/outside-press-closes-every-layer.md`.
 */
export function useOutsidePress({
	elementRef,
	additionalInsideElementRefs,
	isOpen,
	onOutsidePress,
}: {
	elementRef: RefObject<HTMLElement | null>;
	additionalInsideElementRefs?: readonly RefObject<HTMLElement | null>[];
	isOpen: boolean;
	onOutsidePress: () => void;
}): undefined {
	const onOutsidePressRef = useRef(onOutsidePress);
	onOutsidePressRef.current = onOutsidePress;

	// Read at event time, so a new (inline) array does not re-bind the listeners mid-press.
	const additionalInsideElementRefsRef = useRef(additionalInsideElementRefs);
	additionalInsideElementRefsRef.current = additionalInsideElementRefs;

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		function isOutside({ target }: { target: EventTarget | null }): boolean {
			// Without the element, nothing is outside it.
			if (!(target instanceof Node) || !elementRef.current) {
				return false;
			}
			return !(
				isInside({ ref: elementRef, target }) ||
				additionalInsideElementRefsRef.current?.some((ref) => isInside({ ref, target }))
			);
		}

		/**
		 * Whether the current press started outside. The press that opened the popover came before
		 * the listeners were bound, so it cannot dismiss.
		 */
		const press = { isStartedOutside: false };

		return bindAll(
			// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- light dismiss listens on the whole document
			document,
			[
				{
					type: 'pointerdown',
					listener(event: PointerEvent) {
						press.isStartedOutside = isOutside({ target: event.target });
					},
				},
				{
					// As native light dismiss: dismiss when a press that started outside ends outside.
					type: 'pointerup',
					listener(event: PointerEvent) {
						const isStartedOutside = press.isStartedOutside;
						press.isStartedOutside = false;
						if (!isStartedOutside || !isOutside({ target: event.target })) {
							return;
						}
						onOutsidePressRef.current();
					},
				},
				{
					// A touch scroll or a native drag ends the press with no `pointerup`.
					type: 'pointercancel',
					listener() {
						press.isStartedOutside = false;
					},
				},
			],
			// Capture, so `stopPropagation()` on the target does not stop the dismiss.
			{ capture: true },
		);
	}, [isOpen, elementRef]);
}
