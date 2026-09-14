import {
	getRemixSlotValues,
	getRemixVersionForRevision,
	recordRemixRevisionEdit,
	recordRemixRevisionVersion,
	recordRemixSlotValues,
	resetRemixSlotStore,
	seedRemixSlotValue,
} from '../remix-slot-store';

describe('remix-slot-store (MAUI reload-free undo/redo session map)', () => {
	beforeEach(() => {
		resetRemixSlotStore();
	});

	it('returns undefined for an unknown embed or version', () => {
		expect(getRemixSlotValues('embed-1', 'v1')).toBeUndefined();
		expect(getRemixSlotValues(undefined, 'v1')).toBeUndefined();
		expect(getRemixSlotValues('embed-1', undefined)).toBeUndefined();
	});

	it('seeds the value that undo needs before the mint finishes', () => {
		seedRemixSlotValue('embed-1', 'v1', 'title', 'Old');
		seedRemixSlotValue('embed-1', 'v1', 'title', 'Wrong');

		expect(getRemixSlotValues('embed-1', 'v1')).toEqual([{ slot: 'title', value: 'Old' }]);
	});

	it('maps a revision to the version minted for it', () => {
		recordRemixRevisionVersion('embed-1', 'revision-1', 'v2');

		expect(getRemixVersionForRevision('embed-1', 'revision-1')).toBe('v2');
		expect(getRemixVersionForRevision('embed-2', 'revision-1')).toBeUndefined();
	});

	it('copies each revision snapshot when version mints finish out of order', () => {
		recordRemixRevisionEdit({
			currentVersionId: 'v1',
			localId: 'embed-1',
			previousValue: 'Title A',
			revisionId: 'revision-1',
			slot: 'chart.title',
			value: 'Title B',
		});
		recordRemixRevisionEdit({
			currentVersionId: 'v1',
			localId: 'embed-1',
			previousRevisionId: 'revision-1',
			previousValue: 'Sub A',
			revisionId: 'revision-2',
			slot: 'chart.subtitle',
			value: 'Sub B',
		});

		recordRemixRevisionVersion('embed-1', 'revision-2', 'v3');
		recordRemixRevisionVersion('embed-1', 'revision-1', 'v2');

		expect(getRemixSlotValues('embed-1', 'v1')).toEqual(
			expect.arrayContaining([
				{ slot: 'chart.title', value: 'Title A' },
				{ slot: 'chart.subtitle', value: 'Sub A' },
			]),
		);
		expect(getRemixSlotValues('embed-1', 'v2')).toEqual(
			expect.arrayContaining([
				{ slot: 'chart.title', value: 'Title B' },
				{ slot: 'chart.subtitle', value: 'Sub A' },
			]),
		);
		expect(getRemixSlotValues('embed-1', 'v3')).toEqual(
			expect.arrayContaining([
				{ slot: 'chart.title', value: 'Title B' },
				{ slot: 'chart.subtitle', value: 'Sub B' },
			]),
		);
	});

	it('updates the version snapshot when its edit arrives after the mint', () => {
		recordRemixRevisionVersion('embed-1', 'revision-1', 'v2');
		recordRemixRevisionEdit({
			currentVersionId: 'v1',
			localId: 'embed-1',
			previousValue: 'Title A',
			revisionId: 'revision-1',
			slot: 'chart.title',
			value: 'Title B',
		});

		expect(getRemixSlotValues('embed-1', 'v2')).toEqual([
			{ slot: 'chart.title', value: 'Title B' },
		]);
	});

	it('builds snapshots for the previous and new version from a single edit', () => {
		recordRemixSlotValues({
			localId: 'embed-1',
			prevVersionId: 'v1',
			newVersionId: 'v2',
			slot: 'bar-chart-x.title',
			previousValue: 'Monthly revenue',
			value: 'Quarterly revenue (edited)',
		});

		// The previous version is seeded with the pre-edit value so undo restores it.
		expect(getRemixSlotValues('embed-1', 'v1')).toEqual([
			{ slot: 'bar-chart-x.title', value: 'Monthly revenue' },
		]);
		// The new version carries the edited value.
		expect(getRemixSlotValues('embed-1', 'v2')).toEqual([
			{ slot: 'bar-chart-x.title', value: 'Quarterly revenue (edited)' },
		]);
	});

	it('carries prior slots forward so each version is a full snapshot', () => {
		// v1 -> edit title -> v2
		recordRemixSlotValues({
			localId: 'embed-1',
			prevVersionId: 'v1',
			newVersionId: 'v2',
			slot: 'chart.title',
			previousValue: 'Title A',
			value: 'Title B',
		});
		// v2 -> edit a different slot -> v3
		recordRemixSlotValues({
			localId: 'embed-1',
			prevVersionId: 'v2',
			newVersionId: 'v3',
			slot: 'chart.subtitle',
			previousValue: 'Sub A',
			value: 'Sub B',
		});

		// v3 is a full snapshot of both edited slots at their v3 values.
		expect(getRemixSlotValues('embed-1', 'v3')).toEqual(
			expect.arrayContaining([
				{ slot: 'chart.title', value: 'Title B' },
				{ slot: 'chart.subtitle', value: 'Sub B' },
			]),
		);
		expect(getRemixSlotValues('embed-1', 'v3')).toHaveLength(2);
		// v2 is also a full snapshot: it holds the title edit AND the subtitle's
		// pre-edit value ('Sub A'), seeded when the subtitle edit created v3. This
		// is essential — undoing to v2 must revert the subtitle back to 'Sub A'.
		expect(getRemixSlotValues('embed-1', 'v2')).toEqual(
			expect.arrayContaining([
				{ slot: 'chart.title', value: 'Title B' },
				{ slot: 'chart.subtitle', value: 'Sub A' },
			]),
		);
		expect(getRemixSlotValues('embed-1', 'v2')).toHaveLength(2);
	});

	it('re-editing the same slot updates only that slot across versions', () => {
		recordRemixSlotValues({
			localId: 'embed-1',
			prevVersionId: 'v1',
			newVersionId: 'v2',
			slot: 'chart.title',
			previousValue: 'A',
			value: 'B',
		});
		recordRemixSlotValues({
			localId: 'embed-1',
			prevVersionId: 'v2',
			newVersionId: 'v3',
			slot: 'chart.title',
			previousValue: 'B',
			value: 'C',
		});

		expect(getRemixSlotValues('embed-1', 'v2')).toEqual([{ slot: 'chart.title', value: 'B' }]);
		expect(getRemixSlotValues('embed-1', 'v3')).toEqual([{ slot: 'chart.title', value: 'C' }]);
	});

	it('does not overwrite an already-seeded previous value', () => {
		// First edit seeds v1's title = A.
		recordRemixSlotValues({
			localId: 'embed-1',
			prevVersionId: 'v1',
			newVersionId: 'v2',
			slot: 'chart.title',
			previousValue: 'A',
			value: 'B',
		});
		// A later record that (wrongly) reports a different previousValue for the
		// same slot on v1 must not clobber the original seed.
		recordRemixSlotValues({
			localId: 'embed-1',
			prevVersionId: 'v1',
			newVersionId: 'v2b',
			slot: 'chart.title',
			previousValue: 'DIFFERENT',
			value: 'B2',
		});

		expect(getRemixSlotValues('embed-1', 'v1')).toEqual([{ slot: 'chart.title', value: 'A' }]);
	});

	it('scopes snapshots per embed (localId)', () => {
		recordRemixSlotValues({
			localId: 'embed-1',
			prevVersionId: 'v1',
			newVersionId: 'v2',
			slot: 'chart.title',
			previousValue: 'A',
			value: 'B',
		});

		expect(getRemixSlotValues('embed-2', 'v2')).toBeUndefined();
	});

	it('carries the previous snapshot forward when no slot info is given', () => {
		recordRemixSlotValues({
			localId: 'embed-1',
			prevVersionId: 'v1',
			newVersionId: 'v2',
			slot: 'chart.title',
			previousValue: 'A',
			value: 'B',
		});
		recordRemixSlotValues({ localId: 'embed-1', prevVersionId: 'v2', newVersionId: 'v3' });

		expect(getRemixSlotValues('embed-1', 'v3')).toEqual([{ slot: 'chart.title', value: 'B' }]);
	});
});
