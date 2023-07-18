import AnalyticsHelper from '../analytics/analytics-helper';
import { EVENT_ACTION, EVENT_STATUS } from './const';
import type { Socket } from 'socket.io-client';
import { createLogger } from './utils';

const logger = createLogger('SocketMessageMetrics', 'green');
export const WEBSOCKET_MESSAGE_VOLUME_METRIC_SEND_INTERVAL_MS = 60000;
export class SocketMessageMetrics {
  private messageCount = 0;
  private totalMessageSize = 0;
  private metricsIntervalID: number | undefined = undefined;
  private socket: Socket;
  private analyticsHelper: AnalyticsHelper;

  constructor(socket: Socket, analyticsHelper: AnalyticsHelper) {
    this.socket = socket;
    this.analyticsHelper = analyticsHelper;
  }

  socketMessageMetricsListener = (event: any, ...args: any[]) => {
    this.messageCount++;
    this.totalMessageSize += Buffer.byteLength(JSON.stringify(args), 'utf8');
  };

  setupSocketMessageMetrics = () => {
    if (this.metricsIntervalID !== undefined) {
      logger(
        'calling setupSocketMessageMetrics function with metricsIntervalID that is not undefined',
      );
      return;
    }

    this.socket.onAnyOutgoing(this.socketMessageMetricsListener);

    // send metrics every 60 seconds
    this.metricsIntervalID = window.setInterval(() => {
      this.analyticsHelper!.sendActionEvent(
        EVENT_ACTION.WEBSOCKET_MESSAGE_VOLUME_METRIC,
        EVENT_STATUS.INFO,
        {
          messageCount: this.messageCount,
          totalMessageSize: this.totalMessageSize,
        },
      );

      this.messageCount = 0;
      this.totalMessageSize = 0;
    }, WEBSOCKET_MESSAGE_VOLUME_METRIC_SEND_INTERVAL_MS);
  };

  closeSocketMessageMetrics = () => {
    clearInterval(this.metricsIntervalID);
    this.metricsIntervalID = undefined;
    this.socket.offAnyOutgoing(this.socketMessageMetricsListener);
  };
}
