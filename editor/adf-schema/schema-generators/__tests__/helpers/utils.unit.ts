import { filterAndSortMarks, formatContent } from './_utils';

describe('formatContent', () => {
	it('should reorder within () with multiple content', () => {
		expect(formatContent('(dTest | aTest)+ (dTest | aTest)*')).toEqual(
			'(aTest|dTest)+ (aTest|dTest)*',
		);
	});

	it('should reorder within () with multiple content, and if first content has no operator', () => {
		expect(formatContent('(dTest | aTest) (dTest | aTest)*')).toEqual(
			'(aTest|dTest) (aTest|dTest)*',
		);
	});

	it('should reorder within (), and no operator for single content', () => {
		expect(formatContent('dTest | aTest')).toEqual('aTest|dTest');
	});

	it('should keep parentheses with multiple content', () => {
		expect(formatContent('(taskItem)+ (dTest|aTest)*')).toEqual('(taskItem)+ (aTest|dTest)*');
	});

	it('should keep parentheses with single content', () => {
		expect(formatContent('(taskItem)+')).toEqual('(taskItem)+');
	});

	it('should remove unsupported strings and unnessary braces with onePlus and zeroPlus exps', () => {
		expect(
			formatContent('(taskItem|unsupportedBlock)+ (testA|testB|unsupportedBlock)*', [
				'unsupportedBlock',
			]),
		).toEqual('taskItem+ (testA|testB)*');
	});

	it('should remove unsupported strings with range exp', () => {
		expect(
			formatContent('(layoutColumn|unsupportedBlock){1,3} (testA|testB|unsupportedBlock)*', [
				'unsupportedBlock',
			]),
		).toEqual('layoutColumn{1,3} (testA|testB)*');
	});

	it('should remove all unsupported strings in between "|"', () => {
		expect(
			formatContent('aTest | unsupportedBlock* | unsupportedBlock+', ['unsupportedBlock']),
		).toEqual('aTest');
	});
});

describe('filterMarks', () => {
	it('should remove marks if excludes defined', () => {
		expect(
			filterAndSortMarks('unsupportedMark unsupportedNodeAttributes testMarkA testMarkB', [
				'unsupportedMark',
				'unsupportedNodeAttributes',
			]),
		).toEqual('testMarkA testMarkB');
	});
});
