import { useCallback } from 'react';

import { checkAICreditStatus } from './checkAICreditStatus';
import type { AICreditCheck, EditorAICreditStatusProvider } from './types';

/** Recheck synchronously at activation using the same shared guard as other Editor actions. */
export const useCreditCheckedAction = (
	provider: EditorAICreditStatusProvider | undefined,
	featureName: AICreditCheck['featureName'],
): ((action: () => void) => void) => {
	const getAICreditStatus = provider?.getAICreditStatus;
	return useCallback(
		(action: () => void) => {
			if (
				!getAICreditStatus ||
				!checkAICreditStatus(getAICreditStatus, { featureName }).isBlocked
			) {
				action();
			}
		},
		[getAICreditStatus, featureName],
	);
};
