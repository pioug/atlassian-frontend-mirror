import type { InteractionGroupSnapshot } from '../analytics/interactivity-snapshot';

import { bucketKeyForMs, REPORTING_THRESHOLD_MS } from './bucket-boundaries';
import type { InteractionUpdate } from './interaction-tracker';

/**
 * Latencies are counted per 8 ms, the resolution Event Timing reports durations at. Every
 * latency is rounded up to this step on the way in, which caps the number of distinct values
 * a group can hold whatever the latency was derived from.
 */
const RESOLUTION_MS = 8;

/** Which percentiles are reported, as quantiles. */
const REPORTED_QUANTILES = [0.9, 0.98];

/**
 * The latencies of one set of interactions — every interaction on the page, or only the ones
 * inside the editor — reported as one object in the event.
 *
 * The whole state is a count per distinct latency, so an interaction only costs a counter
 * whatever its latency was, and everything the event carries — the reported buckets, the
 * count, the sum, the maximum and the percentiles — is derived from that map when a snapshot
 * is taken. Nothing is computed while interactions arrive.
 *
 * The two counters count different populations: `trackInteractionUpdate` takes the interactions
 * Event Timing measured, `countTotal` takes all of them, including the ones below the 16 ms
 * reporting threshold it never delivers. So `totalCount >= observedCount`, and the difference is how
 * many were too fast to be measured.
 */
export class InteractionGroup {
	private countByLatency = new Map<number, number>();
	private totalCount = 0;

	/**
	 * Takes in what the tracker now says about an interaction: a new one is counted, and one measured
	 * again moves the count it already has.
	 *
	 * @returns whether the group changed.
	 */
	trackInteractionUpdate(update: InteractionUpdate): boolean {
		if (update.type === 'new') {
			this.add(update.latencyMs);
			return true;
		}

		return this.remeasure(update.previousLatencyMs, update.latencyMs);
	}

	add(latencyMs: number): void {
		this.increment(latencyMs);
	}

	/**
	 * Counts an interaction towards the group's total, measured or not. `page` has no use for it:
	 * `performance.interactionCount` counts the page's interactions.
	 */
	countTotal(): void {
		this.totalCount += 1;
	}

	/**
	 * @returns whether the count moved, which is `false` when both latencies fall in the step the
	 * interaction is already counted in — including when the interaction was measured no slower at
	 * all and only its boundaries moved.
	 */
	remeasure(previousLatencyMs: number, latencyMs: number): boolean {
		if (this.roundLatencyUp(previousLatencyMs) === this.roundLatencyUp(latencyMs)) {
			return false;
		}

		// Moved rather than counted again: the count belongs to the same interaction.
		this.decrement(previousLatencyMs);
		this.increment(latencyMs);

		return true;
	}

	/**
	 * @param totalCount every interaction of the group, including those below the Event Timing
	 * reporting threshold. Defaults to what `countTotal` was told, which is where an editor
	 * group's total comes from; `page` passes `performance.interactionCount` instead.
	 */
	snapshot(totalCount: number = this.totalCount): InteractionGroupSnapshot {
		const observedCount = this.observedCount();
		// `performance.interactionCount` can lag the entries the observer has delivered.
		const reportedTotalCount = Math.max(totalCount, observedCount);

		if (reportedTotalCount === 0) {
			return {
				totalCount: 0,
				observedCount: 0,
				sumMs: 0,
				maxMs: 0,
				buckets: {},
				percentilesMs: {},
			};
		}

		// Ascending, so the reported buckets come out in order and the last latency is the
		// maximum. Sorted once for everything below.
		const latencies = Array.from(this.countByLatency.keys()).sort((a, b) => a - b);

		// A percentile is the interaction at position `ceil(quantile * total)` of all interactions
		// sorted by latency. Event Timing never reports the ones under 16 ms, but they are the fastest,
		// so they fill the front of the line, and the rank is the position among the measured ones:
		//
		//   250 interactions, 150 of them unmeasured
		//
		//   position   1 ........... 150   | 151 ........... 245 .... 250
		//   latency    unmeasured, < 16 ms | 16 ms ............. measured
		//                                                    ^ p98
		//
		//   p98 is position ceil(0.98 * 250) = 245 of all, rank 245 - 150 = 95 among the measured.
		const unmeasuredCount = reportedTotalCount - observedCount;
		const percentileRanks = REPORTED_QUANTILES.map((quantile) => ({
			key: String(Math.round(quantile * 100)),
			rank: Math.ceil(quantile * reportedTotalCount) - unmeasuredCount,
		}));

		const buckets: Record<string, number> = {};
		const percentilesMs: Record<string, number> = {};
		let sumMs = 0;
		let counted = 0;

		// A rank of 0 or below is a latency Event Timing never reports, so the percentile gets the
		// lowest one it does.
		for (const { key, rank } of percentileRanks) {
			if (rank <= 0) {
				percentilesMs[key] = REPORTING_THRESHOLD_MS;
			}
		}

		for (const latencyMs of latencies) {
			const count = this.countByLatency.get(latencyMs) ?? 0;
			sumMs += latencyMs * count;

			const bucket = String(bucketKeyForMs(latencyMs));
			buckets[bucket] = (buckets[bucket] ?? 0) + count;

			// A percentile is the latency the group's interactions reach counting up from the
			// fastest, so it is answered as soon as this many of them have been passed.
			counted += count;
			for (const { key, rank } of percentileRanks) {
				if (percentilesMs[key] === undefined && counted >= rank) {
					percentilesMs[key] = latencyMs;
				}
			}
		}

		return {
			totalCount: reportedTotalCount,
			observedCount,
			sumMs,
			maxMs: latencies[latencies.length - 1] ?? 0,
			buckets,
			percentilesMs,
		};
	}

	private observedCount(): number {
		let total = 0;
		for (const count of this.countByLatency.values()) {
			total += count;
		}
		return total;
	}

	/** Rounding lives here so that every count goes through the same step, in or out. */
	private roundLatencyUp(latencyMs: number): number {
		return Math.ceil(latencyMs / RESOLUTION_MS) * RESOLUTION_MS;
	}

	private increment(latencyMs: number): void {
		const step = this.roundLatencyUp(latencyMs);

		this.countByLatency.set(step, (this.countByLatency.get(step) ?? 0) + 1);
	}

	private decrement(latencyMs: number): void {
		const step = this.roundLatencyUp(latencyMs);

		const next = (this.countByLatency.get(step) ?? 0) - 1;
		if (next > 0) {
			this.countByLatency.set(step, next);
		} else {
			this.countByLatency.delete(step);
		}
	}
}
