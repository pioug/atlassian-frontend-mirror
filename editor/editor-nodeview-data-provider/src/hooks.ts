export function useNodeViewDataProvider() {
	// Implementation pending
}
import { useEffect, useMemo, useState } from 'react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { buildCaches } from './provider-cache';

import type { NodeViewDataProvider } from './index';

// re exported to avoid type issues
// this type is only used in jsdoc comments in this file.
export type { buildCaches as __doNotUseThisType };

/**
 * Access the value via {@link NodeViewDataProvider} when cached.
 *
 * It will return the value of the provider if it is already available.
 *
 * For more information on building caches, see {@link buildCaches}.
 *
 * @example
 * ```ts
 * await buildCaches({ adf, oneTickProviders: [emojiNodeViewDataProvider] });
 * const value = useNodeViewDataProviderValue({ provider: emojiNodeViewDataProvider, node });
 * if (value) {
 *  return <SinglePassRenderEmoji emoji={value} />;
 * }
 * return <LegacyMultiPassRenderEmoji node={node} />;
 * ```
 */
export function useNodeViewDataProviderValue<
	// This is a generic type, so it can be anything
	// It's expected the type will be inferred from the provider passed in
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	_NodeViewDataProvider extends NodeViewDataProvider<any, any>,
>(options: { provider: _NodeViewDataProvider; node: PMNode }) {
	const providerValue = useMemo(
		() => options.provider!.cache[options.provider.nodeToKey(options.node)],
		[options.provider, options.node],
	);

	return providerValue;
}

// The following hooks are not expected to be used with the initial experimentation of the NodeViewDataProvider
// and are not covered in the initial tests.
// They are provided as a reference

/**
 *
 *
 * This hook is intended to simplify accessing data via the one tick providers.
 *
 * ```ts
 * const value = useNodeViewDataProviderGet(emojiProvider, emojiNode);
 *
 * if (value.state === 'loading') {
 *   return <Loading />;
 * }
 * if (value.state === 'failed') {
 *  return <Fallback />;
 * }
 * return <Emoji properties=(value.result) />
 * ```
 */
export function useNodeViewDataProviderGet<
	// @ts-ignore
	_NodeViewDataProvider extends NodeViewDataProvider<any, any>,
>(options: { provider: _NodeViewDataProvider; node: PMNode }) {
	const getResult = useMemo(
		() => options.provider!.get(options.node),
		[options.provider, options.node],
	);

	let [resolved, setResolved] = useState<
		_NodeViewDataProvider['cache'][string] | undefined | 'error'
	>(getResult !== undefined && !isPromise(getResult) ? getResult : undefined);

	useEffect(() => {
		if (!isPromise(getResult)) {
			return;
		}

		let cancelled = false;

		(async function () {
			try {
				let resolved = await getResult;
				if (!cancelled) {
					setResolved(resolved);
				}
			} catch {
				setResolved('error');
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [getResult]);

	if (resolved === undefined) {
		return { state: 'loading' as const, result: undefined };
	}

	if (resolved === 'error') {
		return { state: 'failed' as const, result: undefined };
	}

	return { state: 'resolved' as const, result: resolved };
}

function isPromise<T>(obj: Promise<T | undefined> | T): obj is Promise<T | undefined> {
	return (
		!!obj &&
		(typeof obj === 'object' || typeof obj === 'function') &&
		// @ts-ignore
		typeof obj.then === 'function'
	);
}
