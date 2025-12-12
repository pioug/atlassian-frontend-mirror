import { adfNode } from '../../../adfNode';
import { adfMark } from '../../../adfMark';
import { $or } from '../../../$or';
import { adfToValidatorSpec } from '../../../transforms/adfToValidatorSpec/adfToValidatorSpec';
import type { ValidatorSpecNode } from '../../../transforms/adfToValidatorSpec/ValidatorSpec';

test('should correctly process marks', () => {
	const mark = adfMark('mark').define({});
	const child = adfNode('child').define({
		marks: [mark],
	});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(child)],
	});
	const result = adfToValidatorSpec(node);
	const childResult = result.child.json;
	expect((childResult as ValidatorSpecNode).props.marks).toEqual({
		type: 'array',
		items: ['mark'],
		optional: true,
	});
});

test('should not include ignored mark in the output', () => {
	const mark = adfMark('mark').define({});
	const ignoredMark = adfMark('ignoredMark').define({
		ignore: ['validator-spec'],
	});
	const child = adfNode('child').define({
		marks: [mark, ignoredMark],
	});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(child)],
	});
	const result = adfToValidatorSpec(node);
	expect(result.ignoredMark).not.toBeDefined();
	expect((result.child.json as ValidatorSpecNode).props.marks?.items).toEqual(['mark']);
});

test('should not have marks if they are not defined in DSL', () => {
	const child = adfNode('child').define({});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(child)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.child.json as ValidatorSpecNode).props.marks).not.toBeDefined();
});

test('should not have marks if all marks in DSL are ignored', () => {
	const ignoredMark = adfMark('ignoredMark').define({
		ignore: ['validator-spec'],
	});
	const child = adfNode('child').define({
		marks: [ignoredMark],
	});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(child)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.child.json as ValidatorSpecNode).props.marks).not.toBeDefined();
});

test('should support hasEmptyMarks', () => {
	const child = adfNode('child').define({
		marks: [],
		hasEmptyMarks: true,
	});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(child)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.child.json as ValidatorSpecNode).props.marks).toEqual({
		items: [],
		optional: true,
		type: 'array',
	});
});

test('should wrap marks in an array if there is more than 1 mark', () => {
	const mark1 = adfMark('mark1').define({});
	const mark2 = adfMark('mark2').define({});
	const child = adfNode('child').define({
		marks: [mark1, mark2],
	});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(child)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.child.json as ValidatorSpecNode).props.marks).toStrictEqual({
		items: [['mark1', 'mark2']],
		optional: true,
		type: 'array',
	});
});

test('should support noMarks', () => {
	const child = adfNode('child').define({
		marks: [],
		noMarks: true,
	});
	const node = adfNode('paragraph').define({
		root: true,
		content: [$or(child)],
	});
	const result = adfToValidatorSpec(node);
	expect((result.child.json as ValidatorSpecNode).props.marks).toEqual({
		items: [],
		maxItems: 0,
		optional: true,
		type: 'array',
	});
});
