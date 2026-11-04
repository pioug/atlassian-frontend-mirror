import { useSyncExternalStore } from 'react';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

const subscribe = () => () => {};
const getClientSnapshot = () => false;

/** Use deterministic content only during SSR/hydration in the experiment treatment. */
export default function useHydrationSafeContent(isEligible = true): boolean {
	return useSyncExternalStore(
		subscribe,
		getClientSnapshot,
		// React only reads this snapshot during SSR/hydration, so client-only mounts
		// never fire an exposure. Control matches the client snapshot and needs no update.
		() => isEligible && isExperimentEnabled('platform_sl_hydration_safe_content'),
	);
}
