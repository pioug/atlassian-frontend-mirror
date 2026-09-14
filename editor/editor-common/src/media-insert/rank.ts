import { MEDIA_INSERT_TAB } from '../analytics/types/enums';

export const DEFAULT_MEDIA_INSERT_TAB_RANK = 0;

export const MEDIA_INSERT_TAB_RANK: Readonly<Record<MEDIA_INSERT_TAB, number>> = {
	[MEDIA_INSERT_TAB.UPLOAD]: 100,
	[MEDIA_INSERT_TAB.LINK]: 200,
	[MEDIA_INSERT_TAB.CREATE]: 300,
} as const;
