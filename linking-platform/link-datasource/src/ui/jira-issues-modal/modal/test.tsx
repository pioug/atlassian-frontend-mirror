import React, { useEffect } from 'react';

import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { InlineCardAdf } from '@atlaskit/linking-common/types';
import { ConcurrentExperience } from '@atlaskit/ufo';

import SmartLinkClient from '../../../../examples-helpers/smartLinkCustomClient';
import { EVENT_CHANNEL } from '../../../analytics';
import { succeedUfoExperience } from '../../../analytics/ufoExperiences';
import { JiraSearchMethod } from '../../../common/types';
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
  getInitialSearchMethod: jest.fn(() => 'basic'),
  JiraSearchContainer: jest.fn(() => null),
}));

jest.mock('../../../hooks/useDatasourceTableState');

const MockIssueLikeTable = () => {
  useEffect(() => {
    succeedUfoExperience(
      {
        name: 'datasource-rendered',
      },
      '123',
    );
  }, []);
  return null;
};
jest.mock('../../issue-like-table', () => ({
  ...jest.requireActual('../../issue-like-table'),
  IssueLikeDataTableView: jest.fn(() => <MockIssueLikeTable />),
}));

const mockUfoStart = jest.fn();
const mockUfoSuccess = jest.fn();
const mockUfoFailure = jest.fn();
const mockUfoAddMetadata = jest.fn();

jest.mock('@atlaskit/ufo', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('@atlaskit/ufo'),
  ConcurrentExperience: (): Partial<ConcurrentExperience> => ({
    getInstance: jest.fn().mockImplementation(() => ({
      start: mockUfoStart,
      success: mockUfoSuccess,
      failure: mockUfoFailure,
      addMetadata: mockUfoAddMetadata,
    })),
  }),
}));

Object.defineProperty(window, 'location', {
  configurable: true,
  enumerable: true,
  value: new URL('https://hello.atlassian.net'),
});

mockSimpleIntersectionObserver(); // for smart link rendering

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
  destinationObjectTypes: ['issue'],
  extensionKey: 'jira-object-provider',
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
  totalCount: 1,
});

const getUnauthorisedHookState: () => DatasourceTableState = () => ({
  columns: [],
  status: 'empty',
  responseItems: [],
  hasNextPage: true,
  defaultVisibleColumnKeys: [],
  onNextPage: jest.fn(),
  loadDatasourceDetails: jest.fn(),
  reset: jest.fn(),
  totalCount: undefined,
  destinationObjectTypes: [],
  extensionKey: undefined,
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
  destinationObjectTypes: [],
  extensionKey: undefined,
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
  destinationObjectTypes: ['issue'],
  extensionKey: 'jira-object-provider',
});

const getErrorHookState: () => DatasourceTableState = () => ({
  columns: [],
  status: 'rejected',
  responseItems: [],
  hasNextPage: true,
  defaultVisibleColumnKeys: [],
  onNextPage: jest.fn(),
  loadDatasourceDetails: jest.fn(),
  reset: jest.fn(),
  totalCount: undefined,
  destinationObjectTypes: ['issue'],
  extensionKey: 'jira-object-provider',
});

type AnalyticsPayloadOverride = {
  attributes?: object;
};

const getInsertAnalyticPayload = <
  T extends AnalyticsPayloadOverride | undefined,
>(
  override: T,
) => {
  return {
    payload: {
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'insert',
      eventType: 'ui',
      ...override,
      attributes: {
        actions: [],
        destinationObjectTypes: ['issue'],
        display: 'datasource_table',
        displayedColumnCount: 1,
        extensionKey: 'jira-object-provider',
        searchCount: 0,
        searchMethod: null,
        totalItemCount: 3,
        ...override?.attributes,
      },
    },
  };
};

