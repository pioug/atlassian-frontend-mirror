import React from 'react';

import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { JQLEditorProps } from '@atlaskit/jql-editor';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import {
  fieldValuesResponseForStatusesMapped,
  mockSiteData,
} from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { InlineCardAdf } from '@atlaskit/linking-common/types';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { LINK_TYPE_TEST_ID } from '../../../issue-like-table/render-type/link';
import { IssueLikeDataTableViewProps } from '../../../issue-like-table/types';
import { useFilterOptions } from '../../basic-filters/hooks/useFilterOptions';
import { SelectOption } from '../../basic-filters/types';
import JiraIssuesConfigModal from '../../index'; // Using async one to test lazy integration at the same time
import { JiraIssuesDatasourceAdf } from '../../types';

import {
  getAvailableJiraSites,
  getDefaultHookState,
  getDefaultParameters,
  getEmptyHookState,
  getErrorHookState,
  getInsertAnalyticPayload,
  getLoadingHookState,
  getSingleIssueHookState,
  IssueLikeDataTableView,
  JQLEditor,
  setup,
  useDatasourceTableState,
} from './_utils';

mockSimpleIntersectionObserver(); // for smart link rendering

jest.mock('../../basic-filters/hooks/useFilterOptions');
jest.mock('@atlaskit/platform-feature-flags');
jest.useFakeTimers();

