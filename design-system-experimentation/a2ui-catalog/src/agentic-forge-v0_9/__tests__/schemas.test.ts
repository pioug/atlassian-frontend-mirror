/**
 * Catalog-side guarantees for the Agentic Forge v0.9 schemas.
 * ResultPanel props are literal title and summary strings, with no action
 * payload. MultipleChoice accepts a bound or literal string-array value.
 */

import { MultipleChoiceSchema, ResultPanelSchema } from '../schemas';

const resultPanel = {
	title: 'Expenses approved',
	summary:
		'Approved 2 expenses totalling $120.00 AUD in report EXP-42.\n\nTrain ticket · $30.00 AUD\nHotel · $90.00 AUD',
};

describe('Agentic Forge v0.9 ResultPanel schema', () => {
	it('parses title and summary and keeps line breaks', () => {
		const parsed = ResultPanelSchema.parse(resultPanel);

		expect(parsed.title).toBe('Expenses approved');
		expect(parsed.summary).toBe(resultPanel.summary);
		expect(Object.keys(parsed).sort()).toEqual(['summary', 'title']);
	});

	it('rejects an empty title or summary', () => {
		expect(() => ResultPanelSchema.parse({ ...resultPanel, title: '' })).toThrow();
		expect(() => ResultPanelSchema.parse({ ...resultPanel, summary: '' })).toThrow();
	});

	it('rejects path bindings', () => {
		expect(() =>
			ResultPanelSchema.parse({ ...resultPanel, title: { path: '/result/title' } }),
		).toThrow();
		expect(() =>
			ResultPanelSchema.parse({ ...resultPanel, summary: { path: '/result/summary' } }),
		).toThrow();
	});

	it('rejects an action prop', () => {
		expect(() =>
			ResultPanelSchema.parse({
				...resultPanel,
				action: { event: { name: 'approve' } },
			}),
		).toThrow();
	});
});

const multipleChoice = {
	label: 'Priority',
	options: [
		{ label: 'High', value: 'high' },
		{ label: 'Normal', value: 'normal' },
	],
	value: { path: '/priority' },
};

describe('Agentic Forge v0.9 MultipleChoice schema', () => {
	it('parses a bound select and keeps option values', () => {
		const parsed = MultipleChoiceSchema.parse(multipleChoice);

		expect(parsed.label).toBe('Priority');
		expect(parsed.options).toEqual(multipleChoice.options);
		expect(parsed.value).toEqual({ path: '/priority' });
	});

	it('accepts a literal string array value', () => {
		const parsed = MultipleChoiceSchema.parse({ ...multipleChoice, value: ['high'] });

		expect(parsed.value).toEqual(['high']);
	});

	it('accepts the action style', () => {
		const parsed = MultipleChoiceSchema.parse({ ...multipleChoice, style: 'action' });

		expect(parsed.style).toBe('action');
	});

	it('rejects an unknown style and a non-string option value', () => {
		expect(() => MultipleChoiceSchema.parse({ ...multipleChoice, style: 'chips' })).toThrow();
		expect(() =>
			MultipleChoiceSchema.parse({
				...multipleChoice,
				options: [{ label: 'High', value: 1 }],
			}),
		).toThrow();
	});
});
