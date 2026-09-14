import { combineQuickInsertProviders } from '../../../utils/combineQuickInsertProviders';

describe('combineQuickInsertProviders', () => {
	it('aggregates optional components only from providers that implement the method', async () => {
		const component = {
			type: 'menu-item' as const,
			key: 'direct',
			parents: [{ type: 'menu-section' as const, key: 'section', rank: 1 }],
			component: () => null,
		};
		const provider = combineQuickInsertProviders([
			{ getItems: async () => [] },
			{ getItems: async () => [], getComponents: async () => [component] },
		]);

		await expect(provider.getComponents?.()).resolves.toEqual([component]);
	});
});
