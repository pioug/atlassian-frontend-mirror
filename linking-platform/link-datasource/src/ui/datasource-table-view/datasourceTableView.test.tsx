import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { DatasourceTableStatusType } from '@atlaskit/linking-types';
import { ConcurrentExperience } from '@atlaskit/ufo';

import { EVENT_CHANNEL } from '../../analytics';
import { DatasourceRenderSuccessAttributesType } from '../../analytics/generated/analytics.types';
import {
  DatasourceTableState,
  useDatasourceTableState,
} from '../../hooks/useDatasourceTableState';
import { useIsOnScreen } from '../issue-like-table/useIsOnScreen';

import { DatasourceTableView } from './datasourceTableView';

jest.mock('../../hooks/useDatasourceTableState');
jest.mock('../issue-like-table/useIsOnScreen');

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

const onAnalyticFireEvent = jest.fn();

const setup = (
  overrides: Partial<DatasourceTableState> & {
    visibleColumnKeys?: string[] | null;
    onVisibleColumnKeysChange?: ((visibleColumnKeys: string[]) => void) | null;
  } = {},
) => {
  const { visibleColumnKeys, onVisibleColumnKeysChange } = overrides;

  const mockReset = jest.fn();
  asMock(useDatasourceTableState).mockReturnValue({
    reset: mockReset,
    status: 'resolved',
    onNextPage: jest.fn(),
    loadDatasourceDetails: jest.fn(),
    hasNextPage: false,
    responseItems: [
      {
        myColumn: {
          data: 'some-value',
        },
        id: {
          data: 'some-id1',
        },
      },
    ],
    totalCount: 2,
    columns: [
      { key: 'myColumn', title: 'My Column', type: 'string' },
      { key: 'id' },
    ],
    defaultVisibleColumnKeys: ['myColumn'],
    extensionKey: 'jira-object-provider',
    destinationObjectTypes: ['issue'],
    ...(overrides || {}),
  } as DatasourceTableState);

  const renderResult = render(
    <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
      <IntlProvider locale="en">
        <DatasourceTableView
          datasourceId={'some-datasource-id'}
          parameters={{
            cloudId: 'some-cloud-id',
            jql: 'some-jql-query',
          }}
          visibleColumnKeys={
            visibleColumnKeys === null
              ? undefined
              : visibleColumnKeys || ['visible-column-1', 'visible-column-2']
          }
          onVisibleColumnKeysChange={
            onVisibleColumnKeysChange === null
              ? undefined
              : onVisibleColumnKeysChange || jest.fn()
          }
        />
      </IntlProvider>
    </AnalyticsListener>,
  );

  return { mockReset, ...renderResult };
};

