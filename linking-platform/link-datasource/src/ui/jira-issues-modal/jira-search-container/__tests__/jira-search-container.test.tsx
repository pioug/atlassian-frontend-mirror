import React from 'react';

import { JQLEditor, JQLEditorProps } from '@atlassianlabs/jql-editor';
import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { EVENT_CHANNEL } from '../../../../analytics';
import { JiraIssueDatasourceParameters } from '../../types';
import { JiraSearchContainer, SearchContainerProps } from '../index';

jest.mock('@atlaskit/jql-editor-autocomplete-rest', () => ({
  useAutocompleteProvider: jest
    .fn()
    .mockReturnValue('useAutocompleteProvider-call-result'),
}));

jest.mock('@atlassianlabs/jql-editor', () => ({
  JQLEditor: jest
    .fn()
    .mockReturnValue(<div data-testid={'mocked-jql-editor'}></div>),
}));

let mockRequest = jest.fn();

jest.mock('@atlaskit/linking-common', () => {
  const originalModule = jest.requireActual('@atlaskit/linking-common');
  return {
    ...originalModule,
    request: (...args: any) => mockRequest(...args),
  };
});

const onAnalyticFireEvent = jest.fn();

const initialParameters: JiraIssueDatasourceParameters = {
  cloudId: '12345',
  jql: '',
};

const setup = (propsOverride: Partial<SearchContainerProps> = {}) => {
  const mockOnSearch = jest.fn();
  const mockOnSearchMethodChange = jest.fn();
  const component = render(
    <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
      <IntlProvider locale="en">
        <JiraSearchContainer
          onSearch={mockOnSearch}
          onSearchMethodChange={mockOnSearchMethodChange}
          initialSearchMethod={'jql'}
          parameters={{ ...initialParameters }}
          {...propsOverride}
        />
      </IntlProvider>
    </AnalyticsListener>,
  );

  const getLatestJQLEditorProps = () => {
    let calls = asMock(JQLEditor).mock.calls;
    return calls[calls.length - 1][0] as JQLEditorProps;
  };

  return {
    ...component,
    mockOnSearch,
    mockOnSearchMethodChange,
    getLatestJQLEditorProps,
  };
};

