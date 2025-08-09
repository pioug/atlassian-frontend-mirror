import * as rtl from '@testing-library/react';

import { HierarchyContainer, useHierarchyData } from './use-hierarchy';

describe('useHierarchyData', () => {
	interface TestNode {
		id?: string;
		parent?: TestNode | null;
		children?: TestNode[];
	}

	const getHook = () => {
		return rtl.renderHook(
			() =>
				useHierarchyData<TestNode>({
					childrenAccessor: (node) => {
						return node.children;
					},
					updateChildren: (node, children) => {
						return { ...node, children };
					},
					identifierAccessor: (node) => node.id ?? '',
					parentIdentifierAccessor: (node) => node?.parent?.id ?? '',
				}),
			{
				wrapper: HierarchyContainer,
			},
		);
	};

	it('should set root node when currently empty', () => {
		const hook = getHook();

		rtl.act(() => {
			hook.result.current[1].addNode({
				id: 'root',
				parent: null,
				children: [],
			});
		});

		expect(hook.result.current[0].rootNode).toEqual({
			id: 'root',
			parent: null,
			children: [],
		});
	});

	it('should clear the root node when reset', () => {
		const hook = getHook();

		rtl.act(() => {
			hook.result.current[1].addNode({
				id: 'root',
				parent: null,
				children: [],
			});

			hook.result.current[1].resetRootNode({});
		});

		expect(hook.result.current[0].rootNode).toEqual({});
	});

	it('should set a new root if parent is added to current tree', () => {
		const hook = getHook();

		rtl.act(() => {
			hook.result.current[1].addNode({
				id: 'child',
				parent: null,
				children: [],
			});

			hook.result.current[1].addNode({
				id: 'root',
				parent: null,
				children: [{ id: 'child', parent: { id: 'root', parent: null, children: [] } }],
			});
		});

		expect(hook.result.current[0].rootNode?.id).toBe('root');
	});
});
