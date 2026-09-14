type MappedPerformanceMark = { type: 'start' | 'end'; name: string };

export type BundleEvalTimingsConfig = {
	mapPerformanceMark: (mark: string) => MappedPerformanceMark | null;
};

export type ReportedTimings = {
	[key: string]: { startTime: number; duration: number };
};
