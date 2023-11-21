import React from 'react';

import { renderHook, RenderHookOptions } from '@testing-library/react-hooks';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { captureException } from '@atlaskit/linking-common/sentry';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { EVENT_CHANNEL } from '../../analytics';
import useErrorLogger from '../useErrorLogger';

jest.mock('@atlaskit/platform-feature-flags', () => {
  const originalModule = jest.requireActual('@atlaskit/platform-feature-flags');
  return {
    ...originalModule,
    getBooleanFF: jest.fn(),
  };
});

jest.mock('@atlaskit/linking-common/sentry', () => {
  const originalModule = jest.requireActual('@atlaskit/link-client-extension');
  return {
    ...originalModule,
    captureException: jest.fn(),
  };
});

const onAnalyticFireEvent = jest.fn();

describe('useErrorLogger', () => {
  const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
    <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
      {children}
    </AnalyticsListener>
  );

  const setup = (fields?: string[]) => {
    const { result, waitForNextUpdate, rerender } = renderHook(
      () => useErrorLogger(),
      { wrapper },
    );

    return {
      result,
      waitForNextUpdate,
      rerender,
    };
  };

  beforeEach(() => {
    asMock(onAnalyticFireEvent).mockReset();
    asMock(captureException).mockReset();
  });

  ffTest('platform.linking-platform.datasources.enable-sentry-client', () => {
    const { result } = setup();

    const response = new Response(null, {
      status: 500,
      headers: { 'x-trace-id': 'mock-trace-id' },
    });

    result.current.captureError('someFunction', response);

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          action: 'operationFailed',
          actionSubject: 'datasource',
          eventType: 'operational',
          attributes: {
            errorLocation: 'someFunction',
            status: 500,
            traceId: 'mock-trace-id',
          },
        },
      },
      EVENT_CHANNEL,
    );
    expect(captureException).toHaveBeenCalledTimes(0);
  });

  ffTest(
    'platform.linking-platform.datasources.enable-sentry-client',
    () => {
      const { result } = setup();

      const mockError = new Error('mockError');

      result.current.captureError('someFunction', mockError);

      expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'operationFailed',
            actionSubject: 'datasource',
            eventType: 'operational',
            attributes: {
              errorLocation: 'someFunction',
              status: null,
              traceId: null,
            },
          },
        },
        EVENT_CHANNEL,
      );
      expect(captureException).toHaveBeenCalledWith(
        mockError,
        'link-datasource',
      );
    },
    () => {
      const { result } = setup();

      const mockError = new Error('mockError');

      result.current.captureError('someFunction', mockError);

      expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
        {
          payload: {
            action: 'operationFailed',
            actionSubject: 'datasource',
            eventType: 'operational',
            attributes: {
              errorLocation: 'someFunction',
              status: null,
              traceId: null,
            },
          },
        },
        EVENT_CHANNEL,
      );
      expect(captureException).toHaveBeenCalledTimes(0);
    },
  );
});
