import * as resourceTiming from '../resource-timing';

export function getResourceTimings(start: number, end: number): any {
	return resourceTiming.getResourceTimings(start, end) ?? undefined;
}
