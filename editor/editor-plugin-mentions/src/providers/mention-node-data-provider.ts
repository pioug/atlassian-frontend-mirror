import type { MentionDefinition } from '@atlaskit/adf-schema/mention';
import type {
	MentionNodeDataCallback,
	MentionNodeDataIdentifier,
	MentionNodeDataProvider as MentionNodeDataProviderContract,
} from '@atlaskit/editor-common/mention';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';
import type { MentionDescription, MentionNodeData, MentionProvider } from '@atlaskit/mention/types';
import { NodeDataProvider } from '@atlaskit/node-data-provider/node-data-provider';

export type FetchMentionNodeData = (
	accountIds: string[],
	signal?: AbortSignal,
) => Promise<Record<string, MentionNodeData>>;

export type ResolveMentionNodeData = (
	mention: MentionNodeDataIdentifier,
) => MentionNodeData | undefined;

const getAppType = (userType: MentionNodeDataIdentifier['userType']): 'agent' | 'user' =>
	userType === 'APP' || userType === 'AGENT' ? 'agent' : 'user';

const enrichMentionNodeData = (
	mention: MentionNodeDataIdentifier,
	data: MentionNodeData | undefined,
): MentionNodeData => ({
	...data,
	appType: data?.appType ?? getAppType(mention.userType),
});

const toMentionNode = ({ id, userType }: MentionNodeDataIdentifier): MentionDefinition => ({
	attrs: {
		id,
		// NodeDataProvider uses an ADF node internally, so normalize the runtime-only value.
		userType: userType === 'AGENT' ? 'APP' : userType,
	},
	type: 'mention',
});

const isMentionNode = (node: JSONNode): node is MentionDefinition =>
	node.type === 'mention' &&
	node.attrs !== undefined &&
	'id' in node.attrs &&
	typeof node.attrs.id === 'string';

const SUBSCRIPTION_KEY_PREFIX = 'mention-node-data-provider';
let subscriptionKeyCounter = 0;

const cacheMentionData = (
	cache: Map<string, MentionNodeData>,
	mentions: readonly MentionDescription[],
): void => {
	mentions.forEach((mention) => {
		if (mention.isPlaceholder || !mention.avatarUrl) {
			cache.delete(mention.id);
			return;
		}

		cache.set(mention.id, {
			avatarUrl: mention.avatarUrl,
			appType: mention.appType,
		});
	});
};

/**
 * Page-scoped data provider for mention avatars.
 *
 * Products inject their resolution strategy so this package remains independent
 * of Jira and Confluence APIs. Reuse the instance for the lifetime of a renderer
 * or editor rather than creating one for every mention.
 *
 * Deterministic products can supply `resolveMentionNodeData` to return an
 * SSR-safe avatar URL synchronously. It must return the same value on the server
 * and the client's first render to preserve hydration parity.
 *
 * Network-backed products supply `fetchMentionNodeData`. Calls made in the same
 * microtask are combined and account IDs are deduplicated before the fetcher is
 * invoked. A Relay adapter can query `users(accountIds:)`, then map each user's
 * `picture` and app type to a `MentionNodeData` record keyed by account ID. The
 * resolved result is cached by the underlying `NodeDataProvider`.
 *
 * Products that already have a `MentionProvider` result stream can call `connect`
 * so emitted mention results populate a synchronous avatar cache.
 */
