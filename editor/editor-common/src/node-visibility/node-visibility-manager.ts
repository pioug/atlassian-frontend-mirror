type NodeObservationConfig = {
	element: HTMLElement;
	onFirstVisible: () => void;
};

export type NodeVisibilityManager = {
	/**
	 * Kills the IntersectionObserver and all callbacks
	 * @returns
	 */
	disconnect: () => void;
	/**
	 * Establishes IntersectionObserver for the editor to monitor all node viewport visibility
	 * @param editorDivElement
	 * @returns
	 */
	initialiseNodeObserver: () => void;
	/**
	 * observes specific node element with callbacks for triggering when the node is visible or hidden
	 */
	observe: (observeConfig: NodeObservationConfig) => () => void;
};

type NodeVisibilityManagerFn = (editorElement: HTMLElement) => NodeVisibilityManager;

// Use this selector to set the intersection observer boundary for editor's inline node views
// If this does not exist, it will use the IntersectionObserver's default root
const INTERSECTION_OBSERVER_ROOT_SELECTOR = '[data-editor-scroll-container="true"]';

const editorObservers = new WeakMap<Element, IntersectionObserver>();
const callbackMap = new WeakMap<Element, Omit<NodeObservationConfig, 'nodeEl'>>();

/**
 * Creates a node visibility manager
 * @param editorElement
 * @returns
 */
export const nodeVisibilityManager: NodeVisibilityManagerFn = (editorElement) => {
	// Warning! do not reference editorElement outside of internal functions.
	// editorElement is passed to allow support for multiple editors,

	const unObserveInternal = (nodeElement: HTMLElement) => {
		editorObservers.get(editorElement)?.unobserve(nodeElement);
		callbackMap.delete(nodeElement);
	};

	const observe: NodeVisibilityManager['observe'] = (observerConfig: NodeObservationConfig) => {
		callbackMap.set(observerConfig.element, observerConfig);
		editorObservers.get(editorElement)?.observe(observerConfig.element);

		// return clean up
		return () => {
			// consumer needs to unobserve on destroy if their element
			// was observed but never scrolled into view
			unObserveInternal(observerConfig.element);
		};
	};

	const initialiseNodeObserver = () => {
		if (editorObservers.has(editorElement)) {
			return;
		}
		const intersectionObserverOptions: IntersectionObserverInit = {
			root: editorElement.closest(INTERSECTION_OBSERVER_ROOT_SELECTOR),
			rootMargin: '0px 0px 100px 0px',
			threshold: 0,
		};

		const editorObserver = new IntersectionObserver(
			(entries: IntersectionObserverEntry[]) =>
				entries
					.map((entry) => ({ entry, callback: callbackMap.get(entry.target) }))
					// Invoke callbacks together to group browser rendering
					// Avoiding requestAnimationFrame to reduce visual flickering
					.forEach(({ entry, callback }) => {
						if (entry.isIntersecting) {
							callback?.onFirstVisible();
							if (entry.target instanceof HTMLElement) {
								// immediately unobserve the element after it is visible
								unObserveInternal(entry.target);
							}
						}
					}),
			intersectionObserverOptions,
		);
		editorObservers.set(editorElement, editorObserver);
	};

	const disconnect = () => {
		editorObservers.get(editorElement)?.disconnect();
		editorObservers.delete(editorElement);
	};

	return {
		initialiseNodeObserver,
		observe,
		disconnect,
	};
};
