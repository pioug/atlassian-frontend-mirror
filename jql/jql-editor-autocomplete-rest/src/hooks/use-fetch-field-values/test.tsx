import { getAutocompleteSuggestionsUrl } from './index';

describe('getAutocompleteSuggestionsUrl', () => {
	it('should return the correct url', () => {
		expect(getAutocompleteSuggestionsUrl('testField', 'testQuery')).toBe(
			'/rest/api/latest/jql/autocompletedata/suggestions?fieldName=testField&fieldValue=testQuery',
		);
	});
	it('should encode the parameter values', () => {
		expect(getAutocompleteSuggestionsUrl('test&Field', 'test?query')).toBe(
			'/rest/api/latest/jql/autocompletedata/suggestions?fieldName=test%26Field&fieldValue=test%3Fquery',
		);
	});
});
