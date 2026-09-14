import type { EditorView } from '@atlaskit/editor-prosemirror/view';

/**
 * Publishes the drag handle rendered into the block controls UI control surface, so popup consumers
 * outside Block Controls can anchor themselves to it without introducing a package cycle.
 * Entries are keyed by editor view so editors on the same page cannot interfere with each other.
 */
type Listener = () => void;

type SurfaceDragHandleElementStore = {
	/** Never returns an element that has left the document. */
	get: (view: EditorView | undefined) => HTMLElement | null;
	/** Clears only when the supplied element is still the current one. */
	release: (view: EditorView | undefined, element: HTMLElement | null) => void;
	/** Publishes the currently rendered surface drag handle. */
	set: (view: EditorView | undefined, element: HTMLElement | null) => void;
	/** Subscribes to handle replacement for one editor instance. */
	subscribe: (view: EditorView | undefined, listener: Listener) => () => void;
};

const elementByView = new WeakMap<EditorView, HTMLElement>();
const listenersByView = new WeakMap<EditorView, Set<Listener>>();

export const surfaceDragHandleElementStore: SurfaceDragHandleElementStore = {
	get: (view) => {
		const element = (view && elementByView.get(view)) || null;
		return element?.isConnected ? element : null;
	},

	release: (view, element) => {
		if (!view || !element || elementByView.get(view) !== element) {
			return;
		}
		surfaceDragHandleElementStore.set(view, null);
	},

	set: (view, element) => {
		if (!view) {
			return;
		}

		const current = elementByView.get(view) ?? null;
		if (current === element) {
			return;
		}

		if (element) {
			elementByView.set(view, element);
		} else {
			elementByView.delete(view);
		}

		listenersByView.get(view)?.forEach((listener) => listener());
	},

	subscribe: (view, listener) => {
		if (!view) {
			return () => {};
		}

		const listeners = listenersByView.get(view) ?? new Set<Listener>();
		listeners.add(listener);
		listenersByView.set(view, listeners);

		return () => {
			listeners.delete(listener);
		};
	},
};
