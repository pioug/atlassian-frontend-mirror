import { type RefObject, useCallback, useRef } from 'react';

import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';

import { setInitialFocus } from './set-initial-focus';

type TInitialFocusInputs = {
	isEnabled: boolean;
	initialFocusRef: RefObject<HTMLElement | null> | undefined;
	role: string | undefined;
};

/**
 * Returns `setInitialFocus` for the layer (see `set-initial-focus.tsx` for the rules). Call it
 * once the layer has shown and its content effects have run. It does nothing when focus is already
 * inside the layer.
 *
 * It reads the latest inputs. Call it when the layer opens (also when it reopens during its exit)
 * and when React creates the show effect again while the layer stays open (strict mode, a Suspense
 * or Activity reveal). Other renders, for example `entering` to `open` or a new `role`, do not move
 * focus.
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
}): () => void {
	// Kept current in a layout effect that is declared before the show effect, so it is current there.
	const inputsRef = useRef<TInitialFocusInputs>({ isEnabled, initialFocusRef, role });
	useLayoutEffect(() => {
		inputsRef.current = { isEnabled, initialFocusRef, role };
	}, [isEnabled, initialFocusRef, role]);

	return useCallback((): void => {
		const element = elementRef.current;
		const inputs = inputsRef.current;
		if (!element || !inputs.isEnabled) {
			return;
		}
		setInitialFocus({
			container: element,
			initialFocusRef: inputs.initialFocusRef,
			role: inputs.role,
		});
	}, [elementRef]);
}
