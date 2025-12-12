import type { ADFAttributes } from '../../../types/ADFAttribute';
import { adfMark } from '../../../adfMark';
import { adfMarkGroup } from '../../../adfMarkGroup';
import { buildAttrs, buildMarkSpec } from '../../../transforms/adfToPm/buildPmSpec';

describe('build pm specs', () => {
	describe('build attrs', () => {
		test('should return with undefined', () => {
			const testAttrs: ADFAttributes = {
				width: {
					type: 'number',
					default: undefined,
				},
			};
			expect(buildAttrs(testAttrs)).toStrictEqual({
				width: { default: undefined },
			});
		});

		test('should not return with optional key for optional attr', () => {
			const testAttrs: ADFAttributes = {
				width: {
					type: 'number',
					optional: true,
				},
			};
			expect(buildAttrs(testAttrs)).toStrictEqual({});
		});

		test('should return key if attr is not optional', () => {
			const testAttrs: ADFAttributes = {
				width: {
					type: 'number',
				},
			};
			expect(buildAttrs(testAttrs)).toStrictEqual({ width: {} });
		});

		test('should return default value if default value is defined', () => {
			const testAttrs: ADFAttributes = {
				width: {
					type: 'number',
					default: undefined,
				},
				widthWithDefault: {
					type: 'number',
					default: 0,
				},
				widthWithDefaultNull: {
					type: 'number',
					default: null,
				} as any,
				foo: {
					type: 'string',
					default: '',
				},
				fooWithNull: {
					type: 'string',
					default: null,
				} as any,
				bar: {
					type: 'boolean',
					default: false,
				},
				barTrue: {
					type: 'boolean',
					default: true,
				},
				enum: {
					type: 'enum',
					values: ['center', 'end'],
					default: 'center',
				},
				array1: {
					type: 'array',
					items: { type: 'string', minLength: 1 },
					default: [''],
				},
				array2: {
					type: 'array',
					items: { type: 'number', minimum: 1, maximum: 5 },
					default: [100],
				},
				objectTest: {
					type: 'object',
					default: {
						welcome: 'hello world',
					},
				},
			};
			expect(buildAttrs(testAttrs)).toStrictEqual({
				width: {
					default: undefined,
				},
				widthWithDefault: {
					default: 0,
				},
				widthWithDefaultNull: {
					default: null,
				},
				foo: {
					default: '',
				},
				fooWithNull: {
					default: null,
				},
				bar: {
					default: false,
				},
				barTrue: {
					default: true,
				},
				enum: {
					default: 'center',
				},
				array1: {
					default: [''],
				},
				array2: {
					default: [100],
				},
				objectTest: {
					default: {
						welcome: 'hello world',
					},
				},
			});
		});
	});

	describe('build mark specs', () => {
		test('should build markSpec correctly', () => {
			const testMark = adfMark('testMark');
			const darthVaderMark = adfMark('darth-vader');
			const palpatineMark = adfMark('palpatine');
			const sithGroup = adfMarkGroup('sith', [darthVaderMark, palpatineMark]);
			const jediGroup = adfMarkGroup('jedi', [testMark]);
			testMark.define({
				excludes: [sithGroup],
				group: jediGroup,
				inclusive: true,
				spanning: true,
				attrs: {
					undefinedDefaultAttr: { type: 'string', default: undefined },
					nullDefaultAttr: { type: 'string', default: null } as any,
					optionalStringAttr: { type: 'string', optional: true },
					optionalNumberAttr: { type: 'number', optional: true },
					optionalBooleanAttr: { type: 'boolean', optional: true },
					booleanAttr: { type: 'boolean' },
					stringAttr: { type: 'string' },
					numberAttr: { type: 'number', minimum: 0, maximum: 6 },
					numberListAttr: { type: 'numberList' } as any,
					enumAttr: {
						type: 'enum',
						values: ['center', 'end'],
						default: 'center',
					},
					array1Attr: {
						type: 'array',
						items: { type: 'string', minLength: 1 },
					},
					array2Attr: { type: 'array', items: { type: 'number', minimum: 1 } },
					objectAttr: {
						type: 'object',
						starWars: {
							people: ['Luke', 'C-3PO', 'R2-D2', 'Darth Vader'],
							planets: ['Tatooine', 'Alderaan'],
						},
					},
				},
			});
			const result = buildMarkSpec(testMark);
			expect(result).toMatchSnapshot();
		});
	});
});
