import React from 'react';
import { JsonLd } from 'json-ld-types';
import { mocked } from 'ts-jest/utils';
import { renderHook } from '@testing-library/react-hooks';
import {
  CardContext,
  SmartCardProvider,
  useSmartLinkContext,
} from '@atlaskit/link-provider';
import { CardState } from '@atlaskit/linking-common';

import { useSmartLinkAnalytics } from '../../analytics/useSmartLinkAnalytics';
import { JiraIssue } from '../../../../examples-helpers/_jsonLDExamples/provider.jira';
import { useSmartCardActions } from '../index';
import { mockGetContext } from './index.test.mock';
import { SmartLinkStatus } from '../../../constants';
import { mocks } from '../../../utils/mocks';

jest.mock('@atlaskit/link-provider', () => ({
  ...jest.requireActual<Object>('@atlaskit/link-provider'),
  useSmartLinkContext: jest.fn(),
}));

describe('with actionable element experiment', () => {
  const id = 'analytics-id';
  const dispatchAnalytics = jest.fn();
  let mockContext: CardContext;

  const flush = () => new Promise((resolve) => process.nextTick(resolve));

  const mockState = (url: string, state: CardState) => {
    mockContext.store.getState = jest.fn().mockImplementation(() => ({
      [url]: state,
    }));
  };

  const mockFetchData = (response: JsonLd.Response | undefined) => {
    mockContext.connections.client.fetchData = jest
      .fn()
      .mockImplementation(() => Promise.resolve(response));
  };

  const renderUseSmartCardActions = (url: string) =>
    renderHook(
      () => {
        const analytics = useSmartLinkAnalytics(url, dispatchAnalytics, id);
        return useSmartCardActions(id, url, analytics);
      },
      {
        wrapper: ({ children }) => (
          <SmartCardProvider>{children}</SmartCardProvider>
        ),
      },
    );

  beforeEach(() => {
    mockContext = mockGetContext();
    mocked(useSmartLinkContext).mockImplementation(() => mockContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not send analytics event on reload', async () => {
    const url = 'https://some/url';
    mockState(url, {
      details: mocks.success,
      status: SmartLinkStatus.Resolved,
    });
    mockFetchData(mocks.success);

    const { result } = renderUseSmartCardActions(url);
    result.current?.reload();
    await flush();

    expect(mockContext.connections.client.fetchData).toHaveBeenCalledTimes(1);
    expect(dispatchAnalytics).not.toHaveBeenCalled();
  });

  it('sends analytics event on Jira issue link reload', async () => {
    // Set existing state before reload
    const url = JiraIssue.data.url;
    const details = JiraIssue as JsonLd.Response;
    mockState(url, { details, status: SmartLinkStatus.Resolved });

    // Set reload fetch response
    mockFetchData({
      ...details,
      data: {
        ...details.data,
        tag: { name: 'Done' },
      },
    } as JsonLd.Response);

    const { result } = renderUseSmartCardActions(url);
    result.current?.reload();
    await flush();

    expect(mockContext.connections.client.fetchData).toHaveBeenCalledTimes(1);
    expect(dispatchAnalytics).toHaveBeenCalledWith({
      action: 'updated',
      actionSubject: 'link',
      actionSubjectId: 'jiraIssueStatus',
      eventType: 'track',
      attributes: {
        componentName: 'smart-cards',
        packageName: '@atlaskit/smart-card',
        packageVersion: '999.9.9',
        id: 'analytics-id',
        definitionId: 'jira-object-provider',
        extensionKey: 'jira-object-provider',
        resourceType: 'issue',
        destinationProduct: 'jira',
        previousJiraStatus: 'In Progress',
        jiraStatus: 'Done',
      },
    });
  });
});
