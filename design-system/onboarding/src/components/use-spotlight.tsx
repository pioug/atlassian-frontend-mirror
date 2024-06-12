import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { SpotlightContext } from './spotlight-manager';

/**
 * Use spotlight hook returns information about available spotlight targets.
 */
export default function useSpotlight() {
	const { targets } = useContext(SpotlightContext);
	const targetRef = useRef(targets);

	useEffect(() => {
		targetRef.current = targets;
	}, [targets]);

	const isTargetRendered = useCallback((target: string) => !!targetRef.current[target], []);

	return useMemo(
		() => ({
			isTargetRendered,
		}),
		[isTargetRendered],
	);
}
