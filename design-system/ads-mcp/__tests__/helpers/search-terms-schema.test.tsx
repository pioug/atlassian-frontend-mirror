import { searchTermsSchema } from '../../src/helpers/search-terms-schema';
import { validateToolArguments } from '../../src/helpers/validation';
import { zodToJsonSchema } from '../../src/helpers/zod-to-json-schema';
import { getGuidelinesInputSchema } from '../../src/tools/get-guidelines/get-guidelines-input-schema';
import { getLintRulesInputSchema } from '../../src/tools/get-lint-rules/get-lint-rules-input-schema';
import { planInputSchema } from '../../src/tools/plan/plan-input-schema';
import { searchAtlaskitComponentsInputSchema } from '../../src/tools/search-atlaskit-components/search-atlaskit-components-input-schema';
import { searchAtlaskitHooksInputSchema } from '../../src/tools/search-atlaskit-hooks/search-atlaskit-hooks-input-schema';
import { searchAtlaskitUtilitiesInputSchema } from '../../src/tools/search-atlaskit-utilities/search-atlaskit-utilities-input-schema';
import { searchComponentsInputSchema } from '../../src/tools/search-components/search-components-input-schema';
import { searchIconsInputSchema } from '../../src/tools/search-icons/search-icons-input-schema';
import { searchTokensInputSchema } from '../../src/tools/search-tokens/search-tokens-input-schema';

const requiredTermSchemas = [
	['ads_search_components', searchComponentsInputSchema],
	['ads_search_tokens', searchTokensInputSchema],
	['ads_search_icons', searchIconsInputSchema],
	['atlaskit_search_components', searchAtlaskitComponentsInputSchema],
	['atlaskit_search_hooks', searchAtlaskitHooksInputSchema],
	['atlaskit_search_utilities', searchAtlaskitUtilitiesInputSchema],
] as const;

const optionalTermSchemas = [
	['ads_get_guidelines', getGuidelinesInputSchema],
	['ads_get_lint_rules', getLintRulesInputSchema],
] as const;

const termSchemas = [...requiredTermSchemas, ...optionalTermSchemas] as const;

const planFields = ['tokens', 'icons', 'components', 'atlaskitComponents'] as const;

describe('search term input compatibility', () => {
	it.each(termSchemas)('%s parses a phrase identically to a one-item array', (_, schema) => {
		const phrase = 'empty state, loading';
		expect(schema.parse({ terms: phrase, limit: 3 })).toEqual(
			schema.parse({ terms: [phrase], limit: 3 }),
		);
		expect(schema.parse({ terms: phrase }).terms).toEqual([phrase]);
		expect(schema.parse({ terms: ['second', 'first', 'second'] }).terms).toEqual([
			'second',
			'first',
			'second',
		]);
		expect(schema.parse({ terms: [] }).terms).toEqual([]);
	});

	it.each(termSchemas)('%s advertises both accepted input forms', (_, schema) => {
		const json = zodToJsonSchema<{ properties: { terms: { anyOf: unknown[] } } }>(schema);
		expect(json.properties.terms.anyOf).toEqual([
			{ type: 'string' },
			{ type: 'array', items: { type: 'string' } },
		]);
	});

	it.each([null, 42, { query: 'button' }, ['button', 42]])(
		'rejects invalid term input %j across all query schemas',
		(terms) => {
			for (const [, schema] of termSchemas) {
				expect(schema.safeParse({ terms }).success).toBe(false);
			}
			for (const field of planFields) {
				expect(planInputSchema.safeParse({ [field]: terms }).success).toBe(false);
			}
		},
	);

	it('preserves required search fields and optional all-resource lookups', () => {
		for (const [, schema] of requiredTermSchemas) {
			expect(schema.safeParse({}).success).toBe(false);
		}
		for (const [, schema] of optionalTermSchemas) {
			expect(schema.parse({})).toEqual({});
		}
		expect(planInputSchema.parse({})).toEqual({
			tokens: [],
			icons: [],
			components: [],
			atlaskitComponents: [],
		});
		expect(searchTermsSchema.parse('')).toEqual(['']);
	});

	it.each(planFields)('normalizes the planner %s query and preserves omitted defaults', (field) => {
		const parsed = planInputSchema.parse({ [field]: 'browse a collection', limit: 1 });
		expect(parsed[field]).toEqual(['browse a collection']);
		for (const other of planFields.filter((name) => name !== field)) {
			expect(parsed[other]).toEqual([]);
		}
	});

	it('passes normalized arrays through the shared validator with their output type', () => {
		const parsed = validateToolArguments(searchComponentsInputSchema, { terms: 'Button' });
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			const terms: string[] = parsed.data.terms;
			expect(terms).toEqual(['Button']);
		}
	});
});
