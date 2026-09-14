export type PendingPreloadHold = {
	key: string;
	preloadKey: string;
	overwriteKey: string;
	name: string;
	source: string;
	preloadStartedAt: number;
	release: () => void;
	settled: boolean;
	overridden: boolean;
	adoptedRelease?: () => void;
};

type PreloadHoldState = {
	pending: Map<string, PendingPreloadHold>;
	adoptionHookRegistered: boolean;
	registryKeySequence: number;
};

export const preloadHoldState: PreloadHoldState = {
	pending: new Map<string, PendingPreloadHold>(),
	adoptionHookRegistered: false,
	registryKeySequence: 0,
};
