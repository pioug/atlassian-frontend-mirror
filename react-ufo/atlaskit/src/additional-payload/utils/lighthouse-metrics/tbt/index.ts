import { withProfiling } from '../../../../self-measurements';
import type { PerformanceEntryBuffer } from '../utils/buffer';

const MAX_ACCEPTABLE_TASK_DURATION = 50;
export const getTBT = withProfiling(function getTBT(
	start: number,
	stop: number,
	buffer: PerformanceEntryBuffer,
) {
	return buffer
		.getAll()
		.filter(
			(entry) =>
				entry.startTime <= stop &&
				entry.duration > MAX_ACCEPTABLE_TASK_DURATION &&
				(entry.startTime >= start ||
					entry.startTime + entry.duration >= start ||
					(entry.startTime <= start && entry.startTime + entry.duration >= stop)),
		)
		.reduce(
			(tbt, entry) => {
				const longTaskStop = entry.startTime + entry.duration;
				const intersectStart = Math.max(entry.startTime + MAX_ACCEPTABLE_TASK_DURATION, start);
				const intersectStop = Math.min(longTaskStop, stop);
				const longTaskIncluded = Math.max(intersectStop - intersectStart, 0);
				// eslint-disable-next-line no-param-reassign
				tbt.observed += entry.duration - MAX_ACCEPTABLE_TASK_DURATION;
				// eslint-disable-next-line no-param-reassign
				tbt.total += longTaskIncluded;

				return tbt;
			},
			{ total: 0, observed: 0 },
		);
});
