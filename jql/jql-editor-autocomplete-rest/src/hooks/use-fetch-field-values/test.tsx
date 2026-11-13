import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import {
	EXPANDED_AUTOCOMPLETE_MAX_RESULTS,
	getAutocompleteSuggestionsUrl,
} from './getAutocompleteSuggestionsUrl';

describe('getAutocompleteSuggestionsUrl', () => {
	describe('when filter_refinement_butter_thanksgiving_drop is disabled', () => {
		beforeEach(() => {
			mockExpDisabled('filter_refinement_butter_thanksgiving_drop');
		});

		it('should return the correct url without maxResults', () => {
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

	describe('when filter_refinement_butter_thanksgiving_drop is enabled', () => {
		beforeEach(() => {
			mockExpEnabled('filter_refinement_butter_thanksgiving_drop');
		});

		it('should request 25 results', () => {
			expect(EXPANDED_AUTOCOMPLETE_MAX_RESULTS).toBe(25);
			expect(getAutocompleteSuggestionsUrl('testField', 'testQuery')).toBe(
				'/rest/api/latest/jql/autocompletedata/suggestions?fieldName=testField&fieldValue=testQuery&maxResults=25',
			);
		});

		it('should encode the parameter values', () => {
			expect(getAutocompleteSuggestionsUrl('test&Field', 'test?query')).toBe(
				'/rest/api/latest/jql/autocompletedata/suggestions?fieldName=test%26Field&fieldValue=test%3Fquery&maxResults=25',
			);
		});
	});
});
