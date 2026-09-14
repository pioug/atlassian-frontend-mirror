import { useCallback, useEffect, useRef } from 'react';

import { getHookDeps } from './get-hook-deps';
import type { Opts } from './opts';

// Handle both browser and Node.js environments
type TimeoutId = number | NodeJS.Timeout;

/**
 * Will return set  timeout as a function which will clean itself up.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const useSetTimeout = (
	opts: Opts = { cleanup: 'unmount' },
): ((handler: Function, timeout?: number | undefined, ...args: any[]) => void) => {
	const timeouts = useRef<TimeoutId[]>([]);

	useEffect(() => {
		return () => {
			if (timeouts.current.length) {
				timeouts.current.forEach((id) => clearTimeout(id));
				timeouts.current = [];
			}
		};
		// We dynamically set this so we either clean up on the next effect - or on unmount.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, getHookDeps(opts));

	return useCallback((handler: Function, timeout?: number | undefined, ...args: any[]) => {
		const id = setTimeout(
			() => {
				timeouts.current = timeouts.current.filter((timeoutId) => timeoutId !== id);
				handler();
			},
			timeout,
			...args,
		);
		timeouts.current.push(id);
	}, []);
};
