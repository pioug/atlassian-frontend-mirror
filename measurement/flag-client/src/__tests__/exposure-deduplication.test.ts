/**
 * @jest-environment node
 */

import {
	DEDUPLICATION_WINDOW_MS,
	ExposureDeduplicator,
	exposureIdentifiersKey,
	exposureIdentityKey,
} from '../exposure/deduplication';

const identity = exposureIdentityKey({
	flagKey: 'flag-a',
	variationId: 'on',
	ruleId: 'rule-a',
	matchReason: 'ss_cohort_match',
	identifiersKey: exposureIdentifiersKey([['AtlassianAccountId', 'user-a']]),
});

describe('ExposureDeduplicator', () => {
	it('uses a 600,000 ms window', () => {
		expect(DEDUPLICATION_WINDOW_MS).toBe(600_000);
	});

	it.each([
		[0, false],
		[60_000, false],
		[600_000, false],
		[600_001, true],
	])('at %i ms after the queued exposure, admits: %s', (elapsedMs, admitted) => {
		const deduplicator = new ExposureDeduplicator();
		expect(deduplicator.admit(identity, 1_000)).toBe(true);

		expect(deduplicator.admit(identity, 1_000 + elapsedMs)).toBe(admitted);
	});

	it('starts a new window when the clock moves back before the queued exposure', () => {
		const deduplicator = new ExposureDeduplicator();
		deduplicator.admit(identity, 86_400_000);

		expect(deduplicator.admit(identity, 1_000)).toBe(true);
		expect(deduplicator.admit(identity, 2_000)).toBe(false);
	});

	it('starts a new window from the exposure admitted after the old one', () => {
		const deduplicator = new ExposureDeduplicator();
		deduplicator.admit(identity, 0);
		deduplicator.admit(identity, 600_001);

		expect(deduplicator.admit(identity, 1_200_001)).toBe(false);
		expect(deduplicator.admit(identity, 1_200_002)).toBe(true);
	});

	it('keeps windows independent per identity', () => {
		const deduplicator = new ExposureDeduplicator();
		deduplicator.admit(identity, 0);

		expect(
			deduplicator.admit(
				exposureIdentityKey({
					flagKey: 'flag-a',
					variationId: 'on',
					ruleId: 'rule-b',
					matchReason: 'ss_cohort_match',
					identifiersKey: exposureIdentifiersKey([['AtlassianAccountId', 'user-a']]),
				}),
				1,
			),
		).toBe(true);
	});

	it('treats an absent member as distinct from every present value', () => {
		const absent = exposureIdentityKey({
			flagKey: 'flag-a',
			variationId: null,
			ruleId: null,
			matchReason: 'flag_not_found',
			identifiersKey: exposureIdentifiersKey([]),
		});
		const nullString = exposureIdentityKey({
			flagKey: 'flag-a',
			variationId: 'null',
			ruleId: 'null',
			matchReason: 'flag_not_found',
			identifiersKey: exposureIdentifiersKey([]),
		});

		expect(absent).not.toBe(nullString);
	});

	it('keeps windows independent per identifier value', () => {
		const deduplicator = new ExposureDeduplicator();
		deduplicator.admit(identity, 0);

		expect(
			deduplicator.admit(
				exposureIdentityKey({
					flagKey: 'flag-a',
					variationId: 'on',
					ruleId: 'rule-a',
					matchReason: 'ss_cohort_match',
					identifiersKey: exposureIdentifiersKey([['AtlassianAccountId', 'user-b']]),
				}),
				1,
			),
		).toBe(true);
	});

	it('ignores identifier order', () => {
		expect(
			exposureIdentifiersKey([
				['a', '1'],
				['b', '2'],
			]),
		).toBe(
			exposureIdentifiersKey([
				['b', '2'],
				['a', '1'],
			]),
		);
	});

	it('ends every window on clear', () => {
		const deduplicator = new ExposureDeduplicator();
		deduplicator.admit(identity, 0);
		deduplicator.clear();

		expect(deduplicator.admit(identity, 1)).toBe(true);
	});
});
