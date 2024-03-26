import React from 'react';

import {
  act,
  fireEvent,
  render,
  RenderResult,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { JQLEditor, JQLEditorProps } from '@atlaskit/jql-editor';
import {
  fieldValuesResponseForStatusesMapped,
  mockSite,
} from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { EVENT_CHANNEL } from '../../../../analytics';
import { useFilterOptions } from '../../basic-filters/hooks/useFilterOptions';
import {
  HydrateJqlState,
  useHydrateJqlQuery,
} from '../../basic-filters/hooks/useHydrateJqlQuery';
import { BasicFilterFieldType, SelectOption } from '../../basic-filters/types';
import { availableBasicFilterTypes } from '../../basic-filters/ui';
import { JiraIssueDatasourceParameters } from '../../types';
import {
  DEFAULT_JQL_QUERY,
  JiraSearchContainer,
  SearchContainerProps,
} from '../index';

jest.mock('../../basic-filters/hooks/useHydrateJqlQuery');

jest.mock('../../basic-filters/hooks/useFilterOptions');

jest.mock('@atlaskit/jql-editor-autocomplete-rest', () => ({
  useAutocompleteProvider: jest
    .fn()
    .mockReturnValue('useAutocompleteProvider-call-result'),
}));

jest.mock('@atlaskit/jql-editor', () => ({
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
  jql: DEFAULT_JQL_QUERY,
};

const rerenderHelper = (
  rerender: any,
  propsOverride: Partial<
    SearchContainerProps & {
      hydratedOptions: HydrateJqlState['hydratedOptions'];
    }
  > = {},
) => {
  return rerender(
    <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
      <IntlProvider locale="en">
        <JiraSearchContainer
          onSearch={jest.fn()}
          onSearchMethodChange={jest.fn()}
          initialSearchMethod={'jql'}
          parameters={{ ...initialParameters }}
          setSearchBarJql={jest.fn()}
          {...propsOverride}
        />
      </IntlProvider>
    </AnalyticsListener>,
  );
};

const setup = (
  propsOverride: Partial<
    SearchContainerProps & {
      hydratedOptions: HydrateJqlState['hydratedOptions'];
      hydrationStatus: HydrateJqlState['status'];
    }
  > = {},
) => {
  const mockFetchHydratedJqlOptions = jest.fn();
  asMock(useHydrateJqlQuery).mockReturnValue({
    fetchHydratedJqlOptions: mockFetchHydratedJqlOptions,
    hydratedOptions: propsOverride.hydratedOptions || {},
    status: propsOverride.hydrationStatus || 'resolved',
  });

  const mockOnSearch = jest.fn();
  const mockOnSearchMethodChange = jest.fn();
  const mockSetSearchBarJql = jest.fn();

  const component = render(
    <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
      <IntlProvider locale="en">
        <JiraSearchContainer
          onSearch={mockOnSearch}
          onSearchMethodChange={mockOnSearchMethodChange}
          initialSearchMethod={'jql'}
          parameters={{ ...initialParameters }}
          setSearchBarJql={mockSetSearchBarJql}
          site={mockSite}
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
    mockSetSearchBarJql,
    getLatestJQLEditorProps,
    mockFetchHydratedJqlOptions,
  };
};

const setupBasicFilter = ({
  getByTestId,
  queryByTestId,
  openPicker = true,
  filterType = 'status',
}: RenderResult & {
  openPicker?: boolean;
  filterType?: BasicFilterFieldType;
}) => {
  asMock(useFilterOptions).mockReturnValue({
    filterOptions: fieldValuesResponseForStatusesMapped as SelectOption[],
    status: 'resolved',
    fetchFilterOptions: jest.fn(),
    reset: jest.fn(),
  });

  // switch to basic search because default is JQL
  // in current implementation JQL doesn't have basic filters
  fireEvent.click(getByTestId('mode-toggle-basic'));

  const triggerButton = queryByTestId(
    `jlol-basic-filter-${filterType}-trigger`,
  );

  if (openPicker) {
    invariant(triggerButton);
    fireEvent.click(triggerButton);
  }

  return { triggerButton };
};

const commonBasicFilterFeatureFlagFalsyTest = () => {
  const { queryByTestId, getByTestId, mockOnSearchMethodChange } = setup();

  // switch to basic search because default is JQL
  // in current implementation JQL doesn't have basic filters
  fireEvent.click(getByTestId('mode-toggle-basic'));
  expect(mockOnSearchMethodChange).toHaveBeenCalledWith('basic');

  expect(queryByTestId('jlol-basic-filter-container')).not.toBeInTheDocument();
};

describe('JiraSearchContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
      searchBarJql: 'some-jql',
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
      searchBarJql: 'status = "0. On Hold"',
    });

    expect(getByTestId('mode-toggle-jql').querySelector('input')).toBeChecked();

    expect(JQLEditor).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'status = "0. On Hold"' }),
      expect.anything(),
    );
  });

  it('displays an initial jql query and does not switch back to jql search mode if user searches using basic text', async () => {
    const {
      getByTestId,
      getByPlaceholderText,
      mockOnSearch,
      mockSetSearchBarJql,
      rerender,
    } = setup({
      parameters: {
        ...initialParameters,
        jql: 'status = "0. On Hold"',
      },
      searchBarJql: 'status = "0. On Hold"',
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

    expect(mockSetSearchBarJql).toHaveBeenCalledWith(
      'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
    );

    // re-render the component with new search bar jql since the state is stored and updated in the parent
    rerenderHelper(rerender, {
      onSearch: mockOnSearch,
      initialSearchMethod: 'basic',
      searchBarJql:
        'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
    });

    fireEvent.click(getByTestId('jira-datasource-modal--basic-search-button'));
    expect(mockOnSearch).toHaveBeenCalledWith(
      {
        jql: 'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
      },
      {
        searchMethod: 'basic',
        basicFilterSelections: {},
        isQueryComplex: false,
      },
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
      searchBarJql:
        '(text ~ "test*" OR summary ~ "test*") order by fakeKey ASC',
    });

    expect(
      getByTestId('mode-toggle-basic').querySelector('input'),
    ).toBeChecked();
  });

  it('should call onSearch with JQL user input', async () => {
    const {
      getByTestId,
      mockOnSearch,
      getLatestJQLEditorProps,
      mockSetSearchBarJql,
      rerender,
    } = setup();

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

    expect(mockSetSearchBarJql).toHaveBeenCalledWith('some-query');

    // re-render the component with new search bar jql since the state is stored and updated in the parent
    rerenderHelper(rerender, {
      onSearch: mockOnSearch,
      searchBarJql: 'some-query',
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
      {
        searchMethod: 'jql',
        basicFilterSelections: {},
        isQueryComplex: false,
      },
    );
  });

  describe('should call onSearch with JQL user input with correct isQueryComplex value if the query is complex', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      () => {
        const {
          getByTestId,
          mockOnSearch,
          getLatestJQLEditorProps,
          mockSetSearchBarJql,
          rerender,
        } = setup();

        // switch to jql search
        act(() => {
          fireEvent.click(getByTestId('mode-toggle-jql'));
        });

        act(() => {
          getLatestJQLEditorProps().onUpdate!('resoulution=none', {
            represents: '',
            errors: [],
            query: undefined,
          });
        });

        expect(mockSetSearchBarJql).toHaveBeenCalledWith('resoulution=none');

        // re-render the component with new search bar jql since the state is stored and updated in the parent
        rerenderHelper(rerender, {
          onSearch: mockOnSearch,
          searchBarJql: 'resoulution=none',
        });

        getLatestJQLEditorProps().onSearch!('resoulution=none', {
          represents: '',
          errors: [],
          query: undefined,
        });

        expect(mockOnSearch).toHaveBeenCalledWith(
          {
            jql: 'resoulution=none',
          },
          {
            searchMethod: 'jql',
            basicFilterSelections: {},
            isQueryComplex: true,
          },
        );
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });

  it('should open in jql search method on a rerender if the component is in the count view mode', () => {
    const {
      rerender,
      getByTestId,
      mockOnSearch,
      getLatestJQLEditorProps,
      mockSetSearchBarJql,
    } = setup();
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

    expect(mockSetSearchBarJql).toHaveBeenCalledWith('some-query');

    // re-render the component with new search bar jql since the state is stored and updated in the parent
    rerenderHelper(rerender, {
      onSearch: mockOnSearch,
      searchBarJql: 'some-query',
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
      {
        searchMethod: 'jql',
        basicFilterSelections: {},
        isQueryComplex: false,
      },
    );
    // re-render the component with count view mode
    rerender(
      <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
        <IntlProvider locale="en">
          <JiraSearchContainer
            onSearch={mockOnSearch}
            onSearchMethodChange={jest.fn()}
            initialSearchMethod={'jql'}
            setSearchBarJql={jest.fn()}
            searchBarJql={'some-query'}
            parameters={{ ...initialParameters }}
          />
        </IntlProvider>
      </AnalyticsListener>,
    );
    // make sure JQL is showing as toggle method
    expect(getByTestId('mode-toggle-jql').querySelector('input')).toBeChecked();
  });

  it('calls onSearch with Basic search', () => {
    const {
      getByTestId,
      getByPlaceholderText,
      mockOnSearch,
      mockSetSearchBarJql,
      rerender,
    } = setup();

    fireEvent.click(getByTestId('mode-toggle-basic'));

    fireEvent.change(getByPlaceholderText('Search for issues by keyword'), {
      target: { value: 'testing' },
    });

    expect(mockSetSearchBarJql).toHaveBeenCalledWith(
      'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
    );

    // re-render the component with new search bar jql since the state is stored and updated in the parent
    rerenderHelper(rerender, {
      onSearch: mockOnSearch,
      searchBarJql:
        'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
    });

    fireEvent.click(getByTestId('jira-datasource-modal--basic-search-button'));

    expect(mockOnSearch).toHaveBeenCalledWith(
      {
        jql: 'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
      },
      {
        searchMethod: 'basic',
        basicFilterSelections: {},
        isQueryComplex: false,
      },
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
    const {
      getByTestId,
      getLatestJQLEditorProps,
      getByPlaceholderText,
      mockSetSearchBarJql,
      rerender,
    } = setup();

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

    expect(mockSetSearchBarJql).toHaveBeenCalledWith(
      'text ~ "test*" or summary ~ "test*" ORDER BY status ASC',
    );

    fireEvent.click(getByTestId('mode-toggle-basic'));

    const basicTextInput = getByPlaceholderText('Search for issues by keyword');
    fireEvent.change(basicTextInput, {
      target: { value: 'testing' },
    });

    fireEvent.click(getByTestId('mode-toggle-jql'));

    // re-render the component with new search bar jql since the state is stored and updated in the parent
    rerenderHelper(rerender, {
      searchBarJql:
        'text ~ "testing*" or summary ~ "testing*" ORDER BY status ASC',
    });

    expect(getLatestJQLEditorProps().query).toEqual(
      'text ~ "testing*" or summary ~ "testing*" ORDER BY status ASC',
    );
  });

  it('uses default order keys if given invalid keys', async () => {
    const {
      getByTestId,
      getLatestJQLEditorProps,
      getByPlaceholderText,
      rerender,
      mockSetSearchBarJql,
    } = setup();

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

    expect(mockSetSearchBarJql).toHaveBeenCalledWith(
      'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
    );

    // re-render the component with new search bar jql since the state is stored and updated in the parent
    rerenderHelper(rerender, {
      initialSearchMethod: 'basic',
      searchBarJql:
        'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
    });

    fireEvent.click(getByTestId('mode-toggle-jql'));

    expect(getLatestJQLEditorProps().query).toEqual(
      'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
    );
  });

  it('has default JQL query when basic search input is empty', async () => {
    const {
      getLatestJQLEditorProps,
      getByPlaceholderText,
      getByTestId,
      rerender,
      mockSetSearchBarJql,
    } = setup();

    // has default query before any user input
    fireEvent.click(getByTestId('mode-toggle-jql'));
    expect(getLatestJQLEditorProps().query).toEqual('ORDER BY created DESC');

    // persists default query if user enters empty string to basic search
    fireEvent.click(getByTestId('mode-toggle-basic'));
    const basicTextInput = getByPlaceholderText('Search for issues by keyword');
    fireEvent.change(basicTextInput, {
      target: { value: '  ' },
    });

    // should be called with the default query if empty
    expect(mockSetSearchBarJql).toBeCalledWith('ORDER BY created DESC');

    // re-render the component with new search bar jql since the state is stored and updated in the parent
    rerenderHelper(rerender, {
      searchBarJql: 'ORDER BY created DESC',
    });

    fireEvent.click(getByTestId('mode-toggle-jql'));

    expect(getLatestJQLEditorProps().query).toEqual('ORDER BY created DESC');
  });

  describe('BasicFilterContainer: should show basic filter container based on FF value', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      () => {
        const renderResult = setup({
          parameters: {
            cloudId: 'test-cloud-id',
            filter: 'project',
          },
        });

        const { queryByTestId, mockOnSearchMethodChange } = renderResult;

        setupBasicFilter({
          ...renderResult,
          filterType: 'project',
          openPicker: false,
        });

        expect(mockOnSearchMethodChange).toHaveBeenCalledWith('basic');

        expect(
          queryByTestId('jlol-basic-filter-container'),
        ).toBeInTheDocument();

        expect(
          queryByTestId('jlol-basic-filter-project-trigger'),
        ).toBeInTheDocument();
        expect(
          queryByTestId('jlol-basic-filter-status-trigger'),
        ).toBeInTheDocument();
        expect(
          queryByTestId('jlol-basic-filter-assignee-trigger'),
        ).toBeInTheDocument();
        expect(
          queryByTestId('jlol-basic-filter-type-trigger'),
        ).toBeInTheDocument();
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });

  describe('BasicFilterContainer: should disable basic mode on search when the query is complex based on FF', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      () => {
        const {
          getLatestJQLEditorProps,
          getByTestId,
          rerender,
          mockSetSearchBarJql,
        } = setup();

        getLatestJQLEditorProps().onUpdate!(
          'text ~ "wrong" or summary ~ "value" ORDER BY status ASC',
          {
            represents: '',
            errors: [],
            query: undefined,
          },
        );

        expect(mockSetSearchBarJql).toHaveBeenCalledWith(
          'text ~ "wrong" or summary ~ "value" ORDER BY status ASC',
        );

        // re-render the component with new search bar jql since the state is stored and updated in the parent
        rerenderHelper(rerender, {
          searchBarJql:
            'text ~ "wrong" or summary ~ "value" ORDER BY status ASC',
        });

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

  describe('BasicFilterContainer: should disable basic mode when the modal loads if the query is complex based on FF', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      () => {
        const { getByTestId } = setup({
          parameters: {
            ...initialParameters,
            jql: 'text ~ "wrong" or summary ~ "value" ORDER BY status ASC',
          },
          searchBarJql:
            'text ~ "wrong" or summary ~ "value" ORDER BY status ASC',
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
          searchBarJql:
            'text ~ "wrong" or summary ~ "value" ORDER BY status ASC',
        });

        expect(
          getByTestId('mode-toggle-basic').querySelector('input'),
        ).not.toBeDisabled();
      },
    );
  });

  describe('BasicFilterContainer: should render options with those selected ordered first on menu reopen', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const renderResult = setup({
          parameters: {
            cloudId: 'test-cloud-id',
            filter: 'status',
          },
        });
        const { findByTestId } = renderResult;

        const { triggerButton } = setupBasicFilter(renderResult);

        const selectMenu = await findByTestId(
          'jlol-basic-filter-popup-select--menu',
        );

        const initialLozengeOptions = within(selectMenu).queryAllByTestId(
          'jlol-basic-filter-popup-select-option--lozenge',
        );
        const secondOption = initialLozengeOptions[1];

        // Select second option ('Awaiting approval' lozenge)
        fireEvent.click(secondOption);

        // Close menu
        fireEvent.click(triggerButton!);

        // Check that the ordering has NOT yet have changed
        const expectedTextContentsOnClose = [
          'Authorize',
          'Awaiting approval',
          'Awaiting implementation',
          'Canceled',
          'Closed',
        ];

        expectedTextContentsOnClose.forEach((expectedTextContent, index) => {
          expect(initialLozengeOptions[index]).toHaveTextContent(
            expectedTextContent,
          );
        });

        // Reopen menu
        fireEvent.click(triggerButton!);

        const selectMenu2 = await findByTestId(
          'jlol-basic-filter-popup-select--menu',
        );
        const updatedLozengeOptions = within(selectMenu2).queryAllByTestId(
          'jlol-basic-filter-popup-select-option--lozenge',
        );

        // Check that the ordering has been updated on reopen
        const expectedTextContentsOnReopen = [
          'Awaiting approval',
          'Authorize',
          'Awaiting implementation',
          'Canceled',
          'Closed',
        ];

        expectedTextContentsOnReopen.forEach((expectedTextContent, index) => {
          expect(updatedLozengeOptions[index]).toHaveTextContent(
            expectedTextContent,
          );
        });
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });

  describe('BasicFilterContainer: should apply selection for each filter correctly', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const renderResult = setup({
          parameters: {
            cloudId: 'test-cloud-id',
            filter: 'status',
          },
        });
        const { findByTestId, queryByTestId } = renderResult;

        setupBasicFilter(renderResult);

        const statusSelectMenu = await findByTestId(
          'jlol-basic-filter-popup-select--menu',
        );

        const [firstStatus] = within(statusSelectMenu).queryAllByTestId(
          'jlol-basic-filter-popup-select-option--lozenge',
        );
        fireEvent.click(firstStatus);

        // Close menu
        const statusTriggerButton = await findByTestId(
          `jlol-basic-filter-status-trigger`,
        );
        fireEvent.click(statusTriggerButton);

        expect(queryByTestId('jlol-basic-filter-container')).toHaveTextContent(
          'ProjectTypeStatus: AuthorizeAssignee',
        );

        const projectTriggerButton = await findByTestId(
          `jlol-basic-filter-project-trigger`,
        );
        fireEvent.click(projectTriggerButton);

        const projectSelectMenu = await findByTestId(
          'jlol-basic-filter-popup-select--menu',
        );

        const [firstProject] = within(projectSelectMenu).queryAllByTestId(
          'jlol-basic-filter-popup-select-option--lozenge',
        );
        fireEvent.click(firstProject);
        // Close menu
        fireEvent.click(projectTriggerButton);

        expect(queryByTestId('jlol-basic-filter-container')).toHaveTextContent(
          'Project: AuthorizeTypeStatus: AuthorizeAssignee',
        );
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });

  describe('BasicFilterContainer: should reset filter labels when the cloudId changes', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const renderResult = setup({
          parameters: {
            cloudId: 'test-cloud-id',
            filter: 'status',
          },
        });
        const { findByTestId, queryByTestId, mockOnSearch, rerender } =
          renderResult;

        setupBasicFilter(renderResult);

        const statusSelectMenu = await findByTestId(
          'jlol-basic-filter-popup-select--menu',
        );

        const [firstStatus] = within(statusSelectMenu).queryAllByTestId(
          'jlol-basic-filter-popup-select-option--lozenge',
        );
        fireEvent.click(firstStatus);

        // Close menu
        const statusTriggerButton = await findByTestId(
          `jlol-basic-filter-status-trigger`,
        );
        fireEvent.click(statusTriggerButton);

        expect(queryByTestId('jlol-basic-filter-container')).toHaveTextContent(
          'ProjectTypeStatus: AuthorizeAssignee',
        );

        rerender(
          <AnalyticsListener
            channel={EVENT_CHANNEL}
            onEvent={onAnalyticFireEvent}
          >
            <IntlProvider locale="en">
              <JiraSearchContainer
                onSearch={mockOnSearch}
                onSearchMethodChange={jest.fn()}
                initialSearchMethod={'jql'}
                setSearchBarJql={jest.fn()}
                searchBarJql={'another-jql'}
                parameters={{ ...initialParameters, jql: 'another-jql' }}
              />
            </IntlProvider>
          </AnalyticsListener>,
        );

        expect(queryByTestId('jlol-basic-filter-container')).toHaveTextContent(
          'ProjectTypeStatus',
        );
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });

  describe('BasicFilterContainer: should reset search term when the cloudId changes', () => {
    it('should reset jql when the cloudId changes', () => {
      const previousJql =
        '(text ~ "testing*" or summary ~ "testing*") and status in (Authorize) ORDER BY created DESC';

      const renderResult = setup({
        searchBarJql: previousJql,
        parameters: { cloudId: 'some-cloud-id', jql: previousJql },
      });

      const { mockOnSearch, getByTestId, rerender, getLatestJQLEditorProps } =
        renderResult;

      expect(getLatestJQLEditorProps().query).toEqual(previousJql);

      rerender(
        <AnalyticsListener
          channel={EVENT_CHANNEL}
          onEvent={onAnalyticFireEvent}
        >
          <IntlProvider locale="en">
            <JiraSearchContainer
              onSearch={mockOnSearch}
              onSearchMethodChange={jest.fn()}
              initialSearchMethod={'jql'}
              setSearchBarJql={jest.fn()}
              parameters={{
                ...initialParameters,
                cloudId: 'another-cloudId',
              }}
            />
          </IntlProvider>
        </AnalyticsListener>,
      );

      fireEvent.click(getByTestId('mode-toggle-jql'));

      expect(getLatestJQLEditorProps().query).not.toEqual(previousJql);
      expect(getLatestJQLEditorProps().query).toEqual(DEFAULT_JQL_QUERY);
    });

    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const renderResult = setup({
          parameters: {
            cloudId: 'test-cloud-id',
            filter: 'status',
          },
        });
        const { container, mockOnSearch, rerender, queryByTestId } =
          renderResult;

        const { triggerButton } = setupBasicFilter(renderResult);

        const input = container.parentElement?.querySelector(
          '#jlol-basic-filter-popup-select--input',
        );
        invariant(input);

        fireEvent.change(input, { target: { value: 'hello' } });

        expect(
          container.parentElement?.querySelector('[data-value="hello"]'),
        ).not.toBeNull();

        // Close menu
        fireEvent.click(triggerButton!);

        rerender(
          <AnalyticsListener
            channel={EVENT_CHANNEL}
            onEvent={onAnalyticFireEvent}
          >
            <IntlProvider locale="en">
              <JiraSearchContainer
                onSearch={mockOnSearch}
                onSearchMethodChange={jest.fn()}
                initialSearchMethod={'jql'}
                setSearchBarJql={jest.fn()}
                searchBarJql={'another-jql'}
                parameters={{ ...initialParameters, jql: 'another-jql' }}
              />
            </IntlProvider>
          </AnalyticsListener>,
        );

        // Open menu
        const newInstaceOfTriggerButton = queryByTestId(
          `jlol-basic-filter-status-trigger`,
        );

        invariant(newInstaceOfTriggerButton);
        fireEvent.click(newInstaceOfTriggerButton);

        expect(
          container.parentElement?.querySelector('[data-value="hello"]'),
        ).toBeNull();
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });

  describe('BasicFilterContainer: should call fetchHydratedJqlOptions on search if query is not complex', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const renderResult = setup({
          parameters: {
            cloudId: 'test-cloud-id',
            filter: 'status',
          },
        });
        const {
          getByTestId,
          getLatestJQLEditorProps,
          mockFetchHydratedJqlOptions,
        } = renderResult;

        // switch to jql search
        act(() => {
          fireEvent.click(getByTestId('mode-toggle-jql'));
        });

        act(() => {
          getLatestJQLEditorProps().onSearch!('some-query', {
            represents: '',
            errors: [],
            query: undefined,
          });
        });

        expect(mockFetchHydratedJqlOptions).toHaveBeenCalledTimes(1);
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });

  describe('BasicFilterContainer: should not call fetchHydratedJqlOptions on search if query mode is basic', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const renderResult = setup({
          parameters: {
            cloudId: 'test-cloud-id',
            filter: 'status',
          },
        });
        const {
          getByTestId,
          getByPlaceholderText,
          mockFetchHydratedJqlOptions,
        } = renderResult;

        setupBasicFilter({
          ...renderResult,
          filterType: 'project',
          openPicker: false,
        });

        fireEvent.click(getByTestId('mode-toggle-basic'));
        const basicTextInput = getByPlaceholderText(
          'Search for issues by keyword',
        );
        fireEvent.change(basicTextInput, {
          target: { value: 'testing' },
        });

        fireEvent.click(
          getByTestId('jira-datasource-modal--basic-search-button'),
        );

        expect(mockFetchHydratedJqlOptions).toHaveBeenCalledTimes(0);
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });

  describe('BasicFilterContainer: should call fetchHydratedJqlOptions on initial dialog render if query is not complex and is not the default JQL query', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const renderResult = setup({
          parameters: {
            cloudId: 'test-cloud-id',
            jql: 'status=DONE',
          },
          searchBarJql: 'status=DONE',
        });
        const { mockFetchHydratedJqlOptions } = renderResult;

        expect(mockFetchHydratedJqlOptions).toHaveBeenCalledTimes(1);
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });

  describe('BasicFilterContainer: should show the loading state for trigger button when hydrating only if the corresponding field has value', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const renderResult = setup({
          parameters: {
            cloudId: 'test-cloud-id',
            jql: 'status=DONE and project=Test',
          },
          hydrationStatus: 'loading',
          searchBarJql: 'status=DONE and project=Test',
        });

        const { getByTestId } = renderResult;

        setupBasicFilter(renderResult);

        expect(
          getByTestId('jlol-basic-filter-status-trigger--loading-button'),
        ).toBeInTheDocument();
        expect(
          getByTestId('jlol-basic-filter-project-trigger--loading-button'),
        ).toBeInTheDocument();

        expect(
          getByTestId('jlol-basic-filter-assignee-trigger--button'),
        ).toBeInTheDocument();
        expect(
          getByTestId('jlol-basic-filter-type-trigger--button'),
        ).toBeInTheDocument();
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });

  describe('BasicFilterContainer: should not show the loading state for trigger button if jql is empty', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const renderResult = setup({
          parameters: {
            cloudId: 'test-cloud-id',
            jql: '',
          },
        });

        const { queryByTestId } = renderResult;

        setupBasicFilter(renderResult);

        availableBasicFilterTypes.forEach(filter => {
          expect(
            queryByTestId(
              `jlol-basic-filter-${filter}-trigger--loading-button`,
            ),
          ).not.toBeInTheDocument();
          expect(
            queryByTestId(`jlol-basic-filter-${filter}-trigger--button`),
          ).toBeInTheDocument();
        });
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });

  describe('BasicFilterContainer: should not call fetchHydratedJqlOptions on initial dialog render if query is the default JQL query', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const renderResult = setup({
          parameters: {
            cloudId: 'test-cloud-id',
            jql: 'ORDER BY created DESC',
          },
          searchBarJql: 'ORDER BY created DESC',
        });
        const { mockFetchHydratedJqlOptions } = renderResult;

        expect(mockFetchHydratedJqlOptions).toHaveBeenCalledTimes(0);
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });

  describe('BasicFilterContainer: should persist filter values when calling onSearch after an input is entered', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const renderResult = setup();

        const {
          findByTestId,
          getByPlaceholderText,
          mockOnSearch,
          getByTestId,
          rerender,
          mockSetSearchBarJql,
        } = renderResult;

        const { triggerButton } = setupBasicFilter({
          ...renderResult,
        });

        const selectMenu = await findByTestId(
          'jlol-basic-filter-popup-select--menu',
        );

        const [firstOption] = within(selectMenu).queryAllByTestId(
          'jlol-basic-filter-popup-select-option--lozenge',
        );

        fireEvent.click(firstOption);

        // Close menu
        invariant(triggerButton);
        fireEvent.click(triggerButton);

        const basicTextInput = getByPlaceholderText(
          'Search for issues by keyword',
        );
        fireEvent.change(basicTextInput, {
          target: { value: 'testing' },
        });

        expect(mockSetSearchBarJql).toHaveBeenCalledWith(
          '(text ~ "testing*" or summary ~ "testing*") and status in (Authorize) ORDER BY created DESC',
        );

        // re-render the component with new search bar jql since the state is stored and updated in the parent
        rerenderHelper(rerender, {
          onSearch: mockOnSearch,
          initialSearchMethod: 'basic',
          searchBarJql:
            '(text ~ "testing*" or summary ~ "testing*") and status in (Authorize) ORDER BY created DESC',
        });

        fireEvent.click(
          getByTestId('jira-datasource-modal--basic-search-button'),
        );

        expect(mockOnSearch).toHaveBeenCalledWith(
          {
            jql: '(text ~ "testing*" or summary ~ "testing*") and status in (Authorize) ORDER BY created DESC',
          },
          {
            searchMethod: 'basic',
            isQueryComplex: false,
            basicFilterSelections: {
              status: [
                {
                  appearance: 'inprogress',
                  label: 'Authorize',
                  optionType: 'lozengeLabel',
                  value: 'Authorize',
                },
              ],
            },
          },
        );
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });

  describe('BasicFilterContainer: should update jql query in JQL mode when the query changes in basic mode', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const expectedJql =
          '(text ~ "testing*" or summary ~ "testing*") and status in (Authorize) ORDER BY created DESC';
        const renderResult = setup();

        const {
          findByTestId,
          getByPlaceholderText,
          mockOnSearch,
          getByTestId,
          getLatestJQLEditorProps,
          rerender,
          mockSetSearchBarJql,
        } = renderResult;

        const { triggerButton } = setupBasicFilter({
          ...renderResult,
        });

        const selectMenu = await findByTestId(
          'jlol-basic-filter-popup-select--menu',
        );

        const [firstOption] = within(selectMenu).queryAllByTestId(
          'jlol-basic-filter-popup-select-option--lozenge',
        );

        fireEvent.click(firstOption);

        // Close menu
        invariant(triggerButton);
        fireEvent.click(triggerButton);

        const basicTextInput = getByPlaceholderText(
          'Search for issues by keyword',
        );
        fireEvent.change(basicTextInput, {
          target: { value: 'testing' },
        });

        expect(mockSetSearchBarJql).toHaveBeenCalledWith(expectedJql);

        // re-render the component with new search bar jql since the state is stored and updated in the parent
        rerenderHelper(rerender, {
          onSearch: mockOnSearch,
          initialSearchMethod: 'basic',
          searchBarJql: expectedJql,
        });

        fireEvent.click(
          getByTestId('jira-datasource-modal--basic-search-button'),
        );

        expect(mockOnSearch).toHaveBeenCalledWith(
          {
            jql: expectedJql,
          },
          {
            searchMethod: 'basic',
            isQueryComplex: false,
            basicFilterSelections: {
              status: [
                {
                  appearance: 'inprogress',
                  label: 'Authorize',
                  optionType: 'lozengeLabel',
                  value: 'Authorize',
                },
              ],
            },
          },
        );

        fireEvent.click(getByTestId('mode-toggle-jql'));

        expect(getLatestJQLEditorProps().query).toEqual(expectedJql);
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });
  describe('BasicFilterContainer: should pre-populate basic mode search text hydrate returns input text', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const renderResult = setup({
          hydratedOptions: {
            basicInputTextValue: 'hello',
          },
        });

        const { queryByTestId } = renderResult;
        setupBasicFilter({ ...renderResult, openPicker: false });

        expect(
          queryByTestId('jira-datasource-modal--basic-search-input'),
        ).toHaveValue('hello');
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
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
        getByTestId('jira-datasource-modal--basic-search-button'),
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

  it('should fire "ui.jqlEditor.searched" with correct attributes when search is initiated via jql input and query is not complex', () => {
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
          attributes: {
            isQueryComplex: false,
          },
          eventType: 'ui',
        },
      },
      EVENT_CHANNEL,
    );
  });

  describe('should fire "ui.jqlEditor.searched" with correct attributes when search is initiated via jql input and query is complex', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      () => {
        const {
          getLatestJQLEditorProps,
          getByTestId,
          rerender,
          mockSetSearchBarJql,
        } = setup();

        fireEvent.click(getByTestId('mode-toggle-jql'));

        act(() => {
          getLatestJQLEditorProps().onUpdate!('resoulution=none', {
            represents: '',
            errors: [],
            query: undefined,
          });
        });

        expect(mockSetSearchBarJql).toBeCalledWith('resoulution=none');

        // re-render the component with new search bar jql since the state is stored and updated in the parent
        rerenderHelper(rerender, { searchBarJql: 'resoulution=none' });

        getLatestJQLEditorProps().onSearch!('resoulution=done', {
          represents: '',
          errors: [],
          query: undefined,
        });

        expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
          {
            payload: {
              action: 'searched',
              actionSubject: 'jqlEditor',
              attributes: {
                isQueryComplex: true,
              },
              eventType: 'ui',
            },
          },
          EVENT_CHANNEL,
        );
      },
      () => commonBasicFilterFeatureFlagFalsyTest(),
    );
  });
});
