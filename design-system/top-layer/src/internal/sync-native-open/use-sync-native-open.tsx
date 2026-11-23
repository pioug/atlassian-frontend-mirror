import React, { type ReactNode, type RefObject, useCallback, useRef } from 'react';

import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';

import { isNativeElementOpen } from '../is-native-element-open';
import { layerShowOrder } from '../layer-show';
import { pendingFocusReturns } from '../manual-hide/pending-focus-returns';
import { getFocusInside } from './get-focus-inside';
import { restoreFocusAtHide } from './restore-focus-at-hide';
import { runAutofocusStep } from './run-autofocus-step';

// One show of the layer: from the show request until the layer hides.
type TShow = {
	element: HTMLElement;
	cancel: () => void;
	// The focused element just after `show()`. `null` until the layer has shown.
	focusAtShow: { after: Element | null } | null;
	// `true` once the content effects have run.
	haveContentEffectsRun: boolean;
};

// How the layer last hid: a close (`isOpen` turned `false`), or a hide that React shows again
// without a new `isOpen` (StrictMode, a Suspense or Activity hide).
type TLastHide = { type: 'close' } | { type: 'reshow'; focusInside: HTMLElement | null };

/**
 * Shows the layer in its `useLayoutEffect`, and renders nothing. The host renders it before
 * `children`, so its `useLayoutEffect` runs before any `useLayoutEffect` or `autoFocus` in its
 * later siblings (`children`), no matter how deep they are (see `useSyncNativeOpen`).
 */
function FirstSibling({
	isOpen,
	showLayer,
}: {
	isOpen: boolean;
	showLayer: () => void;
}): ReactNode {
	useLayoutEffect(() => {
		if (isOpen) {
			showLayer();
		}
	}, [isOpen, showLayer]);
	return null;
}

type TUseSyncNativeOpenArgs = {
	elementRef: RefObject<HTMLElement | null>;
	// The `id` of the host element. It must be unique in the document.
	hostId: string;
	isOpen: boolean;
	isMounted: boolean;
	// The functions must be stable.
	bindListeners: (args: { element: HTMLElement }) => () => void;
	show: (args: { element: HTMLElement }) => void;
	hide: (args: { element: HTMLElement }) => void;
	// Runs once the layer has shown and the content effects have run.
	onInitialFocusNeeded?: () => void;
};

type TUseSyncNativeOpenResult = {
	// Render in the host, before `children`. Its layout effect shows the layer.
	firstSibling: ReactNode;
};

/**
 * Keeps the native open state of a layer in sync with `isOpen`: `show` calls `showPopover()` or
 * `showModal()`, and `hide` calls `hidePopover()` or `close()`.
 *
 * **Why the layer shows in `FirstSibling`**
 *
 * We call `.showPopover()` and `.showModal()` early, in a layout effect in `FirstSibling`, so that
 * we play nicely with the timing of React's built-in `autoFocus` behaviour:
 *
 * - React runs its `autoFocus` logic in the same tree walk as `useLayoutEffect`. React runs the
 *   `autoFocus` logic of an element _before_ the `useLayoutEffect` of the component that renders
 *   it.
 * - The `useLayoutEffect` in `FirstSibling` always runs before the effects of its later siblings
 *   (`children`), no matter how deep they are. This is React's commit order.
 * - So the layer shows before React runs its own `autoFocus` code on `children`, and the React
 *   `autoFocus` prop on JSX in `children` works. So does a `focus()` call in a ref callback, a
 *   layout effect or `componentDidMount`.
 *
 * **Timing, when the layer mounts open** (one commit, before paint):
 *
 * ```tsx
 * <div popover>              // 5. host layout effect: initial focus
 *   <FirstSibling />         // 1. showPopover()
 *   <Card>                   // 4. Card's layout effects
 *     <Body>                 // 3. Body's layout effects
 *       <input autoFocus />  // 2. focus() works: the layer is visible
 *     </Body>
 *   </Card>
 * </div>
 * ```
 *
 * **Content effects** (in the comments below): `autoFocus`, ref callbacks, `useLayoutEffect` and
 * `componentDidMount` in `children`. They all run between steps 1 and 5. `useEffect` runs later,
 * after paint.
 *
 * In step 5 the host finishes the show: the `[autofocus]` step, initial focus (unless focus is
 * already inside), then the nested layers that wait for this one.
 *
 * Exceptions, where the layer shows after the content effects:
 *
 * - A nested layer that opens in the same commit as its parent layer. It waits, and shows when the
 *   parent finishes its show (`../layer-show.tsx`).
 * - A host that `FirstSibling` cannot find by its `id` (for example in a shadow root, which we do
 *   not support). The layer shows in step 5.
 *
 * See `notes/decisions/react-autofocus-and-focus-on-open.md`.
 */
