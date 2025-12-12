import { buildContentExpression } from '../../../transforms/adfToPm/buildContentExpression';

describe('build content expression', () => {
	test('should have () for multiple nodes with operator', () => {
		const actual = buildContentExpression(['aTest', 'bTest'], '*');
		expect(actual).toEqual('(aTest | bTest)*');
	});

	test('should have () for multipe nodes with no operator', () => {
		const actual = buildContentExpression(['aTest', 'bTest']);
		expect(actual).toEqual('(aTest | bTest)');
	});

	test('should have no () for one one with operator', () => {
		const actual = buildContentExpression(['aTest'], '+');
		expect(actual).toEqual('aTest+');
	});

	test('should have no () for one one with no operator', () => {
		const actual = buildContentExpression(['aTest']);
		expect(actual).toEqual('aTest');
	});
});
