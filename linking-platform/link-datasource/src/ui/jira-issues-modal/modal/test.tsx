import React from 'react';

import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { InlineCardAdf } from '@atlaskit/linking-common/types';

import SmartLinkClient from '../../../../examples-helpers/smartLinkCustomClient';
import {
  DatasourceTableState,
  useDatasourceTableState,
} from '../../../hooks/useDatasourceTableState';
import { getAvailableJiraSites } from '../../../services/getAvailableJiraSites';
import { IssueLikeDataTableView } from '../../issue-like-table';
import { LINK_TYPE_TEST_ID } from '../../issue-like-table/render-type/link';
import { IssueLikeDataTableViewProps } from '../../issue-like-table/types';
import JiraIssuesConfigModal from '../index'; // Using async one to test lazy integration at the same time
import {
  JiraSearchContainer,
  SearchContainerProps,
} from '../jira-search-container';
import {
  JiraIssueDatasourceParameters,
  JiraIssuesDatasourceAdf,
} from '../types';

jest.mock('../../../services/getAvailableJiraSites', () => ({
  getAvailableJiraSites: jest.fn(),
}));

jest.mock('../jira-search-container', () => ({
  JiraSearchContainer: jest.fn(() => null),
}));

jest.mock('../../../hooks/useDatasourceTableState');

jest.mock('../../issue-like-table', () => ({
  ...jest.requireActual('../../issue-like-table'),
  IssueLikeDataTableView: jest.fn(() => null),
}));

mockSimpleIntersectionObserver(); // for smart link rendering

