import fetchMock from 'fetch-mock/cjs/client';

import { mockSuggestionData } from '../../../examples-helpers/mockSuggestionData';
import { makeGetJqlSuggestionsData } from '../makeGetJqlSuggestionsData';

describe('makeGetJqlSuggestionsData', () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  it('should return suggestions results', async () => {
    const mock = fetchMock.get({
      url: '/gateway/api/ex/jira/12345//rest/api/latest/jql/autocompletedata/suggestions?fieldName=status&fieldValue=open',
      headers: { 'content-type': 'application/json' },
      response: mockSuggestionData,
    });

    const suggestionsData = await makeGetJqlSuggestionsData('12345')(
      '/rest/api/latest/jql/autocompletedata/suggestions?fieldName=status&fieldValue=open',
    );

    expect(mock.calls()).toHaveLength(1);
    expect(mock.done()).toBe(true);

    expect(suggestionsData).toEqual(mockSuggestionData);
  });

  it('should throw if response is 500', async () => {
    expect.assertions(3);
    const mock = fetchMock.get(
      '/gateway/api/ex/jira/12345//rest/api/latest/jql/autocompletedata/suggestions?fieldName=status&fieldValue=open',
      {
        body: 'failed to receive suggestion data',
        status: 500,
      },
    );

    try {
      await makeGetJqlSuggestionsData('12345')(
        '/rest/api/latest/jql/autocompletedata/suggestions?fieldName=status&fieldValue=open',
      );
    } catch (e) {
      expect(e).toEqual(new Error('failed to receive suggestion data'));
    }
    expect(mock.calls()).toHaveLength(1);
    expect(mock.done()).toBe(true);
  });

  it('should throw if response is 401', async () => {
    expect.assertions(3);
    const mock = fetchMock.get(
      '/gateway/api/ex/jira/12345//rest/api/latest/jql/autocompletedata/suggestions?fieldName=status&fieldValue=open',
      {
        status: 401,
      },
    );

    try {
      await makeGetJqlSuggestionsData('12345')(
        '/rest/api/latest/jql/autocompletedata/suggestions?fieldName=status&fieldValue=open',
      );
    } catch (e) {
      expect(e).toEqual(new Error('Something went wrong'));
    }
    expect(mock.calls()).toHaveLength(1);
    expect(mock.done()).toBe(true);
  });
});
