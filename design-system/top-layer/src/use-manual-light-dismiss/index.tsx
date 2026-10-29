import { type RefObject, useEffect, useRef } from 'react';

import { bind } from 'bind-event-listener';
import invariant from 'tiny-invariant';

import { combine } from '../internal/combine';
import { claimEscape } from '../internal/escape-ownership/claim-escape';
import { hasEscapeOwnerAbove } from '../internal/escape-ownership/has-escape-owner-above';
import { isEscapeToHandle } from '../internal/escape-ownership/is-escape-to-handle';
import { manualEscapeLayerAttribute } from '../internal/escape-ownership/manual-escape-layer-attribute';
import { openOrderTracker } from '../internal/escape-ownership/open-order-tracker';
import { useStartOpenOrderTracking } from '../internal/escape-ownership/use-start-open-order-tracking';
import { setAttribute } from '../internal/set-attribute';
import { useCloseOnUnclaimedEscape } from '../page-surface/use-close-on-unclaimed-escape';
import { type TPopoverCloseReason } from '../popover/types';
import { useOutsidePress } from './use-outside-press';

export type TUseManualLightDismissOptions = {
	/**
	 * The element to dismiss. A press inside it never dismisses it.
	 *
	 * With `mode: 'popover'` (the default) it must be a `[popover]` element (for example a `Popover`
	 * ref), or the hook throws.
	 */
	popoverRef: RefObject<HTMLElement | null>;

	/**
	 * What `popoverRef` is. It decides how Escape is shared with other layers.
	 *
	 * - `'popover'` (default): a `popover="manual"` element in the top layer. It is in the layer
	 *   stack: a layer inside it, or opened after it, gets Escape first; it takes Escape before the
	 *   layers below it (with `preventDefault()`).
	 * - `'page-surface'`: an element outside the top layer (for example a side panel or a drawer).
	 *   Outside every layer it is below every layer. Inside a layer it takes that layer's position,
	 *   and takes Escape before its ancestors, as `useCloseOnUnclaimedEscape` does.
	 */
	mode?: 'popover' | 'page-surface';

	/**
	 * Elements outside the popover that count as inside (for example the trigger, so it keeps its
	 * own click behaviour). A press in them never dismisses.
	 */
	additionalInsideElementRefs?: readonly RefObject<HTMLElement | null>[];

	/**
	 * The hook listens only while `true`.
	 */
	isOpen: boolean;

	/**
	 * Called on a press outside the popover and `additionalInsideElementRefs`
	 * (`reason: 'light-dismiss'`), or on Escape (`reason: 'escape'`). Set the popover to closed in
	 * response; the hook hides nothing itself.
	 */
	onClose: (args: { reason: TPopoverCloseReason }) => void;
};

/**
 * **Manual light dismiss**
 *
 * Gives a `popover="manual"` element the outside press and Escape dismissal of an auto popover.
 * With `mode: 'page-surface'`, gives the same to an element outside the top layer.
 *
 * **Use it** when a popover must be `manual` (for example a press on its trigger must not close it)
 * but an outside press or Escape must still close it, or for a page surface (for example a drawer)
 * that closes the same way.
 *
 * **Do not use it** instead of the default auto `Popover`, which gets light dismiss and a correct
 * layer stack from the browser, or for a manual popover that must survive an outside press (for
 * example a validation message).
 *
 * - **Outside press:** as native light dismiss, a pointer press that starts and ends outside
 *   `popoverRef` and `additionalInsideElementRefs` dismisses when it ends. `pointerdown` and
 *   `pointerup` are bound in the capture phase, so `stopPropagation()` does not stop it. A drag
 *   across the boundary (for example a text selection), a touch scroll or native drag
 *   (`pointercancel`), and a keyboard or programmatic `click()` do not dismiss. Any button
 *   dismisses, as in Chrome and Firefox. Nothing dismisses while `popoverRef` is not attached.
 * - **Escape, `mode: 'popover'`:** an Escape `keydown` from anywhere on the page. The topmost layer
 *   takes it, as with native close watchers. The hook ignores it when `event.defaultPrevented`,
 *   during IME composition, or when a layer that takes Escape is above the popover:
 *   - an open layer inside the popover;
 *   - an open layer that opened after the popover, even inside an older layer (for example a
 *     tooltip on hover, a `Dialog` from a keyboard shortcut, or another popover with this hook);
 *   - an open page surface inside the popover, or inside a layer that opened after it. A page
 *     surface ranks just above its nearest containing layer.
 *
 *   A layer above that stays open still takes the press, so this popover stays open too. See
 *   `internal/escape-ownership`. Otherwise the hook calls `preventDefault()`, so one press closes
 *   one layer: no ancestor `Dialog` or auto popover also closes. A held key asks once.
 * - **Escape, `mode: 'page-surface'`:** as `useCloseOnUnclaimedEscape`. The surface closes only
 *   while no owner is above it. Inside a layer it takes that layer's position.
 *
 * **Outside presses are not stacked:** one press dismisses every element with this hook that it is
 * outside, as native light dismiss closes every auto popover it is outside. Only Escape goes one
 * layer per press. See `notes/decisions/outside-press-closes-every-layer.md`.
 */
