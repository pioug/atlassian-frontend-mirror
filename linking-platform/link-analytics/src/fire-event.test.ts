import { DatasourceDataResponse } from '@atlaskit/linking-types/datasource';

import { fireDatasourceEvent } from './fire-event';

const analyticsFire = jest.fn();
const createAnalyticsEvent = jest.fn().mockReturnValue({
  fire: analyticsFire,
  context: [],
  hasFired: false,
  clone: () => null,
  _isAnalyticsEvent: true,
  _isUIAnalyticsEvent: true,
  handlers: [() => {}],
  payload: {},
  update: () => {},
});

const data: DatasourceDataResponse = {
  data: { items: [{}], totalCount: 1 },
  meta: {
    access: 'granted',
    visibility: 'public',
    extensionKey: 'jira-object-provider',
    destinationObjectTypes: ['issue'],
  },
};

const getDatasourceData = jest.fn(() => Promise.resolve(data));

const datasourceDetails = {
  datasourceId: 'jira-issue-id',
  parameters: {
    jql: '',
  },
};

describe('fireDatasourceEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fire datasource event', async () => {
    await fireDatasourceEvent(
      'updated',
      createAnalyticsEvent,
      getDatasourceData,
    )(datasourceDetails, null, {});

    expect(analyticsFire).toHaveBeenCalledTimes(1);
  });

  it('should call getDatasourceData with correct arguments', async () => {
    await fireDatasourceEvent(
      'updated',
      createAnalyticsEvent,
      getDatasourceData,
    )(datasourceDetails, null, {});

    expect(getDatasourceData).toHaveBeenCalledWith('jira-issue-id', {
      fields: [],
      includeSchema: true,
      pageSize: 20,
      parameters: { jql: '' },
    });
  });

  it('should fire datasource created and macro inserted event if jira datasource', async () => {
    await fireDatasourceEvent(
      'created',
      createAnalyticsEvent,
      getDatasourceData,
    )(datasourceDetails, null, {});

    const datasourceAnalyticCall = createAnalyticsEvent.mock.calls[0][0];
    expect(datasourceAnalyticCall.eventType).toEqual('track');
    expect(datasourceAnalyticCall.actionSubject).toEqual('datasource');

    const jlolAnalyticCall = createAnalyticsEvent.mock.calls[1][0];
    expect(jlolAnalyticCall.eventType).toEqual('track');
    expect(jlolAnalyticCall.actionSubject).toEqual('macro');
    expect(jlolAnalyticCall.actionSubjectId).toEqual('jlol');

    expect(createAnalyticsEvent).toHaveBeenCalledTimes(2);
    expect(analyticsFire).toHaveBeenCalledTimes(2);
  });
});
