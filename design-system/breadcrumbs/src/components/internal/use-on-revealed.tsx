import { useEffect } from 'react';

import usePreviousValue from '@atlaskit/ds-lib/use-previous-value';

interface OnRevealedParams {
	/**
	 * Current state of breadcrumbs.
	 */
	isExpanded: boolean;
	/**
	 * Used to disable callback invoking
	 */
	isDisabled: boolean;
}

/**
 * The hook is used to invoke callback after breadcrumbs is revealed.
 *
 * The hook checks if previous state of breadcrumbs was collapsed and current state is expanded
 * and if so invoke received callback.
 *
 * @param callback the function to invoke after revealing
 * @param param1 the object that contain two field:
 *    1) isExpanded - current state of breadcrumbs
 *    2) isDisabled - to disable the callback.
 */
export function useOnRevealed(callback: () => void, { isExpanded, isDisabled }: OnRevealedParams) {
	const prevExtended = usePreviousValue<boolean>(isExpanded);

	useEffect(() => {
		const hasBeenRevealed = !prevExtended && isExpanded;
		if (!isDisabled && hasBeenRevealed) {
			callback();
		}
	}, [isExpanded, isDisabled, callback, prevExtended]);
}
