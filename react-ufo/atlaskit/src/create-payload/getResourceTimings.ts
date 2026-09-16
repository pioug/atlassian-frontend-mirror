import { getResourceTimings as getBufferedResourceTimings } from '../resource-timing/main';

export function getResourceTimings(start: number, end: number): any {
	return getBufferedResourceTimings(start, end) ?? undefined;
}
