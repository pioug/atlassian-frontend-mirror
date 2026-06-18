import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import type { QuickInsertItem } from '../../provider-factory';
import { boostNativeResultsAboveSkills } from '../boost-native-results-above-skills';
import { find } from '../utils';

const noop = () => false as const;

const makeItem = (title: string, overrides?: Partial<QuickInsertItem>): QuickInsertItem => ({
	title,
	action: noop,
	...overrides,
});

const makeResult = <T extends QuickInsertItem>(item: T, score: number) => ({
	item,
	score,
});

describe('boostNativeResultsAboveSkills', () => {
	it('should promote native item above a skill with a similar score', () => {
		const skill = makeItem('Code Intelligence', { priority: 9000 });
		const native = makeItem('Code snippet');

		const results = [makeResult(skill, 0.1), makeResult(native, 0.15)];

		const reranked = boostNativeResultsAboveSkills(results);

		expect(reranked.map((r) => r.item.title)).toEqual(['Code snippet', 'Code Intelligence']);
	});

	it('should not promote native item when skill has a significantly better score', () => {
		const skill = makeItem('Research Insights', { priority: 9000 });
		const native = makeItem('Live search');

		const results = [makeResult(skill, 0.05), makeResult(native, 0.3)];

		const reranked = boostNativeResultsAboveSkills(results);

		expect(reranked.map((r) => r.item.title)).toEqual(['Research Insights', 'Live search']);
	});

	it('should not change order when there are no skills', () => {
		const a = makeItem('Action item');
		const b = makeItem('Table');

		const results = [makeResult(a, 0.1), makeResult(b, 0.15)];

		const reranked = boostNativeResultsAboveSkills(results);

		expect(reranked.map((r) => r.item.title)).toEqual(['Action item', 'Table']);
	});

	it('should not change order when there are no native items', () => {
		const a = makeItem('Skill A', { priority: 9000 });
		const b = makeItem('Skill B', { priority: 9000 });

		const results = [makeResult(a, 0.1), makeResult(b, 0.15)];

		const reranked = boostNativeResultsAboveSkills(results);

		expect(reranked.map((r) => r.item.title)).toEqual(['Skill A', 'Skill B']);
	});

	it('should promote multiple native items above multiple skills with similar scores', () => {
		const skill1 = makeItem('Code Intelligence', { priority: 9000 });
		const skill2 = makeItem('Code Review', { priority: 9000 });
		const native1 = makeItem('Code snippet');
		const native2 = makeItem('Code block');

		const results = [
			makeResult(skill1, 0.1),
			makeResult(skill2, 0.12),
			makeResult(native1, 0.14),
			makeResult(native2, 0.16),
		];

		const reranked = boostNativeResultsAboveSkills(results);

		expect(reranked.map((r) => r.item.title)).toEqual([
			'Code snippet',
			'Code block',
			'Code Intelligence',
			'Code Review',
		]);
	});

	it('should handle mixed ordering with some skills having better scores', () => {
		const skill1 = makeItem('Research Insights', { priority: 9000 });
		const native1 = makeItem('Status');
		const skill2 = makeItem('Report Builder', { priority: 9000 });
		const native2 = makeItem('Heading');

		// All scores within 0.2 of each other, so all native items get promoted
		const results = [
			makeResult(skill1, 0.05),
			makeResult(native1, 0.1),
			makeResult(skill2, 0.15),
			makeResult(native2, 0.18),
		];

		const reranked = boostNativeResultsAboveSkills(results);

		// native1 (0.1) promoted above skill1 (0.05) — diff 0.05 < 0.2
		// native2 (0.18) promoted above skill2 (0.15) and skill1 (0.05) — both within 0.2
		expect(reranked.map((r) => r.item.title)).toEqual([
			'Status',
			'Heading',
			'Research Insights',
			'Report Builder',
		]);
	});

	it('should handle empty results', () => {
		const reranked = boostNativeResultsAboveSkills([]);
		expect(reranked).toEqual([]);
	});

	it('should handle single item', () => {
		const results = [makeResult(makeItem('Table'), 0.1)];
		const reranked = boostNativeResultsAboveSkills(results);
		expect(reranked.map((r) => r.item.title)).toEqual(['Table']);
	});

	it('should not mutate the original array', () => {
		const skill = makeItem('Code Intelligence', { priority: 9000 });
		const native = makeItem('Code snippet');

		const results = [makeResult(skill, 0.1), makeResult(native, 0.15)];
		const originalOrder = results.map((r) => r.item.title);

		boostNativeResultsAboveSkills(results);

		expect(results.map((r) => r.item.title)).toEqual(originalOrder);
	});

	it('should treat items with priority below threshold as native items', () => {
		const lowPriority = makeItem('Panel', { priority: 500 });
		const skill = makeItem('Code Intelligence', { priority: 9000 });
		const native = makeItem('Code snippet');

		const results = [
			makeResult(skill, 0.1),
			makeResult(lowPriority, 0.12),
			makeResult(native, 0.14),
		];

		const reranked = boostNativeResultsAboveSkills(results);

		expect(reranked.map((r) => r.item.title)).toEqual([
			'Panel',
			'Code snippet',
			'Code Intelligence',
		]);
	});

	it('should respect score proximity threshold boundary (exactly 0.2 difference)', () => {
		const skill = makeItem('Skill', { priority: 9000 });
		const native = makeItem('Native');

		// Exactly 0.2 difference — should NOT promote (threshold is strict <)
		const results = [makeResult(skill, 0.0), makeResult(native, 0.2)];

		const reranked = boostNativeResultsAboveSkills(results);

		expect(reranked.map((r) => r.item.title)).toEqual(['Skill', 'Native']);
	});

	it('should promote when score difference is just under threshold', () => {
		const skill = makeItem('Skill', { priority: 9000 });
		const native = makeItem('Native');

		// Just under 0.2 — should promote
		const results = [makeResult(skill, 0.0), makeResult(native, 0.199)];

		const reranked = boostNativeResultsAboveSkills(results);

		expect(reranked.map((r) => r.item.title)).toEqual(['Native', 'Skill']);
	});
});

