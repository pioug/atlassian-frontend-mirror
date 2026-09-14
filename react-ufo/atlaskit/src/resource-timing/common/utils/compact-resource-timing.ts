import type { ResourceTiming } from '../types';

export type LegacyResourceTimingEntry = {
	label: string;
	data: ResourceTiming;
};

export type CompactResourceTimingEntry = {
	/** label */
	l: string;
	/** resource type */
	rt: number | string;
	/** startTime */
	st: number;
	/** duration */
	du: number;
	/** workerStart */
	ws: number;
	/** fetchStart */
	fs: number;
	/** ttfb */
	tb?: number;
	/** requestStart */
	rq?: number;
	/** transferType */
	tr?: number | string | null;
	/** serverTime */
	sv?: number;
	/** networkTime */
	nw?: number;
	/** encodedSize */
	es?: number | null;
	/** decodedSize */
	ds?: number | null;
	/** size */
	sz?: number;
	/** count */
	ct?: number;
};

export type CompactResourceTimings = {
	v: 1;
	r: CompactResourceTimingEntry[];
};
