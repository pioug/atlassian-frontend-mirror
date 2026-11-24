import { InteractionGroup } from '../../collector/interaction-group';
import type { InteractionUpdate } from '../../collector/interaction-tracker';

/** Event Timing reports durations in 8ms steps, so real groups look like this. */
const latenciesOf = (count: number, from = 16) =>
	Array.from({ length: count }, (_, index) => from + index * 8);

describe('InteractionGroup', () => {
	it('reports everything the event carries about the group', () => {
		const group = new InteractionGroup();
		group.add(24);
		group.add(120);

		expect(group.snapshot(7)).toEqual({
			totalCount: 7,
			observedCount: 2,
			sumMs: 144,
			maxMs: 120,
			buckets: { '24': 1, '120': 1 },
			percentilesMs: { '90': 120, '98': 120 },
		});
	});

	it('reports nothing measured for a group with no interactions', () => {
		expect(new InteractionGroup().snapshot(0)).toEqual({
			totalCount: 0,
			observedCount: 0,
			sumMs: 0,
			maxMs: 0,
			buckets: {},
			percentilesMs: {},
		});
	});

	it('never reports fewer total than observed interactions', () => {
		const group = new InteractionGroup();
		group.add(24);
		group.add(32);

		// `performance.interactionCount` can lag the entries the observer has delivered.
		expect(group.snapshot(0).totalCount).toBe(2);
	});

	it('counts a latency that is not a multiple of 8ms in the step above it', () => {
		const group = new InteractionGroup();
		group.add(17);
		group.add(23);

		// Bounds the number of distinct latencies a group can hold, whatever they came from.
		// Event Timing already reports in 8ms steps, so nothing moves for the durations we get.
		expect(group.snapshot(2)).toMatchObject({ sumMs: 48, maxMs: 24, buckets: { '24': 2 } });
	});

	describe('buckets', () => {
		it('omits empty buckets and keys them by upper boundary', () => {
			const group = new InteractionGroup();
			group.add(24);
			group.add(24);
			group.add(216);

			expect(group.snapshot(3).buckets).toEqual({ '24': 2, '222': 1 });
		});

		it('is not cumulative', () => {
			const group = new InteractionGroup();
			group.add(24);
			group.add(120);
			group.add(600);

			expect(group.snapshot(3).buckets).toEqual({ '24': 1, '120': 1, '675': 1 });
		});

		it('moves a remeasured interaction between buckets without counting it twice', () => {
			const group = new InteractionGroup();
			group.add(24);
			group.remeasure(24, 120);

			expect(group.snapshot(1)).toMatchObject({ observedCount: 1, buckets: { '120': 1 } });
		});

		it('keeps other counts in a bucket a remeasured interaction leaves', () => {
			const group = new InteractionGroup();
			group.add(24);
			group.add(24);
			group.remeasure(24, 120);

			expect(group.snapshot(2).buckets).toEqual({ '24': 1, '120': 1 });
		});

		it('leaves the bucket alone when growth stays inside it', () => {
			const group = new InteractionGroup();
			group.add(17);
			group.remeasure(17, 23);

			expect(group.snapshot(1).buckets).toEqual({ '24': 1 });
		});
	});

	describe('count, sum and max', () => {
		it('reports the slowest interaction as the max', () => {
			const group = new InteractionGroup();
			group.add(600);
			group.add(24);

			expect(group.snapshot(2)).toMatchObject({ maxMs: 600 });
		});

		it('adds only the difference for an interaction that grew', () => {
			const group = new InteractionGroup();
			group.add(24);
			group.remeasure(24, 120);

			// Still one interaction, now measured at 120ms rather than 24ms.
			expect(group.snapshot(1)).toMatchObject({ observedCount: 1, sumMs: 120, maxMs: 120 });
		});
	});

	describe('percentiles', () => {
		it('reports the only interaction of a group', () => {
			const group = new InteractionGroup();
			group.add(120);

			expect(group.snapshot(1).percentilesMs).toEqual({ '90': 120, '98': 120 });
		});

		it('computes exact nearest-rank percentiles', () => {
			const group = new InteractionGroup();
			// 100 interactions: 16ms, 24ms, … 808ms.
			latenciesOf(100).forEach((latencyMs) => group.add(latencyMs));

			// The 90th of the 100 sorted latencies is 16 + 89 * 8, the 98th is 16 + 97 * 8.
			expect(group.snapshot(100).percentilesMs).toEqual({ '90': 728, '98': 792 });
		});

		it('does not depend on the order the interactions arrived in', () => {
			const group = new InteractionGroup();
			latenciesOf(100)
				.reverse()
				.forEach((latencyMs) => group.add(latencyMs));

			expect(group.snapshot(100).percentilesMs).toEqual({ '90': 728, '98': 792 });
		});

		it('counts repeated latencies rather than storing each one', () => {
			const group = new InteractionGroup();
			for (let index = 0; index < 95; index++) {
				group.add(24);
			}
			for (let index = 0; index < 5; index++) {
				group.add(600);
			}

			// The 90th latency is still one of the fast ones, the 98th is one of the slow ones.
			expect(group.snapshot(100).percentilesMs).toEqual({ '90': 24, '98': 600 });
		});

		it('stays exact for a group with far more interactions than distinct latencies', () => {
			const group = new InteractionGroup();
			// 50 000 interactions across 50 distinct latencies: 16ms, 24ms, … 408ms.
			for (let round = 0; round < 1000; round++) {
				latenciesOf(50).forEach((latencyMs) => group.add(latencyMs));
			}

			// Each distinct latency occurs 1000 times, so the 45 000th of 50 000 is the 45th
			// distinct latency, 16 + 44 * 8, and the 49 000th is the 49th.
			expect(group.snapshot(50_000).percentilesMs).toEqual({ '90': 368, '98': 400 });
		});

		it('ranks over the interactions too fast to be measured as well', () => {
			const group = new InteractionGroup();
			// 30 measured: 16ms, 24ms, … 248ms. 70 more were never delivered.
			latenciesOf(30).forEach((latencyMs) => group.add(latencyMs));

			// The 90th of 100 is the 20th measured, the 98th is the 28th — not the 30th.
			expect(group.snapshot(100).percentilesMs).toEqual({ '90': 168, '98': 232 });
		});

		it('reports the threshold for a percentile that falls among the unmeasured', () => {
			const group = new InteractionGroup();
			group.add(600);

			expect(group.snapshot(100).percentilesMs).toEqual({ '90': 16, '98': 16 });
		});

		it('reports the threshold when nothing was measured but interactions were counted', () => {
			const group = new InteractionGroup();

			expect(group.snapshot(5)).toMatchObject({
				totalCount: 5,
				observedCount: 0,
				percentilesMs: { '90': 16, '98': 16 },
			});
		});

		it('follows an interaction whose latency grew', () => {
			const group = new InteractionGroup();
			latenciesOf(100).forEach((latencyMs) => group.add(latencyMs));
			group.remeasure(728, 4000);

			// 728ms is gone from the group, so the 90th latency is now the next one up.
			expect(group.snapshot(100).percentilesMs).toMatchObject({ '90': 736 });
		});
	});

	describe('what the tracker reports about an interaction', () => {
		const measured = (latencyMs: number): InteractionUpdate => ({
			type: 'new',
			interactionId: 1,
			latencyMs,
			attribution: undefined,
		});

		const measuredAgain = (previousLatencyMs: number, latencyMs: number): InteractionUpdate => ({
			type: 'remeasured',
			interactionId: 1,
			previousLatencyMs,
			latencyMs,
			attribution: undefined,
		});

		it('counts a new interaction', () => {
			const group = new InteractionGroup();

			expect(group.trackInteractionUpdate(measured(24))).toBe(true);
			expect(group.snapshot(1)).toMatchObject({ observedCount: 1, maxMs: 24 });
		});

		it('moves the count of one measured again', () => {
			const group = new InteractionGroup();
			group.trackInteractionUpdate(measured(24));

			expect(group.trackInteractionUpdate(measuredAgain(24, 120))).toBe(true);
			expect(group.snapshot(1)).toMatchObject({ observedCount: 1, maxMs: 120 });
		});

		it('changes nothing when it was measured within the step it is already counted in', () => {
			const group = new InteractionGroup();
			group.trackInteractionUpdate(measured(208));

			// An interaction whose boundaries moved and whose latency did not, then one measured 4ms
			// slower: both fall in the 208ms step it is counted in.
			expect(group.trackInteractionUpdate(measuredAgain(208, 208))).toBe(false);
			expect(group.trackInteractionUpdate(measuredAgain(201, 205))).toBe(false);
			expect(group.snapshot(1)).toMatchObject({ observedCount: 1, maxMs: 208 });
		});
	});
});
