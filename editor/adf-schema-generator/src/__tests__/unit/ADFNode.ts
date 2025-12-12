import { adfNodeGroup } from '../../adfNodeGroup';
import { adfNode } from '../../adfNode';
import { PMSpecTransformerName } from '../../transforms/transformerNames';
import { adfMark } from '../../adfMark';

test('should define root node', () => {
	const node = adfNode('doc').define({
		version: 1,
		root: true,
		content: [],
	});
	expect(node.getSpec()?.root).toBe(true);
});

test('should define a node', () => {
	const node = adfNode('paragraph').define({
		content: [],
	});
	expect(node.isDefined()).toBe(true);
});

test('should add a group to a node', () => {
	const node = adfNode('paragraph').define({
		content: [],
	});
	const group = adfNodeGroup('block', [node]);
	expect(group.members).toContain(node);
	expect(node.getGroups()).toContain(group.group);
});

test('should add multiple groups to a node', () => {
	const node = adfNode('paragraph').define({
		content: [],
	});
	const group1 = adfNodeGroup('block1', [node]);
	const group2 = adfNodeGroup('block2', [node]);
	expect(group1.members).toContain(node);
	expect(group2.members).toContain(node);
	expect(node.getGroups()).toContain(group1.group);
	expect(node.getGroups()).toContain(group2.group);
});

test('should not allow re-defining a node', () => {
	const node = adfNode('paragraph').define({
		content: [],
	});

	expect(() => {
		node.define({});
	}).toThrow();
});

test('should add a variant to a node', () => {
	const node = adfNode('paragraph')
		.define({
			block: true,
			content: [],
		})
		.variant('with-attrs', {
			attrs: { color: { type: 'string' } },
		});

	expect(() => {
		node.use('with-attrs');
	}).not.toThrow();
});

test('should produce new node spec for a variant', () => {
	const node = adfNode('paragraph')
		.define({
			block: true,
			content: [],
		})
		.variant('with-attrs', {
			attrs: { color: { type: 'string' } },
		});
	const variant = node.use('with-attrs');

	expect(variant?.getSpec()?.attrs).toEqual({ color: { type: 'string' } });
});

test('should not allow to define a variant if base node was not defined', () => {
	const node = adfNode('paragraph');

	expect(() => {
		node.variant('with-attrs', {});
	}).toThrow();
});

test('should not allow to re-define a variant', () => {
	const node = adfNode('paragraph')
		.define({
			block: true,
			content: [],
		})
		.variant('with-attrs', {
			attrs: { color: { type: 'string' } },
		});

	const variant = node.use('with-attrs');

	expect(() => {
		variant?.define({ attrs: { color: { type: 'string' } } });
	}).toThrow();
});

test('should not allow to create variations of variations', () => {
	const node = adfNode('paragraph')
		.define({
			block: true,
			content: [],
		})
		.variant('with-attrs', {
			attrs: { color: { type: 'string' } },
		});

	const variant = node.use('with-attrs');

	expect(() => {
		variant?.variant('hello', {});
	}).toThrow();
});

test('should link to a base class from a variant', () => {
	const node = adfNode('paragraph')
		.define({
			block: true,
			content: [],
		})
		.variant('with-attrs', {
			attrs: { color: { type: 'string' } },
		});

	const variant = node.use('with-attrs');

	expect(variant?.getBase()).toBe(node);
});

test('should not allow to create a variation with the same name', () => {
	const node = adfNode('paragraph')
		.define({
			block: true,
			content: [],
		})
		.variant('with-attrs', {
			attrs: { color: { type: 'string' } },
		});

	expect(() => {
		node.variant('with-attrs', {});
	}).toThrow();
});

test('should return a node name', () => {
	const node = adfNode('paragraph');
	expect(node.getName()).toBe('paragraph');
});

test('should return a node name for a variant', () => {
	const node = adfNode('paragraph')
		.define({})
		.variant('with-attrs', {
			attrs: { color: { type: 'string' } },
		});

	expect(node.use('with-attrs')?.getName()).toBe('paragraph_with-attrs');
});

test('should return true if node variant is ignored by a transformer', () => {
	const node = adfNode('paragraph').define({
		ignore: ['pm-spec'],
	});

	expect(node.isIgnored(PMSpecTransformerName)).toBe(true);
});

test('should return false if node variant is not ignored by a transformer', () => {
	const node = adfNode('paragraph').define({
		ignore: ['json-schema'],
	});

	expect(node.isIgnored(PMSpecTransformerName)).toBe(false);
});

test('should propagate ignore to all variants', () => {
	const node = adfNode('paragraph').define({
		ignore: ['pm-spec'],
	});
	const variant = node.variant('with-attrs', {});

	expect(variant.isIgnored(PMSpecTransformerName)).toBe(true);
});

test('should allow variant to override ignores', () => {
	const node = adfNode('paragraph')
		.define({
			ignore: ['pm-spec'],
		})
		.variant('with-attrs', {
			ignore: ['json-schema'],
		});

	expect(node.use('with-attrs')?.isIgnored(PMSpecTransformerName)).toBe(false);
});

test('should not inherit DANGEROUS_MANUAL_OVERRIDE from a base node', () => {
	const node = adfNode('paragraph')
		.define({
			DANGEROUS_MANUAL_OVERRIDE: {
				'pm-spec': {
					content: {
						value: 'hello',
						reason: 'test',
					},
				},
			},
		})
		.variant('with-attrs', {});

	expect(node.use('with-attrs')?.getSpec()?.DANGEROUS_MANUAL_OVERRIDE).not.toBeDefined();
});