const setup = async (
  args: {
    parameters?: JiraIssueDatasourceParameters;
    hookState?: DatasourceTableState;
    visibleColumnKeys?: string[];
    dontWaitForSitesToLoad?: boolean;
    mockSiteDataOverride?: {
      cloudId: string;
      url: string;
      displayName: string;
    }[];
  } = {},
) => {
  asMock(getAvailableJiraSites).mockResolvedValue(
    args.mockSiteDataOverride || mockSiteData,
  );
  asMock(useDatasourceTableState).mockReturnValue(
    args.hookState || getDefaultHookState(),
  );

  const onCancel = jest.fn();
  const onInsert = jest.fn();
  const onAnalyticFireEvent = jest.fn();

  let renderFunction = render;

  const renderComponent = () =>
    renderFunction(
      <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
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
        </IntlProvider>
      </AnalyticsListener>,
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

  const assertInsertResult = <T extends { attributes?: object } | undefined>(
    args: {
      cloudId?: string;
      jql?: string;
      columnKeys?: string[];
      jqlUrl?: string;
    } = {},
    analyticsExpectedOverride: T,
  ) => {
    const button = component.getByRole('button', { name: 'Insert issues' });
    button.click();
    expect(onInsert).toHaveBeenCalledWith(
      {
        type: 'blockCard',
        attrs: {
          url: args?.jqlUrl,
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
                  columns: Object.keys(args).includes('columnKeys')
                    ? args.columnKeys?.map(key => ({ key }))
                    : [{ key: 'myColumn' }],
                },
              },
            ],
          },
        },
      } as JiraIssuesDatasourceAdf,
      expect.objectContaining(
        getInsertAnalyticPayload(analyticsExpectedOverride),
      ),
    );
  };

  const selectNewJiraInstanceSite = async () => {
    const { findByTestId, getAllByRole } = component;
    const siteSelectorTrigger = await findByTestId(
      'jira-jql-datasource-modal--site-selector--trigger',
    );
    siteSelectorTrigger.click();
    const availableJiraSiteDropdownItems = getAllByRole('menuitem');

    act(() => {
      availableJiraSiteDropdownItems[0].click();
    });
  };

  const searchWithNewJql = (
    jql = 'different-query',
    searchMethod: JiraSearchMethod = 'basic',
  ) => {
    const { onSearch } = getLatestJiraSearchContainerProps();
    act(() => {
      onSearch(
        {
          jql,
        },
        searchMethod,
      );
    });
  };

  const assertAnalyticsAfterButtonClick = async (
    buttonName: string,
    payload: any,
  ) => {
    const { findByRole } = component;
    (await findByRole('button', { name: buttonName })).click();

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      payload,
      EVENT_CHANNEL,
    );
  };

  const updateVisibleColumnList = (newVisibleColumns: string[]) => {
    const { onVisibleColumnKeysChange: tableOnVisibleColumnKeysChange } =
      getLatestIssueLikeTableProps();

    if (!tableOnVisibleColumnKeysChange) {
      return expect(tableOnVisibleColumnKeysChange).toBeDefined();
    }

    tableOnVisibleColumnKeysChange(newVisibleColumns);
  };

  return {
    ...component,
    renderComponent,
    onCancel,
    onInsert,
    onAnalyticFireEvent,
    assertInsertResult,
    getLatestJiraSearchContainerProps,
    getLatestIssueLikeTableProps,
    selectNewJiraInstanceSite,
    searchWithNewJql,
    assertAnalyticsAfterButtonClick,
    updateVisibleColumnList,
  };
};

