import { $onePlus } from '../../$onePlus';
import { $or } from '../../$or';
import { adfNodeGroup } from '../../adfNodeGroup';
import { type ADFNode, adfNode } from '../../adfNode';
import { traverse, type ADFVisitor } from '../../traverse';
import { adfMark } from '../../adfMark';
import { $zeroPlus } from '../../$zeroPlus';

test('should be called for each item type', () => {
	const text = adfNode('text').define({});
	const paragraph = adfNode('paragraph').define({
		content: [$onePlus($or(text))],
	});
	const group = adfNodeGroup('block', [paragraph]);
	const doc = adfNode('doc').define({
		root: true,
		version: 1,
		content: [$onePlus($or(group))],
	});
	const visitor = {
		node: jest.fn(),
		group: jest.fn(),
		$or: jest.fn(),
		$onePlus: jest.fn(),
	};

	traverse(doc, visitor);

	expect(visitor.node).toHaveBeenCalledTimes(3);
	expect(visitor.group).toHaveBeenCalledTimes(1);
	expect(visitor.$or).toHaveBeenCalledTimes(2);
	expect(visitor.$onePlus).toHaveBeenCalledTimes(2);
});

test('should be called with all node variants', () => {
	const paragraph = adfNode('paragraph')
		.define({
			content: [],
		})
		.variant('with-marks', {
			marks: [],
		});
	const doc = adfNode('doc').define({
		root: true,
		version: 1,
		content: [$onePlus($or(paragraph, paragraph.use('with-marks')!))],
	});
	const visitor = {
		node: jest.fn(),
		group: jest.fn(),
		$or: jest.fn(),
	};
	traverse(doc, visitor);
	expect(visitor.node).toHaveBeenCalledWith(paragraph, []);
	expect(visitor.node).toHaveBeenCalledWith(paragraph.use('with-marks'), []);
});

test('should call node visitor with children return values', () => {
	const paragraph = adfNode('paragraph')
		.define({
			block: true,
			content: [],
		})
		.variant('with-marks', {
			marks: [],
		});
	const doc = adfNode('doc').define({
		root: true,
		content: [$onePlus($or(paragraph, paragraph.use('with-marks')!))],
	});
	const visitor: ADFVisitor = {
		node: jest.fn(),
		group: jest.fn(),
		$onePlus: jest.fn().mockReturnValue('content'),
	};
	traverse(doc, visitor);
	expect(visitor.node).toHaveBeenCalledWith(paragraph, ['content']);
});

test('should call content visitor with children return values', () => {
	const paragraph = adfNode('paragraph')
		.define({
			block: true,
			content: [],
		})
		.variant('with-marks', {
			marks: [],
		});
	const doc = adfNode('doc').define({
		root: true,
		version: 1,
		content: [$onePlus($or(paragraph, paragraph.use('with-marks')!))],
	});
	const visitor: ADFVisitor = {
		node: jest.fn().mockReturnValue('node'),
		group: jest.fn(),
		$or: jest.fn().mockReturnValue('content'),
	};
	traverse(doc, visitor);
	expect(visitor.$or).toHaveBeenNthCalledWith(1, ['node', 'node']);
});

test('should call group visitor with children return values', () => {
	const text = adfNode('text').define({});
	const paragraph = adfNode('paragraph')
		.define({
			block: true,
			content: [$onePlus($or(text))],
		})
		.variant('with-marks', {});
	const group = adfNodeGroup('block', [paragraph, paragraph.use('with-marks')!]);
	const doc = adfNode('doc').define({
		root: true,
		version: 1,
		content: [$onePlus($or(group))],
	});
	const visitor = {
		node: jest.fn().mockReturnValue('node'),
		group: jest.fn(),
		$or: jest.fn(),
	};
	traverse(doc, visitor);
	expect(visitor.group).toHaveBeenCalledWith(group, ['node', 'node']);
});

