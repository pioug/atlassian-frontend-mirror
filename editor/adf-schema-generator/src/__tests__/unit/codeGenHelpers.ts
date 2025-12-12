import { adfMark } from '../../adfMark';
import { adfNode } from '../../adfNode';
import {
	_namedImport,
	buildADFAttributesTypes,
	stringifyWithUndefined,
} from '../../transforms/adfToPm/codeGenHelpers';

describe('named imports', () => {
	test('should generate import statements', () => {
		const result = _namedImport('@atlaskit/editor-prosemirror/model', 'MarkSpec');
		expect(result).toEqual("import { MarkSpec } from '@atlaskit/editor-prosemirror/model'");
	});
});

describe('stringifyWithUndefined', () => {
	test('should not strip out undefined in object', () => {
		const testInput = {
			foo: {
				default: undefined,
				width: 123,
				bar: 'undefined',
			},
		};

		expect(stringifyWithUndefined(testInput)).toEqual(
			`{"foo":{"default":undefined,"width":123,"bar":undefined}}`,
		);
	});
});

describe('mark types', () => {
	test('should generate string correctly', () => {
		const testMark = adfMark('testMark');
		testMark.define({
			attrs: {
				stringAttr: { type: 'string' },
				optionalStringAttr: { type: 'string', optional: true },
			},
		});
		const result = buildADFAttributesTypes(testMark.getSpec().attrs!);
		expect(result.length).toBe(2);
		expect(result[0]).toEqual('stringAttr: string');
		expect(result[1]).toEqual('optionalStringAttr?: string');
	});

	test('should generate number correctly', () => {
		const testMark = adfMark('testMark');
		testMark.define({
			attrs: {
				numberAttr: { type: 'number', minimum: 0, maximum: 6 },
				optionalNumberAttr: { type: 'number', optional: true },
				numberListAttr: { type: 'array', items: { type: 'number' } },
			},
		});
		const result = buildADFAttributesTypes(testMark.getSpec().attrs!);
		expect(result.length).toBe(3);
		expect(result[0]).toEqual('numberAttr: number');
		expect(result[1]).toEqual('optionalNumberAttr?: number');
		expect(result[2]).toEqual('numberListAttr: Array<number>');
	});

	test('should generate boolean correctly', () => {
		const testMark = adfMark('testMark');
		testMark.define({
			attrs: {
				booleanAttr: { type: 'boolean' },
				optionalBooleanAttr: { type: 'boolean', optional: true },
			},
		});
		const result = buildADFAttributesTypes(testMark.getSpec().attrs!);
		expect(result.length).toBe(2);
		expect(result[0]).toEqual('booleanAttr: boolean');
		expect(result[1]).toEqual('optionalBooleanAttr?: boolean');
	});

	test('should generate enum correctly', () => {
		const testMark = adfMark('testMark');
		testMark.define({
			attrs: {
				enumAttr: {
					type: 'enum',
					values: ['center', 'end'],
					default: 'center',
				},
			},
		});
		const result = buildADFAttributesTypes(testMark.getSpec().attrs!);
		expect(result.length).toBe(1);
		expect(result[0]).toBe(`enumAttr: "center"|"end"`);
	});

	test('should generate array correctly', () => {
		const testMark = adfMark('testMark');
		testMark.define({
			attrs: {
				array1Attr: { type: 'array', items: { type: 'string', min: 1 } },
				array2Attr: { type: 'array', items: { type: 'number', min: 1 } },
			},
		});
		const result = buildADFAttributesTypes(testMark.getSpec().attrs!);
		expect(result.length).toBe(2);
		expect(result[0]).toBe('array1Attr: Array<string>');
		expect(result[1]).toBe('array2Attr: Array<number>');
	});

	test('should generate object correctly', () => {
		const testMark = adfMark('testMark');
		testMark.define({
			attrs: {
				objectAttr: {
					type: 'object',
					starWars: {
						people: ['Luke', 'C-3PO', 'R2-D2', 'Darth Vader'],
						planets: ['Tatooine', 'Alderaan'],
					},
				},
			},
		});
		const result = buildADFAttributesTypes(testMark.getSpec().attrs!);
		expect(result.length).toBe(1);
		expect(result[0]).toBe('objectAttr: Record<string, unknown>');
	});
});

describe('node types', () => {
	test('should generate string correctly', () => {
		const testNode = adfNode('testNode');
		testNode.define({
			attrs: {
				stringAttr: { type: 'string' },
				optionalStringAttr: { type: 'string', optional: true },
			},
		});
		const result = buildADFAttributesTypes(testNode.getSpec()!.attrs!);
		expect(result.length).toBe(2);
		expect(result[0]).toEqual('stringAttr: string');
		expect(result[1]).toEqual('optionalStringAttr?: string');
	});

	test('should generate number correctly', () => {
		const testNode = adfNode('testNode');
		testNode.define({
			attrs: {
				numberAttr: { type: 'number', minimum: 0, maximum: 6 },
				optionalNumberAttr: { type: 'number', optional: true },
				numberListAttr: { type: 'array', items: { type: 'number' } },
			},
		});
		const result = buildADFAttributesTypes(testNode.getSpec()!.attrs!);
		expect(result.length).toBe(3);
		expect(result[0]).toEqual('numberAttr: number');
		expect(result[1]).toEqual('optionalNumberAttr?: number');
		expect(result[2]).toEqual('numberListAttr: Array<number>');
	});

	test('should generate boolean correctly', () => {
		const testNode = adfNode('testNode');
		testNode.define({
			attrs: {
				booleanAttr: { type: 'boolean' },
				optionalBooleanAttr: { type: 'boolean', optional: true },
			},
		});
		const result = buildADFAttributesTypes(testNode.getSpec()!.attrs!);
		expect(result.length).toBe(2);
		expect(result[0]).toEqual('booleanAttr: boolean');
		expect(result[1]).toEqual('optionalBooleanAttr?: boolean');
	});

	test('should generate enum correctly', () => {
		const testNode = adfNode('testNode');
		testNode.define({
			attrs: {
				enumAttr: {
					type: 'enum',
					values: ['center', 'end'],
					default: 'center',
				},
			},
		});
		const result = buildADFAttributesTypes(testNode.getSpec()!.attrs!);
		expect(result.length).toBe(1);
		expect(result[0]).toBe(`enumAttr: "center"|"end"`);
	});

	test('should generate array correctly', () => {
		const testNode = adfNode('testNode');
		testNode.define({
			attrs: {
				array1Attr: { type: 'array', items: { type: 'string', min: 1 } },
				array2Attr: { type: 'array', items: { type: 'number', min: 1 } },
			},
		});
		const result = buildADFAttributesTypes(testNode.getSpec()!.attrs!);
		expect(result.length).toBe(2);
		expect(result[0]).toBe('array1Attr: Array<string>');
		expect(result[1]).toBe('array2Attr: Array<number>');
	});

	test('should generate object correctly', () => {
		const testNode = adfNode('testNode');
		testNode.define({
			attrs: {
				objectAttr: {
					type: 'object',
					starWars: {
						people: ['Luke', 'C-3PO', 'R2-D2', 'Darth Vader'],
						planets: ['Tatooine', 'Alderaan'],
					},
				},
			},
		});
		const result = buildADFAttributesTypes(testNode.getSpec()!.attrs!);
		expect(result.length).toBe(1);
		expect(result[0]).toBe('objectAttr: Record<string, unknown>');
	});
});