describe('JiraSearchContainer', () => {
  it('renders the JQL input when initially rendered without parameters', async () => {
    const { getByTestId } = setup();

    expect(getByTestId('mode-toggle-jql').querySelector('input')).toBeChecked();
    expect(getByTestId('mocked-jql-editor')).toBeInTheDocument();
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

  it('changes to correct input mode when an option is selected', () => {
    const { getByTestId, getByPlaceholderText } = setup();

    // switch to jql search
    fireEvent.click(getByTestId('mode-toggle-jql'));
    expect(getByTestId('mocked-jql-editor')).toBeInTheDocument();

    // switch to basic search
    fireEvent.click(getByTestId('mode-toggle-basic'));
    expect(
      getByPlaceholderText('Search for issues by keyword'),
    ).toBeInTheDocument();
  });

  it('should call onSearchMethodChange when mode changes', () => {
    const { getByTestId, mockOnSearchMethodChange } = setup();

    // switch to basic search
    fireEvent.click(getByTestId('mode-toggle-basic'));
    expect(mockOnSearchMethodChange).toHaveBeenCalledWith('basic');

    // switch to jql search
    fireEvent.click(getByTestId('mode-toggle-jql'));
    expect(mockOnSearchMethodChange).toHaveBeenCalledWith('jql');
  });

  it('displays an initial jql query', () => {
    const { getByTestId } = setup({
      parameters: {
        ...initialParameters,
        jql: 'status = "0. On Hold"',
      },
    });

    expect(getByTestId('mode-toggle-jql').querySelector('input')).toBeChecked();

    expect(JQLEditor).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'status = "0. On Hold"' }),
      expect.anything(),
    );
  });

  it('displays an initial jql query and does not switch back to jql search mode if user searches using basic text', async () => {
    const { getByTestId, getByPlaceholderText, mockOnSearch } = setup({
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
    // switch to basic, type, and search
    fireEvent.click(getByTestId('mode-toggle-basic'));
    const basicTextInput = getByPlaceholderText('Search for issues by keyword');
    fireEvent.change(basicTextInput, {
      target: { value: 'testing' },
    });
    fireEvent.click(
      getByTestId('jira-jql-datasource-modal--basic-search-button'),
    );
    expect(mockOnSearch).toHaveBeenCalledWith(
      {
        jql: 'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
      },
      'basic',
    );
    expect(
      getByTestId('mode-toggle-basic').querySelector('input'),
    ).toBeChecked();
  });

  it('displays an initial basic query', async () => {
    const { getByTestId } = setup({
      parameters: {
        ...initialParameters,
        jql: '(text ~ "test*" OR summary ~ "test*") order by fakeKey ASC',
      },
      initialSearchMethod: 'basic',
    });

    expect(
      getByTestId('mode-toggle-basic').querySelector('input'),
    ).toBeChecked();
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

    expect(mockOnSearch).toHaveBeenCalledWith(
      {
        jql: 'some-query',
      },
      'jql',
    );
  });

  it('should open in jql search method on a rerender if the component is in the count view mode', () => {
    const { rerender, getByTestId, mockOnSearch, getLatestJQLEditorProps } =
      setup();
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
    expect(mockOnSearch).toHaveBeenCalledWith(
      {
        jql: 'some-query',
      },
      'jql',
    );
    // re-render the component with count view mode
    rerender(
      <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
        <IntlProvider locale="en">
          <JiraSearchContainer
            onSearch={mockOnSearch}
            onSearchMethodChange={jest.fn()}
            initialSearchMethod={'jql'}
            parameters={{ ...initialParameters }}
          />
        </IntlProvider>
      </AnalyticsListener>,
    );
    // make sure JQL is showing as toggle method
    expect(getByTestId('mode-toggle-jql').querySelector('input')).toBeChecked();
  });

  it('calls onSearch with Basic search', () => {
    const { getByTestId, getByPlaceholderText, mockOnSearch } = setup();

    fireEvent.click(getByTestId('mode-toggle-basic'));

    fireEvent.change(getByPlaceholderText('Search for issues by keyword'), {
      target: { value: 'testing' },
    });
    fireEvent.click(
      getByTestId('jira-jql-datasource-modal--basic-search-button'),
    );

    expect(mockOnSearch).toHaveBeenCalledWith(
      {
        jql: 'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
      },
      'basic',
    );
  });

  it('persists basic text search on toggle', () => {
    const { getByTestId, getByPlaceholderText } = setup();

    fireEvent.click(getByTestId('mode-toggle-basic'));

    const basicTextInput = getByPlaceholderText('Search for issues by keyword');
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
        'text ~ "test*" or summary ~ "test*" ORDER BY status ASC',
        {
          represents: '',
          errors: [],
          query: undefined,
        },
      );
    });

    fireEvent.click(getByTestId('mode-toggle-basic'));

    const basicTextInput = getByPlaceholderText('Search for issues by keyword');
    fireEvent.change(basicTextInput, {
      target: { value: 'testing' },
    });

    fireEvent.click(getByTestId('mode-toggle-jql'));

    expect(getLatestJQLEditorProps().query).toEqual(
      'text ~ "testing*" or summary ~ "testing*" ORDER BY status ASC',
    );
  });

  it('uses default order keys if given invalid keys', async () => {
    const { getByTestId, getLatestJQLEditorProps, getByPlaceholderText } =
      setup();

    fireEvent.click(getByTestId('mode-toggle-jql'));

    act(() => {
      getLatestJQLEditorProps().onUpdate!(
        'text ~ "test*" or summary ~ "test*" ORDER BY fakeKey ASC',
        {
          represents: '',
          errors: [],
          query: undefined,
        },
      );
    });

    fireEvent.click(getByTestId('mode-toggle-basic'));

    fireEvent.change(getByPlaceholderText('Search for issues by keyword'), {
      target: { value: 'testing' },
    });

    fireEvent.click(getByTestId('mode-toggle-jql'));

    expect(getLatestJQLEditorProps().query).toEqual(
      'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
    );
  });

  it('has default JQL query when basic search input is empty', async () => {
    const { getLatestJQLEditorProps, getByPlaceholderText, getByTestId } =
      setup();

    // has default query before any user input
    fireEvent.click(getByTestId('mode-toggle-jql'));
    expect(getLatestJQLEditorProps().query).toEqual(
      'created >= -30d order by created DESC',
    );

    // persists default query if user enters empty string to basic search
    fireEvent.click(getByTestId('mode-toggle-basic'));
    const basicTextInput = getByPlaceholderText('Search for issues by keyword');
    fireEvent.change(basicTextInput, {
      target: { value: '  ' },
    });

    fireEvent.click(getByTestId('mode-toggle-jql'));

    expect(getLatestJQLEditorProps().query).toEqual(
      'created >= -30d ORDER BY created DESC',
    );
  });

  describe('should show basic filter container based on FF value', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      () => {
        const { queryByTestId, getByTestId, mockOnSearchMethodChange } = setup({
          parameters: {
            cloudId: 'test-cloud-id',
            filter: 'project',
          },
        });

        // switch to basic search because default is JQL
        // in current implementation JQL doesn't have basic filters
        fireEvent.click(getByTestId('mode-toggle-basic'));
        expect(mockOnSearchMethodChange).toHaveBeenCalledWith('basic');

        expect(
          queryByTestId('jlol-basic-filter-container'),
        ).toBeInTheDocument();

        const triggerButton = queryByTestId(
          `jlol-basic-filter-project-trigger`,
        );

        invariant(triggerButton);
        fireEvent.click(triggerButton);

        const fetchArgs = mockRequest.mock.calls[0][2];

        expect(fetchArgs.variables).toEqual(
          expect.objectContaining({
            after: undefined,
            cloudId: 'test-cloud-id',
            first: 10,
            jql: '',
            jqlTerm: 'project',
            searchString: '',
          }),
        );
      },
      () => {
        const { queryByTestId, getByTestId, mockOnSearchMethodChange } =
          setup();

        // switch to basic search because default is JQL
        // in current implementation JQL doesn't have basic filters
        fireEvent.click(getByTestId('mode-toggle-basic'));
        expect(mockOnSearchMethodChange).toHaveBeenCalledWith('basic');

        expect(
          queryByTestId('jlol-basic-filter-container'),
        ).not.toBeInTheDocument();
      },
    );
  });

  describe('should disable basic mode on search when the query is complex based on FF', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      () => {
        const { getLatestJQLEditorProps, getByTestId } = setup();

        getLatestJQLEditorProps().onUpdate!(
          'text ~ "wrong" or summary ~ "value" ORDER BY status ASC',
          {
            represents: '',
            errors: [],
            query: undefined,
          },
        );

        // triggers search
        getLatestJQLEditorProps().onSearch!('', {
          represents: '',
          errors: [],
          query: undefined,
        });

        expect(
          getByTestId('mode-toggle-basic').querySelector('input'),
        ).toBeDisabled();
      },
      () => {
        const { getLatestJQLEditorProps, getByTestId } = setup();

        getLatestJQLEditorProps().onUpdate!(
          'text ~ "wrong" or summary ~ "value" ORDER BY status ASC',
          {
            represents: '',
            errors: [],
            query: undefined,
          },
        );

        // triggers search
        getLatestJQLEditorProps().onSearch!('', {
          represents: '',
          errors: [],
          query: undefined,
        });

        expect(
          getByTestId('mode-toggle-basic').querySelector('input'),
        ).not.toBeDisabled();
      },
    );
  });

  describe('should disable basic mode when the modal loads if the query is complex based on FF', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      () => {
        const { getByTestId } = setup({
          parameters: {
            ...initialParameters,
            jql: 'text ~ "wrong" or summary ~ "value" ORDER BY status ASC',
          },
        });

        expect(
          getByTestId('mode-toggle-basic').querySelector('input'),
        ).toBeDisabled();
      },
      () => {
        const { getByTestId } = setup({
          parameters: {
            ...initialParameters,
            jql: 'text ~ "wrong" or summary ~ "value" ORDER BY status ASC',
          },
        });

        expect(
          getByTestId('mode-toggle-basic').querySelector('input'),
        ).not.toBeDisabled();
      },
    );
  });
});

