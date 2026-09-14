import { fg } from '@atlaskit/platform-feature-flags/fg';

import { beginUFOPreloadHold } from '../preload-hold';
import { makePreloadKey } from '../preload-hold/make-preload-key';

// Local structural types avoid a dependency on Jira RRR.
export type UfoRrrRouterContext = {
	route: { name?: string; ufoName?: string };
	match: { url: string };
	query?: Readonly<Record<string, string | undefined>>;
};

export type UfoRrrPrefetchPromise = {
	pluginId: string;
	key: string;
	promise: Promise<unknown>;
	startedAt: number;
};

export type UfoRrrPlugin<TContext extends UfoRrrRouterContext = UfoRrrRouterContext> = {
	id: string;
	onAfterRoutePrefetch: (args: {
		nextContext: TContext;
		promises: readonly UfoRrrPrefetchPromise[];
	}) => void;
};

export const UFO_RRR_PLUGIN_ID = 'ufo-rrr-plugin';

export function createUfoRrrPlugin<
	TContext extends UfoRrrRouterContext = UfoRrrRouterContext,
>(): UfoRrrPlugin<TContext> {
	const heldByKey = new Map<string, { promise: Promise<unknown> }>();
	const settledPromises = new WeakSet<Promise<unknown>>();

	return {
		id: UFO_RRR_PLUGIN_ID,
		onAfterRoutePrefetch: ({ nextContext, promises }) => {
			if (!fg('platform_ufo_preload_hold_adoption')) {
				return;
			}

			const name = nextContext.route.ufoName;
			if (!name || promises.length === 0) {
				return;
			}

			const routeIdentifier = nextContext.match.url;
			const query = nextContext.query;

			for (const prefetchPromise of promises) {
				if (settledPromises.has(prefetchPromise.promise)) {
					continue;
				}

				const source = `${prefetchPromise.pluginId}-${prefetchPromise.key}`;
				const key = makePreloadKey({ name, routeIdentifier, query, source });
				if (heldByKey.get(key)?.promise === prefetchPromise.promise) {
					continue;
				}

				const release = beginUFOPreloadHold({
					name,
					source,
					preloadStartedAt: prefetchPromise.startedAt,
					routeIdentifier,
					query,
				});
				const registration = { promise: prefetchPromise.promise };
				heldByKey.set(key, registration);

				const onSettled = () => {
					settledPromises.add(prefetchPromise.promise);
					if (heldByKey.get(key) === registration) {
						heldByKey.delete(key);
					}
					release();
				};

				// Avoid the rejected promise returned by `finally`.
				void prefetchPromise.promise.then(onSettled, onSettled);
			}
		},
	};
}
