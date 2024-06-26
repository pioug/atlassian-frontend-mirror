/* eslint-disable @repo/internal/react/disallow-unstable-values */
import { useRef } from 'react';

/**
 * Will return a unique id that does not change between renders.
 * Try not use this to render DOM markup (attributes or otherwise)
 * as you will probably not get the same result on the Server vs. Client.
 */
export function useUniqueId(): string {
	const identifier = useRef('');
	if (!identifier.current) {
		identifier.current =
			'_' +
			(
				Number(String(Math.random()).slice(2)) +
				Date.now() +
				Math.round(performance.now())
			).toString(36);
	}

	return identifier.current;
}
