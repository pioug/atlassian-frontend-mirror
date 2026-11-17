import { getNearestContainingLayer } from './escape-ownership/get-nearest-containing-layer';
import { openRequestedAttribute } from './open-requested-attribute';

type TShowRequest = {
	element: HTMLElement;
	show: () => void;
};

type TQueuedShow = TShowRequest & {
	/**
	 * The parent layer that this layer waits for.
	 */
	parent: HTMLElement;
};

type TLayerShowOrder = {
	/**
	 * Shows the layer, or queues it while its parent layer has not finished its show. Call the cleanup
	 * when the show is cancelled or the layer closes: it takes the layer off the queue and marks its
	 * show as not finished.
	 */
	queueOrShow: (args: TShowRequest) => () => void;
	/**
	 * Call once the layer has shown, its content effects have run and it has taken initial focus.
	 * Shows the queued layers inside it whose parent has finished its show.
	 */
	markShowFinished: (args: { element: HTMLElement }) => void;
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
	// The layers that have finished their show. A `WeakSet`, so a removed host is not kept alive.
	const finishedLayers = new WeakSet<HTMLElement>();
	// The layers that wait for a parent layer to finish its show.
	const queue = new Set<TQueuedShow>();

	/**
	 * Shows the queued layers inside `element` whose parent has finished its show, in DOM order. A
	 * layer that shows here finishes its show in its `show`, which can show more of the queue first.
	 */
	function showQueueInside({ element }: { element: HTMLElement }): void {
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
			// A portal can put a layer inside `element` in the DOM while its own parent has not finished
			// its show. It keeps waiting, and shows when its parent finishes.
			if (!queue.has(queued) || !finishedLayers.has(queued.parent)) {
				return;
			}
			queue.delete(queued);
			queued.show();
		});
	}

	return {
		queueOrShow({ element, show }) {
			function markShowNotFinished(): void {
				finishedLayers.delete(element);
			}

			// Look only at your parent. It is in the DOM query only while its `isOpen` is `true`.
			const parent = getParentLayer({ element });
			if (parent && !finishedLayers.has(parent)) {
				const queued: TQueuedShow = { element, show, parent };
				queue.add(queued);
				return () => {
					queue.delete(queued);
					markShowNotFinished();
				};
			}

			show();
			return markShowNotFinished;
		},
		markShowFinished({ element }) {
			finishedLayers.add(element);
			showQueueInside({ element });
		},
	};
}

/**
 * **Layer show order**
 *
 * The top layer stacks layers in show order: the last layer shown is on top. A nested layer that
 * opens in the same commit as its parent must show after its parent, and after its parent has taken
 * initial focus. Then it is on top, and it returns focus into its parent when it closes.
 *
 * **How**
 *
 * - Render: each layer host sets `data-top-layer-open-requested` while `isOpen` is `true`.
 * - Show: if your parent layer (the nearest in the DOM) has not finished its show, join the queue.
 *   Else, show.
 * - Finish: a layer finishes its show once it has shown, its content effects have run and it has
 *   taken initial focus (`sync-native-open/use-sync-native-open.tsx`). Then the queued layers inside
 *   it whose parent has finished show, in DOM order.
 *
 * A layer shows before its content effects, but its initial focus comes after them. So a nested
 * layer waits for the finish, not for the show.
 *
 * **Notes**
 *
 * - A defensive fix, not support for nested layers that open together.
 * - The DOM, not the React tree, as Escape ownership and the browser use.
 * - See `notes/architecture/layer-show-order.md`.
 */
export const layerShowOrder: TLayerShowOrder = createLayerShowOrder();
