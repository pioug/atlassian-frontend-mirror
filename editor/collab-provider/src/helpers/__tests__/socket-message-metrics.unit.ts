import {
  SocketMessageMetrics,
  WEBSOCKET_MESSAGE_VOLUME_METRIC_SEND_INTERVAL_MS,
} from '../../helpers/socket-message-metrics';
import { createSocketIOSocket } from '../../socket-io-provider';
import AnalyticsHelper from '../../analytics/analytics-helper';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';

describe('SocketMessageMetrics', () => {
  it('setup and cleanup', () => {
    let fakeAnalyticsWebClient: AnalyticsWebClient = {
      sendOperationalEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendUIEvent: jest.fn(),
    };

    const fakeDocumentAri =
      'ari:cloud:confluence:a436116f-02ce-4520-8fbb-7301462a1674:page/1731046230';
    const url = 'http://localhost:8080/ccollab/sessionId/123';
    const analyticsHelper = new AnalyticsHelper(
      fakeDocumentAri,
      fakeAnalyticsWebClient,
    );
    jest.useFakeTimers();

    const sendActionEventSpy = jest.spyOn(
      AnalyticsHelper.prototype,
      'sendActionEvent',
    );

    const socket = createSocketIOSocket(url);
    const socketMessageMetrics = new SocketMessageMetrics(
      socket,
      analyticsHelper,
    );

    socketMessageMetrics.setupSocketMessageMetrics();

    socketMessageMetrics.socketMessageMetricsListener('test', 'test');

    jest.advanceTimersByTime(WEBSOCKET_MESSAGE_VOLUME_METRIC_SEND_INTERVAL_MS);

    expect(sendActionEventSpy).toHaveBeenCalledTimes(1);
    expect(sendActionEventSpy).toHaveBeenCalledWith(
      'websocketMessageVolumeMetric',
      'INFO',
      {
        resetReason: undefined,
        messageCount: 1,
        totalMessageSize: 8,
      },
    );

    // @ts-ignore private method
    expect(socketMessageMetrics.metricsIntervalID).toBeDefined();

    socketMessageMetrics.closeSocketMessageMetrics();
    // @ts-ignore private method
    expect(socketMessageMetrics.metricsIntervalID).toBeUndefined();
  });
});