describe('Analytics: JiraSearchContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ui.form.submitted.basicSearch', () => {
    it('should fire event on search button click', async () => {
      const { getByPlaceholderText, getByTestId } = setup();

      fireEvent.click(getByTestId('mode-toggle-basic'));
      const basicTextInput = getByPlaceholderText(
        'Search for issues by keyword',
      );
      fireEvent.change(basicTextInput, {
        target: { value: 'testing' },
      });

      fireEvent.click(
        getByTestId('jira-jql-datasource-modal--basic-search-button'),
      );

      expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'submitted',
            actionSubject: 'form',
            actionSubjectId: 'basicSearch',
            attributes: {},
            eventType: 'ui',
          },
        },
        EVENT_CHANNEL,
      );
    });

    it('should fire event on enter key press', async () => {
      const { getByPlaceholderText, getByTestId } = setup();

      fireEvent.click(getByTestId('mode-toggle-basic'));
      const basicTextInput = getByPlaceholderText(
        'Search for issues by keyword',
      );
      await userEvent.type(basicTextInput, 'testing{enter}');

      expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'submitted',
            actionSubject: 'form',
            actionSubjectId: 'basicSearch',
            attributes: {},
            eventType: 'ui',
          },
        },
        EVENT_CHANNEL,
      );
    });
  });

  it('should fire "ui.jqlEditor.searched" when search is initiated via jql input', () => {
    const { getLatestJQLEditorProps, getByTestId } = setup();

    fireEvent.click(getByTestId('mode-toggle-jql'));

    getLatestJQLEditorProps().onSearch!('some-other-query', {
      represents: '',
      errors: [],
      query: undefined,
    });

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          action: 'searched',
          actionSubject: 'jqlEditor',
          attributes: {},
          eventType: 'ui',
        },
      },
      EVENT_CHANNEL,
    );
  });
});
