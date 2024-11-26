import type { buildCaches } from './cache';

/**
 * This is the base class for creating a node data provider for an editor plugin.
 *
 * ## Usage
 *
 * ### Create a provider
 *
 * @example
 * ```ts
 * class EmojiNodeDataProvider extends NodeDataProvider<
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
 * const emojiNodeDataProvider = new EmojiNodeDataProvider();
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
 *  nodeDataProviders: [emojiNodeDataProvider],
 *  signal: AbortSignal.timeout(5000),
 * });
 * emojiNodeDataProvider // { 'key': 'value' }
 * ```
 *
 * ### Load an new provider with an existing cache
 *
 * @example
 * ```
 * const provider1 = new ExampleNodeDataProvider();
 * await buildCaches({adf, nodeDataProviders: [provider1]})
 * provider1.cache // { 'key': 'value' }
 *
 * const provider2 = new ExampleNodeDataProvider({existingCache: provider1.cache});
 * ```
 */
export class NodeDataProvider<INode extends ReceivableNode, Result extends unknown> {
	/**
	 * This is added to ease building types
	 */
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	__node: INode = {} as any;

	private __cache: Record<string, Result>;

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

	/**
	 * The adf node name this provider is responsible for.
	 */
	nodeName: string;

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
		nodeToKey: typeof NodeDataProvider.prototype.nodeToKey;
		resolve: typeof NodeDataProvider.prototype.resolve;
	}) {
		this.__cache = existingCache;
		this.nodeName = nodeName;
		this.nodeToKey = nodeToKey;
		this.resolve = resolve;
	}

	/**
	 * Updates the providers cache.
	 *
	 * Useful in scenarios such as SSR where the cache is built on the server and then passed to the client.
	 *
	 * Avoids the need to provide the cache to the constructor (to allow decoupling creation of node data providers from cache building),
	 * and allow for caching to be managed at a group level across multiple providers.
	 *
	 * This is not expected to be used by consumers, for internal consumption examples;
	 * @see {@link buildCaches}
	 *
	 */
	updateCache(cache: Record<string, Result>, options: { strategy: 'merge-override' | 'replace' }) {
		switch (options.strategy) {
			case 'merge-override':
				this.__cache = { ...this.__cache, ...cache };
				return;
			case 'replace':
				this.__cache = cache;
				return;
		}
	}

	/**
	 * This is the cache for the provider.
	 */
	get cache(): Record<string, Result> {
		return this.__cache;
	}

	private pending: Record<
		string,
		{
			resolving: Promise<Result | undefined>;
			abortController: AbortController;
			activeSignals: AbortSignal[];
		}
	> = {};

	get(node: INode, _?: { signal: AbortSignal }): Promise<Result | undefined> | Result {
		const key = this.nodeToKey(node);
		const cached = this.cache[key];

		if (cached) {
			return cached;
		}

		// Get could be called from a variety of sources;
		// - a Node Data Provider
		// - a cache build
		// - something else
		//
		// We want to avoid triggering multiple resolves for the same node -- so we keep track of pending requests
		// and share them across any overlapping gets.
		//
		// When a get is cancelled -- we only want to cancel the shared resolve if all signals are aborted
		// so we keep track of all signals that are not aborted.

		let originalSignal = _?.signal || new AbortController().signal;
		if (!this.pending[key]) {
			const abortController = new AbortController();
			this.pending[key] = {
				resolving: new Promise(async (res, rej) => {
					try {
						const result = await this.resolve(node, { signal: abortController.signal }).catch(
							(res) => res(undefined),
						);
						res(result);
					} catch {
						res(undefined);
					}
				}),
				abortController,
				activeSignals: [originalSignal],
			};
		}
		const handleAbort = () => {
			this.pending[key].activeSignals = this.pending[key].activeSignals.filter(
				(activeSignal) => activeSignal !== originalSignal,
			);

			if (this.pending[key].activeSignals.length === 0) {
				// abort the resolution if all signals are aborted
				this.pending[key].abortController.abort();
			}
		};

		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		originalSignal?.addEventListener('abort', handleAbort);

		this.pending[key].resolving.then((resolvedValue) => {
			if (resolvedValue) {
				this.cache[key] = resolvedValue;
			}
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			originalSignal?.removeEventListener('abort', handleAbort);

			return resolvedValue;
		});

		return this.pending[key].resolving;
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
