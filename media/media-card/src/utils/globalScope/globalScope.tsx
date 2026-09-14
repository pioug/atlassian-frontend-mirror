import { type MediaCardSsr } from './types';

// ----- WARNING -----
// This is a very sensitive fraction of code.
// Any changes to this file must be tested directly in product before merging.
// The scripts printed here might differ from what we observe in our internal tests
// due to minimification, for example.
export const GLOBAL_MEDIA_CARD_SSR = 'mediaCardSsr';

export const GLOBAL_MEDIA_NAMESPACE = '__MEDIA_INTERNAL';

export const GLOBAL_MEDIA_PERFORMANCE_ENTRIES = 'performanceEntries';

export type MediaGlobalScope = {
	[GLOBAL_MEDIA_CARD_SSR]?: MediaCardSsr;
	[GLOBAL_MEDIA_PERFORMANCE_ENTRIES]?: PerformanceEntry[];
};