describe('DatasourceTableView', () => {
  it('should call useDatasourceTableState with the correct arguments', () => {
    setup();

    expect(useDatasourceTableState).toHaveBeenCalledWith({
      datasourceId: 'some-datasource-id',
      parameters: {
        cloudId: 'some-cloud-id',
        jql: 'some-jql-query',
      },
      fieldKeys: ['visible-column-1', 'visible-column-2'],
    });
  });

  it('should call IssueLikeDataTableView with right props', () => {
    const { getByTestId } = setup({
      visibleColumnKeys: ['myColumn'],
    });

    expect(getByTestId('myColumn-column-heading')).toHaveTextContent(
      'My Column',
    );
    expect(
      getByTestId('datasource-table-view--row-some-id1'),
    ).toHaveTextContent('some-value');
  });

  it('should call onVisibleColumnKeysChange with defaultVisibleColumnKeys if no visibleColumnKeys are received from props', () => {
    const onVisibleColumnKeysChange = jest.fn();
    const { getByTestId } = setup({
      onVisibleColumnKeysChange,
      visibleColumnKeys: null,
    });

    expect(getByTestId('myColumn-column-heading')).toHaveTextContent(
      'My Column',
    );
    expect(onVisibleColumnKeysChange).toHaveBeenCalledWith(['myColumn']);
  });

  it('should NOT call onVisibleColumnKeysChange with defaultVisibleColumnKeys if visibleColumnKeys are received from props', () => {
    const onVisibleColumnKeysChange = jest.fn();
    setup({
      visibleColumnKeys: ['myColumn'],
      onVisibleColumnKeysChange,
    });

    expect(onVisibleColumnKeysChange).not.toHaveBeenCalled();
  });

  it('should NOT call onVisibleColumnKeysChange with defaultVisibleColumnKeys if no defaultVisibleColumnKeys are returned from hook', () => {
    const onVisibleColumnKeysChange = jest.fn();
    setup({
      defaultVisibleColumnKeys: [],
      onVisibleColumnKeysChange,
    });

    expect(onVisibleColumnKeysChange).not.toHaveBeenCalled();
  });

  it('should wait for data AND columns before rendering table', () => {
    const { queryByTestId } = setup({
      columns: [],
      visibleColumnKeys: ['myColumn'],
    });

    expect(queryByTestId('datasource-table-view')).toBe(null);
    expect(queryByTestId('datasource-table-view-skeleton')).toBeInTheDocument();
  });

  it('should render table footer', () => {
    const { getByTestId } = setup();

    expect(getByTestId('table-footer')).toBeInTheDocument();
  });

  it('should not call reset() on initial load (only when parameters change)', () => {
    const { mockReset } = setup();
    expect(mockReset).not.toHaveBeenCalled();
  });

  it('should call reset() when parameters change', () => {
    const { rerender, mockReset } = setup();

    const newParameters = {
      cloudId: 'new-cloud-id',
      jql: 'some-jql-query',
    };

    rerender(
      <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
        <IntlProvider locale="en">
          <DatasourceTableView
            datasourceId={'some-datasource-id'}
            parameters={newParameters}
            visibleColumnKeys={['visible-column-1', 'visible-column-2']}
            onVisibleColumnKeysChange={jest.fn()}
          />
        </IntlProvider>
      </AnalyticsListener>,
    );

    expect(mockReset).toBeCalledTimes(1);
  });

  it('should call reset() when refresh button is preset', () => {
    const { getByRole, mockReset } = setup();

    asMock(mockReset).mockReset();

    getByRole('button', { name: 'Refresh' }).click();

    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(mockReset).toHaveBeenCalledWith({ shouldForceRequest: true });
  });

  it.each([
    ['should', true, true],
    ['should not', true, false],
    ['should not', false, true],
    ['should not', false, false],
  ])(
    `%p call onNextPage when hasNextPage is %p and isLastItemVisible is %p`,
    (outcome, hasNextPage, isLastItemVisible) => {
      asMock(useIsOnScreen).mockReturnValue(isLastItemVisible);
      const onNextPage = jest.fn();

      setup({ hasNextPage, onNextPage });

      if (outcome === 'should') {
        expect(onNextPage).toHaveBeenCalled();
      } else {
        expect(onNextPage).not.toHaveBeenCalled();
      }
    },
  );

  describe('when results are not returned', () => {
    it('should show no results if no responseItems are returned', () => {
      const { mockReset, getByRole, getByText } = setup({
        responseItems: [],
      });

      expect(getByText('No results found')).toBeInTheDocument();

      getByRole('button', { name: 'Refresh' }).click();
      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('when an error on /data request occurs', () => {
    it('should show an error message on request failure', () => {
      const { getByRole, getByText, mockReset } = setup({
        status: 'rejected',
      });

      expect(getByText('Unable to load items')).toBeInTheDocument();

      getByRole('button', { name: 'Refresh' }).click();
      expect(mockReset).toHaveBeenCalledTimes(1);
    });

    it('should show an unauthorized message on 403 response', () => {
      const { getByText } = setup({ status: 'unauthorized' });

      expect(
        getByText("You don't have access to this site"),
      ).toBeInTheDocument();
    });
  });
});
describe('Analytics: DatasourceTableView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fire "ui.emptyResult.shown.datasource" when datasource results are empty', () => {
    setup({
      responseItems: [],
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
      },
      EVENT_CHANNEL,
    );
  });

  it('should fire "ui.error.shown" with reason as "access" when the user unauthorised', () => {
    setup({
      status: 'unauthorized',
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
      },
      EVENT_CHANNEL,
    );
  });

  it('should fire "ui.error.shown" with reason as "network" when the user request failed', () => {
    setup({
      status: 'rejected',
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
      },
      EVENT_CHANNEL,
    );
  });

  it('should fire "ui.button.clicked.sync" event when refresh button is clicked', async () => {
    const { getByRole } = setup();

    getByRole('button', { name: 'Refresh' }).click();
    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          actionSubject: 'button',
          action: 'clicked',
          actionSubjectId: 'sync',
          attributes: {
            extensionKey: 'jira-object-provider',
            destinationObjectTypes: ['issue'],
          },
        },
        context: [
          {
            packageName: '@atlaskit/fabric',
            packageVersion: '0.0.0',
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });

  describe('"ui.datasource.renderSuccess" event', () => {
    const getEventPayload = (
      overrideAttributes: Partial<DatasourceRenderSuccessAttributesType> = {},
    ) => ({
      payload: {
        action: 'renderSuccess',
        actionSubject: 'datasource',
        attributes: {
          extensionKey: 'jira-object-provider',
          destinationObjectTypes: ['issue'],
          displayedColumnCount: 2,
          display: 'table',
          ...overrideAttributes,
        },
        eventType: 'ui',
      },
      context: [
        {
          packageName: '@atlaskit/fabric',
          packageVersion: '0.0.0',
        },
      ],
    });

    it('should fire "ui.datasource.renderSuccess" event with display = "table" when the data is present and status is resolved', () => {
      setup();

      expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
        getEventPayload({ totalItemCount: 2 }),
        EVENT_CHANNEL,
      );
    });

    it.each(['unauthorized', 'empty', 'rejected'])(
      'should not fire "ui.datasource.renderSuccess" event with display = "table" when the status is %s',
      status => {
        setup({ status: status as DatasourceTableStatusType });

        expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
          getEventPayload(),
          EVENT_CHANNEL,
        );
      },
    );

    it.each([
      {
        columns: [],
      },
      {
        responseItems: [],
      },
      {
        totalCount: 0,
      },
    ])(
      'should not fire "ui.datasource.renderSuccess" event with display = "table" when status is resolved, but %s',
      override => {
        setup({ status: 'resolved', ...override });

        expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
          getEventPayload(),
          EVENT_CHANNEL,
        );
      },
    );
  });
});

