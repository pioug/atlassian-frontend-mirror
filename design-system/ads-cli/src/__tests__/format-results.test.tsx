import { formatCompactResults } from '../output/format-results';

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
		expect(out).toContain('Button  @atlaskit/button  (3 props, 1 example)');
		// Single-kind listings are terse by default.
		expect(out).not.toContain('→ ads-cli component Button');
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
	});

	it('pluralises prop/example counts correctly', () => {
		const out = formatCompactResults({
			kind: 'components',
			data: [{ name: 'Icon', package: '@atlaskit/icon', props: [1], examples: [] }],
		});
		expect(out).toContain('(1 prop, 0 examples)');
	});

	it('renders tokens as name = value lines', () => {
		const out = formatCompactResults({
			kind: 'tokens',
			data: [{ name: 'space.100', exampleValue: '8px' }],
		});
		expect(out).toContain('space.100 = 8px');
	});

	it('truncates very long token values to keep one line', () => {
		const longValue = 'a'.repeat(200);
		const out = formatCompactResults({
			kind: 'tokens',
			data: [{ name: 'motion.long', exampleValue: longValue }],
		});
		// The truncated line must be far shorter than the raw value and end with an ellipsis.
		const line = out?.split('\n').find((l) => l.startsWith('motion.long')) ?? '';
		expect(line.length).toBeLessThan(120);
		expect(line).toContain('…');
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
		expect(out).toContain('AddIcon  @atlaskit/icon/core/add  — Reserved for adding.');
	});

	it('tolerates missing optional fields', () => {
		const out = formatCompactResults({ kind: 'components', data: [{}] });
		expect(out).toContain('(unknown)');
	});
});
