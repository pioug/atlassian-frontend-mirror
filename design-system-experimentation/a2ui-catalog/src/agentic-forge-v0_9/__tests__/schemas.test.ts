/**
 * Catalog-side guarantee that Agentic Forge v0.9 ResultPanel props are
 * literal title and summary strings, with no action payload.
 */

import { ResultPanelSchema } from '../schemas';

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
