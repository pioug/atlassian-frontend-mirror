import { adfNode } from '../../../adfNode';
import { $or } from '../../../$or';
import { $zeroPlus } from '../../../$zeroPlus';
import { $onePlus } from '../../../$onePlus';
import { $range } from '../../../$range';
import { adfNodeGroup } from '../../../adfNodeGroup';
import { adfToValidatorSpec } from '../../../transforms/adfToValidatorSpec/adfToValidatorSpec';
import type { ValidatorSpecNode } from '../../../transforms/adfToValidatorSpec/ValidatorSpec';

test('should handle single $or content', () => {
	const child = adfNode('child').define({});
	const node = adfNode('p').define({
		root: true,
		content: [$or(child)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		items: ['child'],
		type: 'array',
	});
});

test('should handle single $or content with multiple items', () => {
	const child = adfNode('child').define({});
	const child2 = adfNode('child2').define({});
	const node = adfNode('p').define({
		root: true,
		content: [$or(child, child2)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		items: [['child', 'child2']],
		type: 'array',
	});
});

test('should handle single $or content with mixed children groups + nodes', () => {
	const child = adfNode('child').define({});
	const child2 = adfNode('child2').define({});
	const child3 = adfNode('child3').define({
		root: true,
		content: [$or(child, child2)],
	});
	const group = adfNodeGroup('block', [child3]);
	const node = adfNode('p').define({
		root: true,
		content: [$or(group, child, child2)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		items: [['child3', 'child', 'child2']],
		type: 'array',
	});
});

test('should not flatten a single group', () => {
	const child = adfNode('child').define({});
	const child2 = adfNode('child2').define({});
	const child3 = adfNode('child3').define({
		root: true,
		content: [$or(child, child2)],
	});
	const group = adfNodeGroup('block', [child, child2, child3]);
	const node = adfNode('p').define({
		root: true,
		content: [$or(group)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		items: ['block'],
		type: 'array',
	});
});

test('should not flatten a single group if $or contains group + ignored nodes', () => {
	const child = adfNode('child').define({});
	const child2 = adfNode('child2').define({
		ignore: ['validator-spec'],
	});
	const child3 = adfNode('child3').define({
		root: true,
		content: [$or(child, child2)],
	});
	const group = adfNodeGroup('block', [child, child3]);
	const node = adfNode('p').define({
		root: true,
		content: [$or(group, child2)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		items: ['block'],
		type: 'array',
	});
});

test('should handle single $or content with no items', () => {
	const node = adfNode('p').define({
		root: true,
		content: [$or()],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toBeUndefined();
});

test('should handle single $zeroPlus($or) content with single items', () => {
	const child = adfNode('child').define({});
	const node = adfNode('p').define({
		root: true,
		content: [$zeroPlus($or(child))],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		items: ['child'],
		type: 'array',
		optional: true,
	});
});

test('should handle single $zeroPlus($or) content with multiple items', () => {
	const child = adfNode('child').define({});
	const child2 = adfNode('child2').define({});
	const node = adfNode('p').define({
		root: true,
		content: [$zeroPlus($or(child, child2))],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		items: [['child', 'child2']],
		type: 'array',
		optional: true,
	});
});

test('should handle single $zeroPlus($or) content with no items', () => {
	const node = adfNode('p').define({
		root: true,
		content: [$zeroPlus($or())],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toBeUndefined();
});

test('should handle single $onePlus($or) content with single items', () => {
	const child = adfNode('child').define({});
	const node = adfNode('p').define({
		root: true,
		content: [$onePlus($or(child))],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		items: ['child'],
		type: 'array',
		minItems: 1,
	});
});

test('should handle single $onePlus($or) content with multiple items', () => {
	const child = adfNode('child').define({});
	const child2 = adfNode('child2').define({});
	const node = adfNode('p').define({
		root: true,
		content: [$onePlus($or(child, child2))],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		items: [['child', 'child2']],
		type: 'array',
		minItems: 1,
	});
});

test('should handle single $onePlus($or) content with no items', () => {
	const node = adfNode('p').define({
		root: true,
		content: [$onePlus($or())],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toBeUndefined();
});

test('should handle single $range($or) content with single items', () => {
	const child = adfNode('child').define({});
	const node = adfNode('p').define({
		root: true,
		content: [$range(1, 2, $or(child))],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		items: ['child'],
		type: 'array',
		minItems: 1,
		maxItems: 2,
	});
});

test('should handle single $range($or) content with multiple items', () => {
	const child = adfNode('child').define({});
	const child2 = adfNode('child2').define({});
	const node = adfNode('p').define({
		root: true,
		content: [$range(2, 3, $or(child, child2))],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		items: [['child', 'child2']],
		type: 'array',
		minItems: 2,
		maxItems: 3,
	});
});

test('should be able to handle tuple like content', () => {
	const child = adfNode('child').define({});
	const child2 = adfNode('child2').define({});
	const node = adfNode('p').define({
		root: true,
		content: [$or(child), $or(child2)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		isTupleLike: true,
		items: ['child', 'child2'],
		type: 'array',
	});
});

test('should be able to handle tuple like content, $or with multiple items', () => {
	const child = adfNode('child').define({});
	const child2 = adfNode('child2').define({});
	const node = adfNode('p').define({
		root: true,
		content: [$or(child), $or(child, child2)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		isTupleLike: true,
		items: ['child', ['child', 'child2']],
		type: 'array',
	});
});

test('should support contentMinItems and contentMaxItems for tuple like content', () => {
	const child = adfNode('child').define({});
	const child2 = adfNode('child2').define({});
	const node = adfNode('p').define({
		root: true,
		contentMinItems: 1,
		contentMaxItems: 2,
		content: [$or(child), $or(child, child2)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.p.json as ValidatorSpecNode).props.content).toEqual({
		isTupleLike: true,
		items: ['child', ['child', 'child2']],
		type: 'array',
		maxItems: 2,
		minItems: 1,
	});
});
