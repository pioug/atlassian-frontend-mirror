import type { JSONSchema4 } from 'json-schema';
import { adfNode } from '../../../adfNode';
import { $or } from '../../../$or';
import { $range } from '../../../$range';
import { $zeroPlus } from '../../../$zeroPlus';
import { transform } from '../../../transforms/adfToJson/adfToJson';
import { expectedJSONDefinitions, getTestAdfNode } from '../../__fixtures__/testAdfNode.fixture';

describe('transform', () => {
	let generatedSchema: JSONSchema4 = {};
	beforeAll(() => {
		const testDoc = getTestAdfNode();
		generatedSchema = transform(testDoc, true);
	});

	describe('format result', () => {
		test('should contain the correct ref', () => {
			expect(generatedSchema.$ref).toEqual('#/definitions/doc_node');
		});

		test('should contain the correct description', () => {
			expect(generatedSchema.description).toEqual('Schema for Atlassian Document Format.');
		});

		test('should contain the correct schema', () => {
			expect(generatedSchema.$schema).toEqual('http://json-schema.org/draft-04/schema#');
		});

		test('should contain the correct definitions', () => {
			expect(generatedSchema.definitions).toEqual(expectedJSONDefinitions);
		});
	});
});

test('filter out empty content items', () => {
	const child1 = adfNode('child1').define({});
	const child2 = adfNode('child1').define({
		ignore: ['json-schema'],
	});
	const child3 = adfNode('child3').define({});
	const node = adfNode('node').define({
		root: true,
		content: [$range(1, 3, $or(child1)), $or(child3), $or(child2)],
	});
	const result = transform(node, false);
	expect(result).toMatchObject({
		definitions: {
			node_node: {
				additionalProperties: false,
				properties: {
					content: {
						items: [{ $ref: '#/definitions/child1_node' }, { $ref: '#/definitions/child3_node' }],
						minItems: 1,
						maxItems: 4,
						type: 'array',
					},
					type: { enum: ['node'] },
				},
				required: ['type', 'content'],
				type: 'object',
			},
		},
	});
});

test('correctly calculate maxItems for non-infinite cases', () => {
	const child1 = adfNode('child1').define({});
	const child2 = adfNode('child2').define({});
	const child3 = adfNode('child3').define({});
	const node = adfNode('node').define({
		root: true,
		content: [$range(1, 3, $or(child1)), $or(child3), $or(child2)],
	});
	const result = transform(node, false);
	expect(result).toMatchObject({
		definitions: {
			node_node: {
				additionalProperties: false,
				properties: {
					content: {
						items: [
							{ $ref: '#/definitions/child1_node' },
							{ $ref: '#/definitions/child3_node' },
							{ $ref: '#/definitions/child2_node' },
						],
						minItems: 1,
						maxItems: 5,
						type: 'array',
					},
					type: { enum: ['node'] },
				},
				required: ['type', 'content'],
				type: 'object',
			},
		},
	});
});

test('correctly calculate maxItems for infinite cases', () => {
	const child1 = adfNode('child1').define({});
	const child2 = adfNode('child2').define({});
	const child3 = adfNode('child3').define({});
	const node = adfNode('node').define({
		root: true,
		content: [$range(1, 3, $or(child1)), $zeroPlus($or(child3)), $or(child2)],
	});
	const result = transform(node, false);
	expect(result).toMatchObject({
		definitions: {
			node_node: {
				additionalProperties: false,
				properties: {
					content: {
						items: [
							{ $ref: '#/definitions/child1_node' },
							{ $ref: '#/definitions/child3_node' },
							{ $ref: '#/definitions/child2_node' },
						],
						minItems: 1,
						type: 'array',
					},
					type: { enum: ['node'] },
				},
				required: ['type', 'content'],
				type: 'object',
			},
		},
	});
});
