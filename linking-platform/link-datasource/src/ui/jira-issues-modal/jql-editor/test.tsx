import React from 'react';

import { render } from '@testing-library/react';
import fetchMock from 'fetch-mock/cjs/client';
import { IntlProvider } from 'react-intl-next';

import { JQLEditor, type JQLEditorProps } from '@atlaskit/jql-editor';
import {
  type GetAutocompleteInitialData,
  type GetAutocompleteSuggestions,
  useAutocompleteProvider,
} from '@atlaskit/jql-editor-autocomplete-rest';
import {
  mockAutoCompleteData,
  mockSuggestionData,
} from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { JiraJQLEditor, type JiraJQLEditorProps } from './index';

jest.mock('@atlaskit/jql-editor', () => ({
  JQLEditor: jest
    .fn()
    .mockReturnValue(<div data-testid={'mocked-jira-editor'}></div>),
}));

jest.mock('@atlaskit/jql-editor-autocomplete-rest', () => ({
  useAutocompleteProvider: jest
    .fn()
    .mockReturnValue('useAutocompleteProvider-call-result'),
}));

describe('jql-editor', () => {
  const setup = (propsOverride: Partial<JiraJQLEditorProps> = {}) => {
    const onSearchMock = jest.fn();

    const component = render(
      <IntlProvider locale="en">
        <JiraJQLEditor
          cloudId="67899"
          onSearch={onSearchMock}
          query="some-query"
          {...propsOverride}
        />
      </IntlProvider>,
    );

    return { ...component, onSearchMock };
  };

  beforeEach(() => {
    fetchMock.reset();
  });

  it('should render JQLEditor', () => {
    const { getByTestId } = setup();
    expect(getByTestId('mocked-jira-editor')).toBeInTheDocument();
    const { analyticsSource, query, autocompleteProvider } = asMock(JQLEditor)
      .mock.calls[0][0] as JQLEditorProps;
    expect(analyticsSource).toBe('link-datasource');
    expect(query).toBe('some-query');
    expect(autocompleteProvider).toBe('useAutocompleteProvider-call-result');
  });

  it('should only call onSearch when valid JQL is provided', async () => {
    const { onSearchMock } = setup();

    let calls = asMock(JQLEditor).mock.calls;
    const props = calls[calls.length - 1][0] as JQLEditorProps;

    props.onSearch?.('some-query', {
      represents: '',
      errors: [{ description: 'error', message: 'error', name: 'error' }],
      query: undefined,
    });

    expect(onSearchMock).not.toHaveBeenCalled();

    props.onSearch?.('some-query', {
      represents: '',
      errors: [],
      query: undefined,
    });

    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });

  it('should setup proper AutocompleteProvider', async () => {
    setup();
    expect(useAutocompleteProvider).toHaveBeenCalledWith(
      'link-datasource',
      expect.any(Function),
      expect.any(Function),
    );

    /*
     * Verify second argument to useAutocompleteProvider when called makes a right backend call
     */
    const getAutocompleteInitialData = asMock(useAutocompleteProvider).mock
      .calls[0][1] as GetAutocompleteInitialData;
    fetchMock.post({
      url: '/gateway/api/ex/jira/67899//rest/api/latest/jql/autocompletedata',
      headers: { 'content-type': 'application/json' },
      body: {
        includeCollapsedFields: true,
      },
      response: mockAutoCompleteData,
    });

    /*
     * Verify third argument to useAutocompleteProvider when called makes a right backend call
     */
    const getAutocompleteSuggestions = asMock(useAutocompleteProvider).mock
      .calls[0][2] as GetAutocompleteSuggestions;
    const autocompleteData = await getAutocompleteInitialData(
      '/rest/api/latest/jql/autocompletedata',
    );

    expect(autocompleteData).toEqual({
      jqlFields: mockAutoCompleteData.visibleFieldNames,
      jqlFunctions: mockAutoCompleteData.visibleFunctionNames,
    });

    fetchMock.get({
      url: '/gateway/api/ex/jira/67899//rest/api/latest/jql/autocompletedata/suggestions?fieldName=status&fieldValue=open',
      headers: { 'content-type': 'application/json' },
      response: mockSuggestionData,
    });

    const suggestionsData = await getAutocompleteSuggestions(
      '/rest/api/latest/jql/autocompletedata/suggestions?fieldName=status&fieldValue=open',
    );
    expect(suggestionsData).toEqual(mockSuggestionData);
  });
});
