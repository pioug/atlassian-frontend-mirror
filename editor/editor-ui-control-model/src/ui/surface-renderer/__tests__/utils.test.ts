import type { RegisterComponent } from '../../../types';
import type { ChildrenMap } from '../types';
import { buildChildrenMap, findSurface, willComponentRender } from '../utils';

describe('findSurface', () => {
	it('should find a root component matching key and type', () => {
		const root: RegisterComponent = { key: 'toolbar', type: 'toolbar' };
		const child: RegisterComponent = {
			key: 'section',
			type: 'section',
			parents: [{ key: 'toolbar', type: 'toolbar', rank: 1 }],
		};

		const result = findSurface([root, child], { key: 'toolbar', type: 'toolbar' });
		expect(result).toBe(root);
	});

	it('should return undefined when no match is found', () => {
		const root: RegisterComponent = { key: 'toolbar', type: 'toolbar' };
		const result = findSurface([root], { key: 'missing', type: 'toolbar' });
		expect(result).toBeUndefined();
	});

	it('should not match a component that has parents', () => {
		const nonRoot = {
			key: 'toolbar',
			type: 'toolbar',
			parents: [{ key: 'wrapper', type: 'wrapper', rank: 1 }],
		} as unknown as RegisterComponent;

		const result = findSurface([nonRoot], { key: 'toolbar', type: 'toolbar' });
		expect(result).toBeUndefined();
	});

	it('should treat empty parents array as a root', () => {
		const root = { key: 'toolbar', type: 'toolbar', parents: [] } as unknown as RegisterComponent;
		const result = findSurface([root], { key: 'toolbar', type: 'toolbar' });
		expect(result).toBe(root);
	});

	it('should match by both key and type', () => {
		const menu: RegisterComponent = { key: 'primary', type: 'menu' };
		const toolbar: RegisterComponent = { key: 'primary', type: 'toolbar' };

		expect(findSurface([menu, toolbar], { key: 'primary', type: 'menu' })).toBe(menu);
		expect(findSurface([menu, toolbar], { key: 'primary', type: 'toolbar' })).toBe(toolbar);
	});
});

describe('buildChildrenMap', () => {
	it('should group children by parent key', () => {
		const components: RegisterComponent[] = [
			{ key: 'root', type: 'toolbar' },
			{
				key: 'section-1',
				type: 'section',
				parents: [{ key: 'root', type: 'toolbar', rank: 1 }],
			},
			{
				key: 'section-2',
				type: 'section',
				parents: [{ key: 'root', type: 'toolbar', rank: 2 }],
			},
		];

		const map = buildChildrenMap(components);

		expect(map.get('root')).toHaveLength(2);
		expect(map.get('root')![0].key).toBe('section-1');
		expect(map.get('root')![1].key).toBe('section-2');
	});

	it('should sort children by rank within each parent', () => {
		const components: RegisterComponent[] = [
			{
				key: 'c',
				type: 'section',
				parents: [{ key: 'root', type: 'toolbar', rank: 300 }],
			},
			{
				key: 'a',
				type: 'section',
				parents: [{ key: 'root', type: 'toolbar', rank: 100 }],
			},
			{
				key: 'b',
				type: 'section',
				parents: [{ key: 'root', type: 'toolbar', rank: 200 }],
			},
		];

		const map = buildChildrenMap(components);
		const children = map.get('root')!;

		expect(children[0].key).toBe('a');
		expect(children[1].key).toBe('b');
		expect(children[2].key).toBe('c');
	});

	it('should handle components with multiple parents', () => {
		const components: RegisterComponent[] = [
			{
				key: 'shared',
				type: 'button',
				parents: [
					{ key: 'group-a', type: 'group', rank: 1 },
					{ key: 'group-b', type: 'group', rank: 1 },
				],
			},
		];

		const map = buildChildrenMap(components);

		expect(map.get('group-a')).toHaveLength(1);
		expect(map.get('group-a')![0].key).toBe('shared');
		expect(map.get('group-b')).toHaveLength(1);
		expect(map.get('group-b')![0].key).toBe('shared');
	});

	it('should not include root components (no parents) in the map', () => {
		const components: RegisterComponent[] = [
			{ key: 'root', type: 'toolbar' },
			{
				key: 'child',
				type: 'section',
				parents: [{ key: 'root', type: 'toolbar', rank: 1 }],
			},
		];

		const map = buildChildrenMap(components);

		expect(map.has('root')).toBe(true);
		for (const [, children] of map) {
			expect(children.every((c) => c.key !== 'root')).toBe(true);
		}
	});

	it('should return empty map for empty input', () => {
		const map = buildChildrenMap([]);
		expect(map.size).toBe(0);
	});

	it('should default rank to 0 when not found', () => {
		const components: RegisterComponent[] = [
			{
				key: 'b',
				type: 'section',
				parents: [{ key: 'root', type: 'toolbar', rank: 10 }],
			},
			{
				key: 'a',
				type: 'section',
				parents: [{ key: 'root', type: 'toolbar', rank: 0 }],
			},
		];

		const map = buildChildrenMap(components);
		const children = map.get('root')!;

		expect(children[0].key).toBe('a');
		expect(children[1].key).toBe('b');
	});
});

