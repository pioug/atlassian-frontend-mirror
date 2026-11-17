import type { AICreditCheck, AICreditStatus, GetAICreditStatus } from './types';

export type AICreditStatusReader = (
	context: AICreditCheck,
) => ReturnType<GetAICreditStatus> | undefined;

/** Editor consumes cached decisions synchronously; legacy async providers fail open. */
export const checkAICreditStatus = (
	getAICreditStatus: AICreditStatusReader | undefined,
	creditCheck: AICreditCheck,
): AICreditStatus => {
	try {
		const result = getAICreditStatus?.(creditCheck);
		if (!result) {
			return { isBlocked: false };
		}
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
