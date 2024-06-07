import fetchMock from 'fetch-mock/cjs/client';

import { mockAutoCompleteData } from '@atlaskit/link-test-helpers/datasource';

import { makeGetJqlAutocompleteData } from '../makeGetJqlAutocompleteData';

describe('makeGetJqlAutocompleteData', () => {
	beforeEach(() => {
		fetchMock.reset();
	});

	it('should return field names and function names', async () => {
		const mock = fetchMock.post({
			url: '/gateway/api/ex/jira/12345//rest/api/latest/jql/autocompletedata',
			headers: { 'content-type': 'application/json' },
			body: {
				includeCollapsedFields: true,
			},
			response: mockAutoCompleteData,
		});

		const autocompleteData = await makeGetJqlAutocompleteData('12345')(
			'/rest/api/latest/jql/autocompletedata',
		);

		expect(mock.calls()).toHaveLength(1);
		expect(mock.done()).toBe(true);

		expect(autocompleteData).toEqual({
			jqlFields: mockAutoCompleteData.visibleFieldNames,
			jqlFunctions: mockAutoCompleteData.visibleFunctionNames,
		});
	});

	it('should throw if response is 500', async () => {
		expect.assertions(3);
		const mock = fetchMock.post(
			'/gateway/api/ex/jira/12345//rest/api/latest/jql/autocompletedata',
			{
				body: 'failed to receive autocomplete data',
				status: 500,
			},
		);

		try {
			await makeGetJqlAutocompleteData('12345')('/rest/api/latest/jql/autocompletedata');
		} catch (e) {
			expect(e).toEqual(new Error('failed to receive autocomplete data'));
		}
		expect(mock.calls()).toHaveLength(1);
		expect(mock.done()).toBe(true);
	});

	it('should throw if response is 401', async () => {
		expect.assertions(3);
		const mock = fetchMock.post(
			'/gateway/api/ex/jira/12345//rest/api/latest/jql/autocompletedata',
			{
				status: 401,
			},
		);

		try {
			await makeGetJqlAutocompleteData('12345')('/rest/api/latest/jql/autocompletedata');
		} catch (e) {
			expect(e).toEqual(new Error('Something went wrong'));
		}
		expect(mock.calls()).toHaveLength(1);
		expect(mock.done()).toBe(true);
	});
});
