import { adfNode } from '../../../adfNode';
import { buildNodeMarks, buildNode } from '../../../transforms/adfToJson/nodeBuilder';

describe('buildNode', () => {
	test('given a base node, it returns an object with properties', () => {
		const baseNode = adfNode('baseNode').define({});
		const result = buildNode(baseNode, [], true);
		expect(result).toEqual({
			additionalProperties: false,
			properties: {
				type: {
					enum: ['baseNode'],
				},
			},
			required: ['type'],
			type: 'object',
		});
	});

	test('given a variant node, it returns an object with allOf', () => {
		const baseNode = adfNode('baseNode').define({}).variant('variantNode', {});
		const result = buildNode(baseNode.use('variantNode')!, [], false);
		expect(result).toEqual({
			allOf: [
				{
					$ref: '#/definitions/baseNode_node',
				},
				{
					additionalProperties: true,
					properties: {},
					type: 'object',
				},
			],
		});
	});

	test('given a variant node with noExtend, it returns an object with properties', () => {
		const baseNode = adfNode('baseNode').define({}).variant('variantNode', { noExtend: true });
		const result = buildNode(baseNode.use('variantNode')!, [], false);
		expect(result).toEqual({
			additionalProperties: false,
			properties: {
				type: {
					enum: ['baseNode'],
				},
			},
			required: ['type'],
			type: 'object',
		});
	});

	test('should add text property to text node [special case]', () => {
		const text = adfNode('text').define({});
		const result = buildNode(text, [], false);
		expect(result).toEqual({
			additionalProperties: false,
			properties: {
				text: {
					minLength: 1,
					type: 'string',
				},
				type: {
					enum: ['text'],
				},
			},
			required: ['type', 'text'],
			type: 'object',
		});
	});
});

describe('buildNodeMarks', () => {
	test('given hasNoMarks is true, it returns an object with marks', () => {
		const nodeMarks: string[] = [];
		const opts = { hasNoMarks: true, hasEmptyMarks: false };
		const result = buildNodeMarks(nodeMarks, opts);
		expect(result).toEqual({
			marks: {
				type: 'array',
				maxItems: 0,
			},
		});
	});

	test('given hasEmptyMarks is true, it returns an object with marks', () => {
		const nodeMarks: string[] = [];
		const opts = { hasNoMarks: false, hasEmptyMarks: true };
		const result = buildNodeMarks(nodeMarks, opts);
		expect(result).toEqual({
			marks: {
				type: 'array',
			},
		});
	});

	test('given nodeMarks is empty, it returns an empty object', () => {
		const nodeMarks: string[] = [];
		const opts = { hasNoMarks: false, hasEmptyMarks: false };
		const result = buildNodeMarks(nodeMarks, opts);
		expect(result).toEqual({});
	});

	test('given nodeMarks has one mark, it returns an object with marks', () => {
		const nodeMarks = ['strong'];
		const opts = { hasNoMarks: false, hasEmptyMarks: false };
		const result = buildNodeMarks(nodeMarks, opts);
		expect(result).toEqual({
			marks: {
				type: 'array',
				items: {
					$ref: '#/definitions/strong_mark',
				},
			},
		});
	});

	test('given nodeMarks has more than one mark, it returns an object with marks', () => {
		const nodeMarks = ['strong', 'em'];
		const opts = { hasNoMarks: false, hasEmptyMarks: false };
		const result = buildNodeMarks(nodeMarks, opts);
		expect(result).toEqual({
			marks: {
				type: 'array',
				items: {
					anyOf: [
						{
							$ref: '#/definitions/strong_mark',
						},
						{
							$ref: '#/definitions/em_mark',
						},
					],
				},
			},
		});
	});
});
