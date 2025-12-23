import debounce from 'lodash/debounce';
import memoize from 'lodash/memoize';

import { type MediaAttributes } from '@atlaskit/adf-schema';
import { type BatchAttrsStepData } from '@atlaskit/adf-schema/steps';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { batchStepsUpdate } from './batchSteps';

/**
 * 🧱 Internal: Editor FE Platform
 * Based on https://github.com/lodash/lodash/issues/2403#issuecomment-1706130395
 *
 * Creates a debounced function that delays invoking the provided function until after a specified
 * wait time has elapsed since the last time the debounced function was invoked. Additionally, the
 * debounced function is memoized so that the same function instance is used for each unique set
 * of arguments based on the resolver.
 *
 * This is particularly useful in scenarios where you want to debounce function calls while ensuring
 * that each unique input combination receives its own debounced function instance. It's a combination
 * of lodash's `debounce` and `memoize`.
 *
 * @template T
 * @param {T} func - The function to debounce.
 * @param {number} [wait=0] - The number of milliseconds to delay.
 * @param {object} [options] - The options object to pass to `debounce`.
 * @param {Function} [resolver] - The function to resolve the cache key for memoization.
 * @returns {Function} A new debounced and memoized function.
 *
 * @example
 * const debouncedFunction = memoizeDebounce(myFunction, 300, { leading: true }, myResolver);
 * debouncedFunction(arg1, arg2);
 */
function memoizeDebounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
	func: T,
	wait = 0,
	options?: Parameters<typeof debounce<T>>[2],
	resolver?: Parameters<
		typeof memoize<(...args: Parameters<T>) => ReturnType<typeof debounce<T>>>
	>[1],
) {
	const mem = memoize<(...args: Parameters<T>) => ReturnType<typeof debounce<T>>>(function () {
		return debounce<T>(func, wait, options);
	}, resolver);

	return function (...args: Parameters<T>) {
		return mem(...args)(...args);
	};
}

type MediaId = string;
type Props = {
	id: MediaId;
	nextAttributes: Partial<MediaAttributes>;
};

export type MediaAttributesMap = Record<MediaId, Partial<MediaAttributes>>;

type MediaAttributesCachePerView = MediaAttributesMap;

export type MediaAttributesCache = WeakMap<EditorView, MediaAttributesCachePerView>;

const mediaAttributesCache: MediaAttributesCache = new WeakMap();
const debouncedTime = 500;

export const containsSameAttributes = (a: MediaAttributes, b: Partial<MediaAttributes>) => {
	// a contains b, and want to check if attributes in b are same in a
	return Object.entries(b).every(([bkey, bValue]) => {
		if (bkey in a) {
			const aValue = a[bkey as keyof MediaAttributes];
			// Check if types match before comparing values
			return typeof aValue === typeof bValue && aValue === bValue;
		}
		return false;
	});
};

/**
 * Updates media node attributes in the editor view based on the provided cache.
 *
 * @param {EditorView} editorView - The editor view instance where the updates will be applied.
 * @param {MediaAttributesCache} cache - The cache containing media attributes to be updated.
 *
 * This function performs the following steps:
 * 1. Retrieves the media attributes to update from the cache for the given editor view.
 * 2. Clears the media attributes cache for the editor view.
 * 3. Searches for media nodes in the document and collects their positions and new attributes.
 * 4. If there are any media nodes to update, it applies the updates in a batch.
 */
export const runUpdate = (editorView: EditorView, cache: MediaAttributesCache): void => {
	const toUpdateValues = cache.get(editorView) || {};
	// clear the media attributes cache per editor view
	cache.delete(editorView);

	const ids = Object.keys(toUpdateValues);
	const { state } = editorView;
	const mediaSteps: BatchAttrsStepData[] = [];

	// search node positions by id
	state.doc.descendants((node, position) => {
		if (![node.type.schema.nodes.media, node.type.schema.nodes.mediaInline].includes(node.type)) {
			return true;
		}
		if (!ids.includes(node.attrs.id)) {
			return false;
		}
		const attrs = toUpdateValues[node.attrs.id];
		if (containsSameAttributes(node.attrs as MediaAttributes, attrs)) {
			return false;
		}
		mediaSteps.push({
			position,
			nodeType: node.type.name,
			attrs,
		});
	});

	if (mediaSteps.length > 0) {
		batchStepsUpdate(editorView, mediaSteps);
	}
};

/**
 * Creates a debounced version of the `runUpdate` function to update media node attributes in the editor view.
 *
 * @constant
 * @type {Function}
 * @param {Function} runUpdate - The function to be debounced.
 * @param {number} debouncedTime - The debounce delay in milliseconds.
 * @param {object} [options] - The debounce options. Defaults to {leading: false, trailing: true}.
 * @param {Function} keyResolver - A function that returns the key to be used for memoization. In this case, it returns the editor view instance.
 *
 * This function performs the following steps:
 * 1. Debounces the `runUpdate` function with the specified delay and options.
 * 2. Uses the editor view instance as the key for memoization to ensure that updates are applied correctly.
 */
export const runUpdateDebounced = memoizeDebounce(
	runUpdate,
	debouncedTime,
	/**
	 * Use the default debounce options:
	 * {leading: false, trailing: true}
	 */
	undefined,
	(view: EditorView) => {
		/**
		 * EditorView is a singleton.
		 * There is only one instance per Editor.
		 */
		return view;
	},
);

/**
 * Updates the media node attributes cache for the given editor view and triggers a debounced update.
 *
 * @param {EditorView} editorView - The editor view instance where the updates will be applied.
 * @param {Props} props - The properties containing the media node ID and the next attributes to be updated.
 *
 * This function performs the following steps:
 * 1. Retrieves the media attributes cache for the given editor view.
 * 2. If no cache exists, initializes a new cache.
 * 3. Updates the cache with the new attributes for the specified media node ID.
 * 4. Sets the updated cache back to the media attributes cache.
 * 5. Triggers a debounced update to apply the changes in the editor view.
 */
export const batchMediaNodeAttrsUpdate = (editorView: EditorView, props: Props): void => {
	let cachePerView: MediaAttributesCachePerView | undefined = mediaAttributesCache.get(editorView);
	if (!cachePerView) {
		cachePerView = {
			records: {},
		};
	}

	cachePerView[props.id] = {
		...(cachePerView[props.id] || {}),
		...props.nextAttributes,
	};

	mediaAttributesCache.set(editorView, cachePerView);
	runUpdateDebounced(editorView, mediaAttributesCache);
};
