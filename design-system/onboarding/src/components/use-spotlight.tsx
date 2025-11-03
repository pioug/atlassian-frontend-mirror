import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { SpotlightContext } from './spotlight-manager';

/**
 * Use spotlight hook returns information about available spotlight targets.
 *
 * @deprecated Use `@atlaskit/spotlight` instead.
 */
export default function useSpotlight() {
	const { targets } = useContext(SpotlightContext);
	const targetRef = useRef(targets);

	useEffect(() => {
		targetRef.current = targets;
	}, [targets]);

	const isTargetRendered = useCallback((target: string) => !!targetRef.current[target], []);

	const checkVisibility = useCallback(
		(target: string) => (options?: CheckVisibilityOptions) =>
			targetRef.current[target]?.checkVisibility?.(options) ?? false,
		[],
	);

	return useMemo(
		() => ({
			isTargetRendered,
			checkVisibility,
		}),
		[isTargetRendered, checkVisibility],
	);
}
