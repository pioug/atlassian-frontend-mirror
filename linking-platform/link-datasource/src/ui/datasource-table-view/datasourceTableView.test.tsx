import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { EVENT_CHANNEL } from '../../analytics';
import {
  DatasourceTableState,
  useDatasourceTableState,
} from '../../hooks/useDatasourceTableState';

import { DatasourceTableView } from './datasourceTableView'; // Using async one to test lazy integration at the same time

jest.mock('../../hooks/useDatasourceTableState');

const onAnalyticFireEvent = jest.fn();

const setup = (overrides: Partial<DatasourceTableState> = {}) => {
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
    columns: [
      { key: 'myColumn', title: 'My Column', type: 'string' },
      { key: 'id' },
    ],
    defaultVisibleColumnKeys: ['myColumn'],
    ...overrides,
  } as DatasourceTableState);

  return { mockReset };
};

const renderComponent = ({
  visibleColumnKeys = ['visible-column-1', 'visible-column-2'],
  onVisibleColumnKeysChange = jest.fn(),
}: {
  visibleColumnKeys?: string[];
  onVisibleColumnKeysChange?: (visibleColumnKeys: string[]) => void;
} = {}) =>
  render(
    <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
      <IntlProvider locale="en">
        <DatasourceTableView
          datasourceId={'some-datasource-id'}
          parameters={{
            cloudId: 'some-cloud-id',
            jql: 'some-jql-query',
          }}
          visibleColumnKeys={visibleColumnKeys}
          onVisibleColumnKeysChange={onVisibleColumnKeysChange}
        />
      </IntlProvider>
    </AnalyticsListener>,
  );

describe('DatasourceTableView', () => {
  it('should call useDatasourceTableState with the correct arguments', () => {
    setup();
    renderComponent();

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
    setup();
    const { getByTestId } = renderComponent({
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
    setup();
    const onVisibleColumnKeysChange = jest.fn();
    const { getByTestId } = render(
      <IntlProvider locale="en">
        <DatasourceTableView
          datasourceId={'some-datasource-id'}
          parameters={{
            cloudId: 'some-cloud-id',
            jql: 'some-jql-query',
          }}
          onVisibleColumnKeysChange={onVisibleColumnKeysChange}
        />
      </IntlProvider>,
    );

    expect(getByTestId('myColumn-column-heading')).toHaveTextContent(
      'My Column',
    );
    expect(onVisibleColumnKeysChange).toHaveBeenCalledWith(['myColumn']);
  });

  it('should NOT call onVisibleColumnKeysChange with defaultVisibleColumnKeys if visibleColumnKeys are received from props', () => {
    setup();
    const onVisibleColumnKeysChange = jest.fn();
    renderComponent({
      visibleColumnKeys: ['myColumn'],
      onVisibleColumnKeysChange,
    });

    expect(onVisibleColumnKeysChange).not.toHaveBeenCalled();
  });

  it('should NOT call onVisibleColumnKeysChange with defaultVisibleColumnKeys if no defaultVisibleColumnKeys are returned from hook', () => {
    setup({
      defaultVisibleColumnKeys: [],
    });
    const onVisibleColumnKeysChange = jest.fn();
    renderComponent({
      onVisibleColumnKeysChange,
    });

    expect(onVisibleColumnKeysChange).not.toHaveBeenCalled();
  });

  it('should wait for data AND columns before rendering table', () => {
    setup({
      columns: [],
    });

    const { queryByTestId } = renderComponent({
      visibleColumnKeys: ['myColumn'],
    });

    expect(queryByTestId('datasource-table-view')).toBe(null);
    expect(queryByTestId('datasource-table-view-skeleton')).toBeInTheDocument();
  });

  it('should render table footer', () => {
    setup();
    const { getByTestId } = renderComponent();

    expect(getByTestId('table-footer')).toBeInTheDocument();
  });

  it('should not call reset() on initial load (only when parameters change)', () => {
    const { mockReset } = setup();
    renderComponent();
    expect(mockReset).not.toHaveBeenCalled();
  });

  it('should call reset() when parameters change', () => {
    const { mockReset } = setup();
    const { rerender } = renderComponent();

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
    const { mockReset } = setup();
    const { getByRole } = renderComponent();

    asMock(mockReset).mockReset();

    getByRole('button', { name: 'Refresh' }).click();

    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(mockReset).toHaveBeenCalledWith(true);
  });

  describe('when results are not returned', () => {
    it('should show no results if no responseItems are returned', () => {
      const { mockReset } = setup({ responseItems: [] });
      const { getByRole, getByText } = renderComponent();

      expect(getByText('No results found')).toBeInTheDocument();

      getByRole('button', { name: 'Refresh' }).click();
      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('when an error on /data request occurs', () => {
    it('should show an error message on request failure', () => {
      const { mockReset } = setup({ status: 'rejected' });
      const { getByRole, getByText } = renderComponent();

      expect(getByText('Unable to load issues')).toBeInTheDocument();

      getByRole('button', { name: 'Refresh' }).click();
      expect(mockReset).toHaveBeenCalledTimes(1);
    });

    it('should show an unauthorized message on 403 response', () => {
      setup({ status: 'unauthorized' });
      const { getByText } = renderComponent();

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
    setup({ responseItems: [] });
    renderComponent();

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
    setup({ status: 'unauthorized' });
    renderComponent();

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
    setup({ status: 'rejected' });
    renderComponent();

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
});
