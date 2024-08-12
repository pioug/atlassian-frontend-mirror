import type { buildCaches } from './provider-cache';

// re exported to avoid type issues
// this type is only used in jsdoc comments in this file.
export type { buildCaches as __doNotUseThisType };

/**
 * This is the base class for creating a node view data provider for an editor plugin.
 *
 * ## Usage
 *
 * ### Create a provider
 *
 * @example
 * ```ts
 * class EmojiNodeViewDataProvider extends NodeViewDataProvider<
 *  { attrs: EmojiAttributes },
 * { resolvedData: string }
 * > {
 *   constructor({ existingCache }?: { existingCache: Record<string, { resolvedData: string }> }) {
 *     super({ existingCache, nodeName: 'emoji' });
 *   }
 *   nodeToKey(node: { attrs: EmojiAttributes }): string {
 *     return `${node.attrs.shortName}-${node.attrs.text}-${node.attrs.id}`;
 *   }
 *   resolve(node: { attrs: EmojiAttributes }, _?: { signal: AbortSignal }) {
 *     return Promise.resolve({ resolvedData: 'resolved' });
 *   }
 * }
 * ```
 *
 * ### Use the provider
 *
 * @example
 * ```ts
 * const emojiNodeViewDataProvider = new EmojiNodeViewDataProvider();
 * ```
 *
 * ### Caching
 *
 * @see {@link buildCaches} for more information on building caches.
 *
 * #### Load an existing provider with a cache
 *
 * @example
 * ```
 * await buildCaches({
 *  adf: docFromSomewhere,
 *  nodeViewDataProviders: [emojiNodeViewDataProvider],
 *  signal: AbortSignal.timeout(5000),
 * });
 * emojiNodeViewDataProvider // { 'key': 'value' }
 * ```
 *
 * ### Load an new provider with an existing cache
 *
 * @example
 * ```
 * const provider1 = new ExampleNodeViewDataProvider();
 * await buildCaches({adf, nodeViewDataProviders: [provider1]})
 * provider1.cache // { 'key': 'value' }
 *
 * const provider2 = new ExampleNodeViewDataProvider({existingCache: provider1.cache});
 * ```
 */
export class NodeViewDataProvider<INode extends ReceivableNode, Result extends unknown> {
	/**
	 * This is added to ease building types
	 */
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	__node: INode = {} as any;

	__cache: Record<string, Result>;

	/**
	 * This takes a node and returns a key that can be used to cache the result of the resolve function.
	 */
	nodeToKey: (node: INode) => string;

	/**
	 * This returns the information required to render a node.
	 *
	 * If unresolvable, this method will throw an error.
	 *
	 * If signal is aborted, this method will return undefined.
	 */
	resolve: (node: INode, _?: { signal?: AbortSignal }) => Promise<Result | undefined>;

	constructor({
		existingCache = {},
		nodeName,
		nodeToKey,
		resolve,
	}: {
		/**
		 * A cache to load the provider with.
		 *
		 * @see {@link buildCaches} for more information on building caches.
		 */
		existingCache?: Record<string, Result>;
		/**
		 * The adf node name this provider is responsible for.
		 *
		 * It is used for;
		 * - determining if the traverser should use this provider to resolve a node when building caches
		 * - identifying the node when submitting analytics events via the helper react hooks
		 */
		nodeName: string;
		nodeToKey: typeof NodeViewDataProvider.prototype.nodeToKey;
		resolve: typeof NodeViewDataProvider.prototype.resolve;
	}) {
		this.__cache = existingCache;
		this.nodeName = nodeName;
		this.nodeToKey = nodeToKey;
		this.resolve = resolve;
	}

	nodeName: string;

	set cache(cache: Record<string, Result>) {
		this.__cache = cache;
	}

	/**
	 * This is the cache for the provider.
	 */
	get cache(): Record<string, Result> {
		return this.__cache;
	}

	get(node: INode, _?: { signal: AbortSignal }): Promise<Result | undefined> | Result {
		const cached = this.cache[this.nodeToKey(node)];
		if (cached) {
			return cached;
		}

		const resolving = this.resolve(node, { signal: _?.signal });

		return resolving;
	}
}

// The purpose of this type is to ensure that either a DocNode or a PMNode is passed in
// to the provider.
// It is not opinionated about which nodes are used, so `any` is used here to allow
// compatibility with both DocNodes and PMNodes.
export type ReceivableNode = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: { [key: string]: any };
};

export type ResolveOptions = { signal: AbortSignal };