export function useSyncNativeOpen({
	elementRef,
	hostId,
	isOpen,
	isMounted,
	bindListeners,
	show,
	hide,
	onInitialFocusNeeded,
}: TUseSyncNativeOpenArgs): TUseSyncNativeOpenResult {
	const listenersRef = useRef<{ element: HTMLElement; unbind: () => void } | null>(null);
	const currentShowRef = useRef<TShow | null>(null);
	const lastHideRef = useRef<TLastHide | null>(null);

	// `beforetoggle` fires during `show()`, so the listeners must be bound before it.
	const bindListenersOnce = useCallback(
		({ element }: { element: HTMLElement }): void => {
			if (listenersRef.current?.element === element) {
				return;
			}
			listenersRef.current?.unbind();
			listenersRef.current = { element, unbind: bindListeners({ element }) };
		},
		[bindListeners],
	);

	// Runs once the layer has shown and the content effects have run.
	const finishShow = useCallback(
		({ currentShow }: { currentShow: TShow }): void => {
			const { element, focusAtShow } = currentShow;
			const lastHide = lastHideRef.current;
			lastHideRef.current = null;
			const focusAfterShow = focusAtShow?.after ?? null;

			// A re-show: React does not run `autoFocus` again, so put focus back where it was.
			const { focusRestored } =
				lastHide?.type === 'reshow' && lastHide.focusInside
					? restoreFocusAtHide({ element, focusAfterShow, focusAtHide: lastHide.focusInside })
					: { focusRestored: false };
			// An `[autofocus]` attribute that a content effect set after the show.
			if (!focusRestored) {
				runAutofocusStep({ element, focusAfterShow });
			}
			// The layer's own initial focus. It does nothing when focus is already inside.
			onInitialFocusNeeded?.();
			layerShowOrder.markShowFinished({ element });
		},
		[onInitialFocusNeeded],
	);

	const startShow = useCallback(
		({ element }: { element: HTMLElement }): TShow => {
			const currentShow: TShow = {
				element,
				cancel: () => {},
				focusAtShow: null,
				haveContentEffectsRun: false,
			};
			// Shows at once, or later if the layer waits for its parent layer to finish its show.
			currentShow.cancel = layerShowOrder.queueOrShow({
				element,
				show() {
					/**
					 * A layer that shows again before the focus return of its last hide ran (a reopen during
					 * the exit animation, or a StrictMode re-show) keeps focus where it is. The returns of
					 * the other layers that hid run now, so this layer records the element that they move
					 * focus to as the element to return focus to (for example a modal dialog that a menu
					 * item opens as the menu closes).
					 */
					pendingFocusReturns.cancel({ element });
					pendingFocusReturns.runAll();
					show({ element });
					currentShow.focusAtShow = { after: element.ownerDocument.activeElement };
					// A layer that waited shows after its content effects ran, so it finishes at once.
					if (currentShow.haveContentEffectsRun) {
						finishShow({ currentShow });
					}
				},
			});
			return currentShow;
		},
		[finishShow, show],
	);

	// Step 1: called by `FirstSibling`, before the content effects.
	const showFromFirstSibling = useCallback((): void => {
		if (currentShowRef.current) {
			return;
		}
		// React attaches the host ref after the content effects, so find the host by its `id`. The
		// global `document` is safe in a layout effect.
		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- tests often stub `getDocument()` with a partial document
		const element = document.getElementById(hostId);
		if (!element || isNativeElementOpen({ element })) {
			return;
		}
		bindListenersOnce({ element });
		currentShowRef.current = startShow({ element });
	}, [bindListenersOnce, hostId, startShow]);

	useLayoutEffect(() => {
		const element = elementRef.current;
		if (!isMounted || !element) {
			return;
		}
		bindListenersOnce({ element });
		return () => {
			listenersRef.current?.unbind();
			listenersRef.current = null;
		};
	}, [bindListenersOnce, elementRef, isMounted]);

	// Step 5: the host's own layout effect, after the content effects.
	useLayoutEffect(() => {
		const element = elementRef.current;
		if (!element) {
			return;
		}

		if (!isOpen) {
			lastHideRef.current = { type: 'close' };
			hide({ element });
			return;
		}

		// No show yet when step 1 could not find the host: show now, after the content effects.
		const currentShow = currentShowRef.current ?? startShow({ element });
		currentShowRef.current = currentShow;
		currentShow.haveContentEffectsRun = true;
		// A layer that waits for its parent finishes when it shows.
		if (currentShow.focusAtShow) {
			finishShow({ currentShow });
		}

		return () => {
			lastHideRef.current = { type: 'reshow', focusInside: getFocusInside({ element }) };
			currentShow.cancel();
			currentShowRef.current = null;
			hide({ element });
		};
	}, [elementRef, finishShow, hide, isOpen, startShow]);

	return {
		firstSibling: <FirstSibling isOpen={isOpen} showLayer={showFromFirstSibling} />,
	};
}
