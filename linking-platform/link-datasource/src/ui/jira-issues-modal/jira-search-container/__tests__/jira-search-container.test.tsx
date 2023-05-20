import React from 'react';

import { JQLEditor, JQLEditorProps } from '@atlassianlabs/jql-editor';
import { act, fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { asMock } from '@atlaskit/link-test-helpers/jest';

import { JiraIssueDatasourceParameters } from '../../types';
import { JiraSearchContainer, SearchContainerProps } from '../index';

jest.mock('@atlassianlabs/jql-editor-autocomplete-rest', () => ({
  useAutocompleteProvider: jest
    .fn()
    .mockReturnValue('useAutocompleteProvider-call-result'),
}));

jest.mock('@atlassianlabs/jql-editor', () => ({
  JQLEditor: jest
    .fn()
    .mockReturnValue(<div data-testid={'mocked-jql-editor'}></div>),
}));

describe('JiraSearchContainer', () => {
  const initialParameters: JiraIssueDatasourceParameters = {
    cloudId: '12345',
    jql: '',
  };

  const setup = (propsOverride: Partial<SearchContainerProps> = {}) => {
    const mockOnSearch = jest.fn();
    const component = render(
      <IntlProvider locale="en">
        <JiraSearchContainer
          onSearch={mockOnSearch}
          parameters={{ ...initialParameters }}
          {...propsOverride}
        />
      </IntlProvider>,
    );

    const getLatestJQLEditorProps = () => {
      let calls = asMock(JQLEditor).mock.calls;
      return calls[calls.length - 1][0] as JQLEditorProps;
    };

    return { ...component, mockOnSearch, getLatestJQLEditorProps };
  };

  it('renders the basic input when initially rendered without parameters', () => {
    const { getByTestId, getByPlaceholderText } = setup();

    expect(getByPlaceholderText('Search')).toBeInTheDocument();
    expect(
      getByTestId('mode-toggle-basic').querySelector('input'),
    ).toBeChecked();
  });

  it('renders the jql input when initially rendered with parameters', () => {
    const { getByTestId, queryByPlaceholderText } = setup({
      parameters: {
        cloudId: 'some-cloud-id',
        jql: 'some-jql',
      },
    });

    expect(queryByPlaceholderText('Search')).not.toBeInTheDocument();
    expect(getByTestId('mode-toggle-jql').querySelector('input')).toBeChecked();
  });

  it('changes to correct input mode when an option is selected', async () => {
    const { getByTestId, getByPlaceholderText } = setup();

    // switch to jql search
    fireEvent.click(getByTestId('mode-toggle-jql'));
    expect(getByTestId('mocked-jql-editor')).toBeInTheDocument();

    // switch to basic search
    fireEvent.click(getByTestId('mode-toggle-basic'));
    expect(getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('displays an initial jql query', async () => {
    const { getByTestId } = setup({
      parameters: {
        ...initialParameters,
        jql: 'status = "0. On Hold"',
      },
    });

    // switch to jql search
    act(() => {
      fireEvent.click(getByTestId('mode-toggle-jql'));
    });

    expect(JQLEditor).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'status = "0. On Hold"' }),
      expect.anything(),
    );
  });

  it('should call onSearch with JQL user input', () => {
    const { getByTestId, mockOnSearch, getLatestJQLEditorProps } = setup();

    // switch to jql search
    act(() => {
      fireEvent.click(getByTestId('mode-toggle-jql'));
    });

    act(() => {
      getLatestJQLEditorProps().onUpdate!('some-query', {
        represents: '',
        errors: [],
        query: undefined,
      });
    });

    getLatestJQLEditorProps().onSearch!('some-other-query', {
      represents: '',
      errors: [],
      query: undefined,
    });

    expect(mockOnSearch).toHaveBeenCalledWith({
      jql: 'some-query',
    });
  });

  it('calls onSearch with JQL', () => {
    const { getByTestId, getByPlaceholderText, mockOnSearch } = setup();

    fireEvent.change(getByPlaceholderText('Search'), {
      target: { value: 'testing' },
    });
    fireEvent.click(
      getByTestId('jira-jql-datasource-modal--basic-search-button'),
    );

    expect(mockOnSearch).toHaveBeenCalledWith({
      jql: '(text ~ "testing*" OR summary ~ "testing*") order by created DESC',
    });
  });

  it('persists basic text search on toggle', () => {
    const { getByTestId, getByPlaceholderText } = setup();

    const basicTextInput = getByPlaceholderText('Search');
    fireEvent.change(basicTextInput, {
      target: { value: 'testing' },
    });

    fireEvent.click(getByTestId('mode-toggle-jql'));
    fireEvent.click(getByTestId('mode-toggle-basic'));

    expect(basicTextInput).toHaveValue('testing');
  });

  it('persists jql order keys on basic text input changes', async () => {
    const { getByTestId, getLatestJQLEditorProps, getByPlaceholderText } =
      setup();

    fireEvent.click(getByTestId('mode-toggle-jql'));

    act(() => {
      getLatestJQLEditorProps().onUpdate!(
        '(text ~ "test*" OR summary ~ "test*") ORDER by status ASC',
        {
          represents: '',
          errors: [],
          query: undefined,
        },
      );
    });

    fireEvent.click(getByTestId('mode-toggle-basic'));

    const basicTextInput = getByPlaceholderText('Search');
    fireEvent.change(basicTextInput, {
      target: { value: 'testing' },
    });

    fireEvent.click(getByTestId('mode-toggle-jql'));

    expect(getLatestJQLEditorProps().query).toEqual(
      '(text ~ "testing*" OR summary ~ "testing*") order by status ASC',
    );
  });

  it('uses default order keys if given invalid keys', async () => {
    const { getByTestId, getLatestJQLEditorProps, getByPlaceholderText } =
      setup();

    fireEvent.click(getByTestId('mode-toggle-jql'));

    act(() => {
      getLatestJQLEditorProps().onUpdate!(
        '(text ~ "test*" OR summary ~ "test*") order by fakeKey ASC',
        {
          represents: '',
          errors: [],
          query: undefined,
        },
      );
    });

    fireEvent.click(getByTestId('mode-toggle-basic'));

    fireEvent.change(getByPlaceholderText('Search'), {
      target: { value: 'testing' },
    });

    fireEvent.click(getByTestId('mode-toggle-jql'));

    expect(getLatestJQLEditorProps().query).toEqual(
      '(text ~ "testing*" OR summary ~ "testing*") order by created DESC',
    );
  });
});