describe('JiraIssuesConfigModal', () => {
  const prevWindowLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: new URL('https://hello.atlassian.net'),
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: prevWindowLocation,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when no Jira instances are returned', () => {
    it('should not show insert button, mode switcher, or search bar, and show the no instances content', async () => {
      asMock(getAvailableJiraSites).mockReturnValue([]);
      asMock(useDatasourceTableState).mockReturnValue(getDefaultHookState());
      const { queryByTestId, getByTestId } = render(
        <IntlProvider locale="en">
          <JiraIssuesConfigModal
            datasourceId={'some-jira-jql-datasource-id'}
            onCancel={jest.fn()}
            onInsert={jest.fn()}
          />
        </IntlProvider>,
      );
      const insertButton = queryByTestId(
        'jira-jql-datasource-modal--insert-button',
      );
      const modeSwitcher = queryByTestId('mode-toggle-container');
      const searchBar = queryByTestId('jira-search-container');
      expect(insertButton).not.toBeInTheDocument();
      expect(modeSwitcher).not.toBeInTheDocument();
      expect(searchBar).not.toBeInTheDocument();
      await waitFor(() => {
        getByTestId('no-jira-instances-content');
      });
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const { findByRole, onCancel } = await setup();
    (await findByRole('button', { name: 'Cancel' })).click();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onInsert when "Insert Issues" button is clicked', async () => {
    const { findByRole, onInsert } = await setup();
    (await findByRole('button', { name: 'Insert issues' })).click();
    expect(onInsert).toHaveBeenCalledTimes(1);
  });

  it('should display the preselected jira site in the title', async () => {
    const { getJiraModalTitleText } = await setup();
    const modalTitle = await getJiraModalTitleText();

    expect(modalTitle).toEqual('Insert Jira issues from hello');
  });

  it('should display the expected title for a single jira site', async () => {
    (getAvailableJiraSites as jest.Mock).mockResolvedValueOnce(
      mockSiteData.slice(0, 1),
    );
    const { findByTestId } = await setup({ dontWaitForSitesToLoad: true });
    const modalTitle = await findByTestId('jira-jql-datasource-modal--title');

    expect(modalTitle.innerText).toEqual('Insert Jira issues');
  });

  describe('when selecting a different jira site', () => {
    it('should reset hooks state', async () => {
      const hookState = getDefaultHookState();
      const { selectNewJiraInstanceSite } = await setup({ hookState });
      await selectNewJiraInstanceSite();
      expect(hookState.reset).toHaveBeenCalledWith({
        shouldForceRequest: true,
      });
    });
  });

  it('should update title with new site name when cloudId updates', async () => {
    const { getJiraModalTitleText, rerender } = await setup();
    const modalTitle = await getJiraModalTitleText();
    expect(modalTitle).toEqual('Insert Jira issues from hello');

    rerender(
      <IntlProvider locale="en">
        <JiraIssuesConfigModal
          datasourceId={'some-jira-jql-datasource-id'}
          parameters={{
            cloudId: '12345',
            jql: 'some-query',
          }}
          onCancel={jest.fn()}
          onInsert={jest.fn()}
        />
      </IntlProvider>,
    );

    const modalTitle2 = await getJiraModalTitleText();
    expect(modalTitle2).toEqual('Insert Jira issues from test1');
  });

  describe('when cloudId', () => {
    describe('is not present', () => {
      it('should produce ADF with cloudId for the site which user is browsing from', async () => {
        const {
          getJiraModalTitleText,
          searchWithNewBasic,
          assertInsertResult,
        } = await setup({
          parameters: undefined,
        });
        await getJiraModalTitleText();

        // We need to do generate jql, since insert button won't active without it.
        searchWithNewBasic('some keywords');

        assertInsertResult(
          {
            cloudId: '67899',
            jql: 'text ~ "some keywords*" or summary ~ "some keywords*" ORDER BY created DESC',
            jqlUrl:
              'https://hello.atlassian.net/issues/?jql=text%20~%20%22some%20keywords*%22%20or%20summary%20~%20%22some%20keywords*%22%20ORDER%20BY%20created%20DESC',
          },
          {
            attributes: {
              actions: ['query updated'],
              searchCount: 1,
              searchMethod: 'datasource_basic_filter',
              projectBasicFilterSelectionCount: 0,
              statusBasicFilterSelectionCount: 0,
              typeBasicFilterSelectionCount: 0,
              assigneeBasicFilterSelectionCount: 0,
            },
          },
        );
      });

      it('should default to first cloudId if no URL match is found', async () => {
        const { getJiraModalTitleText, searchWithNewJql, assertInsertResult } =
          await setup({
            parameters: undefined,
            mockSiteDataOverride: mockSiteData.slice(0, 2),
          });
        await getJiraModalTitleText();

        searchWithNewJql('some-query');

        assertInsertResult(
          {
            cloudId: '67899',
            jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
          },
          {
            attributes: {
              actions: ['query updated'],
              searchCount: 1,
              searchMethod: 'datasource_search_query',
            },
          },
        );
      });
    });
  });

  describe('should call insert with correct basic filter selection count attributes when a selection is made', () => {
    asMock(useFilterOptions).mockReturnValue({
      filterOptions: fieldValuesResponseForStatusesMapped as SelectOption[],
      status: 'resolved',
      fetchFilterOptions: jest.fn(),
      reset: jest.fn(),
    });

    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const {
          getJiraModalTitleText,
          getByTestId,
          assertInsertResult,
          queryByTestId,
          findByTestId,
        } = await setup({
          parameters: {
            cloudId: '67899',
            jql: 'status = done',
          },
        });
        await getJiraModalTitleText();

        act(() => {
          fireEvent.click(getByTestId('mode-toggle-basic'));
        });

        // open the status dropdown
        const triggerButton = queryByTestId(`jlol-basic-filter-status-trigger`);
        invariant(triggerButton);
        fireEvent.click(triggerButton);

        const statusSelectMenu = await findByTestId(
          'jlol-basic-filter-popup-select--menu',
        );
        const [firstStatus, secondStatus] = within(
          statusSelectMenu,
        ).queryAllByTestId('jlol-basic-filter-popup-select-option--lozenge');
        fireEvent.click(firstStatus); // select the first status
        fireEvent.click(secondStatus); // select the second status

        jest.advanceTimersByTime(500);

        assertInsertResult(
          {
            cloudId: '67899',
            jql: 'status in (Authorize, "Awaiting approval") ORDER BY created DESC',
            jqlUrl:
              'https://hello.atlassian.net/issues/?jql=status%20in%20(Authorize,%20%22Awaiting%20approval%22)%20ORDER%20BY%20created%20DESC',
          },
          {
            attributes: {
              actions: ['query updated'],
              searchCount: 1,
              searchMethod: 'datasource_basic_filter',
              projectBasicFilterSelectionCount: 0,
              statusBasicFilterSelectionCount: 2,
              typeBasicFilterSelectionCount: 0,
              assigneeBasicFilterSelectionCount: 0,
            },
          },
        );
      },
      async () => {
        const { getJiraModalTitleText, getByTestId, queryByTestId } =
          await setup();
        await getJiraModalTitleText();

        act(() => {
          fireEvent.click(getByTestId('mode-toggle-basic'));
        });

        expect(
          queryByTestId('jlol-basic-filter-container'),
        ).not.toBeInTheDocument();
      },
    );
  });

  it('should provide parameters to JQLEditor', async () => {
    await setup();

    expect(JQLEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'some-query',
        isSearching: false,
        onSearch: expect.any(Function),
        onUpdate: expect.any(Function),
      } as JQLEditorProps),
      expect.anything(),
    );
  });

  it('should display a placeholder smart link if there is no jql', async () => {
    const { getByText } = await setup({
      parameters: { cloudId: '67899', jql: '' },
      viewMode: 'count',
    });

    expect(getByText('### Issues')).toBeInTheDocument();
  });

  describe('when onSearch is called from JiraSearchContainer', () => {
    it('should call onInsert with new JQL', async () => {
      const { assertInsertResult, searchWithNewJql } = await setup();

      searchWithNewJql('different-query');

      assertInsertResult(
        {
          jql: 'different-query',
          jqlUrl: 'https://hello.atlassian.net/issues/?jql=different-query',
        },
        {
          attributes: {
            actions: ['query updated'],
            searchCount: 1,
            searchMethod: 'datasource_search_query',
          },
        },
      );
    });

    it('should reset hooks state', async () => {
      const hookState = getDefaultHookState();
      const { searchWithNewJql } = await setup({
        hookState,
      });

      searchWithNewJql('different-query');

      expect(hookState.reset).toHaveBeenCalledWith({
        shouldForceRequest: true,
      });
    });

    it('should show a smart link in count view', async () => {
      const { searchWithNewJql, queryByTestId, findByText } = await setup({
        viewMode: 'count',
      });

      searchWithNewJql('different-query');
      expect(await findByText('55 Issues')).toBeTruthy();

      const card = queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-view`);
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute(
        'href',
        'https://hello.atlassian.net/issues/?jql=different-query',
      );
    });

    it('should not show footer issue count in count view', async () => {
      const { searchWithNewJql, queryByTestId, findByText } = await setup({
        viewMode: 'count',
      });

      searchWithNewJql('different-query');
      expect(await findByText('55 Issues')).toBeTruthy();

      expect(
        queryByTestId('jira-jql-datasource-modal-total-issues-count'),
      ).toBeNull();
    });

    describe('should call onInsert with new JQL and isQueryComplex=true when the query is complex', () => {
      ffTest(
        'platform.linking-platform.datasource.show-jlol-basic-filters',
        async () => {
          const { assertInsertResult, searchWithNewJql } = await setup();

          searchWithNewJql('resolution=done');

          assertInsertResult(
            {
              jql: 'resolution=done',
              jqlUrl: 'https://hello.atlassian.net/issues/?jql=resolution=done',
            },
            {
              attributes: {
                actions: ['query updated'],
                searchCount: 1,
                searchMethod: 'datasource_search_query',
                isQueryComplex: true,
              },
            },
          );
        },
        async () => {
          const { assertInsertResult, searchWithNewJql } = await setup();

          searchWithNewJql('resolution=done');

          assertInsertResult(
            {
              jql: 'resolution=done',
              jqlUrl: 'https://hello.atlassian.net/issues/?jql=resolution=done',
            },
            {
              attributes: {
                actions: ['query updated'],
                searchCount: 1,
                searchMethod: 'datasource_search_query',
                isQueryComplex: false,
              },
            },
          );
        },
      );
    });

    describe('should call onInsert with new JQL and isQueryComplex=false when the query is not complex', () => {
      ffTest(
        'platform.linking-platform.datasource.show-jlol-basic-filters',
        async () => {
          const { assertInsertResult, searchWithNewJql } = await setup();

          searchWithNewJql('status=done');

          assertInsertResult(
            {
              jql: 'status=done',
              jqlUrl: 'https://hello.atlassian.net/issues/?jql=status=done',
            },
            {
              attributes: {
                actions: ['query updated'],
                searchCount: 1,
                searchMethod: 'datasource_search_query',
                isQueryComplex: false,
              },
            },
          );
        },
        async () => {
          const { assertInsertResult, searchWithNewJql } = await setup();

          searchWithNewJql('status=done');

          assertInsertResult(
            {
              jql: 'status=done',
              jqlUrl: 'https://hello.atlassian.net/issues/?jql=status=done',
            },
            {
              attributes: {
                actions: ['query updated'],
                searchCount: 1,
                searchMethod: 'datasource_search_query',
                isQueryComplex: false,
              },
            },
          );
        },
      );
    });
  });

  describe('when onNextPage is called from IssueLikeDataTableView', () => {
    it('it should call onNextPage from the hook with the correct parameters', async () => {
      const mockOnNextPage = jest.fn();

      const { getLatestIssueLikeTableProps } = await setup({
        hookState: {
          ...getDefaultHookState(),
          hasNextPage: true,
          onNextPage: mockOnNextPage,
        },
      });

      const { onNextPage } = getLatestIssueLikeTableProps();
      onNextPage({
        isSchemaFromData: false,
        shouldForceRequest: true,
      });

      expect(mockOnNextPage).toHaveBeenCalledWith({
        isSchemaFromData: false,
        shouldForceRequest: true,
      });
    });
  });

  it('should use useDatasourceTableState hook', async () => {
    await setup();
    expect(useDatasourceTableState).toHaveBeenCalledWith<
      Parameters<typeof useDatasourceTableState>
    >({
      datasourceId: 'some-jira-jql-datasource-id',
      parameters: getDefaultParameters(),
      fieldKeys: ['myColumn'],
    });
  });

  describe('when there is no parameters yet', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const { queryByRole, getByText, getByTestId, queryByText } =
          await setup({
            hookState: getEmptyHookState(),
            parameters: undefined,
          });

        expect(
          getByTestId('mode-toggle-basic').querySelector('input'),
        ).toBeChecked();
        expect(
          getByText('Search by keyword for issues to insert.'),
        ).toBeInTheDocument();

        expect(queryByText('Beta')).not.toBeInTheDocument();
        expect(
          queryByRole('link', { name: 'Learn how to search with JQL' }),
        ).not.toBeInTheDocument();
      },
      async () => {
        const { queryByTestId, getByRole, getByText, getByTestId } =
          await setup({
            hookState: getEmptyHookState(),
            parameters: undefined,
          });
        expect(
          queryByTestId('jlol-datasource-modal--initial-state-view'),
        ).toBeTruthy();
        expect(
          getByText('Use JQL (Jira Query Language) to search for issues.'),
        ).toBeInTheDocument();
        expect(getByText('Beta')).toBeInTheDocument();
        expect(
          getByRole('link', { name: 'Learn how to search with JQL' }),
        ).toHaveAttribute(
          'href',
          'https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/',
        );
        expect(
          getByTestId('mode-toggle-jql').querySelector('input'),
        ).toBeChecked();
      },
    );

    it('should not display issue count', async () => {
      const { queryByTestId } = await setup({
        hookState: getEmptyHookState(),
        parameters: undefined,
      });

      expect(
        queryByTestId('jira-jql-datasource-modal-total-issues-count'),
      ).toBeNull();
    });

    it('should disable insert button', async () => {
      const { getByRole } = await setup({
        visibleColumnKeys: undefined,
        parameters: { cloudId: '', jql: '' },
        hookState: getEmptyHookState(),
      });
      const button = getByRole('button', { name: 'Insert issues' });
      expect(button).toBeDisabled();
    });

    it('should NOT call onNextPage automatically', async () => {
      const hookState = getEmptyHookState();
      await setup({
        visibleColumnKeys: undefined,
        parameters: { cloudId: '', jql: '' },
        hookState,
      });

      expect(hookState.onNextPage).not.toHaveBeenCalled();
    });
  });

  describe('when status is `loading` and parameters provided', () => {
    it('should disable insert button', async () => {
      const { getByRole } = await setup({
        visibleColumnKeys: undefined,
        parameters: { cloudId: 'abc123', jql: 'cool' },
        hookState: getLoadingHookState(),
      });

      const button = getByRole('button', { name: 'Insert issues' });
      expect(button).toBeDisabled();
    });
  });

  describe('when status is still `empty` but parameters provided', () => {
    it('should NOT call onNextPage automatically', async () => {
      const hookState = getEmptyHookState();
      await setup({
        visibleColumnKeys: undefined,
        parameters: {
          cloudId: 'some-cloud-id',
          jql: 'some-jql',
        },
        hookState,
      });

      expect(hookState.onNextPage).not.toHaveBeenCalled();
    });

    it('should display EmptyState', async () => {
      const { queryByTestId } = await setup({
        hookState: getEmptyHookState(),
        parameters: {
          cloudId: 'some-cloud-id',
          jql: 'some-jql',
        },
      });
      expect(
        queryByTestId('jira-jql-datasource-modal--empty-state'),
      ).toBeTruthy();
    });
  });

  describe('when only one issue is returned', () => {
    it('should call LinkRenderType with the correct url', async () => {
      const hookState = getSingleIssueHookState();
      const { switchMode, queryByTestId, getByText } = await setup({
        hookState,
      });

      expect(IssueLikeDataTableView).toHaveBeenCalled();
      switchMode('count');

      await waitFor(() =>
        getByText(
          'EDM-5941: Implement mapping between data type and visual component',
        ),
      );

      const card = queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-view`);
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute(
        'href',
        'https://product-fabric.atlassian.net/browse/EDM-5941',
      );
    });

    it('should not render a smart-link when the response object does not have a "key" prop', async () => {
      const hookState = getSingleIssueHookState();
      hookState.responseItems = [{}];
      const { queryByTestId } = await setup({
        hookState,
      });

      expect(IssueLikeDataTableView).toHaveBeenCalled();

      const card = queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-views`);
      expect(card).not.toBeInTheDocument();
    });

    it('should not render a smart-link when the response object does not have a url in the "key" prop', async () => {
      const hookState = getSingleIssueHookState();
      hookState.responseItems = [
        {
          key: {
            data: '',
          },
        },
      ];
      const { queryByTestId } = await setup({
        hookState,
      });

      expect(IssueLikeDataTableView).toHaveBeenCalled();

      const card = queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-views`);
      expect(card).not.toBeInTheDocument();
    });

    it('should not render a smart-link when the response object has more than one object', async () => {
      const hookState = getDefaultHookState();
      const { queryByTestId } = await setup({
        hookState,
      });

      expect(IssueLikeDataTableView).toHaveBeenCalled();

      const card = queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-views`);
      expect(card).not.toBeInTheDocument();
    });

    it('should have enabled Insert button', async () => {
      const hookState = getSingleIssueHookState();
      const { getByRole } = await setup({
        hookState,
      });

      const button = getByRole('button', { name: 'Insert issues' });
      expect(button).not.toBeDisabled();
    });

    it('should call onInsert with inline card ADF upon Insert button press', async () => {
      const hookState = getSingleIssueHookState();
      const { getByText, onInsert, getByRole } = await setup({
        hookState,
        viewMode: 'count',
      });

      await waitFor(() =>
        getByText(
          'EDM-5941: Implement mapping between data type and visual component',
        ),
      );
      const button = getByRole('button', { name: 'Insert issues' });
      act(() => {
        button.click();
      });

      expect(onInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'inlineCard',
          attrs: {
            url: 'https://product-fabric.atlassian.net/browse/EDM-5941',
          },
        }),
        expect.objectContaining(
          getInsertAnalyticPayload({
            attributes: {
              display: 'inline',
              totalItemCount: 1,
              actions: ['display view changed'],
            },
          }),
        ),
      );
    });

    it('should call onInsert with datasource ADF when no valid url is available', async () => {
      const hookState = getSingleIssueHookState();
      hookState.responseItems = [
        {
          key: {
            data: '',
          },
        },
      ];
      const { onInsert, getByRole } = await setup({
        hookState,
      });

      const button = getByRole('button', { name: 'Insert issues' });
      button.click();

      expect(onInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'blockCard',
        }),
        expect.objectContaining(
          getInsertAnalyticPayload({
            attributes: {
              display: 'datasource_table',
              totalItemCount: 1,
            },
          }),
        ),
      );
    });

    it('should call onInsert with datasource ADF when response does not have a "key" prop', async () => {
      const hookState = getSingleIssueHookState();
      hookState.responseItems = [{}];
      const { onInsert, getByRole } = await setup({
        hookState,
      });

      const button = getByRole('button', { name: 'Insert issues' });
      button.click();

      expect(onInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'blockCard',
        }),
        expect.objectContaining(
          getInsertAnalyticPayload({
            attributes: {
              display: 'datasource_table',
              totalItemCount: 1,
            },
          }),
        ),
      );
    });
  });

  describe('when there are more then one issue returned', () => {
    it('should provide useDataSourceTableState variables to IssueLikeTable', async () => {
      const hookState = getDefaultHookState();
      await setup({
        hookState,
      });
      expect(IssueLikeDataTableView).toHaveBeenCalledWith(
        {
          status: 'resolved',
          columns: [
            { key: 'myColumn', title: 'My Column', type: 'string' },
            { key: 'otherColumn', title: 'My Other Column', type: 'string' },
            { key: 'myId', title: 'ID', type: 'string', isIdentity: true },
          ],
          testId: 'jira-jql-datasource-table',
          hasNextPage: false,
          items: [
            {
              myColumn: { data: 'some-value' },
              otherColumn: { data: 'other-column-value' },
              myId: { data: 'some-id1' },
            },
            {
              myColumn: { data: 'other-value' },
              otherColumn: { data: 'other-column-other-value' },
              myId: { data: 'some-id2' },
            },
          ],
          visibleColumnKeys: ['myColumn'],
          onNextPage: expect.any(Function),
          onLoadDatasourceDetails: hookState.loadDatasourceDetails,
          onVisibleColumnKeysChange: expect.any(Function),
          parentContainerRenderInstanceId: expect.any(String),
          extensionKey: expect.any(String),
          columnCustomSizes: undefined,
          onColumnResize: expect.any(Function),
        } as IssueLikeDataTableViewProps,
        expect.anything(),
      );
    });

    it('should display a count of all issues found with and link to the JQL link', async () => {
      const hookState = getDefaultHookState();
      const { getByTestId } = await setup({
        hookState,
      });
      expect(
        getByTestId('jira-jql-datasource-modal-total-issues-count').textContent,
      ).toEqual('3 issues');

      const issueCountLink = getByTestId('item-count-url');
      expect(issueCountLink).toHaveAttribute('target', '_blank');
      expect(issueCountLink).toHaveAttribute(
        'href',
        'https://hello.atlassian.net/issues/?jql=some-query',
      );
    });

    it('should have enabled Insert button', async () => {
      const { getByRole } = await setup();
      const button = getByRole('button', { name: 'Insert issues' });
      expect(button).not.toBeDisabled();
    });

    it('should call onInsert with query from search bar even if user did not click search previously', async () => {
      const { onInsert, getByRole, getByTestId, getByPlaceholderText } =
        await setup();
      act(() => {
        fireEvent.click(getByTestId('mode-toggle-basic'));
      });
      const basicTextInput = getByPlaceholderText(
        'Search for issues by keyword',
      );
      fireEvent.change(basicTextInput, {
        target: { value: 'testing' },
      });

      const button = getByRole('button', { name: 'Insert issues' });
      button.click();
      expect(onInsert).toHaveBeenCalledWith(
        {
          type: 'blockCard',
          attrs: {
            url: 'https://hello.atlassian.net/issues/?jql=text%20~%20%22testing*%22%20or%20summary%20~%20%22testing*%22%20ORDER%20BY%20created%20DESC',
            datasource: {
              id: 'some-jira-jql-datasource-id',
              parameters: {
                cloudId: '67899',
                jql: 'text ~ "testing*" or summary ~ "testing*" ORDER BY created DESC',
              },
              views: [
                {
                  type: 'table',
                  properties: {
                    columns: [{ key: 'myColumn' }],
                  },
                },
              ],
            },
          },
        } as JiraIssuesDatasourceAdf,
        expect.objectContaining(getInsertAnalyticPayload({})),
      );
    });

    it('should call onInsert with datasource ADF upon Insert button press', async () => {
      const { onInsert, getByRole } = await setup();
      const button = getByRole('button', { name: 'Insert issues' });
      button.click();
      expect(onInsert).toHaveBeenCalledWith(
        {
          type: 'blockCard',
          attrs: {
            url: 'https://hello.atlassian.net/issues/?jql=some-query',
            datasource: {
              id: 'some-jira-jql-datasource-id',
              parameters: {
                cloudId: '67899',
                jql: 'some-query',
              },
              views: [
                {
                  type: 'table',
                  properties: {
                    columns: [{ key: 'myColumn' }],
                  },
                },
              ],
            },
          },
        } as JiraIssuesDatasourceAdf,
        expect.objectContaining(getInsertAnalyticPayload({})),
      );
    });

    it('should call onInsert with inlineCard ADF upon Insert button press in count view mode', async () => {
      const { onInsert, findByRole } = await setup({ viewMode: 'count' });

      const insertIssuesButton = await findByRole('button', {
        name: 'Insert issues',
      });
      insertIssuesButton.click();

      expect(onInsert).toHaveBeenCalledWith(
        {
          type: 'inlineCard',
          attrs: {
            url: 'https://hello.atlassian.net/issues/?jql=some-query',
          },
        } as InlineCardAdf,
        expect.objectContaining(
          getInsertAnalyticPayload({
            attributes: {
              actions: ['display view changed'],
              display: 'datasource_inline',
            },
          }),
        ),
      );
    });

    it('should render inlineCard ADF with firstIssueUrl upon Insert button press in count view mode', async () => {
      const hookState = getSingleIssueHookState();
      const { onInsert, findByRole } = await setup({
        hookState,
        viewMode: 'count',
      });

      const insertIssuesButton = await findByRole('button', {
        name: 'Insert issues',
      });
      insertIssuesButton.click();

      expect(onInsert).toHaveBeenCalledWith(
        {
          type: 'inlineCard',
          attrs: {
            url: 'https://product-fabric.atlassian.net/browse/EDM-5941',
          },
        } as InlineCardAdf,
        expect.objectContaining(
          getInsertAnalyticPayload({
            attributes: {
              totalItemCount: 1,
              actions: ['display view changed'],
              display: 'inline',
            },
          }),
        ),
      );
    });

    it('should not call onNextPage automatically', async () => {
      const hookState = getDefaultHookState();
      await setup({
        hookState,
      });
      expect(hookState.onNextPage).not.toHaveBeenCalled();
    });
  });

  describe('when consumer provides list of visible column keys', () => {
    it('should NOT use default list coming from backend in resulting ADF', async () => {
      const { assertInsertResult } = await setup({
        visibleColumnKeys: ['myColumn'],
      });

      assertInsertResult(
        {
          properties: { columns: [{ key: 'myColumn' }] },
          jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
        },
        {},
      );
    });
  });

  describe('when user provides list of custom column widths', () => {
    it('should use custom column widths in resulting ADF', async () => {
      const { assertInsertResult } = await setup({
        visibleColumnKeys: ['myColumn'],
        columnCustomSizes: { myColumn: 42 },
      });

      assertInsertResult(
        {
          properties: { columns: [{ key: 'myColumn', width: 42 }] },
          jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
        },
        {},
      );
    });

    it('should render IssueLikeDataTableView with custom column width', async () => {
      await setup({
        visibleColumnKeys: ['myColumn'],
        columnCustomSizes: { myColumn: 42 },
      });

      expect(IssueLikeDataTableView).toHaveBeenCalledWith(
        expect.objectContaining({
          columnCustomSizes: { myColumn: 42 },
        } as Partial<IssueLikeDataTableViewProps>),
        expect.anything(),
      );
    });
  });

  describe('when user provides callback for column resizing', () => {
    it('should use updated custom column widths in resulting ADF', async () => {
      const { getLatestIssueLikeTableProps, assertInsertResult } = await setup({
        visibleColumnKeys: ['myColumn'],
        columnCustomSizes: { myColumn: 42 },
      });

      const { onColumnResize } = getLatestIssueLikeTableProps();

      invariant(onColumnResize);

      act(() => {
        onColumnResize('myColumn', 56);
      });

      assertInsertResult(
        {
          properties: { columns: [{ key: 'myColumn', width: 56 }] },
          jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
        },
        {},
      );
    });

    it('should update and send custom column widths to table component', async () => {
      const { getLatestIssueLikeTableProps } = await setup({
        visibleColumnKeys: ['myColumn', 'otherColumn', 'thirdColumn'],
        columnCustomSizes: { myColumn: 42, otherColumn: 43 },
      });

      const { onColumnResize } = getLatestIssueLikeTableProps();

      invariant(onColumnResize);

      act(() => {
        onColumnResize('myColumn', 56);
      });

      expect(IssueLikeDataTableView).toHaveBeenLastCalledWith(
        expect.objectContaining({
          columnCustomSizes: { myColumn: 56, otherColumn: 43 },
        } as Partial<IssueLikeDataTableViewProps>),
        expect.anything(),
      );
    });
  });

  describe('when user changes visible columns from within IssueLikeTable', () => {
    it('should use new columnKeyList in resulting ADF', async () => {
      const { updateVisibleColumnList, assertInsertResult } = await setup();

      updateVisibleColumnList(['someColumn']);

      assertInsertResult(
        {
          properties: { columns: [{ key: 'someColumn' }] },
          jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
        },
        {
          attributes: {
            actions: ['column reordered'],
          },
        },
      );
    });
  });

  describe('when consumer not providing list of visible column keys', () => {
    it('should use default list coming from backend', async () => {
      const { assertInsertResult } = await setup({
        visibleColumnKeys: undefined,
      });
      expect(IssueLikeDataTableView).toHaveBeenCalledWith(
        expect.objectContaining({
          visibleColumnKeys: ['myColumn', 'otherColumn'],
        }),
        expect.anything(),
      );

      assertInsertResult(
        {
          properties: {
            columns: [{ key: 'myColumn' }, { key: 'otherColumn' }],
          },
          jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
        },
        {
          attributes: {
            displayedColumnCount: 2,
          },
        },
      );
    });

    describe("but hook state hasn't loaded default column keys yet", () => {
      it('should NOT use default list coming from backend in resulting ADF', async () => {
        const { assertInsertResult, renderComponent } = await setup({
          visibleColumnKeys: undefined,
          hookState: getEmptyHookState(),
        });

        asMock(useDatasourceTableState).mockReturnValue(getDefaultHookState());

        renderComponent();

        assertInsertResult(
          {
            properties: {
              columns: [{ key: 'myColumn' }, { key: 'otherColumn' }],
            },
            jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
          },
          {
            attributes: {
              displayedColumnCount: 2,
            },
          },
        );
      });
    });
  });

  describe('when no issues are returned', () => {
    it('should show no results screen in issue view mode', async () => {
      const { getByRole, getByText, onInsert } = await setup({
        hookState: { ...getDefaultHookState(), responseItems: [] },
      });

      expect(getByText('No results found')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert issues' })).not.toBeDisabled();

      fireEvent.click(getByRole('button', { name: 'Insert issues' }));
      expect(onInsert).toHaveBeenCalledTimes(1);
    });

    it('should not show no results screen in count view mode', async () => {
      const { getByRole, queryByText, onInsert } = await setup({
        hookState: { ...getDefaultHookState(), responseItems: [] },
        viewMode: 'count',
      });

      expect(queryByText('No results found')).not.toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert issues' })).not.toBeDisabled();
      fireEvent.click(getByRole('button', { name: 'Insert issues' }));
      expect(onInsert).toHaveBeenCalledTimes(1);
    });
  });

  describe('when an error occurs on data request', () => {
    it('should show network error message', async () => {
      const { getByRole, getByText } = await setup({
        hookState: { ...getErrorHookState() },
      });

      expect(getByText('Unable to load results')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert issues' })).toBeDisabled();
    });

    it('should not show network error message in count view mode', async () => {
      const { queryByText } = await setup({
        hookState: { ...getErrorHookState() },
        viewMode: 'count',
      });

      expect(queryByText('Unable to load results')).not.toBeInTheDocument();
    });

    it('should show no results message on a 403 aka forbidden status', async () => {
      const { getByRole, getByTestId } = await setup({
        hookState: { ...getErrorHookState(), status: 'forbidden' },
      });

      // issue view
      expect(
        getByTestId('jira-jql-datasource-modal--no-results'),
      ).toBeInTheDocument();
      // button is still clickable since users are able to insert on no results found
      expect(getByRole('button', { name: 'Insert issues' })).not.toBeDisabled();
    });

    it('should show unauthorized error message', async () => {
      const { switchMode, getByRole, getByText } = await setup({
        hookState: { ...getErrorHookState(), status: 'unauthorized' },
      });

      // issue view
      expect(
        getByText("You don't have access to the following site:"),
      ).toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert issues' })).toBeDisabled();

      // count view
      switchMode('count');
      expect(
        getByText("You don't have access to the following site:"),
      ).toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert issues' })).toBeDisabled();
    });

    describe('during editing (unauthorized)', () => {
      it('should not select a site if cloudId is not in availableSites', async () => {
        const { getByText, getSiteSelectorText } = await setup({
          hookState: { ...getErrorHookState(), status: 'unauthorized' },
          mockSiteDataOverride: mockSiteData.slice(3),
          url: 'https://hello.atlassian.net',
        });

        expect(getSiteSelectorText()).toEqual('Choose site');
        expect(
          getByText("You don't have access to the following site:"),
        ).toBeInTheDocument();
        expect(getByText('https://hello.atlassian.net')).toBeInTheDocument();
      });

      it('should not select a site if cloudId is not in availableSites and should not show a site in message if URL is not provided', async () => {
        const { getByText, getSiteSelectorText } = await setup({
          hookState: { ...getErrorHookState(), status: 'unauthorized' },
          mockSiteDataOverride: mockSiteData.slice(3),
        });

        expect(getSiteSelectorText()).toEqual('Choose site');
        expect(
          getByText("You don't have access to this content"),
        ).toBeInTheDocument();
      });

      it('should not show a site name if cloudId is not in availableSites and an invalid URL is provided', async () => {
        const { getByText, getSiteSelectorText } = await setup({
          hookState: { ...getErrorHookState(), status: 'unauthorized' },
          mockSiteDataOverride: mockSiteData.slice(3),
          url: '',
        });

        expect(getSiteSelectorText()).toEqual('Choose site');
        expect(
          getByText("You don't have access to this content"),
        ).toBeInTheDocument();
      });
    });
  });

  describe('when opening the modal, it should set the correct mode based on FF', () => {
    ffTest(
      'platform.linking-platform.datasource.show-jlol-basic-filters',
      async () => {
        const { getByTestId } = await setup({
          hookState: getEmptyHookState(),
          parameters: undefined,
        });
        expect(
          getByTestId('mode-toggle-basic').querySelector('input'),
        ).toBeChecked();
      },
      async () => {
        const { getByTestId } = await setup({
          hookState: getEmptyHookState(),
          parameters: undefined,
        });
        expect(
          getByTestId('mode-toggle-jql').querySelector('input'),
        ).toBeChecked();
      },
    );
  });

  describe('when ff is on initialstate should be based on the query', () => {
    it('should default to jql mode if query is complex ', async () => {
      asMock(getBooleanFF).mockReturnValue(true);
      const { getByTestId } = await setup({
        hookState: getEmptyHookState(),
        parameters: {
          cloudId: '131231',
          jql: 'project in (ABC, DEF) and ORDER BY test asc',
        },
      });

      expect(
        getByTestId('mode-toggle-jql').querySelector('input'),
      ).toBeChecked();
    });
    it('should default to jql mode if query contains created field and it is complex', async () => {
      asMock(getBooleanFF).mockReturnValue(true);
      const { getByTestId } = await setup({
        hookState: getEmptyHookState(),
        parameters: {
          cloudId: '131231',
          jql: 'created >= -30d order by created DESC',
        },
      });

      expect(
        getByTestId('mode-toggle-jql').querySelector('input'),
      ).toBeChecked();
    });

    it('should default to basic mode if query is not complex ', async () => {
      asMock(getBooleanFF).mockReturnValue(true);
      const { getByTestId } = await setup({
        hookState: getEmptyHookState(),
        parameters: {
          cloudId: '131231',
          jql: 'order by created DESC',
        },
      });

      expect(
        getByTestId('mode-toggle-basic').querySelector('input'),
      ).toBeChecked();
    });
  });
});
