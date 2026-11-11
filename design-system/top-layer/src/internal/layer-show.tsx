import { getNearestContainingLayer } from './escape-ownership/get-nearest-containing-layer';
import { openRequestedAttribute } from './open-requested-attribute';

type TShowRequest = {
	element: HTMLElement;
	show: () => undefined;
};

type TQueuedShow = TShowRequest & {
	/**
	 * The parent layer that this layer waits for.
	 */
	parent: HTMLElement;
};

type TLayerShowOrder = {
	/**
	 * Call it from the layout effect that shows the layer, and return its cleanup from that effect.
	 * If the parent layer is open-pending, the layer joins the queue. Else `show` runs at once.
	 *
	 * The cleanup takes the layer off the queue if it has not shown, and marks it as not shown.
	 */
	queueOrShow: (args: TShowRequest) => () => undefined;
};

/**
 * The parent layer: the nearest layer around `element` in the DOM whose `isOpen` is `true`.
 */
function getParentLayer({ element }: { element: HTMLElement }): HTMLElement | null {
	const layers = Array.from(
		element.ownerDocument.querySelectorAll<HTMLElement>(`[${openRequestedAttribute}]`),
	);
	return getNearestContainingLayer({ element, layers });
}

function createLayerShowOrder(): TLayerShowOrder {
	// The layers that have shown. A `WeakSet`, so a removed host is not kept alive.
	const shownLayers = new WeakSet<HTMLElement>();
	// The layers that wait for a parent layer to show.
	const queue = new Set<TQueuedShow>();

	function showNow({ element, show }: TShowRequest): undefined {
		show();
		shownLayers.add(element);
		return undefined;
	}

	/**
	 * Shows the queued layers inside `element` whose parent has shown, in DOM order. A parent comes
	 * before the layers inside it, so one pass is enough: a parent that shows in this pass has shown
	 * by the time the layers inside it are reached.
	 */
	function showQueueInside({ element }: { element: HTMLElement }): undefined {
		const inside = Array.from(queue)
			.filter((queued) => element.contains(queued.element))
			.sort((a, b) =>
				Boolean(
					a.element.compareDocumentPosition(b.element) & a.element.DOCUMENT_POSITION_FOLLOWING,
				)
					? -1
					: 1,
			);
		inside.forEach((queued) => {
			// A portal can put a layer inside `element` in the DOM while its parent has not shown yet.
			// It keeps waiting, and shows when its parent shows.
			if (!shownLayers.has(queued.parent)) {
				return;
			}
			queue.delete(queued);
			showNow(queued);
		});
		return undefined;
	}

	return {
		queueOrShow({ element, show }) {
			function markNotShown(): undefined {
				shownLayers.delete(element);
				return undefined;
			}

			// Look only at your parent. It is in the DOM query only while its `isOpen` is `true`.
			const parent = getParentLayer({ element });
			if (parent && !shownLayers.has(parent)) {
				const queued: TQueuedShow = { element, show, parent };
				queue.add(queued);
				return () => {
					queue.delete(queued);
					return markNotShown();
				};
			}

			showNow({ element, show });
			showQueueInside({ element });
			return markNotShown;
		},
	};
}

/**
 * **Layer show order**
 *
 * The top layer stacks layers in show order, and React runs child effects first. So a nested layer
 * that opens in the same commit as its parent would show first, and its parent would cover it.
 *
 * **How**
 *
 * - Render: each layer host sets `data-top-layer-open-requested` while `isOpen` is `true`.
 * - Effect: if your parent layer (the nearest in the DOM) has not shown yet, join the queue. Else,
 *   show.
 * - Show: show yourself, then the queued layers inside you whose parent has shown, in DOM order.
 *
 * **Notes**
 *
 * - A defensive fix for React's effect order, not support for nested layers that open together.
 * - The DOM, not the React tree, as Escape ownership and the browser use.
 * - See `notes/architecture/layer-show-order.md`.
 */
export const layerShowOrder: TLayerShowOrder = createLayerShowOrder();