test('should not inherit stage0 from a base node', () => {
	const node = adfNode('paragraph')
		.define({
			stage0: true,
		})
		.variant('with-attrs', {});

	expect(node.use('with-attrs')?.getSpec()?.stage0).not.toBeDefined();
});

test('should not inherit noExtend from a base node', () => {
	const node = adfNode('paragraph')
		.define({
			noExtend: true,
		})
		.variant('with-attrs', {});

	expect(node.use('with-attrs')?.getSpec()?.noExtend).not.toBeDefined();
});

test('should define maxItems for marks array if marksMaxItems is defined', () => {
	const mark = adfMark('em').define({});
	const node = adfNode('paragraph').define({
		marks: [mark],
		marksMaxItems: 1,
	});

	expect(node.getSpec()?.marksMaxItems).toBe(1);
});

// as part of https://product-fabric.atlassian.net/browse/ED-27093
// this test should pass :)
test.skip('should define maxItems to 0 if hasEmptyMarks is defined', () => {
	const node = adfNode('paragraph').define({
		hasEmptyMarks: true,
		marks: [],
	});

	expect(node.getSpec()?.marksMaxItems).toBe(0);
});

test('should set maxItems to marksMaxItems', () => {
	const node = adfNode('paragraph').define({
		marksMaxItems: 2,
	});

	expect(node.getSpec()?.marksMaxItems).toBe(2);
});

test('should set maxItems to 0 if hasNoMarks is defined', () => {
	const node = adfNode('paragraph').define({
		hasNoMarks: true,
		marks: [],
	});

	expect(node.getSpec()?.marks).toHaveLength(0);
});

test('should not inherit hasEmptyMarks from a base node', () => {
	const node = adfNode('paragraph')
		.define({
			hasEmptyMarks: true,
		})
		.variant('with-attrs', {});

	expect(node.use('with-attrs')?.getSpec()?.hasEmptyMarks).not.toBeDefined();
});

test('should return true if node variant has overwright for attributes', () => {
	const node = adfNode('paragraph')
		.define({
			attrs: {},
		})
		.variant('new-attrs', {
			attrs: {},
		});

	expect(node.use('new-attrs')?.hasAttributeOverride()).toBe(true);
});

test("should return false if node variant doesn't have overwright for attributes", () => {
	const node = adfNode('paragraph')
		.define({
			attrs: {},
		})
		.variant('new-attrs', {});

	expect(node.use('new-attrs')?.hasAttributeOverride()).toBe(false);
});

test('should be able to define DANGEROUS_MANUAL_OVERRIDE on a variant', () => {
	const node = adfNode('paragraph')
		.define({})
		.variant('with-attrs', {
			DANGEROUS_MANUAL_OVERRIDE: {
				'pm-spec': {
					content: {
						value: 'hello',
						reason: 'test',
					},
				},
			},
		});

	expect(node.use('with-attrs')?.getSpec()?.DANGEROUS_MANUAL_OVERRIDE).toBeDefined();
});

describe('full schema', () => {
	describe('getMarks()', () => {
		test('should ignore stage0 flag if no stage0 overrides', () => {
			const mark = adfMark('em').define({});
			const node = adfNode('paragraph').define({
				marks: [mark],
			});

			expect(node.getMarks(true)).toContain(mark);
		});
	});

	describe('isStage0Only', () => {
		test('should return false if stage0 is not defined', () => {
			const node = adfNode('paragraph').define({});

			expect(node.isStage0Only()).toBe(false);
		});
	});
});

describe('stage 0 only', () => {
	describe('isStage0Only', () => {
		test('should return true if stage0 === true', () => {
			const node = adfNode('paragraph').define({
				stage0: true,
			});

			expect(node.isStage0Only()).toBe(true);
		});
	});

	describe('hasStage0', () => {
		test('should return true if stage0 is defined', () => {
			const node = adfNode('paragraph').define({
				stage0: true,
			});

			expect(node.hasStage0()).toBe(true);
		});
	});
});

describe('stage 0 with overrides', () => {
	describe('getSpec(stage0 === true)', () => {
		test('should return stage0', () => {
			const node = adfNode('paragraph').define({
				root: false,
				stage0: {
					root: true,
				},
			});

			expect(node.getSpec(true)?.root).toBe(true);
		});
	});

	describe('getMarks(stage0 === true)', () => {
		test('should include stage 0 marks', () => {
			const mark = adfMark('em').define({});
			const node = adfNode('paragraph').define({
				marks: [],
				stage0: {
					marks: [mark],
				},
			});

			expect(node.getMarks(true)).toContain(mark);
		});
	});

	describe('getMarks()', () => {
		test('should not include stage 0 marks', () => {
			const mark = adfMark('em').define({});
			const node = adfNode('paragraph').define({
				marks: [],
				stage0: {
					marks: [mark],
				},
			});

			expect(node.getMarks()).not.toContain(mark);
		});
	});

	describe('getMarksTypes(stage0 === true)', () => {
		test('should include stage 0 marks', () => {
			const mark = adfMark('em').define({});
			const node = adfNode('paragraph').define({
				marks: [],
				stage0: {
					marks: [mark],
				},
			});

			expect(node.getMarksTypes(true)).toContain('em');
		});
	});

	describe('isStage0Only', () => {
		test('should return false if stage0 contains an override', () => {
			const node = adfNode('paragraph').define({
				stage0: {
					atom: false,
				},
			});

			expect(node.isStage0Only()).toBe(false);
		});
	});
});
