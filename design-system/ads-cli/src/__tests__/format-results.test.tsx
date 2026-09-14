import { compactResults } from '../output/compact-results';
import { createDocSearchResults } from '../output/create-doc-search-results';
import { formatCompactResults } from '../output/format-results';

describe('compactResults', () => {
	it('projects rich component discovery payloads into the fields shown by the human row', () => {
		expect(
			compactResults({
				kind: 'components',
				data: [
					{
						name: 'Button',
						package: '@atlaskit/button',
						props: [{ name: 'appearance' }, { name: 'isDisabled' }],
						examples: ['<Button />'],
						designSource: { figmaUrl: 'https://example.com' },
					},
				],
				showFollowUp: true,
			}),
		).toEqual([
			{
				name: 'Button',
				package: '@atlaskit/button',
				propCount: 2,
				exampleCount: 1,
				followUp: 'component Button',
			},
		]);
	});

	it('is idempotent for compact rows used by batch rendering', () => {
		const rows = [
			{
				name: 'Button',
				package: '@atlaskit/button',
				propCount: 2,
				exampleCount: 1,
				followUp: 'component Button',
			},
		];
		expect(compactResults({ kind: 'components', data: rows, showFollowUp: true })).toEqual(rows);
	});

	it('bounds token and icon text in the JSON projection as well as the human view', () => {
		const longText = 'word '.repeat(40);
		const tokens = compactResults({
			kind: 'tokens',
			data: [{ name: 'motion.long', exampleValue: longText }],
		});
		const icons = compactResults({
			kind: 'icons',
			data: [{ componentName: 'LongIcon', usage: longText }],
		});

		expect((tokens?.[0] as { exampleValue?: string }).exampleValue).toContain('…');
		expect((icons?.[0] as { usage?: string }).usage).toContain('…');
	});

	it('only includes document follow-up commands when requested', () => {
		const data = [
			{
				title: 'Spacing',
				summary: 'Spacing guidance.',
				followUp: 'docs spacing',
			},
		];

		expect(compactResults({ kind: 'docs', data })).toEqual([
			{
				title: 'Spacing',
				summary: 'Spacing guidance.',
			},
		]);
		expect(compactResults({ kind: 'docs', data, showFollowUp: true })).toEqual(data);
	});
});

