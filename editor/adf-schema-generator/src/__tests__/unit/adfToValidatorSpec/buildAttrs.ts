import { buildAttrs } from '../../../transforms/adfToValidatorSpec/buildAttrs';

describe('buildAttrs', () => {
	test('should strip falsy properties', () => {
		expect(
			buildAttrs({
				null: null,
				undefined: undefined,
				remaining: { type: 'boolean' },
			} as any),
		).toStrictEqual({ props: { remaining: { type: 'boolean' } } });
	});

	test('should add optional property if all optional properties true', () => {
		expect(buildAttrs({ a: { type: 'string', optional: true } })).toStrictEqual({
			optional: true,
			props: {
				a: {
					type: 'string',
					optional: true,
				},
			},
		});
	});

	test('should not add optional property if all optional properties are not true', () => {
		expect(
			buildAttrs({
				a: { type: 'string', optional: true },
				b: { type: 'string', optional: false },
			}),
		).toStrictEqual({
			props: {
				a: {
					type: 'string',
					optional: true,
				},
				b: {
					type: 'string',
					optional: false,
				},
			},
		});
	});

	test('should strip private properties', () => {
		expect(
			buildAttrs({
				title: { type: 'string', default: '', optional: true },
				__expanded: { type: 'boolean', default: true, optional: true },
			}),
		).toStrictEqual({
			optional: true,
			props: {
				title: { type: 'string', optional: true },
			},
		});
	});

	test('given a nested set of properties, it should generate correctly', () => {
		const result = buildAttrs({
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
		});
		expect(result).toEqual({
			props: {
				datasource: {
					props: {
						id: { type: 'string' },
						views: {
							items: [
								{
									props: {
										properties: { optional: true, type: 'object' },
										type: { type: 'string' },
									},
								},
							],
							minItems: 1,
							type: 'array',
						},
					},
				},
			},
		});
	});
});
