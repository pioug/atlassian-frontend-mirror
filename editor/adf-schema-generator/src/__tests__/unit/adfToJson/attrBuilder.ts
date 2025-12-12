import type {
	ADFAttribute,
	ADFAttributeNumber,
	ADFAttributeString,
	ADFAttributesAnyOf,
} from '../../../types/ADFAttribute';
import { buildAttrs, buildAttrsSet } from '../../../transforms/adfToJson/attrBuilder';

describe('when running buildAttrs', () => {
	test('given undefined nodeAttrs, it should return an empty object', () => {
		const nodeAttrs = undefined;
		const result = buildAttrs(nodeAttrs);
		expect(result).toEqual({});
	});

	test('given an attribute without anyOf, it should return JSON schema for object', () => {
		const stringAttr: ADFAttributeString = {
			type: 'string',
		};
		const result = buildAttrs({ attr1: stringAttr });
		expect(result).toEqual({
			attrs: {
				additionalProperties: false,
				properties: {
					attr1: {
						type: 'string',
					},
				},
				required: ['attr1'],
				type: 'object',
			},
		});
	});

	test('given an attribute with anyOf, it should return JSON schema for object', () => {
		const stringAttr: ADFAttributeString = {
			type: 'string',
		};
		const numberAttr: ADFAttributeNumber = {
			type: 'number',
			optional: true,
		};

		const nodeAttrs: ADFAttributesAnyOf = {
			anyOf: [{ attr1: stringAttr }, { attr2: numberAttr }],
		};
		const result = buildAttrs(nodeAttrs);
		expect(result).toEqual({
			attrs: {
				anyOf: [
					{
						additionalProperties: false,
						properties: {
							attr1: {
								type: 'string',
							},
						},
						required: ['attr1'],
						type: 'object',
					},
					{
						additionalProperties: false,
						properties: {
							attr2: {
								type: 'number',
							},
						},
						type: 'object',
					},
				],
			},
		});
	});
});

describe('when running buildAttrsSet', () => {
	test('given an attribute set, it should omit attributes starting with _', () => {
		const attrsSet: Record<string, ADFAttribute> = {
			_attr1: {
				type: 'string',
			},
		};
		const result = buildAttrsSet(attrsSet);
		expect(result).toEqual({
			additionalProperties: false,
			properties: {},
			type: 'object',
		});
	});

	test('given an attribute set, it should omit type for objects that dont hold other key-value pairs', () => {
		const attrsSet: Record<string, ADFAttribute> = {
			data: {
				type: 'object',
			},
			parameters: {
				type: 'object',
			},
		};
		const result = buildAttrsSet(attrsSet);
		expect(result).toEqual({
			additionalProperties: false,
			properties: {
				data: {},
				parameters: {},
			},
			required: ['data', 'parameters'],
			type: 'object',
		});
	});

	test('given a nested set of properties, it should generate correctly', () => {
		const attrsSet: Record<string, ADFAttribute> = {
			datasource: {
				type: 'object',
				default: undefined,
				additionalProperties: false,
				properties: {
					id: { type: 'string' },
					views: {
						items: {
							additionalProperties: false,
							// nested properties object
							properties: {
								// empty nested properties object
								properties: { optional: true, type: 'object' },
								type: {
									type: 'string',
								},
							},
							required: ['type'],
							type: 'object',
						},
						minItems: 1,
						type: 'array',
					},
				},
				required: ['id', 'views'],
			},
		};
		const result = buildAttrsSet(attrsSet);
		expect(result).toEqual({
			additionalProperties: false,
			properties: {
				datasource: {
					type: 'object',
					additionalProperties: false,
					properties: {
						id: {
							type: 'string',
						},
						views: {
							items: {
								type: 'object',
								// nested properties object
								properties: {
									// empty nested properties object
									properties: {},
									type: {
										type: 'string',
									},
								},
								required: ['type'],
								additionalProperties: false,
							},
							minItems: 1,
							type: 'array',
						},
					},
					required: ['id', 'views'],
				},
			},
			required: ['datasource'],
			type: 'object',
		});
	});

	test('given an attribute set, it should format enum', () => {
		const attrsSet: Record<string, ADFAttribute> = {
			enumAttr: {
				type: 'enum',
				values: ['value1', 'value2'],
			},
		};
		const result = buildAttrsSet(attrsSet);
		expect(result).toEqual({
			additionalProperties: false,
			properties: {
				enumAttr: {
					enum: ['value1', 'value2'],
				},
			},
			required: ['enumAttr'],
			type: 'object',
		});
	});

	test('given an attribute set, it should omit validatorFn', () => {
		const attrsSet: Record<string, ADFAttribute> = {
			stringAttr: {
				type: 'string',
				validatorFn: 'safeUrl',
			},
		};
		const result = buildAttrsSet(attrsSet);
		expect(result).toEqual(expect.not.objectContaining({ validatorFn: expect.anything() }));
	});

	test('given an attribute set, it should omit optional and default', () => {
		const attrsSet: Record<string, ADFAttribute> = {
			stringAttr: {
				type: 'string',
				optional: true,
				default: 'default',
			},
		};
		const result = buildAttrsSet(attrsSet);
		expect(result).toEqual(expect.not.objectContaining({ optional: expect.anything() }));
		expect(result).toEqual(expect.not.objectContaining({ default: expect.anything() }));
	});

	test('given an attribute set, it should include the required entry if there are required fields', () => {
		const attrsSet: Record<string, ADFAttribute> = {
			requiredAttr: {
				type: 'string',
			},
		};
		const result = buildAttrsSet(attrsSet);
		expect(result.required).toEqual(['requiredAttr']);
	});

	test('when there is no required entry, output should not contain required field', () => {
		const attrsSet: Record<string, ADFAttribute> = {
			optionalAttr: {
				type: 'string',
				optional: true,
			},
		};
		const result = buildAttrsSet(attrsSet);
		expect(result).toEqual(expect.not.objectContaining({ required: expect.anything() }));
	});
});
