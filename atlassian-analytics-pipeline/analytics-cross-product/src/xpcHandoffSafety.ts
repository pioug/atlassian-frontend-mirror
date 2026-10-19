import type { XpcFinalSinkHandoff } from './xpcFinalSinkDepartureCapture';

export const reportXpcFinalSinkHandoffSafely = (
	observer: ((handoff: XpcFinalSinkHandoff) => void) | undefined,
	handoff: XpcFinalSinkHandoff,
): void => {
	try {
		observer?.(handoff);
	} catch {
		// Observation must never affect navigation.
	}
};