test('should throw if node is not defined', () => {
	const node = adfNode('node');
	const visitor = {
		node: jest.fn(),
		group: jest.fn(),
		$or: jest.fn(),
	};

	expect(() => {
		traverse(node, visitor);
	}).toThrow();
});

test('should throw if node is not root', () => {
	const node = adfNode('node').define({});
	const visitor = {
		node: jest.fn(),
		group: jest.fn(),
		$or: jest.fn(),
	};

	expect(() => {
		traverse(node, visitor);
	}).toThrow();
});

test('should be able to traverse cyclic structures', () => {
	const listItem = adfNode('listItem');
	const list = adfNode('list').define({
		root: true,
		content: [$onePlus($or(listItem))],
	});
	listItem.define({
		content: [$onePlus($or(list))],
	});
	const visitor = {
		node: jest.fn(),
		group: jest.fn(),
		$or: jest.fn(),
	};
	traverse(list, visitor);
	expect(visitor.node).toHaveBeenCalledTimes(3);
});

test('should only flag a cycle for a node that is an ancestor in the current branch', () => {
	const listItem = adfNode('listItem');
	const list = adfNode('list').define({
		root: true,
		content: [$onePlus($or(listItem))],
	});
	listItem.define({
		content: [$onePlus($or(list))],
	});
	const visitor = {
		node: jest.fn().mockReturnValue('node'),
		group: jest.fn(),
		$or: jest.fn().mockReturnValue('or'),
		$onePlus: jest.fn().mockReturnValue('one+'),
	};

	traverse(list, visitor);

	// only the `listItem -> list` back reference is a cycle
	expect(visitor.node.mock.calls.filter(([, , cycle]) => cycle)).toEqual([[list, [], true]]);
	expect(visitor.node).toHaveBeenCalledWith(listItem, ['one+']);
});

test('should not treat a node reused in a sibling subtree as a cycle', () => {
	const text = adfNode('text').define({});
	const paragraph = adfNode('paragraph').define({
		content: [$zeroPlus($or(text))],
	});
	const panel = adfNode('panel').define({
		content: [$onePlus($or(paragraph))],
	});
	const expand = adfNode('expand').define({
		content: [$onePlus($or(paragraph))],
	});
	const doc = adfNode('doc').define({
		root: true,
		content: [$onePlus($or(panel, expand))],
	});
	const visitor = {
		node: jest.fn().mockReturnValue('node'),
		group: jest.fn(),
		$or: jest.fn().mockReturnValue('or'),
		$onePlus: jest.fn().mockReturnValue('one+'),
		$zeroPlus: jest.fn().mockReturnValue('zero+'),
	};

	traverse(doc, visitor);

	// `paragraph` and `text` are reachable through both `panel` and `expand`,
	// these are separate branches of the DFS, so none of them is a cycle
	expect(visitor.node.mock.calls.filter(([, , cycle]) => cycle)).toEqual([]);
	expect(visitor.node.mock.calls.filter(([node]) => node === paragraph)).toEqual([
		[paragraph, ['zero+']],
		[paragraph, ['zero+']],
	]);
	expect(visitor.node.mock.calls.filter(([node]) => node === text)).toEqual([
		[text, []],
		[text, []],
	]);
});

test('should fully traverse a node that is both a sibling and a descendant of a sibling', () => {
	const text = adfNode('text').define({});
	const paragraph = adfNode('paragraph').define({
		content: [$zeroPlus($or(text))],
	});
	const panel = adfNode('panel').define({
		content: [$onePlus($or(paragraph))],
	});
	const doc = adfNode('doc').define({
		root: true,
		// `paragraph` is visited first as a direct child of `doc`, and then
		// again while descending into `panel`
		content: [$onePlus($or(paragraph, panel))],
	});
	const visitor = {
		node: jest.fn().mockReturnValue('node'),
		group: jest.fn(),
		$or: jest.fn().mockReturnValue('or'),
		$onePlus: jest.fn().mockReturnValue('one+'),
		$zeroPlus: jest.fn().mockReturnValue('zero+'),
	};

	traverse(doc, visitor);

	expect(visitor.node.mock.calls.filter(([node]) => node === paragraph)).toEqual([
		[paragraph, ['zero+']],
		[paragraph, ['zero+']],
	]);
});

