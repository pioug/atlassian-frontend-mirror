import { timings } from './timings';

export function addTimingFromPerformanceMark(
	name: string,
	startMark: string,
	stopMark: string,
	cleanStart = false,
	cleanStop = false,
): void {
	timings.push({
		name,
		startMark,
		stopMark,
		cleanStart,
		cleanStop,
	});
}
