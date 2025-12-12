import { adfMark } from '../../../adfMark';
import { _markInterfaces } from '../../../transforms/adfToPm/pmMarksCodeGen';

test('should generate mark types with alias with attribute sub type', () => {
	const testMark = adfMark('testMark');
	testMark.define({
		attrs: {
			optionalStringAttr: { type: 'string', optional: true },
		},
	});
	const result = _markInterfaces(
		'TestMark',
		'TestMark',
		'TestMarkDefinition',
		testMark.getSpec().attrs!,
	);

	expect(result).toEqual(
		[
			'export interface TestMarkAttributes {optionalStringAttr?: string}',
			'export interface TestMarkDefinition {type: "TestMark", attrs: TestMarkAttributes}',
			'export interface TestMark extends Mark {attrs: TestMarkAttributes}',
		].join('\n\n'),
	);
});

test('should generate mark types with alias with no attribute if not defined', () => {
	const testMark = adfMark('testMark');
	testMark.define({});
	const result = _markInterfaces(
		'TestMark',
		'TestMark',
		'TestMarkDefinition',
		testMark.getSpec().attrs!,
	);

	expect(result).toEqual(
		['export interface TestMarkDefinition {type: "TestMark"}', 'export type TestMark = Mark'].join(
			'\n\n',
		),
	);
});