export class MentionNodeDataProvider
	extends NodeDataProvider<MentionDefinition, MentionNodeData>
	implements MentionNodeDataProviderContract
{
	readonly name = 'mentionNodeDataProvider';
	private readonly abortControllerRef: { current: AbortController } = {
		current: new AbortController(),
	};
	private readonly emittedMentionCache = new Map<string, MentionNodeData>();
	private readonly subscriptionKey = `${SUBSCRIPTION_KEY_PREFIX}:${++subscriptionKeyCounter}`;
	private lastMentionResource: Promise<MentionProvider> | undefined;
	private queuedFetches: Array<{
		accountIds: string[];
		reject: (error: unknown) => void;
		resolve: (data: Record<string, MentionNodeData>) => void;
	}> = [];
	private isFlushScheduled = false;

	constructor(
		private readonly fetchMentionNodeData: FetchMentionNodeData,
		private readonly resolveMentionNodeData: ResolveMentionNodeData | undefined = undefined,
	) {
		super();
	}

	isNodeSupported(node: JSONNode): node is MentionDefinition {
		return isMentionNode(node) && node.attrs.userType !== 'SPECIAL';
	}

	nodeDataKey(node: MentionDefinition): string {
		return node.attrs.id;
	}

	async fetchNodesData(nodes: MentionDefinition[]): Promise<MentionNodeData[]> {
		const accountIds = Array.from(new Set(nodes.map(({ attrs }) => attrs.id)));
		const dataByAccountId = await this.enqueueFetch(accountIds);

		return nodes.map(({ attrs }) => enrichMentionNodeData(attrs, dataByAccountId[attrs.id]));
	}

	getMentionData(mention: MentionNodeDataIdentifier, callback: MentionNodeDataCallback): void {
		const resolvedData = this.resolveMentionNodeDataFromCache(mention);
		if (resolvedData) {
			callback({ data: enrichMentionNodeData(mention, resolvedData) });
			return;
		}

		this.getData(toMentionNode(mention), callback);
	}

	getMentionDataFromCache(mention: MentionNodeDataIdentifier): MentionNodeData | undefined {
		const resolvedData = this.resolveMentionNodeDataFromCache(mention);
		if (resolvedData) {
			return enrichMentionNodeData(mention, resolvedData);
		}

		const data = this.getNodeDataFromCache(toMentionNode(mention))?.data;

		return data ? enrichMentionNodeData(mention, data) : undefined;
	}

	connect(mentionResource: Promise<MentionProvider>): () => void {
		if (this.lastMentionResource && this.lastMentionResource !== mentionResource) {
			this.emittedMentionCache.clear();
			this.resetCache();
		}
		this.lastMentionResource = mentionResource;
		if (this.abortControllerRef.current.signal.aborted) {
			this.abortControllerRef.current = new AbortController();
		}

		let isDisconnected = false;
		let subscribedMentionProvider: MentionProvider | undefined;

		void mentionResource
			.then((mentionProvider) => {
				if (isDisconnected) {
					return;
				}

				subscribedMentionProvider = mentionProvider;
				mentionProvider.subscribe(this.subscriptionKey, (mentions) => {
					cacheMentionData(this.emittedMentionCache, mentions);
				});
			})
			.catch(() => undefined);

		return () => {
			isDisconnected = true;
			this.abortControllerRef.current.abort();
			subscribedMentionProvider?.unsubscribe(this.subscriptionKey);
			subscribedMentionProvider = undefined;
		};
	}

	private resolveMentionNodeDataFromCache(
		mention: MentionNodeDataIdentifier,
	): MentionNodeData | undefined {
		return this.resolveMentionNodeData?.(mention) ?? this.emittedMentionCache.get(mention.id);
	}

	private enqueueFetch(accountIds: string[]): Promise<Record<string, MentionNodeData>> {
		const result = new Promise<Record<string, MentionNodeData>>((resolve, reject) => {
			this.queuedFetches.push({ accountIds, reject, resolve });
		});

		if (!this.isFlushScheduled) {
			this.isFlushScheduled = true;
			void Promise.resolve().then(() => this.flushFetches());
		}

		return result;
	}

	private async flushFetches(): Promise<void> {
		this.isFlushScheduled = false;
		const queuedFetches = this.queuedFetches;
		this.queuedFetches = [];
		const accountIds = Array.from(new Set(queuedFetches.flatMap((request) => request.accountIds)));

		try {
			const data = await this.fetchMentionNodeData(
				accountIds,
				this.abortControllerRef.current.signal,
			);
			queuedFetches.forEach(({ resolve }) => resolve(data));
		} catch (error) {
			queuedFetches.forEach(({ reject }) => reject(error));
		}
	}
}