describe('JiraIssuesConfigModal', () => {
  const getDefaultParameters: () => JiraIssueDatasourceParameters = () => ({
    cloudId: '67899',
    jql: 'some-query',
  });

  const getDefaultHookState: () => DatasourceTableState = () => ({
    reset: jest.fn(),
    status: 'resolved',
    onNextPage: jest.fn(),
    loadDatasourceDetails: jest.fn(),
    hasNextPage: false,
    responseItems: [
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
    columns: [
      { key: 'myColumn', title: 'My Column', type: 'string' },
      { key: 'otherColumn', title: 'My Other Column', type: 'string' },
      { key: 'myId', title: 'ID', type: 'string', isIdentity: true },
    ],
    defaultVisibleColumnKeys: ['myColumn', 'otherColumn'],
    totalCount: 3,
  });

  const getSingleIssueHookState: () => DatasourceTableState = () => ({
    ...getDefaultHookState(),
    responseItems: [
      {
        key: {
          data: { url: 'https://product-fabric.atlassian.net/browse/EDM-5941' },
        },
      },
    ],
  });

  const getEmptyHookState: () => DatasourceTableState = () => ({
    columns: [],
    status: 'empty',
    responseItems: [],
    hasNextPage: true,
    defaultVisibleColumnKeys: [],
    onNextPage: jest.fn(),
    loadDatasourceDetails: jest.fn(),
    reset: jest.fn(),
    totalCount: undefined,
  });

  const getLoadingHookState: () => DatasourceTableState = () => ({
    columns: [],
    status: 'loading',
    responseItems: [],
    hasNextPage: true,
    defaultVisibleColumnKeys: [],
    onNextPage: jest.fn(),
    loadDatasourceDetails: jest.fn(),
    reset: jest.fn(),
  });

  const setup = async (
    args: {
      parameters?: JiraIssueDatasourceParameters;
      hookState?: DatasourceTableState;
      visibleColumnKeys?: string[];
      dontWaitForSitesToLoad?: boolean;
    } = {},
  ) => {
    asMock(getAvailableJiraSites).mockResolvedValue(mockSiteData);
    asMock(useDatasourceTableState).mockReturnValue(
      args.hookState || getDefaultHookState(),
    );

    const onCancel = jest.fn();
    const onInsert = jest.fn();

    let renderFunction = render;

    const renderComponent = () =>
      renderFunction(
        <IntlProvider locale="en">
          <SmartCardProvider client={new SmartLinkClient()}>
            <JiraIssuesConfigModal
              datasourceId={'some-jira-jql-datasource-id'}
              parameters={
                Object.keys(args).includes('parameters')
                  ? args.parameters
                  : getDefaultParameters()
              }
              onCancel={onCancel}
              onInsert={onInsert}
              visibleColumnKeys={
                Object.keys(args).includes('visibleColumnKeys')
                  ? args.visibleColumnKeys
                  : ['myColumn']
              }
            />
          </SmartCardProvider>
        </IntlProvider>,
      );

    const component = renderComponent();
    renderFunction = component.rerender as typeof render;

    const getLatestJiraSearchContainerProps = () => {
      let calls = asMock(JiraSearchContainer).mock.calls;
      return calls[calls.length - 1][0] as SearchContainerProps;
    };

    const getLatestIssueLikeTableProps = () => {
      let calls = asMock(IssueLikeDataTableView).mock.calls;
      return calls[calls.length - 1][0] as IssueLikeDataTableViewProps;
    };

    if (!args.dontWaitForSitesToLoad) {
      await component.findByTestId(
        'jira-jql-datasource-modal--site-selector--trigger',
      );
    }

    const assertInsertResult = (
      args: {
        cloudId?: string;
        jql?: string;
        columnKeys?: string[];
      } = {},
    ) => {
      const button = component.getByRole('button', { name: 'Insert issues' });
      button.click();

      expect(onInsert).toHaveBeenCalledWith({
        type: 'blockCard',
        attrs: {
          datasource: {
            id: 'some-jira-jql-datasource-id',
            parameters: {
              cloudId: args.cloudId || '67899',
              jql: args.jql || 'some-query',
            },
            views: [
              {
                type: 'table',
                properties: {
                  columnKeys: Object.keys(args).includes('columnKeys')
                    ? args.columnKeys
                    : ['myColumn'],
                },
              },
            ],
          },
        },
      } as JiraIssuesDatasourceAdf);
    };

    return {
      ...component,
      renderComponent,
      onCancel,
      onInsert,
      assertInsertResult,
      getLatestJiraSearchContainerProps,
      getLatestIssueLikeTableProps,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
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
    const { findByTestId } = await setup();
    const modalTitle = await findByTestId('jira-jql-datasource-modal--title');

    expect(modalTitle.innerText).toEqual('Insert Jira issues from hello');
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
      const { findByTestId, getAllByRole } = await setup({ hookState });

      const siteSelectorTrigger = await findByTestId(
        'jira-jql-datasource-modal--site-selector--trigger',
      );

      siteSelectorTrigger.click();

      const availableJiraSiteDropdownItems = getAllByRole('menuitem');

      availableJiraSiteDropdownItems[0].click();
      expect(hookState.reset).toHaveBeenCalled();
    });

    it('should produce ADF with new cloudId', async () => {
      const { findByTestId, getAllByRole, assertInsertResult } = await setup();

      const siteSelectorTrigger = await findByTestId(
        'jira-jql-datasource-modal--site-selector--trigger',
      );
      siteSelectorTrigger.click();
      const availableJiraSiteDropdownItems = getAllByRole('menuitem');

      act(() => {
        availableJiraSiteDropdownItems[0].click();
      });

      assertInsertResult({ cloudId: '12345' });
    });
  });

  it('should update title with new site name when cloudId updates', async () => {
    const { findByTestId, rerender } = await setup();
    const modalTitle = await findByTestId('jira-jql-datasource-modal--title');
    expect(modalTitle.innerText).toEqual('Insert Jira issues from hello');

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

    const modalTitle2 = await findByTestId('jira-jql-datasource-modal--title');
    expect(modalTitle2.innerText).toEqual('Insert Jira issues from test1');
  });

  describe('when cloudId is not present', () => {
    it('should produce ADF with first cloudId from the list', async () => {
      const {
        findByText,
        getLatestJiraSearchContainerProps,
        assertInsertResult,
      } = await setup({
        parameters: undefined,
      });
      await findByText('Insert Jira issues from test1');

      // We need to do generate jql, since insert button won't active without it.
      const { onSearch } = getLatestJiraSearchContainerProps();
      act(() => {
        onSearch({
          jql: 'some-query',
        });
      });

      assertInsertResult({ cloudId: '12345' });
    });
  });

  it('should provide parameters to JiraSearchContainer', async () => {
    await setup();
    expect(JiraSearchContainer).toHaveBeenCalledWith(
      {
        parameters: {
          cloudId: '67899',
          jql: 'some-query',
        },
        onSearch: expect.any(Function),
      } as SearchContainerProps,
      expect.anything(),
    );
  });

  it('should display a placeholder smart link if there is no jql', async () => {
    const { getByLabelText, getByText } = await setup({
      parameters: { cloudId: '67899', jql: '' },
    });

    getByLabelText('Count view').click();

    expect(getByText('### Issues')).toBeInTheDocument();
  });

  describe('when onSearch is called from JiraSearchContainer', () => {
    it('should call onInsert with new JQL', async () => {
      const { getLatestJiraSearchContainerProps, assertInsertResult } =
        await setup();
      const { onSearch } = getLatestJiraSearchContainerProps();
      act(() => {
        onSearch({
          jql: 'different-query',
        });
      });

      assertInsertResult({ jql: 'different-query' });
    });

    it('should reset hooks state', async () => {
      const hookState = getDefaultHookState();
      const { getLatestJiraSearchContainerProps } = await setup({
        hookState,
      });
      const { onSearch } = getLatestJiraSearchContainerProps();
      act(() => {
        onSearch({
          jql: 'different-query',
        });
      });

      expect(hookState.reset).toHaveBeenCalled();
    });

    it('should show a smart link in count view', async () => {
      const {
        getLatestJiraSearchContainerProps,
        getByLabelText,
        queryByTestId,
        findByText,
      } = await setup();
      const { onSearch } = getLatestJiraSearchContainerProps();
      act(() => {
        onSearch({
          jql: 'different-query',
        });
      });

      getByLabelText('Count view').click();
      expect(await findByText('55 Issues')).toBeTruthy();

      const card = queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-view`);
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute(
        'href',
        'https://hello.atlassian.net/issues/?jql=different-query',
      );
    });

    it('should not show footer issue count in count view', async () => {
      const {
        getLatestJiraSearchContainerProps,
        getByLabelText,
        queryByTestId,
        findByText,
      } = await setup();
      const { onSearch } = getLatestJiraSearchContainerProps();
      act(() => {
        onSearch({
          jql: 'different-query',
        });
      });

      getByLabelText('Count view').click();
      expect(await findByText('55 Issues')).toBeTruthy();

      expect(
        queryByTestId('jira-jql-datasource-modal-total-issues-count'),
      ).toBeNull();
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
    it('should display EmptyState', async () => {
      const { queryByTestId } = await setup({
        hookState: getEmptyHookState(),
        parameters: undefined,
      });
      expect(
        queryByTestId('jira-jql-datasource-modal--empty-state'),
      ).toBeTruthy();
    });

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
  });

  describe('when only one issue is returned', () => {
    it('should call LinkRenderType with the correct url', async () => {
      const hookState = getSingleIssueHookState();
      const { queryByTestId, getByText } = await setup({
        hookState,
      });

      expect(IssueLikeDataTableView).not.toHaveBeenCalled();

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
      const { onInsert, getByRole } = await setup({
        hookState,
      });

      const button = getByRole('button', { name: 'Insert issues' });
      act(() => {
        button.click();
      });

      expect(onInsert).toHaveBeenCalledWith({
        type: 'inlineCard',
        attrs: {
          url: 'https://product-fabric.atlassian.net/browse/EDM-5941',
        },
      });
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
          onNextPage: hookState.onNextPage,
          onLoadDatasourceDetails: hookState.loadDatasourceDetails,
          onVisibleColumnKeysChange: expect.any(Function),
        } as IssueLikeDataTableViewProps,
        expect.anything(),
      );
    });

    it('should display a count of all issues found', async () => {
      const hookState = getDefaultHookState();
      const { getByTestId } = await setup({
        hookState,
      });
      expect(
        getByTestId('jira-jql-datasource-modal-total-issues-count').textContent,
      ).toEqual('3 issues');
    });

    it('should have enabled Insert button', async () => {
      const { getByRole } = await setup();
      const button = getByRole('button', { name: 'Insert issues' });
      expect(button).not.toBeDisabled();
    });

    it('should call onInsert with datasource ADF upon Insert button press', async () => {
      const { onInsert, getByRole } = await setup();
      const button = getByRole('button', { name: 'Insert issues' });
      button.click();
      expect(onInsert).toHaveBeenCalledWith({
        type: 'blockCard',
        attrs: {
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
                  columnKeys: ['myColumn'],
                },
              },
            ],
          },
        },
      } as JiraIssuesDatasourceAdf);
    });

    it('should call onInsert with inlineCard ADF upon Insert button press in count view mode', async () => {
      const { onInsert, findByLabelText, findByRole } = await setup();
      const countViewToggle = await findByLabelText('Count view');
      countViewToggle.click();

      const insertIssuesButton = await findByRole('button', {
        name: 'Insert issues',
      });
      insertIssuesButton.click();

      expect(onInsert).toHaveBeenCalledWith({
        type: 'inlineCard',
        attrs: {
          url: 'https://hello.atlassian.net/issues/?jql=some-query',
        },
      } as InlineCardAdf);
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

      assertInsertResult({ columnKeys: ['myColumn'] });
    });
  });

  describe('when user changes visible columns from within IssueLikeTable', () => {
    it('should use new columnKeyList in resulting ADF', async () => {
      const { getLatestIssueLikeTableProps, assertInsertResult } =
        await setup();
      const { onVisibleColumnKeysChange: tableOnVisibleColumnKeysChange } =
        getLatestIssueLikeTableProps();
      tableOnVisibleColumnKeysChange!(['someColumn']);

      assertInsertResult({ columnKeys: ['someColumn'] });
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

      assertInsertResult({ columnKeys: ['myColumn', 'otherColumn'] });
    });

    describe("but hook state hasn't loaded default column keys yet", () => {
      it('should NOT use default list coming from backend in resulting ADF', async () => {
        const { assertInsertResult, renderComponent } = await setup({
          visibleColumnKeys: undefined,
          hookState: getEmptyHookState(),
        });

        asMock(useDatasourceTableState).mockReturnValue(getDefaultHookState());

        renderComponent();

        assertInsertResult({ columnKeys: ['myColumn', 'otherColumn'] });
      });
    });
  });

  describe('when no issues are returned', () => {
    it('should show no results screen in issue view mode', async () => {
      const { getByRole, getByText } = await setup({
        hookState: { ...getDefaultHookState(), responseItems: [] },
      });

      expect(getByText('No results found')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert issues' })).toBeDisabled();
    });

    it('should not show no results screen in count view mode', async () => {
      const { getByLabelText, queryByText } = await setup({
        hookState: { ...getDefaultHookState(), responseItems: [] },
      });

      act(() => {
        fireEvent.click(getByLabelText('Count view'));
      });

      expect(queryByText('No results found')).not.toBeInTheDocument();
    });
  });

  describe('when an error occurs on data request', () => {
    it('should show network error message', async () => {
      const { getByRole, getByText } = await setup({
        hookState: { ...getDefaultHookState(), status: 'rejected' },
      });

      expect(getByText('Unable to load results')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert issues' })).toBeDisabled();
    });

    it('should not show network error message in count view mode', async () => {
      const { getByLabelText, queryByText } = await setup({
        hookState: { ...getDefaultHookState(), responseItems: [] },
      });

      act(() => {
        fireEvent.click(getByLabelText('Count view'));
      });

      expect(queryByText('Unable to load results')).not.toBeInTheDocument();
    });
  });
});
