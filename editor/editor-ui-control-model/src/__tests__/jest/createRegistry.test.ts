import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { createRegistry } from '../../createRegistry';

const component = (key: string) => ({
	type: 'menu-item' as const,
	key,
	parents: [{ type: 'menu-section' as const, key: 'section', rank: 1 }],
});

describe('createRegistry', () => {
	describe('when the slash command experiment is disabled', () => {
		beforeEach(() => {
			mockExpDisabled('platform_editor_slash_command');
			mockExpDisabled('platform_editor_block_control_migration');
		});

		it('appends registrations', () => {
			const registry = createRegistry();
			registry.register([component('item')]);
			registry.register([{ ...component('item'), isHidden: () => true }]);

			expect(registry.components).toHaveLength(2);
			expect(registry.components[1]?.isHidden).toBeDefined();
			expect(registry.getComponent({ type: 'menu-item', key: 'item' })).toBeUndefined();
		});

		it('retains the existing unregistration behavior', () => {
			const registry = createRegistry();
			registry.register([component('item')]);

			registry.unregister([{ type: 'menu-item', key: 'item' }]);

			expect(registry.components).toEqual([]);
		});

		it('retains the existing uncached string lookup order', () => {
			const registry = createRegistry();
			const surface = { key: 'surface', type: 'toolbar' as const };
			const lowerPrioritySection = {
				key: 'lower-priority',
				type: 'section' as const,
				parents: [{ ...surface, rank: 200 }],
			};
			const higherPrioritySection = {
				key: 'higher-priority',
				type: 'section' as const,
				parents: [{ ...surface, rank: 100 }],
			};
			registry.register([surface, lowerPrioritySection, higherPrioritySection]);

			const firstLookup = registry.getComponents(surface.key);
			const secondLookup = registry.getComponents(surface.key);

			expect(firstLookup).toEqual([surface, lowerPrioritySection, higherPrioritySection]);
			expect(secondLookup).not.toBe(firstLookup);
		});
	});

	describe('when the slash command experiment is enabled', () => {
		beforeEach(() => {
			mockExpEnabled('platform_editor_slash_command');
			mockExpDisabled('platform_editor_block_control_migration');
		});

		it('deduplicates components', () => {
			const registry = createRegistry();
			registry.register([component('item')]);
			registry.register([component('item'), component('other'), component('other')]);

			expect(registry.components).toEqual([component('item'), component('other')]);
		});

		it('replaces and unregisters a component by its stable identity', () => {
			const registry = createRegistry();
			registry.register([component('item')]);
			registry.register([{ ...component('item'), isHidden: () => true }], {
				replaceExisting: true,
			});

			expect(registry.components).toHaveLength(1);
			expect(registry.getComponent({ type: 'menu-item', key: 'item' })?.isHidden).toBeDefined();

			registry.unregister([{ type: 'menu-item', key: 'item' }]);
			expect(registry.components).toEqual([]);
		});

		it('caches ranked surface lookup and invalidates it after replacement', () => {
			const registry = createRegistry();
			const surfaceA = { key: 'surface-a', type: 'toolbar' as const };
			const surfaceB = { key: 'surface-b', type: 'toolbar' as const };
			const sectionA = {
				key: 'section',
				type: 'section' as const,
				parents: [{ ...surfaceA, rank: 1 }],
			};
			registry.register([surfaceA, surfaceB, sectionA]);

			const firstLookup = registry.getComponents(surfaceA.key);
			expect(registry.getComponents(surfaceA.key)).toBe(firstLookup);

			const sectionB = { ...sectionA, parents: [{ ...surfaceB, rank: 1 }] };
			registry.register([sectionB], { replaceExisting: true });

			expect(registry.getComponents(surfaceA.key)).toEqual([surfaceA]);
			expect(registry.getComponents(surfaceB.key)).toEqual([surfaceB, sectionB]);
		});
	});

	describe('when the block control migration experiment is enabled', () => {
		beforeEach(() => {
			mockExpDisabled('platform_editor_slash_command');
			mockExpEnabled('platform_editor_block_control_migration');
		});

		it('resolves a surface registered after its descendants', () => {
			const registry = createRegistry();
			const section = {
				key: 'section',
				type: 'section' as const,
				parents: [{ key: 'surface', type: 'toolbar' as const, rank: 1 }],
			};
			registry.register([section]);

			expect(registry.getComponents({ key: 'surface', type: 'toolbar' })).toEqual([]);

			const surface = { key: 'surface', type: 'toolbar' as const };
			registry.register([surface]);
			expect(registry.getComponents(surface)).toEqual([surface, section]);
		});

		it('invalidates a cached surface after unregistering a descendant', () => {
			const registry = createRegistry();
			const surface = { key: 'surface', type: 'toolbar' as const };
			const section = {
				key: 'section',
				type: 'section' as const,
				parents: [{ ...surface, rank: 1 }],
			};
			registry.register([surface, section]);
			expect(registry.getComponents(surface)).toEqual([surface, section]);

			registry.unregister([{ key: 'section', type: 'section' }]);
			expect(registry.getComponents(surface)).toEqual([surface]);
		});

		it('keeps registrations with the same key and different types distinct', () => {
			const registry = createRegistry();
			const surface = { key: 'shared', type: 'toolbar' as const };
			const section = {
				key: 'shared',
				type: 'section' as const,
				parents: [{ key: 'shared', type: 'toolbar' as const, rank: 1 }],
			};
			registry.register([surface, section]);

			expect(registry.getComponents(surface)).toEqual([surface, section]);
			expect(registry.getComponent({ key: 'shared', type: 'toolbar' })).toBeUndefined();
			expect(registry.getComponent({ key: 'shared', type: 'section' })).toBeUndefined();
		});

		it('retains append registration semantics', () => {
			const registry = createRegistry();
			registry.register([component('item')]);
			registry.register([{ ...component('item'), isHidden: () => true }]);

			expect(registry.components).toHaveLength(2);
		});

		it('isolates left and right surface descendants with equivalent ranks and keys', () => {
			const registry = createRegistry();
			const left = { key: 'left', type: 'toolbar' as const };
			const right = { key: 'right', type: 'toolbar' as const };
			const leftSection = {
				key: 'shared',
				type: 'section' as const,
				parents: [{ ...left, rank: 100 }],
			};
			const rightSection = {
				key: 'right-section',
				type: 'section' as const,
				parents: [{ ...right, rank: 100 }],
			};
			const rightGroup = {
				key: 'shared',
				type: 'group' as const,
				parents: [{ ...rightSection, rank: 100 }],
			};
			registry.register([left, right, leftSection, rightSection, rightGroup]);

			expect(registry.getComponents(left)).toEqual([left, leftSection]);
			expect(registry.getComponents(right)).toEqual([right, rightSection, rightGroup]);
		});
	});

	describe('subscriptions', () => {
		beforeEach(() => {
			mockExpEnabled('platform_editor_slash_command');
			mockExpDisabled('platform_editor_block_control_migration');
		});

		it('notifies subscribers after registration and unregistration', () => {
			const registry = createRegistry();
			const listener = jest.fn();
			registry.subscribe(listener);
			const item = component('item');

			registry.register([item]);
			registry.unregister([{ type: item.type, key: item.key }]);

			expect(listener).toHaveBeenCalledTimes(2);
		});

		it('stops notifying an unsubscribed listener', () => {
			const registry = createRegistry();
			const listener = jest.fn();
			const unsubscribe = registry.subscribe(listener);

			unsubscribe();
			registry.register([component('item')]);

			expect(listener).not.toHaveBeenCalled();
		});

		it('notifies after invalidating the surface cache', () => {
			const registry = createRegistry();
			const surface = { key: 'surface', type: 'toolbar' as const };
			const section = {
				key: 'section',
				type: 'section' as const,
				parents: [{ ...surface, rank: 1 }],
			};
			registry.register([surface]);
			const cachedSurface = registry.getComponents(surface);
			const listener = jest.fn(() => {
				expect(registry.getComponents(surface)).toEqual([surface, section]);
				expect(registry.getComponents(surface)).not.toBe(cachedSurface);
			});
			registry.subscribe(listener);

			registry.register([section]);

			expect(listener).toHaveBeenCalledTimes(1);
		});
	});
});
