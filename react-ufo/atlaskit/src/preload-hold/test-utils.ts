import { setPreloadHoldAdoptionHook } from '../interaction-metrics';

import { preloadHoldState } from './state';

function clearPendingPreloadHolds(): void {
	preloadHoldState.pending.clear();
	preloadHoldState.adoptionHookRegistered = false;
	preloadHoldState.registryKeySequence = 0;
	setPreloadHoldAdoptionHook(null);
}

function getPendingPreloadHoldsSize(): number {
	return preloadHoldState.pending.size;
}

type PreloadHoldTestUtils = {
	clearPendingPreloadHolds: () => void;
	getPendingPreloadHoldsSize: () => number;
};

export const preloadHoldTestUtils: PreloadHoldTestUtils = {
	clearPendingPreloadHolds,
	getPendingPreloadHoldsSize,
};