describe('UFO metrics: DatasourceTableView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start ufo experience when DatasourceTableView is initialised', async () => {
    setup({
      status: 'loading',
    });

    expect(mockUfoStart).toHaveBeenCalledTimes(1);

    expect(mockUfoSuccess).not.toHaveBeenCalled();
    expect(mockUfoFailure).not.toHaveBeenCalled();
  });

  it('should add extensionKey metadata to ufo experience when DatasourceTableView is initialised', async () => {
    setup({
      status: 'loading',
    });

    expect(mockUfoAddMetadata).toHaveBeenCalledTimes(1);
    expect(mockUfoAddMetadata).toHaveBeenCalledWith({
      extensionKey: 'jira-object-provider',
    });
  });

  it('should mark as a successful experience when DatasourceTableView results are resolved', async () => {
    setup({
      responseItems: [
        {
          id: {
            data: 'some-id1',
          },
        },
        {
          id: {
            data: 'some-id2',
          },
        },
      ],
    });

    expect(mockUfoSuccess).toHaveBeenCalledTimes(1);

    expect(mockUfoFailure).not.toHaveBeenCalled();
  });

  it('should start experience when DatasourceTableView gets re-rendered', async () => {
    const { rerender } = setup({
      status: 'loading',
    });

    const newParameters = {
      cloudId: 'new-cloud-id',
      jql: 'some-jql-query',
    };

    rerender(
      <IntlProvider locale="en">
        <DatasourceTableView
          datasourceId={'some-datasource-id'}
          parameters={newParameters}
          visibleColumnKeys={[
            'visible-column-1',
            'visible-column-2',
            'visible-column-3',
          ]}
        />
      </IntlProvider>,
    );

    expect(mockUfoStart).toHaveBeenCalledTimes(2);
  });

  it('should not start experience when DatasourceTableView gets re-rendered but hook status is resolved', async () => {
    const { rerender } = setup({
      status: 'loading',
    });

    const newParameters = {
      cloudId: 'new-cloud-id',
      jql: 'some-jql-query',
    };

    setup();

    rerender(
      <IntlProvider locale="en">
        <DatasourceTableView
          datasourceId={'some-datasource-id'}
          parameters={newParameters}
          visibleColumnKeys={['visible-column-1']}
        />
      </IntlProvider>,
    );

    expect(mockUfoStart).toHaveBeenCalledTimes(1);
  });

  it('should mark as a failed experience when DatasourceTableView request fails', async () => {
    setup({
      status: 'rejected',
    });

    expect(mockUfoFailure).toHaveBeenCalled();
    expect(mockUfoFailure).toHaveBeenCalledTimes(1);

    expect(mockUfoSuccess).not.toHaveBeenCalled();
  });

  it('should mark as a failed experience when DatasourceTableView data request returns unauthorised response', async () => {
    setup({
      status: 'unauthorized',
    });

    expect(mockUfoSuccess).toHaveBeenCalled();
    expect(mockUfoSuccess).toHaveBeenCalledTimes(1);

    expect(mockUfoFailure).not.toHaveBeenCalled();
  });

  it('should abort the experience when DatasourceTableView results are empty', async () => {
    setup({
      responseItems: [],
    });

    expect(mockUfoSuccess).toHaveBeenCalled();
    expect(mockUfoSuccess).toHaveBeenCalledTimes(1);

    expect(mockUfoFailure).not.toHaveBeenCalled();
  });
});
