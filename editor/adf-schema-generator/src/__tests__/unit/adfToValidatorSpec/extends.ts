import { adfNode } from '../../../adfNode';
import { adfMark } from '../../../adfMark';
import { $or } from '../../../$or';
import { adfToValidatorSpec } from '../../../transforms/adfToValidatorSpec/adfToValidatorSpec';

test('should produce "extends" validator spec for variants of the node', () => {
	const child = adfNode('child').define({}).variant('variant', {});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(child, child.use('variant')!)],
	});
	const result = adfToValidatorSpec(node);
	expect(Array.isArray(result.child_variant.json)).toBe(true);
	expect((result.child_variant.json as any)[0]).toBe('child');
});

test('should not duplicate attributes for a variant', () => {
	const child = adfNode('child')
		.define({
			attrs: {
				myAttr: { type: 'string' },
			},
		})
		.variant('variant', {});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(child, child.use('variant')!)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.child_variant.json as any)[1].props.attrs).not.toBeDefined();
});

test('should not duplicate marks for a variant', () => {
	const mark = adfMark('mark').define({});
	const child = adfNode('child')
		.define({
			marks: [mark],
		})
		.variant('variant', {});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(child, child.use('variant')!)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.child_variant.json as any)[1].props.marks).not.toBeDefined();
});

test('should output attributes if they are overridden by a variant', () => {
	const child = adfNode('child')
		.define({
			attrs: {
				myAttr: { type: 'string' },
			},
		})
		.variant('variant', {
			attrs: {
				myAttr2: { type: 'string' },
			},
		});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(child, child.use('variant')!)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.child_variant.json as any)[1].props.attrs.props.myAttr2).toBeDefined();
});
