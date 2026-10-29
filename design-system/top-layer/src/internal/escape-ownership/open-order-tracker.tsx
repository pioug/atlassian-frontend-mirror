import { bind } from 'bind-event-listener';

type TOpenOrderTracker = {
	/**
	 * Binds the listener. Only `useStartOpenOrderTracking` calls it. Later calls do nothing.
	 */
	start: () => undefined;
	/**
	 * The open order of `element`: higher opened later. `null` if it has not opened since tracking
	 * started.
	 */
	getOpenOrder: (args: { element: Element }) => number | null;
	/**
	 * Gives `element` an open order now, if it has none: for a layer that opened before tracking
	 * started.
	 */
	ensureOpenOrder: (args: { element: Element }) => undefined;
};

function createOpenOrderTracker(): TOpenOrderTracker {
	// A `WeakMap`, so a removed element is not kept alive.
	const openOrders = new WeakMap<Element, number>();
	let lastOpenOrder = 0;
	let isTracking = false;

	function record({ element }: { element: Element }): undefined {
		lastOpenOrder += 1;
		openOrders.set(element, lastOpenOrder);
	}

	return {
		start() {
			if (isTracking) {
				return;
			}
			isTracking = true;
			// Never unbound: it must see every open for the life of the page.
			// `beforetoggle`, not `toggle`: `beforetoggle` fires synchronously on open. `toggle` is
			// task-queued, and in Chrome it can arrive after an Escape that follows the open.
			// Capture, so an inner `stopPropagation()` cannot hide an open.
			// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- open order is tracked for the whole document
			bind(document, {
				type: 'beforetoggle',
				listener(event: ToggleEvent) {
					if (event.newState !== 'open' || !(event.target instanceof Element)) {
						return;
					}
					// An element that opens again gets a new, higher order.
					record({ element: event.target });
				},
				options: { capture: true },
			});
		},
		getOpenOrder({ element }) {
			return openOrders.get(element) ?? null;
		},
		ensureOpenOrder({ element }) {
			if (openOrders.has(element)) {
				return;
			}
			record({ element });
		},
	};
}

/**
 * **Open order**
 *
 * The layer that opened last takes Escape first, as with native close watchers. The browser does
 * not tell us the top-layer order, so we record it: one `beforetoggle` listener on `document` gives
 * each popover and `<dialog>` a number when it opens. Higher opened later.
 *
 * Tracking starts once, from `useStartOpenOrderTracking`, and never stops. A layer that opened
 * before it started has no open order. Layers in a shadow root are not seen: `beforetoggle` is not
 * composed.
 *
 * The tracker lives in module scope. At this stage we do not handle more than one copy of
 * `@atlaskit/top-layer` on a page: each copy would keep its own open order.
 */
export const openOrderTracker: TOpenOrderTracker = createOpenOrderTracker();
