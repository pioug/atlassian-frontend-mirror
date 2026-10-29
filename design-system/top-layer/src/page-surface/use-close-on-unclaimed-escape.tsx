import { type RefObject, useEffect, useRef } from 'react';

import { bind } from 'bind-event-listener';

import { combine } from '../internal/combine';
import { claimEscape } from '../internal/escape-ownership/claim-escape';
import { getNearestContainingLayer } from '../internal/escape-ownership/get-nearest-containing-layer';
import { getOpenLayersTakingEscape } from '../internal/escape-ownership/get-open-layers-taking-escape';
import { hasEscapeOwnerAbove } from '../internal/escape-ownership/has-escape-owner-above';
import { isEscapeToHandle } from '../internal/escape-ownership/is-escape-to-handle';
import { pageSurfaceEscapeAttribute } from '../internal/escape-ownership/page-surface-escape-attribute';
import { useStartOpenOrderTracking } from '../internal/escape-ownership/use-start-open-order-tracking';
import { setAttribute } from '../internal/set-attribute';

type TUseCloseOnUnclaimedEscapeOptions = {
	/**
	 * Listens only while `true`. Pass the open state of the surface. A missing value (for example
	 * from an unmocked feature gate in a test) binds nothing.
	 */
	isEnabled: boolean;

	/**
	 * Called when Escape asks the surface to close. Set it to closed in response; the hook hides
	 * nothing itself.
	 */
	onClose: (args: { event: KeyboardEvent }) => void;

	/**
	 * Return `false` to keep the surface open for this Escape (for example while a text field has
	 * focus). Runs after the built-in checks: it can keep the surface open, not make it close.
	 */
	shouldClose?: (args: { event: KeyboardEvent }) => boolean;

	/**
	 * Listen on this element instead of `document`. Escape then closes the surface only while focus
	 * is inside it. The owners that keep it open are the same as without `targetRef`.
	 *
	 * Read when `isEnabled` becomes `true`. If the element is not mounted then, nothing is bound.
	 */
	targetRef?: RefObject<HTMLElement | null>;

	/**
	 * The surface element, when it is not the `targetRef` element. Defaults to `targetRef`.
	 *
	 * A layer around the surface (for example a `Dialog` it is in) is below it, so it does not keep
	 * the surface open: the surface takes the Escape with `preventDefault()`, and the layer stays
	 * open. Without a surface element, every open layer keeps the surface open.
	 */
	surfaceRef?: RefObject<HTMLElement | null>;
};

/**
 * `true` when `surface` is inside an open layer that takes Escape.
 */
function isInsideOpenLayer({ surface }: { surface: HTMLElement }): boolean {
	return (
		getNearestContainingLayer({
			element: surface,
			layers: getOpenLayersTakingEscape({ within: surface.ownerDocument }),
		}) !== null
	);
}

/**
 * `true` when the document has an open layer that takes Escape, or a marked page surface.
 */
function hasAnyEscapeOwner({ ownerDocument }: { ownerDocument: Document }): boolean {
	return (
		getOpenLayersTakingEscape({ within: ownerDocument }).length > 0 ||
		ownerDocument.querySelector(`[${pageSurfaceEscapeAttribute}]`) !== null
	);
}

/**
 * Closes a page surface (for example a side panel) on Escape.
 *
 * Not for `Popover` or `Dialog`: the browser and `Dialog` already close them on Escape.
 *
 * A surface outside the top layer needs its own `keydown` listener, which also hears the Escape
 * that closes an open popover or dialog. So this hook calls `onClose` only for an unclaimed Escape.
 * An Escape is claimed when:
 *
 * - `event.defaultPrevented`: something already handled it.
 * - IME composition is running: the Escape cancels the composition.
 * - `event.repeat`: a held key closes one surface per key press.
 * - An owner is above the surface (see `hasEscapeOwnerAbove`): an open layer that takes Escape (a
 *   dialog that closes on Escape, an `auto` or `hint` popover such as a tooltip, or a `Dialog` or
 *   `manual` popover with `useManualLightDismiss`), or a marked page surface. The surface ranks
 *   just above its nearest containing layer (see `surfaceRef`). Outside every layer it is below
 *   every layer. With no surface element it is the whole page, so every owner is above it. The
 *   browser closes an `auto` or `hint` popover after the `keydown`, so it is still open here.
 * - `shouldClose` returns `false`.
 *
 * Unrelated surfaces outside layers decide independently and can both close. A surface inside an
 * open layer (for example a panel in a `Dialog`) takes the Escape with `preventDefault()`, even
 * when `shouldClose` returns `false` or the key repeats.
 */
export function useCloseOnUnclaimedEscape({
	isEnabled,
	onClose,
	shouldClose,
	targetRef,
	surfaceRef,
}: TUseCloseOnUnclaimedEscapeOptions): undefined {
	// Latest callbacks, so the listener does not re-bind each render.
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;
	const shouldCloseRef = useRef(shouldClose);
	shouldCloseRef.current = shouldClose;
	useStartOpenOrderTracking();

	useEffect(() => {
		if (!isEnabled) {
			return;
		}

		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- page surfaces listen on the document by default
		const target: HTMLElement | Document | null = targetRef ? targetRef.current : document;
		if (!target) {
			return;
		}

		// A manual popover around the surface also listens on `document` and may run first. The mark
		// tells it to leave the Escape to this surface. On an element target this listener runs first
		// anyway.
		const markedSurface = target instanceof HTMLElement ? null : (surfaceRef?.current ?? null);

		return combine(
			markedSurface
				? setAttribute({ element: markedSurface, name: pageSurfaceEscapeAttribute, value: '' })
				: undefined,
			// Target and phase matter. See the listener order in `claim-escape`.
			bind(target, {
				type: 'keydown',
				listener(event: KeyboardEvent) {
					if (!isEscapeToHandle({ event })) {
						return;
					}

					const surface = surfaceRef?.current ?? (target instanceof HTMLElement ? target : null);

					if (surface) {
						if (hasEscapeOwnerAbove({ element: surface })) {
							return;
						}
					} else if (
						hasAnyEscapeOwner({
							ownerDocument: target instanceof Document ? target : target.ownerDocument,
						})
					) {
						// No element: the surface is the whole page, so every owner is inside it, and above it.
						return;
					}

					const isInsideLayer = surface && isInsideOpenLayer({ surface });
					// `shouldClose` sees the event before it is claimed.
					const shouldClose =
						!event.repeat && (!shouldCloseRef.current || shouldCloseRef.current({ event }));
					// Take the Escape even on a veto or repeat, so the layer around the surface stays open.
					if (isInsideLayer) {
						claimEscape({ event });
					}
					if (!shouldClose) {
						return;
					}

					onCloseRef.current({ event });
				},
			}),
		);
	}, [isEnabled, surfaceRef, targetRef]);
}
