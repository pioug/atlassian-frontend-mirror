import React, { useEffect } from 'react';

import { queries } from '@testing-library/dom';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { JQLEditor, JQLEditorProps } from '@atlaskit/jql-editor';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import SmartLinkClient from '../../../examples-helpers/smartLinkCustomClient';
import { EVENT_CHANNEL } from '../../analytics';
import { succeedUfoExperience } from '../../analytics/ufoExperiences';
import { ConfigModalProps, IssueViewModes } from '../../common/types';
import {
  DatasourceTableState,
  useDatasourceTableState,
} from '../../hooks/useDatasourceTableState';
import { getAvailableSites } from '../../services/getAvailableSites';
import { IssueLikeDataTableView } from '../../ui/issue-like-table';
import { IssueLikeDataTableViewProps } from '../../ui/issue-like-table/types';

jest.mock('../../services/getAvailableSites', () => ({
  getAvailableSites: jest.fn(),
}));

jest.mock('../../hooks/useDatasourceTableState');

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

jest.mock('../../ui/issue-like-table', () => ({
  ...jest.requireActual('../../ui/issue-like-table'),
  IssueLikeDataTableView: jest.fn(() => <MockIssueLikeTable />),
}));

export type ProviderType = 'jira' | 'confluence-search';

type AnalyticsPayloadOverride = {
  attributes?: object;
};

type ConfigModalFC<ADF, Parameters> = (
  props: ConfigModalProps<ADF, Parameters>,
) => JSX.Element;

export const setupFactory = <Parameters, InsertArgs, ADF>(
  providerType: ProviderType,
  Component:
    | ConfigModalFC<ADF, Parameters>
    | React.ForwardRefExoticComponent<ConfigModalProps<ADF, Parameters>>,
  getDefaultParameters: () => Parameters,
  insertArgs: (args: InsertArgs) => object,
) => {
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
    extensionKey: `${providerType}-object-provider`,
  });

  const getSingleResponseItemHookState: () => DatasourceTableState = () => ({
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
    extensionKey: `${providerType}-object-provider`,
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
    extensionKey: `${providerType}-object-provider`,
  });

  const getInsertAnalyticPayload = <
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
          extensionKey: `${providerType}-object-provider`,
          searchCount: 0,
          searchMethod: null,
          totalItemCount: 3,
          isQueryComplex: false,
          ...override?.attributes,
        },
      },
    };
  };
  const setup = async (
    args: {
      parameters?: Parameters;
      hookState?: DatasourceTableState;
      visibleColumnKeys?: string[];
      dontWaitForSitesToLoad?: boolean;
      mockSiteDataOverride?: {
        cloudId: string;
        url: string;
        displayName: string;
      }[];
      columnCustomSizes?: ConfigModalProps<
        unknown,
        unknown
      >['columnCustomSizes'];
      wrappedColumnKeys?: ConfigModalProps<
        unknown,
        unknown
      >['wrappedColumnKeys'];
      url?: ConfigModalProps<unknown, unknown>['url'];
      viewMode?: IssueViewModes;
    } = {},
  ) => {
    asMock(getAvailableSites).mockResolvedValue(
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
        <AnalyticsListener
          channel={EVENT_CHANNEL}
          onEvent={onAnalyticFireEvent}
        >
          <IntlProvider locale="en">
            <SmartCardProvider client={new SmartLinkClient()}>
              <Component
                datasourceId={`some-${providerType}-datasource-id`}
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
                columnCustomSizes={
                  Object.keys(args).includes('columnCustomSizes')
                    ? args.columnCustomSizes
                    : undefined
                }
                wrappedColumnKeys={
                  Object.keys(args).includes('wrappedColumnKeys')
                    ? args.wrappedColumnKeys
                    : undefined
                }
                url={args.url}
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
      getByPlaceholderText,
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
        `${providerType}-datasource-modal--site-selector--trigger`,
      );
    }

    /** TODO[mdao]: Confluence doesn't really have this... */
    const switchMode = (viewMode: IssueViewModes) => {
      fireEvent.click(
        getByTestId(
          `${providerType}-datasource-modal--view-drop-down--trigger`,
        ),
      );
      viewMode === 'issue'
        ? fireEvent.click(getByTestId('dropdown-item-table'))
        : fireEvent.click(getByTestId('dropdown-item-inline-link'));
    };

    if (args.viewMode) {
      switchMode(args.viewMode);
    }

    const selectNewInstanceSite = async () => {
      const siteSelectorTrigger = document.getElementsByClassName(
        `${providerType}-datasource-modal--site-selector__control`,
      )[0];

      fireEvent.mouseDown(siteSelectorTrigger);

      const availableJiraSiteDropdownItems = [
        ...document.getElementsByClassName(
          `${providerType}-datasource-modal--site-selector__option`,
        ),
      ] as HTMLElement[];

      act(() => {
        fireEvent.click(availableJiraSiteDropdownItems[0]);
      });
    };

    const getSiteSelectorText = () =>
      document.getElementsByClassName(
        `${providerType}-datasource-modal--site-selector__control`,
      )[0]?.textContent;

    const getConfigModalTitleText = async () => {
      const modalTitle = await component.findByTestId(
        `${providerType}-datasource-modal--title-text`,
      );
      const modalTitleTextContent = modalTitle?.textContent;

      const siteSelectorText = getSiteSelectorText();

      if (!siteSelectorText) {
        return modalTitleTextContent;
      }

      // the text content in title contains the input value but without spacing so this cleans it up a bit
      return `${modalTitleTextContent?.replace(
        siteSelectorText,
        '',
      )} ${siteSelectorText}`;
    };

    const searchWithNewBasic = (keywords: string = 'keywords') => {
      act(() => {
        if (providerType === 'jira') {
          fireEvent.click(getByTestId('mode-toggle-basic'));
        }
      });
      act(() => {
        fireEvent.change(
          getByTestId(`${providerType}-datasource-modal--basic-search-input`),
          { target: { value: keywords } },
        );
      });
      act(() => {
        fireEvent.click(
          getByTestId(`${providerType}-datasource-modal--basic-search-button`),
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

    const assertInsertResult = (
      args: InsertArgs,
      analyticsExpectedOverride?: AnalyticsPayloadOverride,
    ) => {
      const button = component.getByTestId(
        `${providerType}-datasource-modal--insert-button`,
      );
      button.click();
      expect(onInsert).toHaveBeenCalledWith(
        insertArgs(args),
        expect.objectContaining(
          getInsertAnalyticPayload(analyticsExpectedOverride),
        ),
      );
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
      getByPlaceholderText,
      assertInsertResult,
      getSiteSelectorText,
      getConfigModalTitleText,
      getLatestJQLEditorProps,
      getLatestIssueLikeTableProps,
      selectNewInstanceSite,
      searchWithNewJql,
      searchWithNewBasic,
      assertAnalyticsAfterButtonClick,
      updateVisibleColumnList,
      switchMode,
    };
  };

  return {
    useDatasourceTableState,
    IssueLikeDataTableView,
    getAvailableSites,
    getDefaultHookState,
    getSingleResponseItemHookState,
    getUnauthorisedHookState,
    getEmptyHookState,
    getLoadingHookState,
    getErrorHookState,
    getInsertAnalyticPayload,
    setup,
  };
};
