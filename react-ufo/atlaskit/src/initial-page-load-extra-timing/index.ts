import { withProfiling } from '../self-measurements';

export type ReportedTiming = { startTime: number; duration: number };

export type ReportedTimings = {
	[key: string]: ReportedTiming;
};

type TimingsFromPerformanceMark = {
	name: string;
	startMark: string;
	stopMark: string;
	cleanStart?: boolean;
	cleanStop?: boolean;
};
const timings: TimingsFromPerformanceMark[] = [];

export const addTimingFromPerformanceMark = withProfiling(function addTimingFromPerformanceMark(
	name: string,
	startMark: string,
	stopMark: string,
	cleanStart = false,
	cleanStop = false,
) {
	timings.push({
		name,
		startMark,
		stopMark,
		cleanStart,
		cleanStop,
	});
});

export const getTimings = withProfiling(function getTimings(): ReportedTimings {
	const reportedTimingsObj: ReportedTimings = {};
	timings.forEach(({ name, startMark, stopMark, cleanStart, cleanStop }) => {
		const startEntryList = performance.getEntriesByName(startMark);
		const stopEntryList = performance.getEntriesByName(stopMark);

		if (startEntryList?.length > 0 && stopEntryList?.length > 0) {
			const startEntry = startEntryList[startEntryList.length - 1];
			const stopEntry = stopEntryList[stopEntryList.length - 1];

			const { startTime } = startEntry;
			const duration = stopEntry.startTime - startTime;
			const timing = {
				startTime: Math.round(startTime),
				duration: Math.round(duration),
			};

			reportedTimingsObj[name] = timing;
		}
		if (cleanStart) {
			performance.clearMarks(startMark);
		}
		if (cleanStop) {
			performance.clearMarks(stopMark);
		}
	});
	return reportedTimingsObj;
});
