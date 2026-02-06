import { getLintRulesTool } from '../../src/tools/get-lint-rules';

jest.mock('../../src/tools/get-lint-rules/lint-rules-structured-content.codegen', () => ({
	lintRulesStructuredContent: [
		{
			ruleName: 'icon-label',
			description: 'Icon labels are used to describe what the icon is.',
			content:
				'# icon-label\n\nIcon labels are used to describe what the icon is.\n\n## Examples\n\n### Incorrect\n\n```js\n<ActivityIcon>\n```\n\n### Correct\n\n```js\n<ActivityIcon label="Activity">\n```\n',
		},
		{
			ruleName: 'ensure-proper-xcss-usage',
			description: 'This ESLint rule enforces proper usage of the xcss prop.',
			content:
				'# ensure-proper-xcss-usage\n\nThis ESLint rule enforces proper usage of the xcss prop.\n\n### Incorrect\n\n```tsx\n<Box xcss={oldStyles} />\n```\n\n### Correct\n\n```tsx\n<Box xcss={styles.root} />\n```\n',
		},
		{
			ruleName: 'FuzzyMatchRule',
			description: 'fuzzy example rule description for search',
			content:
				'# FuzzyMatchRule\n\nfuzzy example rule description for search\n\n## Options\n\nThis rule has options.\n',
		},
		{
			ruleName: 'DuplicateRule',
			description: 'example rule description',
			content:
				'# DuplicateRule\n\nexample rule description\n\n## Options\n\nThis rule has options.\n',
		},
	],
}));

describe('ads_get_lint_rules tool', () => {
	it('Lists all lint rules in Markdown format when no search terms provided', async () => {
		const result = await getLintRulesTool({});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# icon-label');
		expect(result.content[0].text).toContain('Icon labels are used to describe');
		expect(result.content[0].text).toContain('# ensure-proper-xcss-usage');
		expect(result.content[0].text).toContain('xcss prop');
	});

	it('Lists all lint rules in Markdown format when empty search terms array provided', async () => {
		const result = await getLintRulesTool({ terms: [] });
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# icon-label');
		expect(result.content[0].text).toContain('# ensure-proper-xcss-usage');
	});

	it('Returns only exact matches if `exactName` is set', async () => {
		const result = await getLintRulesTool({
			terms: ['ensure-proper-xcss-usage'],
			exactName: true,
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# ensure-proper-xcss-usage');
		expect(result.content[0].text).toContain('xcss prop');
		expect(result.content[0].text).not.toContain('FuzzyMatchRule');
	});

	it('Returns fuse results when there is no exact match', async () => {
		const result = await getLintRulesTool({
			terms: ['fuzzy example rule description'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toContain('# FuzzyMatchRule');
		expect(result.content[0].text).toContain('fuzzy example rule description');
	});

	it('Returns empty results if there are no matches', async () => {
		const result = await getLintRulesTool({
			terms: ['DOES NOT EXIST'],
		});
		expect(result.content).toHaveLength(1);
		expect(result.content[0].type).toEqual('text');
		expect(result.content[0].text).toEqual('');
	});

	it('Deduplicates results', async () => {
		const result = await getLintRulesTool({ terms: ['DuplicateRule'] });
		expect(result.content).toHaveLength(1);
		const markdownText = result.content[0].text as string;
		const duplicateCount = (markdownText.match(/# DuplicateRule/g) || []).length;
		expect(duplicateCount).toBe(1);
	});

	it('Formats lint rules correctly in Markdown format', async () => {
		const result = await getLintRulesTool({
			terms: ['icon-label'],
			exactName: true,
		});
		expect(result.content[0].text).toEqual(
			'# icon-label\n\nIcon labels are used to describe what the icon is.\n\n## Examples\n\n### Incorrect\n\n```js\n<ActivityIcon>\n```\n\n### Correct\n\n```js\n<ActivityIcon label="Activity">\n```\n',
		);
	});
});
