import { useEffect, useState } from 'react';

import { checkAICreditStatus } from './checkAICreditStatus';
import type { AICreditCheck, AICreditStatus, EditorAICreditStatusProvider } from './types';

const available: AICreditStatus = { isBlocked: false };

/** Reuses cached product decisions; notifications preserve live depletion and recovery. */
export const useAICreditStatus = (
	provider: EditorAICreditStatusProvider | undefined,
	featureName: AICreditCheck['featureName'],
	isActive = true,
): AICreditStatus => {
	const getAICreditStatus = provider?.getAICreditStatus;
	const subscribe = provider?.subscribeToAICreditStatus;
	const [status, setStatus] = useState<AICreditStatus>(() =>
		isActive && getAICreditStatus
			? checkAICreditStatus(getAICreditStatus, { featureName })
			: available,
	);

	useEffect(() => {
		if (!isActive) return;
		const refresh = () => {
			setStatus(
				getAICreditStatus ? checkAICreditStatus(getAICreditStatus, { featureName }) : available,
			);
		};
		const unsubscribe = subscribe?.(refresh);
		refresh();
		return unsubscribe;
	}, [featureName, getAICreditStatus, subscribe, isActive]);

	return isActive && getAICreditStatus ? status : available;
};
