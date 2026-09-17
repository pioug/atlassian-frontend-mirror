import { getLegacyCompatibleComponents } from '../getLegacyCompatibleComponents';

const item = (key: string, title = key, app?: { source?: 'internal' | 'ecosystem' }) => ({
	key,
	title,
	...(app ? { app: { key, ...app } } : {}),
	action: jest.fn(() => ({}) as never),
});

const directComponent = (key: string) => ({
	type: 'menu-item' as const,
	key,
	parents: [{ type: 'menu-section' as const, key: 'section', rank: 1 }],
	component: () => null,
});

describe('getLegacyCompatibleComponents', () => {
	it('prefers direct registrations and adapts remaining legacy items', () => {
		const components = getLegacyCompatibleComponents({
			directComponents: [directComponent('direct')],
			onInsert: jest.fn(),
			providedItems: [item('direct'), item('legacy')],
		});

		expect(components.map(({ key }) => key)).toEqual([
			'quick-insert-provider-legacy',
			'quick-insert-provider-direct',
		]);
	});

	it('classifies matched ecosystem registrations while retaining raw matching keys', () => {
		const components = getLegacyCompatibleComponents({
			directComponents: [directComponent('direct'), directComponent('unmatched')],
			onInsert: jest.fn(),
			providedItems: [
				item('direct', 'direct', { source: 'ecosystem' }),
				item('fallback', 'fallback', { source: 'ecosystem' }),
				item('internal', 'internal', { source: 'internal' }),
			],
		});

		expect(components.map(({ key }) => key)).toEqual([
			'quick-insert-ecosystem-fallback',
			'quick-insert-provider-internal',
			'quick-insert-ecosystem-direct',
			'quick-insert-provider-unmatched',
		]);
	});

	it('applies legacy filtering to both direct and fallback items', () => {
		const components = getLegacyCompatibleComponents({
			directComponents: [directComponent('kept'), directComponent('hidden')],
			itemFilter: ({ key }) => key === 'kept',
			onInsert: jest.fn(),
			providedItems: [item('kept'), item('hidden')],
		});

		expect(components.map(({ key }) => key)).toEqual(['quick-insert-provider-kept']);
	});

	it('forwards provider onInsert callback to preferred direct component', () => {
		const onInsert = jest.fn();
		const providedItem = item('direct');
		let directOnInsert: (() => void) | undefined;
		const components = getLegacyCompatibleComponents({
			directComponents: [
				{
					...directComponent('direct'),
					component: (props) => {
						directOnInsert = props.onInsert as (() => void) | undefined;
						return null;
					},
				},
			],
			onInsert,
			providedItems: [providedItem],
		});

		components[0]?.component?.({ parents: [] });
		directOnInsert?.();

		expect(onInsert).toHaveBeenCalledWith(providedItem);
	});

	it('matches fallback registrations using legacy item metadata', () => {
		const components = getLegacyCompatibleComponents({
			directComponents: [],
			onInsert: jest.fn(),
			providedItems: [
				{
					...item('legacy', 'Provider title'),
					description: 'Provider description',
					keywords: ['provider-keyword'],
					keyshortcut: 'Ctrl+Alt+P',
				},
			],
		});
		const match = components[0]?.match;
		const formatMessage = jest.fn((message) => message.defaultMessage ?? '');

		for (const query of [
			'Provider title',
			'Provider description',
			'provider-keyword',
			'Ctrl+Alt+P',
		]) {
			expect(match?.({ formatMessage, query })).not.toBeNull();
		}
	});

	it('enriches direct registrations without overriding an explicit matcher', () => {
		const explicitMatch = jest.fn(() => ({ score: 0.25 }));
		const components = getLegacyCompatibleComponents({
			directComponents: [
				directComponent('derived'),
				{ ...directComponent('explicit'), match: explicitMatch },
			],
			onInsert: jest.fn(),
			providedItems: [{ ...item('derived'), keywords: ['derived-keyword'] }, item('explicit')],
		});
		const formatMessage = jest.fn((message) => message.defaultMessage ?? '');
		const derived = components.find(({ key }) => key === 'quick-insert-provider-derived');
		const explicit = components.find(({ key }) => key === 'quick-insert-provider-explicit');

		expect(derived?.match?.({ formatMessage, query: 'derived-keyword' })).not.toBeNull();
		expect(explicit?.match).toBe(explicitMatch);
	});
});