describe('willComponentRender', () => {
	it('should return true for a visible leaf component', () => {
		const component: RegisterComponent = {
			key: 'button',
			type: 'button',
			parents: [{ key: '_', type: 'group', rank: 0 }],
		};
		const childrenMap: ChildrenMap = new Map();

		expect(willComponentRender(component, childrenMap)).toBe(true);
	});

	it('should return false when isHidden returns true', () => {
		const component: RegisterComponent = {
			key: 'button',
			type: 'button',
			parents: [{ key: '_', type: 'group', rank: 0 }],
			isHidden: () => true,
		};
		const childrenMap: ChildrenMap = new Map();

		expect(willComponentRender(component, childrenMap)).toBe(false);
	});

	it('should return true when isHidden returns false', () => {
		const component: RegisterComponent = {
			key: 'button',
			type: 'button',
			parents: [{ key: '_', type: 'group', rank: 0 }],
			isHidden: () => false,
		};
		const childrenMap: ChildrenMap = new Map();

		expect(willComponentRender(component, childrenMap)).toBe(true);
	});

	it('should return true for a container with at least one visible child', () => {
		const section: RegisterComponent = {
			key: 'section',
			type: 'menu-section',
			parents: [{ key: '_', type: 'menu', rank: 0 }],
		};
		const visibleItem: RegisterComponent = {
			key: 'item-1',
			type: 'menu-item',
			parents: [{ key: 'section', type: 'menu-section', rank: 1 }],
		};
		const hiddenItem: RegisterComponent = {
			key: 'item-2',
			type: 'menu-item',
			parents: [{ key: 'section', type: 'menu-section', rank: 2 }],
			isHidden: () => true,
		};

		const childrenMap: ChildrenMap = new Map([['section', [visibleItem, hiddenItem]]]);

		expect(willComponentRender(section, childrenMap)).toBe(true);
	});

	it('should return false for a container where all children are hidden', () => {
		const section: RegisterComponent = {
			key: 'section',
			type: 'menu-section',
			parents: [{ key: '_', type: 'menu', rank: 0 }],
		};
		const hidden1: RegisterComponent = {
			key: 'item-1',
			type: 'menu-item',
			parents: [{ key: 'section', type: 'menu-section', rank: 1 }],
			isHidden: () => true,
		};
		const hidden2: RegisterComponent = {
			key: 'item-2',
			type: 'menu-item',
			parents: [{ key: 'section', type: 'menu-section', rank: 2 }],
			isHidden: () => true,
		};

		const childrenMap: ChildrenMap = new Map([['section', [hidden1, hidden2]]]);

		expect(willComponentRender(section, childrenMap)).toBe(false);
	});

	it('should recurse through nested containers', () => {
		const topSection: RegisterComponent = {
			key: 'top',
			type: 'menu-section',
			parents: [{ key: '_', type: 'menu', rank: 0 }],
		};
		const nestedMenu: RegisterComponent = {
			key: 'nested',
			type: 'nested-menu',
			parents: [{ key: 'top', type: 'menu-section', rank: 1 }],
		};
		const innerSection: RegisterComponent = {
			key: 'inner',
			type: 'menu-section',
			parents: [{ key: 'nested', type: 'nested-menu', rank: 1 }],
		};
		const visibleItem: RegisterComponent = {
			key: 'item',
			type: 'menu-item',
			parents: [{ key: 'inner', type: 'menu-section', rank: 1 }],
		};

		const childrenMap: ChildrenMap = new Map([
			['top', [nestedMenu]],
			['nested', [innerSection]],
			['inner', [visibleItem]],
		]);

		expect(willComponentRender(topSection, childrenMap)).toBe(true);
	});

	it('should return false when deeply nested leaf is hidden', () => {
		const topSection: RegisterComponent = {
			key: 'top',
			type: 'menu-section',
			parents: [{ key: '_', type: 'menu', rank: 0 }],
		};
		const nestedMenu: RegisterComponent = {
			key: 'nested',
			type: 'nested-menu',
			parents: [{ key: 'top', type: 'menu-section', rank: 1 }],
		};
		const innerSection: RegisterComponent = {
			key: 'inner',
			type: 'menu-section',
			parents: [{ key: 'nested', type: 'nested-menu', rank: 1 }],
		};
		const hiddenItem: RegisterComponent = {
			key: 'item',
			type: 'menu-item',
			parents: [{ key: 'inner', type: 'menu-section', rank: 1 }],
			isHidden: () => true,
		};

		const childrenMap: ChildrenMap = new Map([
			['top', [nestedMenu]],
			['nested', [innerSection]],
			['inner', [hiddenItem]],
		]);

		expect(willComponentRender(topSection, childrenMap)).toBe(false);
	});

	it('should return false when container itself has isHidden true even if children are visible', () => {
		const section: RegisterComponent = {
			key: 'section',
			type: 'menu-section',
			parents: [{ key: '_', type: 'menu', rank: 0 }],
			isHidden: () => true,
		};
		const visibleItem: RegisterComponent = {
			key: 'item',
			type: 'menu-item',
			parents: [{ key: 'section', type: 'menu-section', rank: 1 }],
		};

		const childrenMap: ChildrenMap = new Map([['section', [visibleItem]]]);

		expect(willComponentRender(section, childrenMap)).toBe(false);
	});
});
