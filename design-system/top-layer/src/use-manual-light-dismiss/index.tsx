import { type RefObject, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

import { bind, bindAll } from 'bind-event-listener';
import invariant from 'tiny-invariant';

import { combine } from '../internal/combine';
import { claimEscape } from '../internal/escape-ownership/claim-escape';
import { hasEscapeOwnerAbove } from '../internal/escape-ownership/has-escape-owner-above';
import { isEscapeToHandle } from '../internal/escape-ownership/is-escape-to-handle';
import { manualEscapeLayerAttribute } from '../internal/escape-ownership/manual-escape-layer-attribute';
import { openOrderTracker } from '../internal/escape-ownership/open-order-tracker';
import { useStartOpenOrderTracking } from '../internal/escape-ownership/use-start-open-order-tracking';
import { lightDismissRequests } from '../internal/manual-hide/light-dismiss-requests';
import { setAttribute } from '../internal/set-attribute';
import { useCloseOnUnclaimedEscape } from '../page-surface/use-close-on-unclaimed-escape';
import { type TPopoverCloseReason } from '../popover/types';

/**
 * The current pointer press, from `pointerdown` until the hook decides whether it dismisses.
 */
type TPress =
	// No press that can still dismiss (none, it started or ended inside, or it already asked).
	| { type: 'idle' }
	// The press started outside the popover and its inside elements.
	| { type: 'started-outside' }
	// A touch or pen press ended outside. The hook asks after its `click`.
	| { type: 'waiting-for-click' };

/**
 * An ask for a press that dismisses. It runs once.
 */
type TPendingAsk = {
	// The `click` of the press reached the window: ask in a microtask, so updates from the click
	// handlers commit first.
	askAfterClick: () => void;
	// The ask is no longer needed (the popover closed, or the hook stopped listening).
	cancel: () => void;
};

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

function isInside({ ref, target }: { ref: RefObject<HTMLElement | null>; target: Node }): boolean {
	return Boolean(ref.current?.contains(target));
}

/**
 * Whether the browser sends the `click` of a press in the same task as its `pointerup`. It does for
 * a mouse. For touch and pen, the `click` of a tap can come in a later task.
 */
function isClickInSameTask({ pointerType }: { pointerType: string | null }): boolean {
	return pointerType !== 'touch' && pointerType !== 'pen';
}

/**
 * Asks in a task, or sooner from `askAfterClick`.
 */
function scheduleAsk({ ask }: { ask: () => void }): TPendingAsk {
	const controller = new AbortController();
	function askOnce(): void {
		if (controller.signal.aborted) {
			return;
		}
		controller.abort();
		ask();
	}
	// When no `click` reaches the window (a handler stopped it, or another button).
	const timeoutId = setTimeout(askOnce, 0);
	bind(controller.signal, { type: 'abort', listener: () => clearTimeout(timeoutId) });
	return {
		askAfterClick() {
			queueMicrotask(askOnce);
		},
		cancel() {
			controller.abort();
		},
	};
}

/**
 * **Manual light dismiss**
 *
 * Gives a `popover="manual"` element the outside press and Escape dismissal of an auto popover.
 * With `mode: 'page-surface'`, gives the same to an element outside the top layer.
 *
 * **Use it** when a popover must be `manual` (for example a press on its trigger must not close it)
 * but an outside press or Escape must still close it, when its owner must be able to refuse the
 * close (a controlled `isOpen` with `onClose`, as in `@atlaskit/popup` and
 * `@atlaskit/dropdown-menu`: the hook only asks, and the popover hides when `isOpen` becomes
 * `false`), or for a page surface (for example a drawer) that closes the same way. See
 * `notes/decisions/wrappers-ask-first-close.md`.
 *
 * **Do not use it** instead of an auto `Popover` whose close nothing can refuse (the browser gives
 * it light dismiss and a correct layer stack), or for a manual popover that must survive an outside
 * press (for example a validation message).
 *
 * - **Outside press:** as native light dismiss, a pointer press that starts and ends outside
 *   `popoverRef` and `additionalInsideElementRefs` dismisses. `pointerdown` and `pointerup` are
 *   bound in the capture phase, so `stopPropagation()` does not stop it. A drag across the boundary
 *   (for example a text selection), a touch scroll or native drag (`pointercancel`), and a keyboard
 *   or programmatic `click()` do not dismiss. Any button dismisses, as in Chrome and Firefox.
 *   Nothing dismisses while `popoverRef` is not attached.
 *
 *   `onClose` runs after the press's `click` reaches the window, as the legacy layers closed, or in
 *   a task after the press when no `click` gets there (a handler stopped it, or another button).
 *   Touch and pen wait for the `click`, which can come in a later task. It runs in `flushSync`. So
 *   every `click` handler of the press runs while the popover is still open, and an owner that
 *   removes elements on close (a blanket) cannot make the `click` land on the element under them.
 *   A tap with no `click` does not ask. It does not ask when the popover closed in the meantime.
 *   With `mode: 'popover'`, `Popover` returns no focus for the close, as with native light
 *   dismiss.
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

	// Read at event time, so a new (inline) array does not re-bind the listeners mid-press.
	const additionalInsideElementRefsRef = useRef(additionalInsideElementRefs);
	additionalInsideElementRefsRef.current = additionalInsideElementRefs;

	// Outside press: decided at `pointerup`, asked after its `click` (see the JSDoc above).
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		function isOutside({ target }: { target: EventTarget | null }): boolean {
			// Without the element, nothing is outside it.
			if (!(target instanceof Node) || !popoverRef.current) {
				return false;
			}
			const isInsidePopover = isInside({ ref: popoverRef, target });
			const isInsideAdditionalElement = Boolean(
				additionalInsideElementRefsRef.current?.some((ref) => isInside({ ref, target })),
			);
			return !isInsidePopover && !isInsideAdditionalElement;
		}

		// The press that opened the popover came before the listeners were bound, so it cannot dismiss.
		let press: TPress = { type: 'idle' };
		let pendingAsk: TPendingAsk | null = null;

		function ask(): void {
			pendingAsk = null;
			const popover = popoverRef.current;
			// The owner's answer commits now, as `Dialog` asks in `flushSync`. Marked meanwhile, so
			// `Popover` returns no focus for the close.
			if (popover) {
				lightDismissRequests.add(popover);
			}
			try {
				flushSync(() => {
					onCloseRef.current({ reason: 'light-dismiss' });
				});
			} finally {
				if (popover) {
					lightDismissRequests.delete(popover);
				}
			}
		}

		function askForPress(): void {
			// A second press came before the ask of the first one ran: one ask closes it.
			if (pendingAsk) {
				return;
			}
			pendingAsk = scheduleAsk({ ask });
		}

		/**
		 * - `pointerdown`, `pointerup`: decide if the press dismisses, as native light dismiss.
		 * - `click`: a touch or pen press dismisses at its `click`, which can come in a later task.
		 * - `pointercancel`: a touch scroll or a native drag ends the press with no `pointerup`.
		 * - `click` on the window (bubble phase): every `click` handler of the press has run, so ask
		 *   now, as the legacy layers closed.
		 */
		const unbind = bindAll(
			// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- light dismiss listens on the whole document
			document,
			[
				{
					type: 'pointerdown',
					listener(event: PointerEvent) {
						// A tap that made no `click` does not ask, as the legacy layers, which closed from
						// `click`. This press decides.
						press = isOutside({ target: event.target })
							? { type: 'started-outside' }
							: { type: 'idle' };
					},
				},
				{
					type: 'pointerup',
					listener(event: PointerEvent) {
						if (press.type !== 'started-outside') {
							return;
						}
						if (!isOutside({ target: event.target })) {
							press = { type: 'idle' };
							return;
						}
						if (isClickInSameTask({ pointerType: event.pointerType ?? null })) {
							press = { type: 'idle' };
							askForPress();
							return;
						}
						press = { type: 'waiting-for-click' };
					},
				},
				{
					type: 'click',
					listener() {
						if (press.type !== 'waiting-for-click') {
							return;
						}
						press = { type: 'idle' };
						askForPress();
					},
				},
				{
					type: 'pointercancel',
					listener() {
						if (press.type === 'started-outside') {
							press = { type: 'idle' };
						}
					},
				},
			],
			// Capture, so `stopPropagation()` on the target does not stop the dismiss.
			{ capture: true },
		);
		const unbindWindowClick = bind(window, {
			type: 'click',
			listener: () => pendingAsk?.askAfterClick(),
		});
		return () => {
			unbind();
			unbindWindowClick();
			// The popover closed before the ask (for example the press's own `click` closed it, as
			// the trigger of another menu with one "open" state for both), or the hook stopped
			// listening: nothing to ask. React runs this cleanup at once after a commit from a `click`.
			pendingAsk?.cancel();
		};
	}, [isOpen, popoverRef]);

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
					// request to an ancestor auto popover. A held-key repeat is taken but does not call
					// `onClose`.
					if (!claimEscape({ event })) {
						return;
					}
					onCloseRef.current({ reason: 'escape' });
				},
			}),
		);
	}, [isOpen, isPopover, popoverRef]);
}
