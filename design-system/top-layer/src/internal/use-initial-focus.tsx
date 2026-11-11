import { type RefObject, useCallback, useRef } from 'react';

import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';

import { applyInitialFocus } from '../apply-initial-focus';

type TInitialFocusInputs = {
	isEnabled: boolean;
	initialFocusRef: RefObject<HTMLElement | null> | undefined;
	role: string | undefined;
};

/**
 * Returns `takeInitialFocus`, which moves focus into the layer by its role (see
 * `getInitialFocusTarget`). Call it right after the layer shows, in the same layout effect pass.
 *
 * It reads the latest inputs, so call it from the effect that shows the layer. That effect runs
 * when the layer opens (also when it reopens during its exit) and when React creates the effect
 * again while the layer stays open (strict mode, a Suspense or Activity reveal). Other renders, for
 * example `entering` to `open` or a new `role`, do not move focus.
 */
export function useInitialFocus({
	elementRef,
	isEnabled,
	initialFocusRef,
	role,
}: {
	elementRef: RefObject<HTMLElement | null>;
	isEnabled: boolean;
	initialFocusRef?: RefObject<HTMLElement | null>;
	role: string | undefined;
}): () => undefined {
	// Kept current in a layout effect that is declared before the show effect, so it is current there.
	const inputsRef = useRef<TInitialFocusInputs>({ isEnabled, initialFocusRef, role });
	useLayoutEffect(() => {
		inputsRef.current = { isEnabled, initialFocusRef, role };
	}, [isEnabled, initialFocusRef, role]);

	return useCallback(() => {
		const element = elementRef.current;
		const inputs = inputsRef.current;
		if (!element || !inputs.isEnabled) {
			return undefined;
		}
		applyInitialFocus({
			container: element,
			initialFocusRef: inputs.initialFocusRef,
			role: inputs.role,
		});
		return undefined;
	}, [elementRef]);
}
