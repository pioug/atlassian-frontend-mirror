export type LayerCountChangeListenerFn = (args: { count: number }) => void;
export type CleanupFn = () => void;

export type LayerCloseListenerFn = () => void;

export type OpenLayerObserverInternalAPI = {
	/**
	 * Returns the current count of open layers.
	 */
	getCount: (options?: { namespace?: string }) => number;

	/**
	 * Adds a listener that will be called when the number of open layers changes.
	 *
	 * Accepts an optional second argument to specify the namespace of the layer.
	 *
	 * If a namespace is provided, the `onChange` will only be called when the number of open layers _in the given namespace_ changes.
	 *
	 * If a namespace is not provided, the `onChange` will be called when the number of open layers in any namespace changes.
	 */
	onChange: (
		/**
		 * The listener that will be called when the number of open layers changes.
		 */
		listener: LayerCountChangeListenerFn,
		options?: {
			/**
			 * The namespace of the layer.
			 * If provided, the `onChange` will only be called when the number of open layers _in the given namespace_ changes.
			 *
			 * If not provided, the `onChange` will be called when the number of open layers in any namespace changes.
			 */
			namespace?: string;
		},
	) => CleanupFn;

	/**
	 * Increments the count of open layers.
	 *
	 * This will call all listeners that were added via `onChange`.
	 *
	 * Note: this internal function will be removed with fg('platform_dst_open_layer_observer_close_layers')
	 */
	increment: () => void;

	/**
	 * Decrements the count of open layers.
	 *
	 * This will call all listeners that were added via `onChange`.
	 *
	 * Note: this internal function will be removed with fg('platform_dst_open_layer_observer_close_layers')
	 */
	decrement: () => void;

	/**
	 * Adds a listener that will be called when all _open_ layers are closed through the `closeLayers`
	 * function.
	 *
	 * Returns a clean up function to unsubscribe the listener.
	 */
	onClose: (listener: LayerCloseListenerFn, options: { namespace: string | null }) => CleanupFn;

	/**
	 * Closes all open layers.
	 *
	 * This will call the `onClose` listeners for all _open_ layers.
	 */
	closeLayers: () => void;
};
