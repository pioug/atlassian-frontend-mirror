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

/** Helper to create a skill item with extensionType set (as buildMenuItem does for extension items). */
const makeSkillItem = (title: string, overrides?: Partial<QuickInsertItem>): QuickInsertItem => ({
	...makeItem(title, overrides),
	extensionType: 'com.atlassian.rovo.skill',
});

const makeResult = <T extends QuickInsertItem>(item: T, score: number) => ({
	item,
	score,
});

describe('boostNativeResultsAboveSkills', () => {
	it('should promote native item above a skill with a similar score', () => {
		const skill = makeSkillItem('Code Intelligence', { priority: 9000 });
		const native = makeItem('Code snippet');

		const results = [makeResult(skill, 0.1), makeResult(native, 0.15)];

		const reranked = boostNativeResultsAboveSkills(results);

		expect(reranked.map((r) => r.item.title)).toEqual(['Code snippet', 'Code Intelligence']);
	});

	it('should not promote native item when skill has a significantly better score', () => {
		const skill = makeSkillItem('Research Insights', { priority: 9000 });
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
		const a = makeSkillItem('Skill A', { priority: 9000 });
		const b = makeSkillItem('Skill B', { priority: 9000 });

		const results = [makeResult(a, 0.1), makeResult(b, 0.15)];

		const reranked = boostNativeResultsAboveSkills(results);

		expect(reranked.map((r) => r.item.title)).toEqual(['Skill A', 'Skill B']);
	});

	it('should promote multiple native items above multiple skills with similar scores', () => {
		const skill1 = makeSkillItem('Code Intelligence', { priority: 9000 });
		const skill2 = makeSkillItem('Code Review', { priority: 9000 });
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
		const skill1 = makeSkillItem('Research Insights', { priority: 9000 });
		const native1 = makeItem('Status');
		const skill2 = makeSkillItem('Report Builder', { priority: 9000 });
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
		const skill = makeSkillItem('Code Intelligence', { priority: 9000 });
		const native = makeItem('Code snippet');

		const results = [makeResult(skill, 0.1), makeResult(native, 0.15)];
		const originalOrder = results.map((r) => r.item.title);

		boostNativeResultsAboveSkills(results);

		expect(results.map((r) => r.item.title)).toEqual(originalOrder);
	});

	it('should treat high-priority native items without extensionType as native', () => {
		// The Link item has priority 1200 (from the embeds experiment) but is
		// a native editor item — it should NOT be classified as a skill.
		const highPriorityNative = makeItem('Link', { priority: 1200 });
		const skill = makeSkillItem('Code Intelligence', { priority: 9000 });
		const native = makeItem('Code snippet');

		const results = [
			makeResult(skill, 0.1),
			makeResult(highPriorityNative, 0.12),
			makeResult(native, 0.14),
		];

		const reranked = boostNativeResultsAboveSkills(results);

		expect(reranked.map((r) => r.item.title)).toEqual([
			'Link',
			'Code snippet',
			'Code Intelligence',
		]);
	});

	it('should classify extension items as skills regardless of priority or categories', () => {
		// An extension item with a non-AI category (e.g. Rovo Chat's 'Skills')
		// should still be classified as a skill because it has extensionType.
		const skill = makeSkillItem('Low Priority Skill', { priority: 100, categories: ['Skills'] });
		const native = makeItem('Native');

		const results = [makeResult(skill, 0.1), makeResult(native, 0.15)];

		const reranked = boostNativeResultsAboveSkills(results);

		expect(reranked.map((r) => r.item.title)).toEqual(['Native', 'Low Priority Skill']);
	});

	it('should not rerank high-priority native item (Link) above other native items', () => {
		// Regression test: the Link item with priority 1200 (from the embeds experiment)
		// should not be classified as a skill and should not be demoted below Figma/Drive.
		const link = makeItem('Link', { priority: 1200 });
		const figma = makeItem('Figma', { keywords: ['link'] });

		// Fuse would score Link better (title match) and Figma worse (keyword match only)
		const results = [makeResult(link, 0.05), makeResult(figma, 0.12)];

		const reranked = boostNativeResultsAboveSkills(results);

		// Link should stay above Figma — neither is a skill
		expect(reranked.map((r) => r.item.title)).toEqual(['Link', 'Figma']);
	});

	it('should not treat non-Rovo extensions as skills', () => {
		// Only Rovo skills (extensionType 'com.atlassian.rovo.skill') are
		// classified as skills. Other extensions keep their original rank.
		const thirdPartyExtension = makeItem('My Extension', {
			extensionType: 'com.example.my-extension',
		} as Partial<QuickInsertItem>);
		const native = makeItem('Code snippet');

		const results = [makeResult(thirdPartyExtension, 0.1), makeResult(native, 0.15)];

		const reranked = boostNativeResultsAboveSkills(results);

		// Third-party extension is NOT demoted — it's not a Rovo skill
		expect(reranked.map((r) => r.item.title)).toEqual(['My Extension', 'Code snippet']);
	});

	it('should respect score proximity threshold boundary (exactly 0.2 difference)', () => {
		const skill = makeSkillItem('Skill', { priority: 9000 });
		const native = makeItem('Native');

		// Exactly 0.2 difference — should NOT promote (threshold is strict <)
		const results = [makeResult(skill, 0.0), makeResult(native, 0.2)];

		const reranked = boostNativeResultsAboveSkills(results);

		expect(reranked.map((r) => r.item.title)).toEqual(['Skill', 'Native']);
	});

	it('should promote when score difference is just under threshold', () => {
		const skill = makeSkillItem('Skill', { priority: 9000 });
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
					makeSkillItem('Code Intelligence', {
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
					makeSkillItem('Research Insights', {
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
					makeSkillItem('Code Intelligence', { priority: 9000 }),
					makeItem('Table', { priority: 1 }),
					makeItem('Code snippet', { priority: 2 }),
				];

				const results = find('', items);

				expect(results.map((r) => r.title)).toEqual(['Table', 'Code snippet', 'Code Intelligence']);
			});
		});

	eeTest
		.describe('platform_editor_insert_menu_ai', 'when experiment is disabled')
		.variant(false, () => {
			it('should use default Fuse.js ordering without boosting', () => {
				const items: QuickInsertItem[] = [
					makeSkillItem('Code Intelligence', {
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