export function useManualLightDismiss({
	popoverRef,
	mode = 'popover',
	additionalInsideElementRefs,
	isOpen,
	onClose,
}: TUseManualLightDismissOptions): undefined {
	// Latest callback, so the listeners do not re-bind each render.
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;
	const isPopover = mode === 'popover';

	useStartOpenOrderTracking();

	useOutsidePress({
		elementRef: popoverRef,
		additionalInsideElementRefs,
		isOpen,
		onOutsidePress: () => onCloseRef.current({ reason: 'light-dismiss' }),
	});

	// Page surface: Escape closes it only while no owner is above it.
	useCloseOnUnclaimedEscape({
		isEnabled: isOpen && !isPopover,
		onClose: () => onCloseRef.current({ reason: 'escape' }),
		surfaceRef: popoverRef,
	});

	// A passive effect, not a layout effect, so SSR in a DOM test environment does not warn. Until it
	// runs, the popover is not marked or listening.
	useEffect(() => {
		if (!isOpen || !isPopover) {
			return;
		}

		const popover = popoverRef.current;
		// Other layers find layers by `[popover]`, and the open order comes from `beforetoggle`. A plain
		// element has neither.
		invariant(
			!popover || popover.hasAttribute('popover'),
			"useManualLightDismiss: `popoverRef` must be a `[popover]` element. Use `mode: 'page-surface'` for an element that is not in the top layer.",
		);
		// The open order lives outside the hook, so an effect re-run keeps it. A popover that opened
		// before tracking started is ordered from now.
		if (popover) {
			openOrderTracker.ensureOpenOrder({ element: popover });
		}

		return combine(
			// Mark it as a layer that takes Escape, for other layers' checks.
			popover
				? setAttribute({ element: popover, name: manualEscapeLayerAttribute, value: '' })
				: undefined,
			// Target and phase matter. See the listener order in `claim-escape`.
			// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- Escape reaches the popover from anywhere on the page
			bind(document, {
				type: 'keydown',
				listener(event: KeyboardEvent) {
					if (!isEscapeToHandle({ event })) {
						return;
					}
					const element = popoverRef.current;
					// Not attached: no place in the stack. Nothing dismisses, and the Escape goes on to the
					// next layer.
					if (!element) {
						return;
					}
					if (hasEscapeOwnerAbove({ element, isLayer: true })) {
						return;
					}
					// Take the Escape even if `onClose` keeps the popover open, as a native close watcher
					// does: an ancestor `Dialog` sees `defaultPrevented`, and the browser sends no close
					// request to an ancestor auto popover.
					if (!claimEscape({ event })) {
						return;
					}
					onCloseRef.current({ reason: 'escape' });
				},
			}),
		);
	}, [isOpen, isPopover, popoverRef]);
}
