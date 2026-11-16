/**
 * @jest-environment node
 */

import {
	DEDUPLICATION_WINDOW_MS,
	ExposureDeduplicator,
	exposureIdentifiersKey,
	exposureIdentityKey,
} from '../exposure/deduplication';
import { DEFAULT_DEDUPE_MAX_KEYS } from '../exposure/options';

const identity = exposureIdentityKey({
	flagKey: 'flag-a',
	variationId: 'on',
	ruleId: 'rule-a',
	matchReason: 'ss_cohort_match',
	identifiersKey: exposureIdentifiersKey([['AtlassianAccountId', 'user-a']]),
});

describe('ExposureDeduplicator', () => {
	it('counts suppressed attempts and drains only once without refreshing the window', () => {
		const cache = new ExposureDeduplicator();
		expect(cache.admit('key', 0)).toBe(true);
		for (let index = 0; index < 9; index += 1) expect(cache.admit('key', 1)).toBe(false);
		expect(cache.drainItemCount('key')).toBe(10);
		expect(cache.drainItemCount('key')).toBe(1);
		expect(cache.admit('key', 599_999)).toBe(false);
		expect(cache.admit('key', 600_000)).toBe(true);
		expect(cache.drainItemCount('key')).toBe(2);
	});

	it('preserves pending counts across window rollover without counting the new carrier', () => {
		const cache = new ExposureDeduplicator();
		cache.admit('key', 0);
		for (let index = 0; index < 9; index += 1) cache.admit('key', 1);
		expect(cache.admit('key', 600_000)).toBe(true);
		expect(cache.drainItemCount('key')).toBe(10);
		expect(cache.drainItemCount('key')).toBe(1);
	});

	it('discards pending counts only on capacity eviction or explicit clear', () => {
		const cache = new ExposureDeduplicator(1);
		cache.admit('first', 100);
		cache.admit('first', 101);
		cache.admit('second', 102);
		expect(cache.drainItemCount('first')).toBe(1);
		cache.admit('second', 104);
		cache.clear();
		expect(cache.drainItemCount('second')).toBe(1);
	});

	it('drains the same retained entry after multiple admission windows', () => {
		const cache = new ExposureDeduplicator();
		cache.admit('key', 0);
		cache.admit('key', 600_000);
		cache.admit('key', 600_001);
		expect(cache.drainItemCount('key')).toBe(2);
		expect(cache.drainItemCount('key')).toBe(1);
	});

	it('saturates suppression observations at the maximum exactly representable integer', () => {
		const cache = new ExposureDeduplicator();
		cache.admit('key', 0);
		const entries = (cache as unknown as { entries: Map<string, { itemCount: number }> }).entries;
		entries.get('key')!.itemCount = Number.MAX_SAFE_INTEGER - 1;
		cache.admit('key', 1);
		cache.admit('key', 2);
		expect(cache.drainItemCount('key')).toBe(Number.MAX_SAFE_INTEGER);
	});

	it('uses a 600,000 ms window', () => {
		expect(DEDUPLICATION_WINDOW_MS).toBe(600_000);
	});

	it.each([
		[0, false],
		[60_000, false],
		[600_000, true],
		[600_001, true],
	])('at %i ms after the queued exposure, admits: %s', (elapsedMs, admitted) => {
		const deduplicator = new ExposureDeduplicator();
		expect(deduplicator.admit(identity, 1_000)).toBe(true);

		expect(deduplicator.admit(identity, 1_000 + elapsedMs)).toBe(admitted);
	});

	it('clamps backward clock movement without clearing entries or pending counts', () => {
		const cache = new ExposureDeduplicator();
		cache.admit('first', 86_400_000);
		cache.admit('second', 86_400_001);
		expect(cache.admit('first', 1_000)).toBe(false);
		expect(cache.admit('second', 2_000)).toBe(false);
		expect(cache.drainItemCount('first')).toBe(2);
		expect(cache.drainItemCount('second')).toBe(2);
		expect(cache.admit('first', 87_000_000)).toBe(true);
	});

	it('starts a new window from the exposure admitted after the old one', () => {
		const deduplicator = new ExposureDeduplicator();
		deduplicator.admit(identity, 0);
		deduplicator.admit(identity, 600_001);

		expect(deduplicator.admit(identity, 1_200_000)).toBe(false);
		expect(deduplicator.admit(identity, 1_200_001)).toBe(true);
		expect(deduplicator.admit(identity, 1_200_002)).toBe(false);
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

	it('retains 5,000 keys by default and evicts only the least recently used key', () => {
		expect(DEFAULT_DEDUPE_MAX_KEYS).toBe(5_000);
		const cache = new ExposureDeduplicator();
		const entries = (cache as unknown as { entries: Map<string, unknown> }).entries;
		expect(entries.size).toBe(0);
		for (let index = 0; index < 5_000; index += 1) cache.admit(`key-${index}`, 0);
		expect(entries.size).toBe(5_000);
		// A duplicate hit makes the oldest inserted key most recently used.
		expect(cache.admit('key-0', 1)).toBe(false);
		cache.admit('new-key', 2);
		expect(entries.size).toBe(5_000);
		expect(cache.drainItemCount('key-0')).toBe(2);
		expect(cache.admit('key-0', 3)).toBe(false);
		expect(cache.admit('key-1', 3)).toBe(true);
	});

	it('drains counts after a long idle period without touching recency or recreating absent keys', () => {
		const cache = new ExposureDeduplicator(2);
		cache.admit('first', 0);
		cache.admit('first', 1);
		cache.admit('second', 2);
		// Advance far beyond the admission window without looking up first for admission.
		cache.admit('second', 86_400_000);
		expect(cache.drainItemCount('first')).toBe(2);
		expect(cache.drainItemCount('missing')).toBe(1);
		cache.admit('third', 86_400_001);
		expect(cache.admit('second', 86_400_002)).toBe(false);
		expect(cache.admit('first', 86_400_002)).toBe(true);
	});

	it('touches existing-key readmission without evicting another entry or resetting its count', () => {
		const cache = new ExposureDeduplicator(2, 100);
		cache.admit('first', 0);
		cache.admit('first', 1);
		cache.admit('second', 2);
		expect(cache.admit('first', 100)).toBe(true);
		expect(cache.drainItemCount('first')).toBe(2);
		expect(cache.admit('second', 101)).toBe(false);
		cache.admit('first', 102);
		cache.admit('third', 103);
		expect(cache.admit('first', 104)).toBe(false);
		expect(cache.admit('second', 104)).toBe(true);
	});

	it('bypasses invalid clocks without changing cache state', () => {
		const cache = new ExposureDeduplicator(1);
		cache.admit('retained', 0);
		expect(cache.admit('other', NaN)).toBe(true);
		expect(cache.admit('retained', Infinity)).toBe(true);
		expect(cache.admit('retained', 1)).toBe(false);
		expect(cache.drainItemCount('retained')).toBe(2);
	});

	it('refreshes duplicate recency without deleting or reinserting its map entry', () => {
		const cache = new ExposureDeduplicator(2);
		cache.admit('first', 0);
		cache.admit('second', 1);
		const entries = (cache as unknown as { entries: Map<string, unknown> }).entries;
		const remove = jest.spyOn(entries, 'delete');
		const insert = jest.spyOn(entries, 'set');
		expect(cache.admit('first', 2)).toBe(false);
		expect(cache.admit('first', 3)).toBe(false);
		expect(remove).not.toHaveBeenCalled();
		expect(insert).not.toHaveBeenCalled();
		remove.mockRestore();
		insert.mockRestore();
		cache.admit('third', 4);
		expect(cache.admit('first', 5)).toBe(false);
		expect(cache.admit('second', 5)).toBe(true);
	});

	it('matches an independent LRU model through churn, rollover, count drains, and clearing', () => {
		const cache = new ExposureDeduplicator(17, 100);
		let model: { key: string; admittedAt: number; count: number }[] = [];
		let seed = 17;
		for (let now = 0; now < 10_000; now++) {
			seed ^= seed << 13;
			seed ^= seed >>> 17;
			seed ^= seed << 5;
			const value = seed >>> 0;
			const key = `key-${value % 37}`;
			const index = model.findIndex((entry) => entry.key === key);
			if (value % 127 === 0) {
				cache.clear();
				model = [];
			} else if (value % 5 === 0) {
				expect(cache.drainItemCount(key)).toBe(index < 0 ? 1 : model[index].count);
				if (index >= 0) model[index].count = 1;
			} else {
				let admitted = true;
				if (index >= 0) {
					const [entry] = model.splice(index, 1);
					model.push(entry);
					if (now - entry.admittedAt < 100) {
						entry.count += 1;
						admitted = false;
					} else {
						entry.admittedAt = now;
					}
				} else {
					if (model.length === 17) model.shift();
					model.push({ key, admittedAt: now, count: 1 });
				}
				expect(cache.admit(key, now)).toBe(admitted);
			}
		}
		for (let index = 0; index < 37; index++) {
			const key = `key-${index}`;
			expect(cache.drainItemCount(key)).toBe(model.find((entry) => entry.key === key)?.count ?? 1);
		}
	});
});
