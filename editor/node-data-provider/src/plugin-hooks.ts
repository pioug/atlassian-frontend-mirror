import { useEffect, useMemo, useState } from 'react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { NodeDataProvider } from './index';

/**
 *
 *
 * This hook is intended to simplify accessing data via the one tick providers.
 *
 * ```ts
 * const value = useNodeDataProviderGet(emojiProvider, emojiNode);
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
export function useNodeDataProviderGet<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	_NodeDataProvider extends NodeDataProvider<any, any>,
>(options: {
	provider: _NodeDataProvider;
	node: PMNode;
}):
	| { state: 'loading'; result: undefined }
	| { state: 'failed'; result: undefined }
	| { state: 'resolved'; result: _NodeDataProvider['cache'][string] } {
	const getResult = useMemo(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		() => options.provider!.get(options.node),
		[options.provider, options.node],
	);

	let [resolved, setResolved] = useState<_NodeDataProvider['cache'][string] | undefined | 'error'>(
		getResult !== undefined && !isPromise(getResult) ? getResult : undefined,
	);

	useEffect(() => {
		if (!isPromise(getResult)) {
			return;
		}

		let cancelled = false;

		(async function () {
			try {
				let resolved = await getResult;
				if (!cancelled) {
					if (resolved === undefined) {
						setResolved('error');
					} else {
						setResolved(resolved);
					}
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
