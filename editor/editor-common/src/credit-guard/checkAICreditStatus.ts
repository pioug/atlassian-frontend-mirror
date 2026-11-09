import type { AICreditCheck, AICreditStatus, GetAICreditStatus } from './types';

/** Editor consumes cached decisions synchronously; legacy async providers fail open. */
export const checkAICreditStatus = (
	getAICreditStatus: GetAICreditStatus,
	creditCheck: AICreditCheck,
): AICreditStatus => {
	try {
		const result = getAICreditStatus(creditCheck);
		if ('then' in result) {
			// Temporary compatibility: never defer an Editor action or apply a late decision.
			void result.catch(() => {});
			return { isBlocked: false };
		}
		return result;
	} catch {
		// Advisory checks fail open; action backends remain authoritative.
		return { isBlocked: false };
	}
};
