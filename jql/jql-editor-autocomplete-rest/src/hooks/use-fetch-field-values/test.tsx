import { ffTest } from '@atlassian/feature-flags-test-utils';

import { getAutocompleteSuggestionsUrl } from './index';

describe('getAutocompleteSuggestionsUrl', () => {
	ffTest.both(
		'empanada_jql_editor_uri_encode_suggestions_params',
		'default cases',
		() => {
			it('should return the correct url', () => {
				expect(getAutocompleteSuggestionsUrl('testField', 'testQuery')).toBe(
					'/rest/api/latest/jql/autocompletedata/suggestions?fieldName=testField&fieldValue=testQuery',
				);
			});
		}
	);

	ffTest.on(
		'empanada_jql_editor_uri_encode_suggestions_params',
		'parameters with special characters',
		() => {
			it('should encode the parameter values', () => {
				expect(getAutocompleteSuggestionsUrl('test&Field', 'test?query')).toBe(
					'/rest/api/latest/jql/autocompletedata/suggestions?fieldName=test%26Field&fieldValue=test%3Fquery',
				);
			});
		},
	);
});
