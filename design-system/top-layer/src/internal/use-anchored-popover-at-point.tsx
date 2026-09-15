/**
 * Positioning and sizing for a popover anchored to a viewport COORDINATE. No
 * positioning logic here: CSS Anchor Positioning needs a real element to carry
 * `anchor-name`, so this hook creates a hidden, zero-size one at the requested
 * point and delegates everything else to `useAnchoredPopover`.
 *
 * See `notes/decisions/anchored-popover-at-point.md` for why this is a sibling
 * hook instead of an anchor union inside `useAnchoredPopover`.
 */
import { useLayoutEffect, useRef } from 'react';

import { type TAnchoredPopoverOptions, useAnchoredPopover } from './use-anchored-popover';

/**
 * A point in viewport coordinates (CSS pixels). Axis-named rather than
 * edge-named, because viewport coordinates are always physical.
 */
export type TAnchorPoint = {
	x: number;
	y: number;
};

/**
 * Appended to `document.body` to escape any transformed ancestor, which would
 * break viewport-relative resolution of `position: fixed`. `Object.assign`
 * rather than `setStyle`: we own the element, so there is nothing to restore.
 */
function mountAnchorElementAtPoint({ point }: { point: TAnchorPoint }): {
	element: HTMLElement;
	cleanup: () => void;
} {
	const element = document.createElement('div');
	element.setAttribute('aria-hidden', 'true');

	Object.assign(element.style, {
		position: 'fixed',
		// Physical insets: `inset-inline-start` would need `viewportWidth - point.x`
		// in RTL.
		top: `${point.y}px`,
		left: `${point.x}px`,
		// Zero size, so placement alone decides which side the popover sits on.
		width: '0',
		height: '0',
		pointerEvents: 'none',
	});

	document.body.appendChild(element);

	return {
		element,
		cleanup: function cleanup() {
			element.remove();
		},
	};
}

/**
 * Positions and sizes a popover at a viewport coordinate. Takes every option
 * `useAnchoredPopover` does except `anchorRef`, with the same meaning. One caveat
 * is specific to a point: it has no size, so `'match-anchor'` and `'min-anchor'`
 * resolve to zero against it.
 *
 * A consumer that anchors to an element sometimes and to a point at other times
 * calls BOTH hooks with complementary `isEnabled` values, since a hook cannot be
 * called conditionally. Nothing enforces that; see `isEnabled` on
 * `useAnchoredPopover` for why two enabled hooks on one popover is a bug.
 *
 * @example Anchor at the cursor, falling back to the trigger element
 * ```tsx
 * const shared = { popoverRef, placement, isOpen };
 *
 * useAnchoredPopover({ ...shared, anchorRef: triggerRef, isEnabled: !mousePos });
 * useAnchoredPopoverAtPoint({
 *   ...shared,
 *   isEnabled: Boolean(mousePos),
 *   // Read through a ref: `getPoint` is latched, see below.
 *   getPoint: () => mousePosRef.current,
 * });
 * ```
 */
export function useAnchoredPopoverAtPoint({
	getPoint,
	isEnabled = true,
	...rest
}: {
	/**
	 * Returns the viewport coordinate to anchor at, or `null` for "no point yet".
	 *
	 * Called once per activation and then latched. It is read through a ref, so an
	 * inline arrow is fine - but for the same reason it must read any value that can
	 * change from a ref rather than closing over it.
	 */
	getPoint: () => TAnchorPoint | null;
	/**
	 * `false` means "do not position": nothing is created and no style is written.
	 * Also the latch key - `false` -> `true` is what re-reads `getPoint`.
	 */
	isEnabled?: boolean;
} & Omit<TAnchoredPopoverOptions, 'anchorRef' | 'isEnabled'>): void {
	const anchorRef = useRef<HTMLElement | null>(null);

	// Latched, keyed on `isEnabled`: consumers read mutable refs inside `getPoint`,
	// so re-reading it would move an already-open popover, and keying on
	// `getPoint`'s identity would re-latch on every parent render.
	const getPointRef = useRef(getPoint);
	getPointRef.current = getPoint;

	// Declared BEFORE `useAnchoredPopover` below, so the element exists when that
	// hook's effect reads the ref (React runs layout effects in source order). This
	// effect must not depend on anything the delegated effect does not: a dependency
	// here alone re-creates the element without that hook writing an `anchor-name`
	// onto it, and positioning silently dies.
	useLayoutEffect(() => {
		if (!isEnabled) {
			return;
		}

		const point = getPointRef.current();
		if (!point) {
			return;
		}

		const { element, cleanup: unmountAnchorElement } = mountAnchorElementAtPoint({ point });
		anchorRef.current = element;

		return function cleanup() {
			unmountAnchorElement();
			anchorRef.current = null;
		};
		// The latch. See `getPointRef` above: `getPoint` is deliberately absent.
	}, [isEnabled]);

	useAnchoredPopover({ ...rest, anchorRef, isEnabled });
}
