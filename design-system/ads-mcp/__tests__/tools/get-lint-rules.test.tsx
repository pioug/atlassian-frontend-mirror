import { getLintRulesTool } from '../../src/tools/get-lint-rules';

jest.mock('../../src/tools/get-lint-rules/lint-rules-structured-content.codegen', () => ({
	lintRulesMcpStructuredContent: [
		{
			ruleName: 'icon-label',
			description: 'Icon labels are used to describe what the icon is.',
			content: {
				ruleName: 'icon-label',
				description: 'Icon labels are used to describe what the icon is.',
				content:
					'# icon-label\n\nIcon labels are used to describe what the icon is.\n\n## Examples\n\n### Incorrect\n\n```js\n<ActivityIcon>\n```\n\n### Correct\n\n```js\n<ActivityIcon label="Activity">\n```\n',
			},
		},
		{
			ruleName: 'ensure-proper-xcss-usage',
			description: 'This ESLint rule enforces proper usage of the xcss prop.',
			content: {
				ruleName: 'ensure-proper-xcss-usage',
				description: 'This ESLint rule enforces proper usage of the xcss prop.',
				content:
					'# ensure-proper-xcss-usage\n\nThis ESLint rule enforces proper usage of the xcss prop.\n\n### Incorrect\n\n```tsx\n<Box xcss={oldStyles} />\n```\n\n### Correct\n\n```tsx\n<Box xcss={styles.root} />\n```\n',
			},
		},
		{
			ruleName: 'FuzzyMatchRule',
			description: 'fuzzy example rule description for search',
			content: {
				ruleName: 'FuzzyMatchRule',
				description: 'fuzzy example rule description for search',
				content:
					'# FuzzyMatchRule\n\nfuzzy example rule description for search\n\n## Options\n\nThis rule has options.\n',
			},
		},
		{
			ruleName: 'DuplicateRule',
			description: 'example rule description',
			content: {
				ruleName: 'DuplicateRule',
				description: 'example rule description',
				content: '# DuplicateRule\n\nexample rule description\n\n## Options\n\nThis rule has options.\n',
			},
		},
	],
}));

describe('ads_get_lint_rules tool', () => {
	it('Returns valid JSON with exact structure (ruleName, description, content) for a single rule', async () => {
		const result = await getLintRulesTool({
			terms: ['icon-label'],
			exactName: true,
		});
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		expect(parsed).toHaveProperty('ruleName', 'icon-label');
		expect(parsed).toHaveProperty('description', 'Icon labels are used to describe what the icon is.');
		expect(parsed).toHaveProperty('content');
		expect(parsed.content).toContain('# icon-label');
		expect(Object.keys(parsed)).toEqual(['ruleName', 'description', 'content']);
	});

	it('Lists all lint rules as JSON array when no search terms provided', async () => {
		const result = await getLintRulesTool({});
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ ruleName: 'icon-label' }),
				expect.objectContaining({ ruleName: 'ensure-proper-xcss-usage' }),
			]),
		);
	});

	it('Lists all lint rules as JSON array when empty search terms array provided', async () => {
		const result = await getLintRulesTool({ terms: [] });
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed[0].ruleName).toBeDefined();
		expect(parsed[0].content).toBeDefined();
	});

	it('Returns only exact matches if `exactName` is set', async () => {
		const result = await getLintRulesTool({
			terms: ['ensure-proper-xcss-usage'],
			exactName: true,
		});
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		expect(parsed.ruleName).toBe('ensure-proper-xcss-usage');
		expect(parsed.content).toContain('xcss prop');
		expect(result.content[0].text).not.toContain('FuzzyMatchRule');
	});

	it('Returns fuse results when there is no exact match', async () => {
		const result = await getLintRulesTool({
			terms: ['fuzzy example rule description'],
		});
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		expect(parsed.ruleName).toBe('FuzzyMatchRule');
		expect(parsed.description).toBe('fuzzy example rule description for search');
	});

	it('Returns empty array when there are no matches', async () => {
		const result = await getLintRulesTool({
			terms: ['DOES NOT EXIST'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].text).toEqual('[]');
	});

	it('Deduplicates results', async () => {
		const result = await getLintRulesTool({ terms: ['DuplicateRule'] });
		expect(result.content).toHaveLength(1);
		const parsed = JSON.parse(result.content[0].text as string);
		const duplicateCount = Array.isArray(parsed)
			? parsed.filter((p: { ruleName: string }) => p.ruleName === 'DuplicateRule').length
			: 1;
		expect(duplicateCount).toBe(1);
	});

	it('Returns single rule with full content in JSON', async () => {
		const result = await getLintRulesTool({
			terms: ['icon-label'],
			exactName: true,
		});
		const parsed = JSON.parse(result.content[0].text as string);
		expect(parsed.content).toContain('# icon-label');
		expect(parsed.content).toContain('<ActivityIcon label="Activity">');
	});
});
