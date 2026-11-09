import { useCallback, useLayoutEffect, useState } from 'react';

import { checkAICreditStatus } from './checkAICreditStatus';
import type { AICreditCheck, AICreditStatus, GetAICreditStatus } from './types';

type CreditStatus = AICreditStatus;
export type BlockedCreditStatus = Extract<CreditStatus, { isBlocked: true }>;

export type AICreditGuard = {
	check: (creditCheck: AICreditCheck, options?: { showFeedback?: boolean }) => boolean;
	close: () => void;
	feedback: BlockedCreditStatus | null;
	isBlocked: boolean;
};

/** Shares advisory checks and feedback state without owning action execution or selection. */
export const useAICreditGuard = (
	getAICreditStatus: GetAICreditStatus,
	isActive = true,
): AICreditGuard => {
	const [feedback, setFeedback] = useState<BlockedCreditStatus | null>(null);
	const [isBlocked, setIsBlocked] = useState(false);
	const close = useCallback(() => setFeedback(null), []);
	useLayoutEffect(() => {
		if (!isActive) {
			close();
			setIsBlocked(false);
		}
	}, [isActive, close]);
	const check = useCallback(
		(
			creditCheck: AICreditCheck,
			{ showFeedback = true }: { showFeedback?: boolean } = {},
		): boolean => {
			if (!isActive) {
				return false;
			}
			const result = checkAICreditStatus(getAICreditStatus, creditCheck);
			setIsBlocked(result.isBlocked);
			if (showFeedback) {
				setFeedback(result.isBlocked ? result : null);
			}
			return !result.isBlocked;
		},
		[getAICreditStatus, isActive],
	);
	return { check, close, feedback, isBlocked };
};
