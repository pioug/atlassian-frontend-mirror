import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { CardErrorBoundary } from '../../../../react/nodes/fallback';

const MockedUnsupportedInline = () => <div>UnsupportedInline</div>;
const url =
  'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424';

describe('Renderer - Fallback analytics', () => {
  const EVENT_CHANNEL = 'media';

  const renderFailedPayload = {
    payload: {
      action: 'renderFailure',
      actionSubject: 'datasource',
      actionSubjectId: undefined,
      attributes: {
        reason: 'internal',
      },
      eventType: 'operational',
    },
    context: [
      {
        component: 'datasource',
      },
    ],
  };

  const setup = async (renderComponent: React.ReactNode, url?: string) => {
    const onAnalyticFireEvent = jest.fn();

    render(
      <AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
        <CardErrorBoundary
          url={url}
          unsupportedComponent={MockedUnsupportedInline}
          isDatasource={true}
        >
          {renderComponent}
        </CardErrorBoundary>
      </AnalyticsListener>,
    );

    await waitFor(() => {
      expect(onAnalyticFireEvent).toHaveBeenCalled();
    });

    return onAnalyticFireEvent;
  };

  const ErrorChild = () => {
    throw new Error('Error');
  };

  it('fires datasource renderFailed event when error is caught by boundary', async () => {
    const onAnalyticFireEvent = await setup(<ErrorChild />, url);

    expect(onAnalyticFireEvent).toHaveBeenCalledTimes(1);
    expect(onAnalyticFireEvent).toBeCalledWith(
      expect.objectContaining(renderFailedPayload),
      EVENT_CHANNEL,
    );
  });

  it('fires datasource renderFailed event when error is caught by boundary and unsafe URL provided', async () => {
    const unsafeUrl = 'javascript:alert(1)';

    const onAnalyticFireEvent = await setup(<ErrorChild />, unsafeUrl);

    expect(onAnalyticFireEvent).toHaveBeenCalledTimes(1);
    expect(onAnalyticFireEvent).toBeCalledWith(
      expect.objectContaining(renderFailedPayload),
      EVENT_CHANNEL,
    );
  });
});