describe('JiraIssuesConfigModal', () => {
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
      const { selectNewJiraInstanceSite } = await setup({ hookState });

      await selectNewJiraInstanceSite();

      expect(hookState.reset).toHaveBeenCalledWith({
        shouldForceRequest: true,
      });
    });

    it('should produce ADF with new cloudId', async () => {
      const { assertInsertResult, selectNewJiraInstanceSite } = await setup();

      await selectNewJiraInstanceSite();

      assertInsertResult(
        {
          cloudId: '12345',
          jqlUrl: 'https://test1.atlassian.net/issues/?jql=some-query',
        },
        {
          attributes: {
            actions: ['instance updated'],
            searchCount: 0,
          },
        },
      );
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

  describe('when cloudId', () => {
    describe('is not present', () => {
      it('should produce ADF with cloudId for the site which user is browsing from', async () => {
        const {
          findByText,
          getLatestJiraSearchContainerProps,
          assertInsertResult,
        } = await setup({
          parameters: undefined,
        });
        await findByText('Insert Jira issues from hello');

        // We need to do generate jql, since insert button won't active without it.
        const { onSearch } = getLatestJiraSearchContainerProps();
        act(() => {
          onSearch(
            {
              jql: 'some-query',
            },
            'basic',
          );
        });

        assertInsertResult(
          {
            cloudId: '67899',
            jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
          },
          {
            attributes: {
              actions: ['query updated'],
              searchCount: 1,
              searchMethod: 'datasource_basic_filter',
            },
          },
        );
      });

      it('should default to first cloudId if no URL match is found', async () => {
        const {
          findByText,
          getLatestJiraSearchContainerProps,
          assertInsertResult,
        } = await setup({
          parameters: undefined,
          mockSiteDataOverride: mockSiteData.slice(0, 2),
        });
        await findByText('Insert Jira issues from test1');

        const { onSearch } = getLatestJiraSearchContainerProps();
        act(() => {
          onSearch(
            {
              jql: 'some-query',
            },
            'basic',
          );
        });

        assertInsertResult(
          {
            cloudId: '12345',
            jqlUrl: 'https://test1.atlassian.net/issues/?jql=some-query',
          },
          {
            attributes: {
              actions: ['query updated'],
              searchCount: 1,
              searchMethod: 'datasource_basic_filter',
            },
          },
        );
      });
    });

    describe('is present', () => {
      it('should default to first cloudId if no URL match is found (unauthorized to edit)', async () => {
        const {
          findByText,
          getLatestJiraSearchContainerProps,
          assertInsertResult,
        } = await setup({
          mockSiteDataOverride: mockSiteData.slice(0, 2),
        });

        await findByText('Insert Jira issues from test1');

        const { onSearch } = getLatestJiraSearchContainerProps();
        act(() => {
          onSearch(
            {
              jql: 'some-query',
            },
            'basic',
          );
        });

        assertInsertResult(
          {
            cloudId: '12345',
            jqlUrl: 'https://test1.atlassian.net/issues/?jql=some-query',
          },
          {
            attributes: {
              searchCount: 1,
              searchMethod: 'datasource_basic_filter',
            },
          },
        );
      });
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
        isSearching: false,
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
      const { assertInsertResult, searchWithNewJql } = await setup();

      searchWithNewJql('different-query', 'basic');

      assertInsertResult(
        {
          jql: 'different-query',
          jqlUrl: 'https://hello.atlassian.net/issues/?jql=different-query',
        },
        {
          attributes: {
            actions: ['query updated'],
            searchCount: 1,
            searchMethod: 'datasource_basic_filter',
          },
        },
      );
    });

    it('should reset hooks state', async () => {
      const hookState = getDefaultHookState();
      const { searchWithNewJql } = await setup({
        hookState,
      });

      searchWithNewJql('different-query', 'basic');

      expect(hookState.reset).toHaveBeenCalledWith({
        shouldForceRequest: true,
      });
    });

    it('should show a smart link in count view', async () => {
      const { searchWithNewJql, getByLabelText, queryByTestId, findByText } =
        await setup();

      searchWithNewJql('different-query', 'basic');

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
      const { searchWithNewJql, getByLabelText, queryByTestId, findByText } =
        await setup();

      searchWithNewJql('different-query', 'basic');

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
    it('should display InitialState', async () => {
      const { queryByTestId } = await setup({
        hookState: getEmptyHookState(),
        parameters: undefined,
      });
      expect(
        queryByTestId('jlol-datasource-modal--initial-state-view'),
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

      expect(onInsert).toHaveBeenCalledWith(
        {
          type: 'inlineCard',
          attrs: {
            url: 'https://product-fabric.atlassian.net/browse/EDM-5941',
          },
        },
        expect.objectContaining(
          getInsertAnalyticPayload({
            attributes: {
              display: 'inline',
              totalItemCount: 1,
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
              display: 'inline',
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
              display: 'inline',
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
      const { onInsert, findByLabelText, findByRole } = await setup();
      const countViewToggle = await findByLabelText('Count view');
      countViewToggle.click();

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
          columnKeys: ['myColumn'],
          jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
        },
        {},
      );
    });
  });

  describe('when user changes visible columns from within IssueLikeTable', () => {
    it('should use new columnKeyList in resulting ADF', async () => {
      const { updateVisibleColumnList, assertInsertResult } = await setup();

      updateVisibleColumnList(['someColumn']);

      assertInsertResult(
        {
          columnKeys: ['someColumn'],
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
          columnKeys: ['myColumn', 'otherColumn'],
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
            columnKeys: ['myColumn', 'otherColumn'],
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
        hookState: { ...getErrorHookState() },
      });

      expect(getByText('Unable to load results')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert issues' })).toBeDisabled();
    });

    it('should not show network error message in count view mode', async () => {
      const { getByLabelText, queryByText } = await setup({
        hookState: { ...getErrorHookState() },
      });

      act(() => {
        fireEvent.click(getByLabelText('Count view'));
      });

      expect(queryByText('Unable to load results')).not.toBeInTheDocument();
    });

    it('should show unauthorized error message', async () => {
      const { getByLabelText, getByRole, getByText } = await setup({
        hookState: { ...getErrorHookState(), status: 'unauthorized' },
      });

      // issue view
      expect(getByText("You don't have access to hello")).toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert issues' })).toBeDisabled();

      // count view
      fireEvent.click(getByLabelText('Count view'));
      expect(getByText("You don't have access to hello")).toBeInTheDocument();
      expect(getByRole('button', { name: 'Insert issues' })).toBeDisabled();
    });
  });
});

describe('Analytics: JiraIssuesConfigModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fire "screen.datasourceModalDialog.viewed" when the modal is rendered', async () => {
    const { onAnalyticFireEvent } = await setup();

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'screen',
          name: 'datasourceModalDialog',
          action: 'viewed',
          attributes: {},
        },
        context: [
          {
            packageName: '@atlaskit/fabric',
            packageVersion: '0.0.0',
            source: 'datasourceConfigModal',
            attributes: { dataProvider: 'jira-issues' },
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });

  it('should fire "ui.modal.ready.datasource" when modal is ready for the user to search and display data', async () => {
    const { onAnalyticFireEvent } = await setup();

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          action: 'ready',
          actionSubject: 'modal',
          actionSubjectId: 'datasource',
          attributes: {
            instancesCount: 8,
          },
        },
        context: [
          {
            packageName: '@atlaskit/fabric',
            packageVersion: '0.0.0',
            source: 'datasourceConfigModal',
            attributes: { dataProvider: 'jira-issues' },
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });

  it('should fire "ui.emptyResult.shown.datasource" when datasource results are empty', async () => {
    const { onAnalyticFireEvent } = await setup({
      hookState: { ...getDefaultHookState(), responseItems: [] },
    });

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          action: 'shown',
          actionSubject: 'emptyResult',
          actionSubjectId: 'datasource',
          attributes: {},
          eventType: 'ui',
        },
        context: [
          {
            packageName: '@atlaskit/fabric',
            packageVersion: '0.0.0',
            source: 'datasourceConfigModal',
            attributes: { dataProvider: 'jira-issues' },
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });

  it('should fire "ui.error.shown" with reason as "access" when the user unauthorised', async () => {
    const { onAnalyticFireEvent } = await setup({
      hookState: { ...getErrorHookState(), status: 'unauthorized' },
    });

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          action: 'shown',
          actionSubject: 'error',
          attributes: {
            reason: 'access',
          },
          eventType: 'ui',
        },
        context: [
          {
            packageName: '@atlaskit/fabric',
            packageVersion: '0.0.0',
            source: 'datasourceConfigModal',
            attributes: { dataProvider: 'jira-issues' },
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });

  it('should fire "ui.error.shown" with reason as "network" when the user request failed', async () => {
    const { onAnalyticFireEvent } = await setup({
      hookState: { ...getErrorHookState() },
    });

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          action: 'shown',
          actionSubject: 'error',
          attributes: {
            reason: 'network',
          },
          eventType: 'ui',
        },
        context: [
          {
            packageName: '@atlaskit/fabric',
            packageVersion: '0.0.0',
            source: 'datasourceConfigModal',
            attributes: { dataProvider: 'jira-issues' },
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });

  describe('button clicked events', () => {
    const getEventPayload = (
      actionSubjectId: 'insert' | 'cancel',
      defaultAttributes = {},
      overrideAttributes = {},
    ) => ({
      payload: {
        eventType: 'ui',
        actionSubject: 'button',
        action: 'clicked',
        actionSubjectId: actionSubjectId,
        attributes: {
          ...defaultAttributes,
          ...overrideAttributes,
        },
      },
      context: [
        {
          packageName: '@atlaskit/fabric',
          packageVersion: '0.0.0',
          source: 'datasourceConfigModal',
          attributes: { dataProvider: 'jira-issues' },
        },
      ],
    });

    const actionAttributeTests = (
      actionSubjectId: 'insert' | 'cancel',
      buttonName: 'Insert issues' | 'Cancel',
      defaultAttributes: any,
    ) => {
      describe('with "actions" attribute', () => {
        const getExpectedPayload = (overrideAttributes = {}) => {
          return getEventPayload(
            actionSubjectId,
            defaultAttributes,
            overrideAttributes,
          );
        };

        it(`should fire "ui.button.clicked.${actionSubjectId}" with action = "instance updated" when user selected a new site and then clicked the ${buttonName} button`, async () => {
          const { selectNewJiraInstanceSite, assertAnalyticsAfterButtonClick } =
            await setup();

          await selectNewJiraInstanceSite();

          await assertAnalyticsAfterButtonClick(
            buttonName,
            getExpectedPayload({
              actions: ['instance updated'],
            }),
          );
        });

        it(`should fire "ui.button.clicked.${actionSubjectId}" with action = "query updated" when user searched with a new query and then clicked the ${buttonName} button`, async () => {
          const { searchWithNewJql, assertAnalyticsAfterButtonClick } =
            await setup();

          await searchWithNewJql();

          await assertAnalyticsAfterButtonClick(
            buttonName,
            getExpectedPayload({
              actions: ['query updated'],
              searchCount: 1,
            }),
          );
        });

        it(`should fire "ui.button.clicked.${actionSubjectId}" with action = "display view changed" and display = "datasource_inline" when user changed the view and then clicked the ${buttonName} button`, async () => {
          const { getByLabelText, assertAnalyticsAfterButtonClick } =
            await setup();

          getByLabelText('Count view').click();

          await assertAnalyticsAfterButtonClick(
            buttonName,
            getExpectedPayload({
              actions: ['display view changed'],
            }),
          );
        });

        it(`should fire "ui.button.clicked.${actionSubjectId}" with action = "page scrolled" when the user scrolled to the next page and then clicked the ${buttonName} button`, async () => {
          const {
            getLatestIssueLikeTableProps,
            assertAnalyticsAfterButtonClick,
          } = await setup({
            hookState: { ...getDefaultHookState(), hasNextPage: true },
          });

          const { onNextPage } = getLatestIssueLikeTableProps();
          onNextPage();

          await assertAnalyticsAfterButtonClick(
            buttonName,
            getExpectedPayload({
              actions: ['next page scrolled'],
            }),
          );
        });

        it(`should fire "ui.button.clicked.${actionSubjectId}" with action = "column added" when the user added a new column and then clicked the ${buttonName} button`, async () => {
          const {
            getLatestIssueLikeTableProps,
            updateVisibleColumnList,
            assertAnalyticsAfterButtonClick,
          } = await setup();

          const { visibleColumnKeys } = getLatestIssueLikeTableProps();

          updateVisibleColumnList([...visibleColumnKeys, 'additionalColumn']);

          await assertAnalyticsAfterButtonClick(
            buttonName,
            getExpectedPayload({
              actions: ['column added'],
            }),
          );
        });

        it(`should fire "ui.button.clicked.${actionSubjectId}" with action = "column removed" when the user removed one column and then clicked the ${buttonName} button`, async () => {
          const { assertAnalyticsAfterButtonClick, updateVisibleColumnList } =
            await setup({ visibleColumnKeys: ['myColumn', 'otherColumn'] });

          updateVisibleColumnList(['myColumn']);

          await assertAnalyticsAfterButtonClick(
            buttonName,
            getExpectedPayload({
              actions: ['column removed'],
            }),
          );
        });

        it(`should fire "ui.button.clicked.${actionSubjectId}" with action = "column reordered" when the user reorders one column and then clicked the ${buttonName} button`, async () => {
          const { assertAnalyticsAfterButtonClick, updateVisibleColumnList } =
            await setup({ visibleColumnKeys: ['myColumn', 'secondColumn'] });

          updateVisibleColumnList(['myColumn', 'otherColumn']);
          updateVisibleColumnList(['otherColumn', 'myColumn']);

          await assertAnalyticsAfterButtonClick(
            buttonName,
            getExpectedPayload({
              actions: ['column reordered'],
            }),
          );
        });
      });
    };

    describe('insert', () => {
      const INSERT_BUTTON_NAME = 'Insert issues';
      const INSERT_ACTION_SUBJECT_ID = 'insert';
      let defaultAttributes = {};

      beforeEach(() => {
        defaultAttributes = {
          extensionKey: 'jira-object-provider',
          destinationObjectTypes: ['issue'],
          searchCount: 0,
          totalItemCount: 3,
          actions: [],
        };
      });

      actionAttributeTests(
        INSERT_ACTION_SUBJECT_ID,
        INSERT_BUTTON_NAME,
        defaultAttributes,
      );

      describe('with "display" attribute', () => {
        it('should fire "ui.button.clicked.insert" with display "datasource_table" when the insert button is clicked and results are presented as a table for more than 1 issue', async () => {
          const { assertAnalyticsAfterButtonClick } = await setup();
          await assertAnalyticsAfterButtonClick(
            INSERT_BUTTON_NAME,
            getEventPayload('insert', defaultAttributes),
          );
        });

        it('should fire "ui.button.clicked.insert" with display "inline" when the insert button is clicked and results are presented as a single issue', async () => {
          const expectedPayload = getEventPayload('insert', defaultAttributes, {
            totalItemCount: 1,
            display: 'inline',
          });

          const { assertAnalyticsAfterButtonClick } = await setup({
            hookState: {
              ...getDefaultHookState(),
              responseItems: [
                {
                  myColumn: { data: 'some-value' },
                  otherColumn: { data: 'other-column-value' },
                  myId: { data: 'some-id1' },
                },
              ],
              totalCount: 1,
            },
          });

          await assertAnalyticsAfterButtonClick(
            INSERT_BUTTON_NAME,
            expectedPayload,
          );
        });

        it('should fire "ui.button.clicked.insert" with display "datasource_inline" when the insert button is clicked and results are presented as a count issue', async () => {
          const expectedPayload = getEventPayload('insert', defaultAttributes, {
            actions: ['display view changed'],
            display: 'datasource_inline',
          });

          const { assertAnalyticsAfterButtonClick, getByLabelText } =
            await setup();

          getByLabelText('Count view').click();

          await assertAnalyticsAfterButtonClick(
            INSERT_BUTTON_NAME,
            expectedPayload,
          );
        });
      });

      describe('with search attributes', () => {
        it('should fire the event with searchMethod = null and searchCount = 0 if a user did not search', async () => {
          const expectedPayload = getEventPayload('insert', defaultAttributes, {
            actions: [],
            searchMethod: null,
            searchCount: 0,
          });

          const { assertAnalyticsAfterButtonClick } = await setup();

          await assertAnalyticsAfterButtonClick(
            INSERT_BUTTON_NAME,
            expectedPayload,
          );
        });

        it('should fire the event with searchMethod = "datasource_basic_filter" when the user searched using basic search and set searchCount to 1', async () => {
          const expectedPayload = getEventPayload('insert', defaultAttributes, {
            actions: ['query updated'],
            searchMethod: 'datasource_basic_filter',
            searchCount: 1,
          });

          const { assertAnalyticsAfterButtonClick, searchWithNewJql } =
            await setup();

          await searchWithNewJql('new_search', 'basic');
          await assertAnalyticsAfterButtonClick(
            INSERT_BUTTON_NAME,
            expectedPayload,
          );
        });

        it('should fire the event with searchMethod = "datasource_search_query" when the user searched using jql search and set searchCount to 1', async () => {
          const expectedPayload = getEventPayload('insert', defaultAttributes, {
            actions: ['query updated'],
            searchMethod: 'datasource_search_query',
            searchCount: 1,
          });

          const { assertAnalyticsAfterButtonClick, searchWithNewJql } =
            await setup();

          await searchWithNewJql('new_search', 'jql');
          await assertAnalyticsAfterButtonClick(
            INSERT_BUTTON_NAME,
            expectedPayload,
          );
        });

        it('should fire the event with the last used searchMethod if user searched multiple times and update the searchCount accordingly', async () => {
          const expectedPayload = getEventPayload('insert', defaultAttributes, {
            actions: ['query updated'],
            searchMethod: 'datasource_search_query',
            searchCount: 4,
          });

          const { assertAnalyticsAfterButtonClick, searchWithNewJql } =
            await setup();

          await searchWithNewJql('basic_search', 'basic');
          await searchWithNewJql('basic_search_2', 'basic');
          await searchWithNewJql('basic_search_3', 'basic');
          await searchWithNewJql('jql_search', 'jql');

          await assertAnalyticsAfterButtonClick(
            INSERT_BUTTON_NAME,
            expectedPayload,
          );
        });
      });

      describe('with displayedColumnCount attribute', () => {
        it('should fire "ui.button.clicked.insert" with the latest displayedColumnCount', async () => {
          const expectedPayload = getEventPayload('insert', defaultAttributes, {
            actions: ['column added'],
            displayedColumnCount: 3,
          });

          // initial number of column = 2
          const { assertAnalyticsAfterButtonClick, updateVisibleColumnList } =
            await setup({ visibleColumnKeys: ['myColumn', 'secondColumn'] });

          // updating the number of columns to 3
          updateVisibleColumnList(['myColumn', 'secondColumn', 'other column']);

          await assertAnalyticsAfterButtonClick(
            INSERT_BUTTON_NAME,
            expectedPayload,
          );
        });
      });
    });

    describe('cancel', () => {
      const CANCEL_BUTTON_NAME = 'Cancel';
      const CANCEL_BUTTON_ACTION_SUBJECT_ID = 'cancel';
      let defaultAttributes = {};

      beforeEach(() => {
        defaultAttributes = {
          extensionKey: 'jira-object-provider',
          destinationObjectTypes: ['issue'],
          actions: [],
          searchCount: 0,
        };
      });

      actionAttributeTests(
        CANCEL_BUTTON_ACTION_SUBJECT_ID,
        CANCEL_BUTTON_NAME,
        defaultAttributes,
      );

      describe('with search count attribute', () => {
        it('should fire "ui.button.clicked.cancel" with searchCount = 0 if a user did not search', async () => {
          const { assertAnalyticsAfterButtonClick } = await setup();
          await assertAnalyticsAfterButtonClick(
            CANCEL_BUTTON_NAME,
            getEventPayload('cancel', defaultAttributes),
          );
        });

        it.each(['jql', 'basic'])(
          'should fire "ui.button.clicked.cancel" with correct searchCount if a user searched using %p search multiple times',
          async searchMode => {
            const expectedPayload = getEventPayload(
              'cancel',
              defaultAttributes,
              {
                actions: ['query updated'],
                searchCount: 3,
              },
            );

            const { assertAnalyticsAfterButtonClick, searchWithNewJql } =
              await setup();

            await searchWithNewJql(
              'new_search',
              searchMode as JiraSearchMethod,
            );
            await searchWithNewJql(
              'new_search2',
              searchMode as JiraSearchMethod,
            );
            await searchWithNewJql(
              'new_search3',
              searchMode as JiraSearchMethod,
            );

            await assertAnalyticsAfterButtonClick(
              CANCEL_BUTTON_NAME,
              expectedPayload,
            );
          },
        );
      });
    });
  });

  it('should fire "ui.link.viewed.singleItem" event once when a single issue is viewed', async () => {
    const hookstate = getSingleIssueHookState();
    const { onAnalyticFireEvent } = await setup({
      hookState: hookstate,
    });

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          actionSubject: 'link',
          action: 'viewed',
          actionSubjectId: 'singleItem',
          attributes: {
            destinationObjectTypes: ['issue'],
            searchMethod: null,
            extensionKey: 'jira-object-provider',
          },
        },
        context: [
          {
            packageName: '@atlaskit/fabric',
            packageVersion: '0.0.0',
            source: 'datasourceConfigModal',
            attributes: { dataProvider: 'jira-issues' },
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });

  it('should not fire "ui.link.viewed.singleItem" when status is unauthorized', async () => {
    const hookstate = getUnauthorisedHookState();
    const { onAnalyticFireEvent } = await setup({
      hookState: hookstate,
    });

    expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          actionSubject: 'link',
          action: 'viewed',
          actionSubjectId: 'singleItem',
          attributes: {
            destinationObjectTypes: ['issue'],
            searchMethod: null,
            extensionKey: 'jira-object-provider',
          },
        },
        context: [
          {
            packageName: '@atlaskit/fabric',
            packageVersion: '0.0.0',
            source: 'datasourceConfigModal',
            attributes: { dataProvider: 'jira-issues' },
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });

  it('should not fire "ui.link.viewed.singleItem" when status is empty', async () => {
    const hookstate = getEmptyHookState();
    const { onAnalyticFireEvent } = await setup({
      hookState: hookstate,
    });

    expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          actionSubject: 'link',
          action: 'viewed',
          actionSubjectId: 'singleItem',
          attributes: {
            destinationObjectTypes: ['issue'],
            searchMethod: null,
            extensionKey: 'jira-object-provider',
          },
        },
        context: [
          {
            packageName: '@atlaskit/fabric',
            packageVersion: '0.0.0',
            source: 'datasourceConfigModal',
            attributes: { dataProvider: 'jira-issues' },
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });

  it('should fire "ui.link.viewed.count" event once when a issue count viewed', async () => {
    const { getByLabelText, onAnalyticFireEvent } = await setup();

    getByLabelText('Count view').click();
    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          actionSubject: 'link',
          action: 'viewed',
          actionSubjectId: 'count',
          attributes: {
            destinationObjectTypes: ['issue'],
            searchMethod: null,
            totalItemCount: 3,
            extensionKey: 'jira-object-provider',
          },
        },
        context: [
          {
            packageName: '@atlaskit/fabric',
            packageVersion: '0.0.0',
            source: 'datasourceConfigModal',
            attributes: { dataProvider: 'jira-issues' },
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });

  it('should not fire "ui.link.viewed.count" when status is unauthorized', async () => {
    const hookstate = getUnauthorisedHookState();
    const { getByLabelText, onAnalyticFireEvent } = await setup({
      hookState: hookstate,
    });

    getByLabelText('Count view').click();
    expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          actionSubject: 'link',
          action: 'viewed',
          actionSubjectId: 'count',
          attributes: {
            destinationObjectTypes: ['issue'],
            searchMethod: null,
            totalItemCount: 3,
            extensionKey: 'jira-object-provider',
          },
        },
        context: [
          {
            packageName: '@atlaskit/fabric',
            packageVersion: '0.0.0',
            source: 'datasourceConfigModal',
            attributes: { dataProvider: 'jira-issues' },
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });

  it('should not fire "ui.link.viewed.count" when status is empty', async () => {
    const hookstate = getEmptyHookState();
    const { getByLabelText, onAnalyticFireEvent } = await setup({
      hookState: hookstate,
    });

    getByLabelText('Count view').click();
    expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          actionSubject: 'link',
          action: 'viewed',
          actionSubjectId: 'count',
          attributes: {
            destinationObjectTypes: ['issue'],
            searchMethod: null,
            totalItemCount: 3,
            extensionKey: 'jira-object-provider',
          },
        },
        context: [
          {
            packageName: '@atlaskit/fabric',
            packageVersion: '0.0.0',
            source: 'datasourceConfigModal',
            attributes: { dataProvider: 'jira-issues' },
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });
});

describe('UFO metrics: JiraIssuesConfigModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start ufo experience when JiraIssuesConfigModal status is loading', async () => {
    await setup({
      hookState: { ...getDefaultHookState(), status: 'loading' },
    });

    expect(mockUfoStart).toHaveBeenCalledTimes(1);
  });

  it('should start ufo experience and set extensionKey metadata when JiraIssuesConfigModal status is loading', async () => {
    await setup({
      hookState: { ...getDefaultHookState(), status: 'loading' },
    });

    expect(mockUfoStart).toHaveBeenCalledTimes(1);

    expect(mockUfoAddMetadata).toHaveBeenCalledTimes(1);
    expect(mockUfoAddMetadata).toHaveBeenCalledWith({
      extensionKey: 'jira-object-provider',
    });
  });

  it('should mark as a successful experience when JiraIssuesConfigModal results are resolved', async () => {
    await setup();

    expect(mockUfoSuccess).toHaveBeenCalledTimes(1);

    expect(mockUfoFailure).not.toHaveBeenCalled();
  });

  it('should mark as a successful when JiraIssuesConfigModal data request returns unauthorized response', async () => {
    await setup({
      hookState: { ...getErrorHookState(), status: 'unauthorized' },
    });

    expect(mockUfoSuccess).toHaveBeenCalledTimes(1);

    expect(mockUfoFailure).not.toHaveBeenCalled();
  });

  it('should mark as a successful experience when JiraIssuesConfigModal results are empty', async () => {
    await setup({
      hookState: { ...getEmptyHookState(), status: 'resolved' },
    });

    expect(mockUfoSuccess).toHaveBeenCalledTimes(1);

    expect(mockUfoFailure).not.toHaveBeenCalled();
  });

  it('should mark as a successful experience when JiraIssuesConfigModal result has only one item', async () => {
    await setup({
      hookState: {
        ...getDefaultHookState(),
        responseItems: [
          {
            key: {
              data: {
                url: 'www.atlassian.com',
              },
            },
          },
        ],
      },
    });

    expect(mockUfoSuccess).toHaveBeenCalled();

    expect(mockUfoFailure).not.toHaveBeenCalled();
  });

  it('should mark as a failed experience when JiraIssuesConfigModal request fails', async () => {
    await setup({ hookState: { ...getErrorHookState() } });

    expect(mockUfoFailure).toHaveBeenCalledTimes(1);

    expect(mockUfoSuccess).not.toHaveBeenCalled();
  });
});
