import {
	buildContent,
	determineItems,
	isADFGroup,
	isADFNode,
	processContentTypes,
	processContentGroups,
	determineMinItems,
	determineMaxItems,
	flattenArray,
	flattenContent,
} from '../../../transforms/adfToJson/contentBuilder';
import type { ADFNodeContentRangeSpec } from '../../../types/ADFNodeSpec';
import { ADFNode } from '../../../adfNode';
import type { ADFNodeGroup } from '../../../types/ADFNodeGroup';
import type { ContentVisitorReturnType } from '../../../transforms/adfToJson/adfToJsonVisitor';

describe('buildContent', () => {
	it('should return empty object if content is empty', () => {
		const content: ContentVisitorReturnType[] = [];
		const name = 'name';
		const adfNode = {};
		const fullSchema = false;
		const result = buildContent(content, name, adfNode, fullSchema);
		expect(result).toEqual({});
	});

	it('should return JSONSchema4 object with type array, items, minItems and maxItems', () => {
		const testNode = new ADFNode('testNode');
		const name: string = 'name';
		const adfNodeContent: Array<ADFNodeContentRangeSpec> = [
			{
				type: '$range',
				content: { type: '$or', content: [testNode] },
				min: 1,
				max: 3,
			},
		];
		const content: Array<ContentVisitorReturnType> = [
			{
				contentTypes: ['test'],
				range: adfNodeContent[0],
				type: '$or',
			},
		];
		const adfNode = {
			content: adfNodeContent,
		};
		const fullSchema: boolean = false;
		const result = buildContent(content, name, adfNode, fullSchema);
		expect(result).toEqual({
			content: {
				type: 'array',
				items: { $ref: '#/definitions/test_node' },
				minItems: 1,
				maxItems: 3,
			},
		});
	});
});

describe('isADFGroup', () => {
	it('should return true if value is ADFNodeGroup', () => {
		const testGroup: ADFNodeGroup = {
			group: 'testGroup',
			groupType: 'node',
			members: [],
			isIgnored: () => false,
		};
		const result = isADFGroup(testGroup);
		expect(result).toEqual(true);
	});

	it('should return false if value is not ADFNodeGroup', () => {
		const testNode = new ADFNode('testNode');
		const result = isADFGroup(testNode);
		expect(result).toEqual(false);
	});
});

describe('isADFNode', () => {
	it('should return true if value is ADFNode', () => {
		const testNode = new ADFNode('testNode');
		const result = isADFNode(testNode);
		expect(result).toEqual(true);
	});

	it('should return false if value is not ADFNode', () => {
		const testGroup: ADFNodeGroup = {
			group: 'testGroup',
			groupType: 'node',
			members: [],
			isIgnored: () => false,
		};
		const result = isADFNode(testGroup);
		expect(result).toEqual(false);
	});
});

describe('determineItems', () => {
	it('should return JSONSchema4 object with type array, items, minItems and maxItems', () => {
		const testNode = new ADFNode('testNode');
		const name: string = 'name';
		const adfNodeContent: Array<ADFNodeContentRangeSpec> = [
			{
				type: '$range',
				content: { type: '$or', content: [testNode] },
				min: 1,
				max: 3,
			},
		];
		const content: Array<ContentVisitorReturnType> = [
			{
				contentTypes: ['test'],
				range: adfNodeContent[0],
				type: '$or',
			},
		];
		const fullSchema: boolean = false;
		const result = determineItems(content, name, adfNodeContent, fullSchema);
		expect(result).toEqual({
			$ref: '#/definitions/test_node',
		});
	});
});

describe('processContentTypes', () => {
	it('should return single content type when there is one item', () => {
		const result = processContentTypes(['test']);
		expect(result).toEqual({ $ref: '#/definitions/test_node' });
	});

	it('should return anyOf array of content types when there are multiple items', () => {
		const result = processContentTypes(['a', 'b']);
		expect(result).toEqual({
			anyOf: [{ $ref: '#/definitions/a_node' }, { $ref: '#/definitions/b_node' }],
		});
	});
});

describe('processContentGroups', () => {
	it('should process the content groups', () => {
		const result = processContentGroups([
			{ contentTypes: ['a'], type: '$or' },
			{ contentTypes: ['b'], type: '$or' },
		]);
		expect(result).toEqual([{ $ref: '#/definitions/a_node' }, { $ref: '#/definitions/b_node' }]);
	});
});

describe('determineMinItems', () => {
	it('should return minItems from content', () => {
		const content: Array<ContentVisitorReturnType> = [
			{
				contentTypes: ['test'],
				minItems: 1,
				type: '$or',
			},
		];
		const result = determineMinItems(content);
		expect(result).toEqual(1);
	});

	it('should return minItems from range', () => {
		const testNode = new ADFNode('testNode');
		const content: Array<ContentVisitorReturnType> = [
			{
				contentTypes: ['test'],
				range: {
					type: '$range',
					content: { type: '$or', content: [testNode] },
					min: 3,
					max: 5,
				},
				type: '$or',
			},
		];
		const result = determineMinItems(content);
		expect(result).toEqual(3);
	});

	it('should return null if no minItems or range', () => {
		const content: Array<ContentVisitorReturnType> = [
			{
				contentTypes: ['test'],
				type: '$or',
			},
		];
		const result = determineMinItems(content);
		expect(result).toEqual(null);
	});
});

describe('determineMaxItems', () => {
	it('should return maxItems from range', () => {
		const testNode = new ADFNode('testNode');
		const content: Array<ContentVisitorReturnType> = [
			{
				contentTypes: ['test'],
				range: {
					type: '$range',
					content: { type: '$or', content: [testNode] },
					min: 3,
					max: 5,
				},
				type: '$or',
			},
		];
		const result = determineMaxItems(content);
		expect(result).toEqual(5);
	});

	it('should return maxItems from range if only one item', () => {
		const testNode = new ADFNode('testNode');
		const adfNodeContent: Array<ADFNodeContentRangeSpec> = [
			{
				type: '$range',
				content: { type: '$or', content: [testNode] },
				min: 3,
				max: 5,
			},
		];
		const content: Array<ContentVisitorReturnType> = [
			{
				contentTypes: ['test'],
				range: adfNodeContent[0],
				type: '$or',
			},
		];
		const result = determineMaxItems(content);
		expect(result).toEqual(5);
	});

	it('should return null if no range', () => {
		const content: Array<ContentVisitorReturnType> = [
			{
				contentTypes: ['test'],
				type: '$or',
			},
		];
		const result = determineMaxItems(content);
		expect(result).toEqual(null);
	});
});

describe('flattenArray', () => {
	it('should return single item if array has one item', () => {
		const result = flattenArray(['test']);
		expect(result).toEqual('test');
	});

	it('should return array if array has multiple items', () => {
		const result = flattenArray(['a', 'b']);
		expect(result).toEqual(['a', 'b']);
	});
});

describe('flattenContent', () => {
	it('should flatten ADF groups and nodes into an array of nodes', () => {
		const testNode1 = new ADFNode('testNode1').define({
			content: [],
		});
		const testNode2 = new ADFNode('testNode2').define({
			content: [],
		});
		const testNode3 = new ADFNode('testNode3').define({
			content: [],
		});
		const testGroup: ADFNodeGroup = {
			group: 'testGroup',
			groupType: 'node',
			members: [testNode2, testNode3],
			isIgnored: () => false,
		};
		const result = flattenContent([testNode1, testGroup]);
		expect(result).toEqual([testNode1, testNode2, testNode3]);
	});
});
