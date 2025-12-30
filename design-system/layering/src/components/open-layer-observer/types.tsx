export type LayerCountChangeListenerFn = (args: { count: number }) => void;
export type CleanupFn = () => void;

export type LayerCloseListenerFn = () => void;

/**
 * The type of layer. This is used as a filter when requesting the count of open layers.
 */
// We can add more types as we need them - e.g. `tooltip`, `select`, etc.
// Disabling the eslint rule, as it semantically makes sense to include "Type" in the name.
// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type LayerType = 'modal' | 'popup';

export type OpenLayerObserverInternalAPI = {
	/**
	 * Returns the current count of open layers.
	 *
	 * - If a namespace is provided, the count for that namespace is returned.
	 * - If a type is provided, only layers of that type are counted.
	 * - If both are provided, only layers matching both criteria are counted.
	 * - Otherwise, the sum of all namespace counts is returned.
	 */
	getCount: (options?: {
		/**
		 * The namespace to get the count of open layers of.
		 */
		namespace?: string;
		/**
		 * The type of layer to get the count of.
		 */
		type?: LayerType;
	}) => number;

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
	 * Adds a listener that will be called when all _open_ layers are closed through the `closeLayers`
	 * function.
	 *
	 * Returns a clean up function to unsubscribe the listener.
	 */
	onClose: (
		listener: LayerCloseListenerFn,
		options: { namespace: string | null; type?: LayerType },
	) => CleanupFn;

	/**
	 * Closes all open layers.
	 *
	 * This will call the `onClose` listeners for all _open_ layers.
	 */
	closeLayers: () => void;
};
