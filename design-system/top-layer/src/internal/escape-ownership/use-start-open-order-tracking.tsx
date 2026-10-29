import { useInsertionEffect } from 'react';

import { openOrderTracker } from './open-order-tracker';

/**
 * Starts open order tracking (see `openOrderTracker`). Every Escape stack hook calls it, so
 * tracking runs before its layer opens.
 */
export function useStartOpenOrderTracking(): undefined {
	// Why `useInsertionEffect`:
	// - It must run before any popover or dialog in this commit opens. `Popover` and `Dialog` open in
	//   layout effects, and React runs child effects first, so our own `useLayoutEffect` can run after
	//   a child layer has opened. React runs every insertion effect of a commit before any layout
	//   effect.
	// - Not during render: render also runs on the server, and binding a `document` listener there
	//   breaks SSR in a DOM test environment. Effects never run on the server.
	useInsertionEffect(() => {
		openOrderTracker.start();
	}, []);
}
