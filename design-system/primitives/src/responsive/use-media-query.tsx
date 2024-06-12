import { useEffect, useLayoutEffect, useRef } from 'react';

import { bind } from 'bind-event-listener';

import { UNSAFE_media } from './media-helper';

type NestedQueryString =
	| `above.${keyof typeof UNSAFE_media.above}`
	| `below.${keyof typeof UNSAFE_media.below}`;

type Queries = Record<NestedQueryString, MediaQueryList | undefined>;

const queries: Queries = {
	'above.xxs':
		typeof window === 'undefined'
			? undefined
			: window?.matchMedia?.(UNSAFE_media.above.xxs.replace('@media ', '').trim()),
	'above.xs':
		typeof window === 'undefined'
			? undefined
			: window?.matchMedia?.(UNSAFE_media.above.xs.replace('@media ', '').trim()),
	'above.sm':
		typeof window === 'undefined'
			? undefined
			: window?.matchMedia?.(UNSAFE_media.above.sm.replace('@media ', '').trim()),
	'above.md':
		typeof window === 'undefined'
			? undefined
			: window?.matchMedia?.(UNSAFE_media.above.md.replace('@media ', '').trim()),
	'above.lg':
		typeof window === 'undefined'
			? undefined
			: window?.matchMedia?.(UNSAFE_media.above.lg.replace('@media ', '').trim()),
	'above.xl':
		typeof window === 'undefined'
			? undefined
			: window?.matchMedia?.(UNSAFE_media.above.xl.replace('@media ', '').trim()),
	'below.xs':
		typeof window === 'undefined'
			? undefined
			: window?.matchMedia?.(UNSAFE_media.below.xs.replace('@media ', '').trim()),
	'below.sm':
		typeof window === 'undefined'
			? undefined
			: window?.matchMedia?.(UNSAFE_media.below.sm.replace('@media ', '').trim()),
	'below.md':
		typeof window === 'undefined'
			? undefined
			: window?.matchMedia?.(UNSAFE_media.below.md.replace('@media ', '').trim()),
	'below.lg':
		typeof window === 'undefined'
			? undefined
			: window?.matchMedia?.(UNSAFE_media.below.lg.replace('@media ', '').trim()),
	'below.xl':
		typeof window === 'undefined'
			? undefined
			: window?.matchMedia?.(UNSAFE_media.below.xl.replace('@media ', '').trim()),
};

/**
 * A hook which returnes a `window.matchMedia` result to help you build responsively around breakpoints in JavaScript.
 *
 * The returning value **WILL NOT** update or react to change.  You can use `mq.matches` to get the latest version and you can use the optional listener argument to react to changes as desired.
 *
 * @important
 *  - This will always be `null` in SSR and the event listener should not fire on SSR => clientside hydration.
 *  - `above.xxs` will always be truthy, your listener should never fire.
 *
 * @experimental This hook only works on the client-side and is not safe in an SSR environment as `window` is unavailable (and the user's viewport would be unknown)
 *
 * @example
 * const mq = useMediaQuery('below.md', useCallback((event) => console.log('changed', event.matches)), []))
 * const isMobile = mq?.matches;
 *
 * @returns
 *  - `MediaQueryList`, primarily used to get if that media query is currently
 *  - `null` when `matchMedia` is unavailable, eg. in SSR.
 */
export const UNSAFE_useMediaQuery = (
	queryString: NestedQueryString,
	listener?: (event: MediaQueryListEvent) => void,
) => {
	const listenerRef = useRef<typeof listener>(listener);
	useEffect(() => {
		// Bind the listener if changed so it's called on the next change event; no guarantee on timing.
		listenerRef.current = listener;
	}, [listener]);

	/**
	 * We explicitly only react to boolean changes for binding our listener
	 * Changes to the functional reference are ignored.
	 */
	const hasListener = !!listener;

	/**
	 * The `matchMedia(…)` return value for our breakpoint query.
	 */
	const mq = queries[queryString];

	useLayoutEffect(
		() => {
			listenerRef.current = listener; // Bind the listener now in case the `useEffect` hasn't fired above yet
			if (!mq || !hasListener || !listenerRef.current) {
				return;
			}

			return bind(mq, {
				type: 'change',
				listener: (event) => {
					// We explicitly call the current version of the function
					return listenerRef.current!(event);
				},
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps -- explicitly do not trigger the effect on `listener` reference change, only on a boolean representation of it.
		[mq, hasListener],
	);

	return mq || null;
};