test('should fully traverse a node shared between two groups', () => {
	const text = adfNode('text').define({});
	const paragraph = adfNode('paragraph').define({
		content: [$zeroPlus($or(text))],
	});
	const blockGroup = adfNodeGroup('block', [paragraph]);
	const layoutGroup = adfNodeGroup('layout', [paragraph]);
	const doc = adfNode('doc').define({
		root: true,
		content: [$onePlus($or(blockGroup, layoutGroup))],
	});
	const visitor = {
		node: jest.fn().mockReturnValue('node'),
		group: jest.fn().mockReturnValue('group'),
		$or: jest.fn().mockReturnValue('or'),
		$onePlus: jest.fn().mockReturnValue('one+'),
		$zeroPlus: jest.fn().mockReturnValue('zero+'),
	};

	traverse(doc, visitor);

	expect(visitor.node.mock.calls.filter(([node]) => node === paragraph)).toEqual([
		[paragraph, ['zero+']],
		[paragraph, ['zero+']],
	]);
	expect(visitor.group).toHaveBeenCalledWith(blockGroup, ['node']);
	expect(visitor.group).toHaveBeenCalledWith(layoutGroup, ['node']);
});

test('should expand a cyclic node again when it is reused in a sibling subtree', () => {
	const listItem = adfNode('listItem');
	const list = adfNode('list').define({
		content: [$onePlus($or(listItem))],
	});
	listItem.define({
		content: [$onePlus($or(list))],
	});
	const panel = adfNode('panel').define({
		content: [$onePlus($or(list))],
	});
	const doc = adfNode('doc').define({
		root: true,
		content: [$onePlus($or(list, panel))],
	});
	const visitor = {
		node: jest.fn().mockReturnValue('node'),
		group: jest.fn(),
		$or: jest.fn().mockReturnValue('or'),
		$onePlus: jest.fn().mockReturnValue('one+'),
	};

	traverse(doc, visitor);

	// `list` is expanded under `doc` and under `panel`, each expansion is only
	// stopped by the `listItem -> list` back reference within its own branch
	expect(visitor.node.mock.calls.filter(([node, , cycle]) => node === list && !cycle)).toEqual([
		[list, ['one+']],
		[list, ['one+']],
	]);
	expect(visitor.node.mock.calls.filter(([node]) => node === listItem)).toEqual([
		[listItem, ['one+']],
		[listItem, ['one+']],
	]);
	expect(visitor.node.mock.calls.filter(([, , cycle]) => cycle)).toEqual([
		[list, [], true],
		[list, [], true],
	]);
});

test('should build the same content expression for a node reachable through multiple parents', () => {
	const text = adfNode('text').define({});
	const paragraph = adfNode('paragraph').define({
		content: [$zeroPlus($or(text))],
	});
	const panel = adfNode('panel').define({
		content: [$onePlus($or(paragraph))],
	});
	const expand = adfNode('expand').define({
		content: [$onePlus($or(paragraph))],
	});
	const doc = adfNode('doc').define({
		root: true,
		content: [$onePlus($or(panel, expand))],
	});

	const specs: Record<string, string> = {};

	traverse<string, string, string>(doc, {
		node(node, children, cycle) {
			const expr = children.length ? `${node.getType()}(${children.join(',')})` : node.getType();
			if (!cycle) {
				specs[node.getType()] = expr;
			}
			return expr;
		},
		$or: (content) => content.join(' | '),
		$onePlus: (content) => `(${content})+`,
		$zeroPlus: (content) => `(${content})*`,
	});

	// the second parent of `paragraph` must not end up with a truncated subtree
	expect(specs.panel).toBe('panel((paragraph((text)*))+)');
	expect(specs.expand).toBe('expand((paragraph((text)*))+)');
});

