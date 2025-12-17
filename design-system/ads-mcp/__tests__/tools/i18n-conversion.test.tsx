import { i18nConversionInputSchema, i18nConversionTool } from '../../src/tools/i18n-conversion';

describe('ads_i18n_conversion_guide tool', () => {
	describe('Input schema validation', () => {
		it('Accepts valid guide parameter', () => {
			const result = i18nConversionInputSchema.safeParse({
				guide: 'hardcoded-string-to-formatmessage',
			});
			expect(result.success).toBe(true);
		});

		it('Rejects invalid guide parameter', () => {
			const result = i18nConversionInputSchema.safeParse({
				guide: 'unknown-guide',
			});
			expect(result.success).toBe(false);
		});

		it('Rejects missing guide parameter', () => {
			const result = i18nConversionInputSchema.safeParse({});
			expect(result.success).toBe(false);
		});
	});

	describe('Guide retrieval', () => {
		let parsedResult: any;

		beforeAll(async () => {
			const result = await i18nConversionTool({
				guide: 'hardcoded-string-to-formatmessage',
			});
			parsedResult = JSON.parse(result.content[0].text);
		});

		it('Returns valid JSON response structure', () => {
			expect(parsedResult).toHaveProperty('id');
			expect(parsedResult).toHaveProperty('title');
			expect(parsedResult).toHaveProperty('description');
			expect(parsedResult).toHaveProperty('purpose');
			expect(parsedResult).toHaveProperty('scope');
			expect(parsedResult).toHaveProperty('implementationChecklist');
			expect(parsedResult).toHaveProperty('patterns');
			expect(parsedResult).toHaveProperty('bestPractices');
			expect(parsedResult).toHaveProperty('commonPitfalls');
			expect(parsedResult).toHaveProperty('additionalResources');
		});

		it('Returns correct guide metadata', () => {
			expect(parsedResult.id).toBe('hardcoded-string-to-formatmessage');
			expect(parsedResult.title).toBe('Hardcoded String to formatMessage Conversion Guide');
		});

		it('Returns arrays with correct structure', () => {
			expect(Array.isArray(parsedResult.patterns)).toBe(true);
			expect(Array.isArray(parsedResult.bestPractices)).toBe(true);
			expect(Array.isArray(parsedResult.commonPitfalls)).toBe(true);
			expect(Array.isArray(parsedResult.implementationChecklist)).toBe(true);
			expect(Array.isArray(parsedResult.additionalResources)).toBe(true);

			expect(parsedResult.patterns.length).toBeGreaterThan(0);
			expect(parsedResult.bestPractices.length).toBeGreaterThan(0);
			expect(parsedResult.commonPitfalls.length).toBeGreaterThan(0);
			expect(parsedResult.implementationChecklist.length).toBeGreaterThan(0);
			expect(parsedResult.additionalResources.length).toBeGreaterThan(0);
		});

		it('Patterns have required structure', () => {
			parsedResult.patterns.forEach((pattern: any) => {
				expect(pattern).toHaveProperty('title');
				expect(pattern).toHaveProperty('description');
				expect(pattern).toHaveProperty('before');
				expect(pattern).toHaveProperty('after');
				expect(pattern).toHaveProperty('explanation');
				expect(pattern.before.length).toBeGreaterThan(0);
				expect(pattern.after.length).toBeGreaterThan(0);
			});
		});

		it('Includes required content', () => {
			const checklistText = parsedResult.implementationChecklist.join(' ');
			expect(checklistText).toContain('CRITICAL');
			expect(checklistText).toContain('defineMessage');
			expect(checklistText).toContain('formatMessage');

			const resourceText = parsedResult.additionalResources.join(' ');
			expect(resourceText.toLowerCase()).toContain('ignore patterns');

			expect(parsedResult.purpose).toContain('hardcoded strings');
			expect(parsedResult.scope).toContain('CRITICAL');
		});
	});

	describe('Response format', () => {
		it('Returns valid JSON', async () => {
			const result = await i18nConversionTool({
				guide: 'hardcoded-string-to-formatmessage',
			});

			expect(result.content).toHaveLength(1);
			expect(result.content[0].type).toBe('text');
			expect(() => JSON.parse(result.content[0].text)).not.toThrow();
			expect(result.content[0].text).toContain('\n'); // Formatted JSON
		});
	});
});
