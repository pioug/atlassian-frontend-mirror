import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
  mockDatasourceDataResponseWithSchema,
  mockDatasourceDetailsResponse,
  useDatasourceClientExtension,
} from '@atlaskit/link-client-extension';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import SmartLinkClient from '../../../../../examples-helpers/smartLinkCustomClient';
import { EVENT_CHANNEL } from '../../../../analytics';
import { getAvailableJiraSites } from '../../../../services/getAvailableJiraSites';
import JiraIssuesConfigModal from '../../index';

jest.mock('../../../../services/getAvailableJiraSites', () => ({
  getAvailableJiraSites: jest.fn(),
}));

jest.mock('@atlaskit/link-client-extension', () => {
  const originalModule = jest.requireActual('@atlaskit/link-client-extension');
  return {
    ...originalModule,
    useDatasourceClientExtension: jest.fn(),
  };
});

const getDefaultParameters = () => ({
  cloudId: '67899',
  jql: 'some-query',
});

// this test file doesn't mock the useDatasourceTableState hook
// use it if you need to test real execution of the hook
describe('integration test', () => {
  let getDatasourceDetails: jest.Mock = jest.fn();
  let getDatasourceData: jest.Mock = jest.fn();

  const setup = async () => {
    const onCancel = jest.fn();
    const onInsert = jest.fn();
    const onAnalyticFireEvent = jest.fn();

    asMock(getAvailableJiraSites).mockResolvedValue(mockSiteData);
    asMock(useDatasourceClientExtension).mockReturnValue({
      getDatasourceDetails,
      getDatasourceData,
    });

    const { findByTestId, debug } = render(
      <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
        <IntlProvider locale="en">
          <SmartCardProvider client={new SmartLinkClient()}>
            <JiraIssuesConfigModal
              datasourceId={'some-jira-jql-datasource-id'}
              parameters={getDefaultParameters()}
              onCancel={onCancel}
              onInsert={onInsert}
              visibleColumnKeys={['assignee']}
            />
          </SmartCardProvider>
        </IntlProvider>
      </AnalyticsListener>,
    );

    return {
      findByTestId,
      debug,
      onAnalyticFireEvent,
    };
  };

  it('should not fire analytics event when user loads column picker', async () => {
    const eventPayload = {
      payload: {
        eventType: 'ui',
        actionSubject: 'table',
        action: 'viewed',
        actionSubjectId: 'datasourceConfigModal',
        attributes: {
          extensionKey: 'jira-object-provider',
          destinationObjectTypes: ['issue'],
          totalItemCount: 1234,
          searchMethod: null,
          displayedColumnCount: 1,
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
    };

    asMock(getDatasourceData).mockResolvedValue(
      mockDatasourceDataResponseWithSchema,
    );

    asMock(getDatasourceDetails).mockResolvedValue({
      ...mockDatasourceDetailsResponse,
      data: {
        schema: {
          properties: [
            {
              key: 'newcol',
              title: 'New Column',
              type: 'string',
            },
          ],
        },
      },
    });

    const { findByTestId, onAnalyticFireEvent } = await setup();
    const columnPicker = await findByTestId('column-picker-trigger-button');

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      eventPayload,
      EVENT_CHANNEL,
    );

    expect(onAnalyticFireEvent).toHaveBeenCalledTimes(3);
    fireEvent.click(columnPicker);

    await findByTestId('column-picker-popup--menu');
    expect(onAnalyticFireEvent).toHaveBeenCalledTimes(3);
    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      eventPayload,
      EVENT_CHANNEL,
    );
  });
});