test('should be able to build a PMNodeSpec like structure for a cyclic DSL', () => {
	const linkMark = adfMark('link').define({});
	const codeMark = adfMark('code').define({});
	const breakoutMark = adfMark('breakout').define({});

	const text = adfNode('text').define({});
	const paragraph = adfNode('paragraph').define({
		content: [$zeroPlus($or(text))],
	});
	const panel = adfNode('panel')
		.define({
			content: [$zeroPlus($or(paragraph))],
		})
		.variant('with-breakout', {
			marks: [breakoutMark],
		});
	const listItem = adfNode('listItem');
	const list = adfNode('list').define({
		marks: [codeMark],
		content: [$onePlus($or(listItem))],
	});

	listItem.define({
		marks: [linkMark],
		content: [$onePlus($or(paragraph, panel)), $onePlus($or(list))],
	});

	const blockGroup = adfNodeGroup('block', [paragraph, panel.use('with-breakout')!]);

	const doc = adfNode('doc').define({
		root: true,
		content: [$zeroPlus($or(list, blockGroup))],
	});

	type NodeVisitorReturnType = {
		childrenMarks: Array<string>;
		content: Array<string>;
		marks: Array<string>;
		node: ADFNode<any, any>;
	};

	type GroupVisitorReturnType = {
		group: string;
		members: Array<NodeVisitorReturnType>;
	};

	function isNodeRetunrValue(
		value: NodeVisitorReturnType | GroupVisitorReturnType,
	): value is NodeVisitorReturnType {
		return 'node' in value;
	}

	function isGroupReturnValue(
		value: NodeVisitorReturnType | GroupVisitorReturnType,
	): value is GroupVisitorReturnType {
		return 'group' in value;
	}

	const resMap: Record<string, NodeVisitorReturnType> = {};

	traverse<
		NodeVisitorReturnType,
		GroupVisitorReturnType,
		{
			expr: string;
			marks: Array<string>;
		}
	>(doc, {
		node(node, content, cycle) {
			const processedNode = {
				node,
				marks: node.getSpec()?.marks?.map((mark) => mark.getType()) ?? [],
				content: [] as string[],
				childrenMarks: [] as string[],
			};

			for (const child of content) {
				processedNode.content.push(child.expr);
				processedNode.childrenMarks.push(...child.marks);
			}

			if (!cycle) {
				resMap[node.getType()] = processedNode;
			}
			return processedNode;
		},
		group(group, members) {
			return { group: group.group, members };
		},
		$or(children) {
			const nodeTypes: Array<string> = [];
			const marks = new Set<string>();

			for (const child of children) {
				if (isGroupReturnValue(child)) {
					nodeTypes.push(child.group);
					for (const node of child.members) {
						if (node.marks.length) {
							for (const mark of node.marks) {
								marks.add(mark);
							}
						}
					}
				} else if (isNodeRetunrValue(child)) {
					nodeTypes.push(child.node.getType());
					if (child.marks.length) {
						for (const mark of child.marks) {
							marks.add(mark);
						}
					}
				}
			}

			return {
				expr: nodeTypes.join(' | '),
				marks: Array.from(marks),
			};
		},
		$onePlus(child) {
			return {
				expr: `(${child.expr})+`,
				marks: child.marks,
			};
		},
		$zeroPlus(child) {
			return {
				expr: `(${child.expr})*`,
				marks: child.marks,
			};
		},
	});

	expect(Object.keys(resMap).length).toBe(6);
	expect(resMap.doc.content[0]).toBe('(list | block)*');
	expect(resMap.doc.childrenMarks).toContain('code');
	expect(resMap.doc.childrenMarks).toContain('breakout');
});
