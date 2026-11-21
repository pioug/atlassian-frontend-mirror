import { useContext, useSyncExternalStore } from 'react';

import { SmartCardContext } from '@atlaskit/link-provider/context';

const subscribe = () => () => {};
const getClientSnapshot = () => false;

/** Use deterministic content during SSR/hydration in Confluence only. */
export default function useHydrationSafeContent(isEligible = true): boolean {
	const product = useContext(SmartCardContext)?.product;

	return useSyncExternalStore(
		subscribe,
		getClientSnapshot,
		() => isEligible && product === 'CONFLUENCE',
	);
}