describe('formatCompactResults', () => {
	it('returns null for non-array data so the caller can fall back', () => {
		expect(formatCompactResults({ kind: 'components', data: 'some markdown' })).toBeNull();
		expect(formatCompactResults({ kind: 'components', data: { name: 'x' } })).toBeNull();
	});

	it('reports "No results." for an empty array', () => {
		expect(formatCompactResults({ kind: 'components', data: [] })).toBe('No results.');
	});

	it('renders components as compact lines without a follow-up by default', () => {
		const out = formatCompactResults({
			kind: 'components',
			data: [{ name: 'Button', package: '@atlaskit/button', props: [1, 2, 3], examples: ['x'] }],
		});
		expect(out).toContain('Results (1):');
		expect(out).toContain('Button  @atlaskit/button');
		expect(out).toContain('3 props');
		expect(out).toContain('1 example');
		// Single-kind listings are terse by default.
		expect(out).not.toContain('→ ads-cli component Button');
	});

	it('renders an already-compact component row without losing its counts', () => {
		const out = formatCompactResults({
			kind: 'components',
			data: [{ name: 'Button', propCount: 13, exampleCount: 3 }],
		});
		expect(out).toContain('Button');
		expect(out).toContain('13 props');
		expect(out).toContain('3 examples');
	});

	it('adds a per-row follow-up hint for every kind when showFollowUp is set', () => {
		const components = formatCompactResults({
			kind: 'components',
			data: [{ name: 'Button', package: '@atlaskit/button', props: [], examples: [] }],
			showFollowUp: true,
		});
		expect(components).toContain('→ ads-cli component Button');

		const tokens = formatCompactResults({
			kind: 'tokens',
			data: [{ name: 'space.100', exampleValue: '8px' }],
			showFollowUp: true,
		});
		expect(tokens).toContain('→ ads-cli token space.100');

		const icons = formatCompactResults({
			kind: 'icons',
			data: [{ componentName: 'AddIcon', package: '@atlaskit/icon/core/add', usage: 'Add.' }],
			showFollowUp: true,
		});
		expect(icons).toContain('→ ads-cli icon AddIcon');

		const docs = formatCompactResults({
			kind: 'docs',
			data: [
				{
					title: 'Color accessibility',
					summary: 'Meet contrast requirements.',
					followUp: 'docs contrast',
				},
			],
			showFollowUp: true,
		});
		expect(docs).toContain('Color accessibility');
		expect(docs).toContain('Meet contrast requirements.');
		expect(docs).toContain('→ ads-cli docs contrast');
	});

	it('uses the supplied invocation in follow-up hints', () => {
		const out = formatCompactResults({
			kind: 'components',
			data: [{ name: 'CountrySelect', package: '@atlaskit/select', props: [], examples: [] }],
			showFollowUp: true,
			invocation: 'atlas ads',
		});

		expect(out).toContain('→ atlas ads component CountrySelect');
		expect(out).not.toContain('→ ads-cli component CountrySelect');
	});

	it('pluralises prop/example counts correctly', () => {
		const out = formatCompactResults({
			kind: 'components',
			data: [{ name: 'Icon', package: '@atlaskit/icon', props: [1], examples: [] }],
		});
		expect(out).toContain('1 prop');
		expect(out).toContain('0 examples');
	});

	it('renders tokens as name = value lines', () => {
		const out = formatCompactResults({
			kind: 'tokens',
			data: [{ name: 'space.100', exampleValue: '8px' }],
		});
		expect(out).toContain('space.100');
		expect(out).toContain('= 8px');
	});

	it('truncates very long token values to keep one line', () => {
		const longValue = 'a'.repeat(200);
		const out = formatCompactResults({
			kind: 'tokens',
			data: [{ name: 'motion.long', exampleValue: longValue }],
		});
		// The truncated line must be far shorter than the raw value and end with an ellipsis.
		expect(out?.length ?? 0).toBeLessThan(240);
		expect(out).toContain('…');
	});

	it('renders icons with package and truncated usage', () => {
		const out = formatCompactResults({
			kind: 'icons',
			data: [
				{
					componentName: 'AddIcon',
					package: '@atlaskit/icon/core/add',
					usage: 'Reserved for adding.',
				},
			],
		});
		expect(out).toContain('AddIcon  @atlaskit/icon/core/add');
		expect(out).toContain('Reserved for adding.');
	});

	it('tolerates missing optional fields', () => {
		const out = formatCompactResults({ kind: 'components', data: [{}] });
		expect(out).toContain('(unknown)');
	});
});

describe('createDocSearchResults', () => {
	it('uses the query as the title and previews the leading textual content', () => {
		const results = createDocSearchResults({
			data: [
				'The consistent and intentional use of a spacing system creates a more harmonious',
				'experience for the end user and lays a foundation for responsive design.',
				'',
				'## 8 pixel base unit',
				'',
				'Our spacing system uses an 8 pixel base unit.',
			].join('\n'),
			query: 'spacing',
		});

		expect(results).toEqual([
			{
				title: 'Spacing',
				summary:
					'The consistent and intentional use of a spacing system creates a more harmonious experience for the…',
				followUp: 'docs spacing',
			},
		]);
	});

	it('removes Markdown and MDX presentation syntax from the preview', () => {
		const results = createDocSearchResults({
			data: [
				'<SectionMessage title="">',
				'Use **color tokens** and review [ADS guidance](https://atlassian.design).',
				'</SectionMessage>',
			].join('\n'),
			query: 'color',
		});

		expect(results).toEqual([
			{
				title: 'Color',
				summary: 'Use color tokens and review ADS guidance.',
				followUp: 'docs color',
			},
		]);
	});
});
