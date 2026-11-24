import { InteractionTracker } from '../../collector/interaction-tracker';
import { entry, type FakeEntry, interactionEvent } from '../_event-timing';

const updateFor = (tracker: InteractionTracker, merged: FakeEntry) => tracker.merge(merged);

describe('InteractionTracker', () => {
	it('ignores entries without an interaction id', () => {
		const tracker = new InteractionTracker();

		expect(updateFor(tracker, entry(0, 120))).toBeUndefined();
	});

	it('reports the first entry of an interaction', () => {
		const tracker = new InteractionTracker();

		expect(updateFor(tracker, entry(1, 24))).toEqual({
			type: 'new',
			interactionId: 1,
			latencyMs: 24,
		});
	});

	it('drops a duration it cannot bucket', () => {
		const tracker = new InteractionTracker();

		// Letting one through would put a `NaN` bucket key in the buckets and turn `sumMs`
		// into `NaN` for the rest of the session.
		expect(updateFor(tracker, entry(1, Number.NaN))).toBeUndefined();
		expect(updateFor(tracker, entry(2, Number.POSITIVE_INFINITY))).toBeUndefined();
		expect(updateFor(tracker, entry(3, -8))).toBeUndefined();
		expect(updateFor(tracker, entry(4, undefined as unknown as number))).toBeUndefined();

		// A dropped interaction is not remembered, so a later valid entry still counts.
		expect(updateFor(tracker, entry(1, 24))).toEqual({
			type: 'new',
			interactionId: 1,
			latencyMs: 24,
		});
	});

	it('treats entries sharing an interaction id as one interaction', () => {
		const tracker = new InteractionTracker();
		updateFor(tracker, entry(1, 24));

		// keydown, then input, then keyup of the same keypress.
		expect(updateFor(tracker, entry(1, 120))).toEqual({
			type: 'remeasured',
			interactionId: 1,
			previousLatencyMs: 24,
			latencyMs: 120,
		});
		expect(updateFor(tracker, entry(1, 40))).toBeUndefined();
	});

	it('uses the maximum duration among the entries of an interaction', () => {
		const tracker = new InteractionTracker();
		updateFor(tracker, entry(1, 120));

		expect(updateFor(tracker, entry(1, 120))).toBeUndefined();
		expect(updateFor(tracker, entry(1, 121))).toEqual({
			type: 'remeasured',
			interactionId: 1,
			previousLatencyMs: 120,
			latencyMs: 121,
		});
	});

	it('keeps distinct interaction ids apart', () => {
		const tracker = new InteractionTracker();

		expect(updateFor(tracker, entry(1, 24))).toEqual({
			type: 'new',
			interactionId: 1,
			latencyMs: 24,
		});
		expect(updateFor(tracker, entry(9, 24))).toEqual({
			type: 'new',
			interactionId: 9,
			latencyMs: 24,
		});
	});

	it('bounds how many interactions it tracks', () => {
		const tracker = new InteractionTracker();
		for (let interactionId = 1; interactionId <= 400; interactionId++) {
			expect(updateFor(tracker, entry(interactionId, 24))).toEqual({
				type: 'new',
				interactionId,
				latencyMs: 24,
			});
		}

		// The most recent interactions can still grow; the oldest were pruned.
		expect(updateFor(tracker, entry(400, 120))).toEqual({
			type: 'remeasured',
			interactionId: 400,
			previousLatencyMs: 24,
			latencyMs: 120,
		});
	});

	it('ignores an entry for an interaction that a previous tracker already counted', () => {
		// `interactionId` counts up over the page, so a tracker that starts after id 10 knows
		// anything at or below it belongs to the session before it.
		const tracker = new InteractionTracker(10);

		expect(updateFor(tracker, entry(4, 24))).toBeUndefined();
		expect(updateFor(tracker, entry(10, 120))).toBeUndefined();
		expect(updateFor(tracker, entry(11, 24))).toEqual({
			type: 'new',
			interactionId: 11,
			latencyMs: 24,
		});
	});

	it('ignores an interaction the user started before the session opened', () => {
		// The click that mounted the editor: its entry is produced after the paint that presented
		// it, so an observer subscribing inside its handlers is still reported it.
		const tracker = new InteractionTracker(0, 1_000);

		expect(updateFor(tracker, entry(1, 700, { startTime: 300 }))).toBeUndefined();
		expect(updateFor(tracker, entry(2, 24, { startTime: 999 }))).toBeUndefined();
		expect(updateFor(tracker, entry(3, 24, { startTime: 1_000 }))).toEqual({
			type: 'new',
			interactionId: 3,
			latencyMs: 24,
		});
	});

	it('takes an entry of any age when it is told of no session start', () => {
		expect(updateFor(new InteractionTracker(), entry(1, 24, { startTime: 0 }))).toMatchObject({
			type: 'new',
		});
	});

	it('reports the highest interaction it has seen', () => {
		const tracker = new InteractionTracker();
		updateFor(tracker, entry(7, 24));
		updateFor(tracker, entry(21, 24));
		updateFor(tracker, entry(14, 24));

		expect(tracker.lastInteractionId).toBe(21);
	});

	it('reports where it started when it has seen nothing', () => {
		expect(new InteractionTracker(10).lastInteractionId).toBe(10);
		expect(new InteractionTracker().lastInteractionId).toBe(0);
	});

	describe('the regions’ events', () => {
		let tracker: InteractionTracker;

		const record = (type: string, timeStamp: number, region = 'main') =>
			tracker.recordRegionEvent(region, interactionEvent(type, timeStamp));

		beforeEach(() => {
			tracker = new InteractionTracker();
		});

		it('counts a key press once, whatever it produced', () => {
			expect(record('keydown', 100)).toBe('typing');
			expect(record('input', 104)).toBeUndefined();
			expect(record('keyup', 108)).toBeUndefined();
		});

		it('counts a tap once', () => {
			expect(record('pointerdown', 100)).toBeUndefined();
			expect(record('pointerup', 150)).toBe('pointer');
			expect(record('click', 160)).toBeUndefined();
		});

		it('counts nothing for an event that is not part of an interaction', () => {
			expect(record('pointermove', 100)).toBeUndefined();
		});

		it('attributes an entry to the region and kind of the event it measured', () => {
			record('pointerdown', 100);
			record('click', 160);

			expect(
				updateFor(tracker, entry(1, 24, { name: 'pointerdown', startTime: 100 })),
			).toMatchObject({
				attribution: { kind: 'pointer', regions: ['main'] },
			});
			// The click is usually the slow part of a pointer press, and it is not the counted event.
			expect(updateFor(tracker, entry(2, 120, { name: 'click', startTime: 160 }))).toMatchObject({
				attribution: { kind: 'pointer', regions: ['main'] },
			});
		});

		it('attributes an event two regions reported to both of them, once each', () => {
			record('keydown', 100, 'main');
			record('keydown', 100, 'side');
			record('keydown', 100, 'side');

			expect(updateFor(tracker, entry(1, 24, { name: 'keydown', startTime: 100 }))).toMatchObject({
				attribution: { kind: 'typing', regions: ['main', 'side'] },
			});
		});

		it('keeps the attribution for the rest of the interaction', () => {
			record('pointerdown', 100);
			updateFor(tracker, entry(1, 24, { name: 'pointerdown', startTime: 100 }));

			// An entry measured on an event no region reported, so it says nothing about the
			// attribution — and the interaction stays where it was counted.
			expect(updateFor(tracker, entry(1, 120, { name: 'keydown', startTime: 999 }))).toEqual({
				type: 'remeasured',
				interactionId: 1,
				previousLatencyMs: 24,
				latencyMs: 120,
				attribution: { kind: 'pointer', regions: ['main'] },
			});
		});

		it('leaves an interaction no region reported without an attribution', () => {
			expect(updateFor(tracker, entry(1, 24, { name: 'keydown', startTime: 100 }))).toEqual({
				type: 'new',
				interactionId: 1,
				latencyMs: 24,
				attribution: undefined,
			});
		});

		it('tells apart events the browser gave the same timestamp', () => {
			record('keydown', 100);
			record('pointerdown', 100);

			expect(updateFor(tracker, entry(1, 24, { name: 'keydown', startTime: 100 }))).toMatchObject({
				attribution: { kind: 'typing' },
			});
			expect(
				updateFor(tracker, entry(2, 24, { name: 'pointerdown', startTime: 100 })),
			).toMatchObject({
				attribution: { kind: 'pointer' },
			});
		});
	});
});
