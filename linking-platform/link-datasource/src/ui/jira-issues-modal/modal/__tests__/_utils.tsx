import React, { useEffect } from 'react';

import { JQLEditor, JQLEditorProps } from '@atlassianlabs/jql-editor';
import { queries } from '@testing-library/dom';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
  JiraIssueDatasourceParameters,
  JiraIssuesDatasourceAdf,
} from '@atlaskit/link-datasource';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import SmartLinkClient from '../../../../../examples-helpers/smartLinkCustomClient';
import { EVENT_CHANNEL } from '../../../../analytics';
import { succeedUfoExperience } from '../../../../analytics/ufoExperiences';
import {
  DatasourceTableState,
  useDatasourceTableState,
} from '../../../../hooks/useDatasourceTableState';
import { getAvailableJiraSites } from '../../../../services/getAvailableJiraSites';
import { IssueLikeDataTableView } from '../../../issue-like-table';
import { IssueLikeDataTableViewProps } from '../../../issue-like-table/types';
import { JiraIssuesConfigModal } from '../index';

jest.mock('../../../../services/getAvailableJiraSites', () => ({
  getAvailableJiraSites: jest.fn(),
}));

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

jest.mock('../../../../hooks/useDatasourceTableState');

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

jest.mock('../../../issue-like-table', () => ({
  ...jest.requireActual('../../../issue-like-table'),
  IssueLikeDataTableView: jest.fn(() => <MockIssueLikeTable />),
}));

export const getDefaultHookState: () => DatasourceTableState = () => ({
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

export const getSingleIssueHookState: () => DatasourceTableState = () => ({
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

export const getUnauthorisedHookState: () => DatasourceTableState = () => ({
  columns: [],
  status: 'unauthorized',
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

export const getEmptyHookState: () => DatasourceTableState = () => ({
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

export const getLoadingHookState: () => DatasourceTableState = () => ({
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

export const getErrorHookState: () => DatasourceTableState = () => ({
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

export const getDefaultParameters: () => JiraIssueDatasourceParameters =
  () => ({
    cloudId: '67899',
    jql: 'some-query',
  });

type AnalyticsPayloadOverride = {
  attributes?: object;
};

export const getInsertAnalyticPayload = <
  T extends AnalyticsPayloadOverride | undefined,
>(
  override: T,
) => {
  return {
    _isAnalyticsEvent: true,
    _isUIAnalyticsEvent: true,
    clone: expect.anything(),
    context: expect.anything(),
    handlers: expect.anything(),
    hasFired: false,
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

export const setup = async (
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

  const renderComponent = (): RenderResult<
    typeof queries,
    HTMLElement,
    HTMLElement
  > =>
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

  const {
    findByRole,
    findByTestId,
    findByText,
    getByLabelText,
    getByTestId,
    getByText,
    getByRole,
    queryByTestId,
    queryByRole,
    queryByText,
    findByLabelText,
    rerender,
  } = component;

  const getLatestJQLEditorProps = () => {
    let calls = asMock(JQLEditor).mock.calls;
    return calls[calls.length - 1][0] as JQLEditorProps;
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

  const searchWithNewBasic = (keywords: string = 'keywords') => {
    act(() => {
      fireEvent.click(getByTestId('mode-toggle-basic'));
    });
    act(() => {
      fireEvent.change(
        getByTestId('jira-jql-datasource-modal--basic-search-input'),
        { target: { value: keywords } },
      );
    });
    act(() => {
      fireEvent.click(
        getByTestId('jira-jql-datasource-modal--basic-search-button'),
      );
    });
  };

  const searchWithNewJql = (jql = 'different-query') => {
    act(() => {
      fireEvent.click(getByTestId('mode-toggle-jql'));
    });

    const jast: any = { errors: [] }; // This value doesnt' matter

    const { onUpdate } = getLatestJQLEditorProps();
    invariant(onUpdate);
    act(() => {
      onUpdate(jql, jast);
    });

    const { onSearch } = getLatestJQLEditorProps();
    invariant(onSearch);
    act(() => {
      onSearch(jql, jast);
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
    findByRole,
    findByTestId,
    findByText,
    getByLabelText,
    getByTestId,
    getByText,
    getByRole,
    queryByTestId,
    queryByRole,
    findByLabelText,
    rerender,
    queryByText,
    renderComponent,
    onCancel,
    onInsert,
    onAnalyticFireEvent,
    assertInsertResult,
    getLatestJQLEditorProps,
    getLatestIssueLikeTableProps,
    selectNewJiraInstanceSite,
    searchWithNewJql,
    searchWithNewBasic,
    assertAnalyticsAfterButtonClick,
    updateVisibleColumnList,
  };
};

// Re-exporting mocked packages
export {
  useDatasourceTableState,
  IssueLikeDataTableView,
  getAvailableJiraSites,
  JQLEditor,
};
