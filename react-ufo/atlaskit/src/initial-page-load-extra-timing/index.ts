export type ReportedTiming = { startTime: number; duration: number };

export type ReportedTimings = {
	[key: string]: ReportedTiming;
};

export type TimingsFromPerformanceMark = {
	name: string;
	startMark: string;
	stopMark: string;
	cleanStart?: boolean;
	cleanStop?: boolean;
};
