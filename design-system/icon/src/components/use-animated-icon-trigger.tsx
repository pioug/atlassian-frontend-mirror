import { useContext } from 'react';

import { AnimatedIconContext, type AnimatedIconContextValue } from './animated-icon-context';

/**
 * Returns the state of the nearest `AnimatedIconTrigger`, or `undefined` when there is none.
 *
 * The trigger only signals. Each animated icon decides how to respond, calls `start()` when it
 * begins, and calls the `done` function it returns when it has finished.
 */
export const useAnimatedIconTrigger = (): AnimatedIconContextValue | undefined =>
	useContext(AnimatedIconContext);
