import { useContext, useEffect, useLayoutEffect as useRealLayoutEffect } from 'react';

import InteractionContext from '@atlaskit/interaction-context';

/**
 * `useLayoutEffect` in SSR-safe form, matching `LoadingBar` and the DS interaction-tracing
 * convention.
 *
 * @see https://hello.atlassian.net/wiki/spaces/DST/pages/2081696628/DSTDACI-010+-+Interaction+Tracing+hooks+in+DS+components
 */
const useLayoutEffect = typeof window === 'undefined' ? useEffect : useRealLayoutEffect;

export type LoadingHoldProps = {
	interactionName?: string;
};

/**
 * Holds the in-progress interaction while a card is loading, without drawing anything.
 *
 * `LoadingBar` and `Spinner` each own a hold for as long as they are mounted. Cards that
 * express loading through motion instead still need the interaction held for the same window,
 * so this stands in for them under the same `interactionName` — mounted and unmounted at the
 * same points, so UFO traces stay comparable either way.
 */
export const LoadingHold = ({ interactionName }: LoadingHoldProps): null => {
	const interactionContext = useContext(InteractionContext);

	useLayoutEffect(() => {
		if (interactionContext != null) {
			return interactionContext.hold(interactionName);
		}
	}, [interactionContext, interactionName]);

	return null;
};
