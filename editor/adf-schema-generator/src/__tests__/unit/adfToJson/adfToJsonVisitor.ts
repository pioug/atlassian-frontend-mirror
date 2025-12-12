import type { JSONSchema4 } from 'json-schema';
import { adfMark } from '../../../adfMark';
import type { ADFNode } from '../../../adfNode';
import { adfNode } from '../../../adfNode';
import { adfNodeGroup } from '../../../adfNodeGroup';
import type { ADFNodeContentRangeSpec } from '../../../types/ADFNodeSpec';
import type { NodeVisitorReturnType } from '../../../transforms/adfToJson/adfToJsonVisitor';
import { buildVisitor } from '../../../transforms/adfToJson/adfToJsonVisitor';
import { JSONSchemaTransformerName } from '../../../transforms/transformerNames';

const testMark = adfMark('testMark').define({
	attrs: {},
});
const testFullSchemaNode = adfNode('fullSchemaNode').define({
	content: [],
	marks: [testMark],
});
const testStage0OnlyNode = adfNode('testStage0OnlyNode').define({
	content: [],
	marks: [testMark],
	stage0: true,
});
const ignoredNode = adfNode('testIgnoredNode').define({
	content: [],
	marks: [testMark],
	ignore: [JSONSchemaTransformerName],
});
const testGroup = adfNodeGroup('testGroup', [testFullSchemaNode, testStage0OnlyNode, ignoredNode]);

const getExpectedNodeJson = (node: ADFNode<any, any>) => {
	return {
		[`${node.getName()}_node`]: {
			json: { jsonSchema: 'blah' },
		},
		[testMark.getName()]: {
			json: {
				type: 'object',
				properties: {
					type: {
						enum: ['testMark'],
					},
				},
				required: ['type'],
				additionalProperties: false,
			},
		},
	};
};

describe('node', () => {
	const mockBuildJson = jest.fn(() => ({
		jsonSchema: 'blah',
	}));

	const processNode = (props: {
		isCycle: true | undefined;
		isFullSchema: boolean;
		node: ADFNode<any, any>;
		resMap: Record<string, { json: JSONSchema4 }>;
	}) => {
		const { node, resMap, isCycle, isFullSchema } = props;
		const visitor = buildVisitor(resMap, mockBuildJson, isFullSchema);
		return visitor.node?.(node, [{ contentTypes: [] } as any], isCycle);
	};

	describe('stage0 only node', () => {
		describe('isFullSchema = false', () => {
			const isFullSchema = false;
			let resMap = {};
			let processedNode: NodeVisitorReturnType | undefined;
			const isCycle = undefined;

			beforeEach(() => {
				resMap = {};
				mockBuildJson.mockClear();
				processedNode = processNode({
					node: testStage0OnlyNode,
					resMap,
					isFullSchema,
					isCycle,
				});
			});

			test('call buildJson with correct parameters', () => {
				expect(mockBuildJson).toHaveBeenCalledTimes(1);
				expect(mockBuildJson).toHaveBeenCalledWith(
					testStage0OnlyNode,
					[{ contentTypes: [] }],
					isFullSchema,
				);
			});

			test('should return processed node', () => {
				expect(processedNode).toEqual({
					json: {
						jsonSchema: 'blah',
					},
					node: testFullSchemaNode,
				});
			});

			test('should add json to the res map', () => {
				expect(resMap).toEqual(getExpectedNodeJson(testStage0OnlyNode));
			});
		});

		describe('isFullSchema = true', () => {
			const isFullSchema = true;
			let resMap = {};
			let processedNode: NodeVisitorReturnType | undefined;
			const isCycle = undefined;

			beforeEach(() => {
				resMap = {};
				mockBuildJson.mockClear();
				processedNode = processNode({
					node: testStage0OnlyNode,
					resMap,
					isFullSchema,
					isCycle,
				});
			});

			test('should not process the node', () => {
				expect(mockBuildJson).toHaveBeenCalledTimes(0);
				expect(processedNode).toBe(undefined);
				expect(resMap).toEqual({});
			});
		});
	});

	describe('ignored node', () => {
		const isFullSchema = false;
		let resMap = {};
		let processedNode: NodeVisitorReturnType | undefined;
		const isCycle = undefined;

		beforeEach(() => {
			resMap = {};
			mockBuildJson.mockClear();
			processedNode = processNode({
				node: ignoredNode,
				resMap,
				isFullSchema,
				isCycle,
			});
		});

		test('should not process the node', () => {
			expect(mockBuildJson).toHaveBeenCalledTimes(0);
			expect(processedNode).toBe(undefined);
			expect(resMap).toEqual({});
		});
	});

	describe('full schema node', () => {
		describe.each([true, undefined] as [true, undefined])('when cycle is %s', (isCycle) => {
			let resMap = {};
			let processedNode: NodeVisitorReturnType | undefined;
			const isFullSchema = true;

			beforeEach(() => {
				resMap = {};
				mockBuildJson.mockClear();
				processedNode = processNode({
					node: testFullSchemaNode,
					resMap,
					isFullSchema,
					isCycle,
				});
			});

			test('call buildJson with correct parameters', () => {
				expect(mockBuildJson).toHaveBeenCalledTimes(1);
				expect(mockBuildJson).toHaveBeenCalledWith(
					testFullSchemaNode,
					[{ contentTypes: [] }],
					isFullSchema,
				);
			});

			test('should return processed node', () => {
				expect(processedNode).toEqual({
					json: {
						jsonSchema: 'blah',
					},
					node: testFullSchemaNode,
				});
			});

			test('should add json to the res map', () => {
				const expectedJson = isCycle ? {} : getExpectedNodeJson(testFullSchemaNode);
				expect(resMap).toEqual(expectedJson);
			});
		});
	});
});

