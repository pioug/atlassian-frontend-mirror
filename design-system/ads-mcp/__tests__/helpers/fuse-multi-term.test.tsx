import {
	computeMultiTermFuseAllocation,
	mergeMultiTermFuseResults,
} from '../../src/helpers/fuse-multi-term';

type Item = { name: string };

describe('fuse-multi-term', () => {
	describe('computeMultiTermFuseAllocation', () => {
		it.each([
			[3, 2, { perTermTake: 2, combinedTake: 2, totalTake: 6 }],
			[1, 2, { perTermTake: 1, combinedTake: 1, totalTake: 3 }],
			[5, 3, { perTermTake: 2, combinedTake: 9, totalTake: 15 }],
			[10, 2, { perTermTake: 5, combinedTake: 10, totalTake: 20 }],
		])('limit=%i termCount=%i matches allocation snapshot', (limit, termCount, expected) => {
			expect(computeMultiTermFuseAllocation(limit, termCount)).toEqual(expected);
		});

		it('returns zeros for termCount < 1', () => {
			expect(computeMultiTermFuseAllocation(3, 0)).toEqual({
				perTermTake: 1,
				combinedTake: 0,
				totalTake: 1,
			});
		});
	});

	describe('mergeMultiTermFuseResults', () => {
		it('single term: returns top `limit` from that query only', () => {
			const search = jest.fn((query: string) => {
				if (query === 'alpha') {
					return [
						{ item: { name: 'a' }, score: 0.1 },
						{ item: { name: 'b' }, score: 0.2 },
						{ item: { name: 'c' }, score: 0.3 },
					];
				}
				return [];
			});

			const out = mergeMultiTermFuseResults<Item>({
				searchTerms: ['alpha'],
				limit: 2,
				search,
			});

			expect(out.map((x) => x.name)).toEqual(['a', 'b']);
			expect(search).toHaveBeenCalledTimes(1);
			expect(search).toHaveBeenCalledWith('alpha');
		});

		it('after global score sort, skips duplicate names and fills with the next distinct hit', () => {
			const search = jest.fn((query: string) => {
				if (query === 'a') {
					return [{ item: { name: 'color.text' }, score: 0.1 }];
				}
				if (query === 'b') {
					return [{ item: { name: 'color.icon' }, score: 0.15 }];
				}
				if (query === 'a b') {
					return [
						{ item: { name: 'color.text' }, score: 0.2 },
						{ item: { name: 'color.next' }, score: 0.17 },
					];
				}
				return [];
			});

			const out = mergeMultiTermFuseResults<Item>({
				searchTerms: ['a', 'b'],
				limit: 3,
				search,
			});

			expect(out.map((o) => o.name)).toEqual(['color.text', 'color.icon', 'color.next']);
		});

		it('two terms: takes per-term slice then combined, dedupes by best score, sorts by score', () => {
			// limit=3, n=2 → perTermTake=max(round(3/2),1)=2, combinedTake=max(1,6-4)=2
			// So we pull two hits per term: x gives only-x + both; y gives both + only-y; combined gives combined-best + both.
			// After global sort by score, unique walk: combined-best (0.05), both (0.2), only-y (0.4) — only-x (0.5) is fourth.
			const search = jest.fn((query: string) => {
				if (query === 'x') {
					return [
						{ item: { name: 'only-x' }, score: 0.5 },
						{ item: { name: 'both' }, score: 0.9 },
					];
				}
				if (query === 'y') {
					return [
						{ item: { name: 'both' }, score: 0.2 },
						{ item: { name: 'only-y' }, score: 0.4 },
					];
				}
				if (query === 'x y') {
					return [
						{ item: { name: 'combined-best' }, score: 0.05 },
						{ item: { name: 'both' }, score: 0.99 },
						{ item: { name: 'filler' }, score: 0.8 },
					];
				}
				return [];
			});

			const out = mergeMultiTermFuseResults<Item>({
				searchTerms: ['x', 'y'],
				limit: 1,
				search,
			});

			expect(out.map((o) => o.name)).toEqual(['combined-best', 'both', 'only-x']);

			expect(search).toHaveBeenCalledWith('x');
			expect(search).toHaveBeenCalledWith('y');
			expect(search).toHaveBeenCalledWith('x y');
		});

		it('uses custom tokenKey for deduplication', () => {
			const search = jest.fn((query: string) => {
				if (query === 'a') {
					return [{ item: { name: 'n1' }, score: 0.5 }];
				}
				if (query === 'b') {
					return [{ item: { name: 'n2' }, score: 0.3 }];
				}
				if (query === 'a b') {
					return [
						{ item: { name: 'n1' }, score: 0.9 },
						{ item: { name: 'n2' }, score: 0.1 },
					];
				}
				return [];
			});

			const out = mergeMultiTermFuseResults<Item>({
				searchTerms: ['a', 'b'],
				limit: 2,
				search,
				tokenKey: () => 'same',
			});

			// All collapse to one key; best score wins (0.3 from b term hit for n2? actually same key merges — last best)
			// a: n1 score 0.5, b: n2 score 0.3, combined: n1 0.9, n2 0.1 → same key "same" — min score 0.1 from combined n2
			expect(out).toHaveLength(1);
			expect(out[0].name).toBe('n2');
		});

		it('returns empty for no search terms', () => {
			expect(
				mergeMultiTermFuseResults<Item>({ searchTerms: [], limit: 3, search: () => [] }),
			).toEqual([]);
		});

		it('dedupes by custom key when items use componentName instead of name', () => {
			type IconRow = { componentName: string; usage: string };
			const search = jest.fn((query: string) => {
				if (query === 'add') {
					return [
						{ item: { componentName: 'AddIcon', usage: 'a' }, score: 0.1 },
						{ item: { componentName: 'AddIcon', usage: 'b' }, score: 0.2 },
					];
				}
				return [];
			});

			const out = mergeMultiTermFuseResults<IconRow>({
				searchTerms: ['add'],
				limit: 2,
				search,
				tokenKey: (i) => i.componentName,
			});

			expect(out).toHaveLength(1);
			expect(out[0].componentName).toBe('AddIcon');
		});
	});
});
