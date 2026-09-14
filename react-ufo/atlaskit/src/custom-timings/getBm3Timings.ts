import type { BM3Marks, BM3TimingsConfig } from './index';

export function getBm3Timings(
	marks?: BM3Marks,
	timingConfigs?: BM3TimingsConfig[],
): {
	[key: string]: {
		startTime: number;
		endTime: number;
	};
} {
	const bm3Timings: { [key: string]: { startTime: number; endTime: number } } = {};
	if (!marks || !timingConfigs) {
		return bm3Timings;
	}
	timingConfigs.forEach((item) => {
		if (!item.startMark || !item.endMark) {
			return;
		}
		const startTime = marks[item.startMark];
		if (!startTime) {
			return;
		}
		const endTime = marks[item.endMark];
		if (!endTime) {
			return;
		}
		bm3Timings[item.key] = { startTime, endTime };
	});
	return bm3Timings;
}