describe('group', () => {
	describe('fullSchema = true', () => {
		const isFullSchema = true;
		test('should return only fullSchemaNode', () => {
			const resMap = {};
			const visitor = buildVisitor(resMap, jest.fn(), isFullSchema);
			const result = visitor.group?.(testGroup, []);
			expect(resMap).toEqual({
				[`${testGroup.group}_node`]: {
					json: {
						anyOf: [
							{
								$ref: '#/definitions/fullSchemaNode_node',
							},
						],
					},
				},
			});
			expect(result).toEqual({ group: testGroup.group, members: [] });
		});
	});

	describe('fullSchema = false', () => {
		const isFullSchema = false;
		test('should return only fullSchemaNode and stage0Node', () => {
			const resMap = {};
			const visitor = buildVisitor(resMap, jest.fn(), isFullSchema);
			const result = visitor.group?.(testGroup, []);
			expect(resMap).toEqual({
				[`${testGroup.group}_node`]: {
					json: {
						anyOf: [
							{
								$ref: '#/definitions/fullSchemaNode_node',
							},
							{
								$ref: '#/definitions/testStage0OnlyNode_node',
							},
						],
					},
				},
			});
			expect(result).toEqual({ group: testGroup.group, members: [] });
		});
	});
});

describe('$or', () => {
	test('should return empty contentTypes when there is no content', () => {
		const resMap = {};
		const visitor = buildVisitor(resMap, jest.fn(), true);
		const result = visitor.$or?.([]);
		expect(result).toEqual({ type: '$or', minItems: 1, contentTypes: [] });
	});

	test('should return contentTypes for node return value', () => {
		const resMap = {};
		const visitor = buildVisitor(resMap, jest.fn(), true);
		const result = visitor.$or?.([{ node: testFullSchemaNode, json: {} }]);
		expect(result).toEqual({
			type: '$or',
			minItems: 1,
			contentTypes: [testFullSchemaNode.getName()],
		});
	});

	test('should return group name in contentTypes if group has members', () => {
		const resMap = {};
		const visitor = buildVisitor(resMap, jest.fn(), true);
		const result = visitor.$or?.([
			{
				group: testGroup.group,
				members: testGroup.members.map((m) => ({
					node: m,
					json: {},
				})),
			},
		]);
		expect(result).toEqual({
			type: '$or',
			minItems: 1,
			contentTypes: [testGroup.group],
		});
	});

	test('should return empty contentTypes when group has no members', () => {
		const resMap = {};
		const visitor = buildVisitor(resMap, jest.fn(), true);
		const result = visitor.$or?.([
			{
				group: testGroup.group,
				members: [],
			},
		]);
		expect(result).toEqual({
			type: '$or',
			minItems: 1,
			contentTypes: [],
		});
	});
});

test('$onePlus', () => {
	const resMap = {};
	const visitor = buildVisitor(resMap, jest.fn(), true);
	const result = visitor.$onePlus?.({ type: '$or', contentTypes: ['test'] });
	expect(result).toEqual({
		type: '$onePlus',
		minItems: 1,
		contentTypes: ['test'],
	});
});

test('$zeroPlus', () => {
	const resMap = {};
	const visitor = buildVisitor(resMap, jest.fn(), true);
	const result = visitor.$zeroPlus?.({ type: '$or', contentTypes: ['test'] });
	expect(result).toEqual({
		type: '$zeroPlus',
		minItems: 0,
		contentTypes: ['test'],
	});
});

test('$range', () => {
	const resMap = {};
	const visitor = buildVisitor(resMap, jest.fn(), true);
	const range: ADFNodeContentRangeSpec = {
		min: 1,
		max: 3,
		type: '$range',
		content: { type: '$or', content: [testFullSchemaNode] },
	};
	const result = visitor.$range?.(range, { type: '$or', contentTypes: ['test'] });
	expect(result).toEqual({
		type: '$range',
		contentTypes: ['test'],
		range,
	});
});