describe('find', () => {
	eeTest
		.describe('platform_editor_insert_menu_ai', 'when experiment is enabled')
		.variant(true, () => {
			it('should rank native "Code snippet" above skill "Code Intelligence" for query "code"', () => {
				const items: QuickInsertItem[] = [
					makeItem('Code Intelligence', {
						priority: 9000,
						keywords: ['code', 'intelligence'],
					}),
					makeItem('Code snippet', {
						keywords: ['code'],
					}),
				];

				const results = find('code', items);

				const codeSnippetIdx = results.findIndex((r) => r.title === 'Code snippet');
				const codeIntelIdx = results.findIndex((r) => r.title === 'Code Intelligence');

				expect(codeSnippetIdx).toBeLessThan(codeIntelIdx);
			});

			it('should not demote a skill that is a much better match than a native item', () => {
				const items: QuickInsertItem[] = [
					makeItem('Research Insights', {
						priority: 9000,
						keywords: ['research', 'insights'],
					}),
					makeItem('Panel', {
						keywords: ['panel', 'note'],
					}),
				];

				const results = find('research', items);

				// "Panel" does not match "research" at all, so only the skill
				// should appear in results
				expect(results).toHaveLength(1);
				expect(results[0].title).toBe('Research Insights');
			});

			it('should sort by priority with skills at the bottom for empty query', () => {
				const items: QuickInsertItem[] = [
					makeItem('Code Intelligence', { priority: 9000 }),
					makeItem('Table', { priority: 1 }),
					makeItem('Code snippet', { priority: 2 }),
				];

				const results = find('', items);

				expect(results.map((r) => r.title)).toEqual([
					'Table',
					'Code snippet',
					'Code Intelligence',
				]);
			});
		});

	eeTest
		.describe('platform_editor_insert_menu_ai', 'when experiment is disabled')
		.variant(false, () => {
			it('should use default Fuse.js ordering without boosting', () => {
				const items: QuickInsertItem[] = [
					makeItem('Code Intelligence', {
						priority: 9000,
						keywords: ['code', 'intelligence'],
					}),
					makeItem('Code snippet', {
						keywords: ['code'],
					}),
				];

				const results = find('code', items);

				// Both should appear, order determined by Fuse.js scoring only
				expect(results.length).toBeGreaterThanOrEqual(1);
				expect(results.some((r) => r.title === 'Code Intelligence')).toBe(true);
			});
		});
});
