import { LayerNode } from './layer-node';

describe('LayerNode', () => {
	it('single node should have height and level 1', () => {
		const node = new LayerNode('root', null);
		expect(node.getHeight()).toEqual(1);
		expect(node.childNodes).toEqual([]);
	});

	it('should be able to add children', () => {
		const rootNode = new LayerNode('root', null);

		const child0 = new LayerNode('child-0', rootNode);
		const child1 = new LayerNode('child-1', rootNode);

		rootNode.addChild(child0);
		expect(rootNode.getHeight()).toEqual(2);
		expect(rootNode.childNodes).toHaveLength(1);

		rootNode.addChild(child1);
		expect(rootNode.getHeight()).toEqual(2);
		expect(rootNode.childNodes).toHaveLength(2);

		expect(child0.getLevel()).toEqual(rootNode.getHeight());
		expect(child1.getLevel()).toEqual(rootNode.getHeight());
	});

	it('should be able to add several nested children', () => {
		// Level 1
		const rootNode = new LayerNode('root', null);

		// Level 2
		const child00 = new LayerNode('child0,0', rootNode);
		const child01 = new LayerNode('child0,1', rootNode);
		const child02 = new LayerNode('child0,2', rootNode);
		rootNode.addChild(child00);
		rootNode.addChild(child01);
		rootNode.addChild(child02);

		// Level 3
		const child10 = new LayerNode('child1,0', child01);
		child01.addChild(child10);

		// Level 4
		const child20 = new LayerNode('child2,0', child10);
		const child21 = new LayerNode('child2,1', child10);
		child10.addChild(child20);
		child10.addChild(child21);

		expect(rootNode.getHeight()).toEqual(4);

		expect(child00.getLevel()).toEqual(2);
		expect(child10.getLevel()).toEqual(3);
		expect(child20.getLevel()).toEqual(rootNode.getHeight());
	});

	it('should be able to remove children', () => {
		// Level 1
		const rootNode = new LayerNode('root', null);

		// Level 2
		const child00 = new LayerNode('child0,0', rootNode);
		const child01 = new LayerNode('child0,1', rootNode);
		const child02 = new LayerNode('child0,2', rootNode);
		rootNode.addChild(child00);
		rootNode.addChild(child01);
		rootNode.addChild(child02);

		// Level 3
		const child10 = new LayerNode('child1,0', child01);
		child01.addChild(child10);
		expect(rootNode.getHeight()).toEqual(3);
		expect(child10.getLevel()).toEqual(3);

		rootNode.removeChild(child01);
		expect(rootNode.getHeight()).toEqual(2);
		expect(child00.getLevel()).toEqual(2);

		rootNode.removeChild(child00);
		expect(rootNode.getHeight()).toEqual(2);

		rootNode.removeChild(child02);
		expect(rootNode.getHeight()).toEqual(1);
	});
});
