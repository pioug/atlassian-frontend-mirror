import { useEffect, useState } from 'react';

import type { useMotion } from '@atlaskit/motion/entering/use-motion';

/**
 * Keep the delayed content fade attached after the shorter panel slide finishes.
 */
export function usePanelContentEnter(state: ReturnType<typeof useMotion>['state']): boolean {
	const [hasEntered, setHasEntered] = useState(state === 'entering');

	useEffect(() => {
		if (state !== 'visible') {
			setHasEntered(state === 'entering');
		}
	}, [state]);

	// Exit/hidden removes the animation so reopening starts a fresh fade. A panel
	// initially mounted as visible should not gain an entrance animation.
	return state === 'entering' || (state === 'visible' && hasEntered);
}
