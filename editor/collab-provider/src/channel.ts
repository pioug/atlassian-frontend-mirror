import { utils } from '@atlaskit/util-service-support';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { Emitter } from './emitter';
import { ErrorCodeMapper } from './error-code-mapper';
import { Config, Socket } from './types';
import { createLogger } from './helpers/utils';
import { startMeasure, stopMeasure } from './analytics/performance';
import { triggerAnalyticsForCatchupSuccessfulWithLatency } from './analytics';

const logger = createLogger('Channel', 'green');

export interface Metadata {
  [key: string]: string | number | boolean;
}

export type InitPayload = {
  doc: any;
  version: number;
  userId?: string;
  metadata?: Metadata;
};

export type ParticipantPayload = {
  sessionId: string;
  userId: string;
  clientId: string;
  timestamp: number;
};

export type TelepointerPayload = ParticipantPayload & {
  selection: {
    type: 'textSelection' | 'nodeSelection';
    anchor: number;
    head: number;
  };
};

export type StepJson = {
  from?: number;
  to?: number;
  stepType?: string;
  clientId: string;
  userId: string;
};

export type StepsPayload = {
  version: number;
  steps: StepJson[];
};

export type ErrorPayload = {
  message: string;
  data?: {
    status: number;
    code?: string;
    meta?: string;
  };
};

export type ChannelEvent = {
  connected: {
    sid: string;
    initialized: boolean;
  };
  init: InitPayload;
  reconnected: null;
  'participant:joined': ParticipantPayload;
  'participant:left': ParticipantPayload;
  'participant:telepointer': TelepointerPayload;
  'participant:updated': ParticipantPayload;
  'steps:commit': StepsPayload & { userId: string };
  'steps:added': StepsPayload;
  'metadata:changed': Metadata;
  error: ErrorPayload;
  disconnect: { reason: string };
};

export interface CatchupResponse {
  doc?: string;
  version?: number;
  stepMaps?: any[];
  metadata?: Metadata;
}

export class Channel extends Emitter<ChannelEvent> {
  private connected: boolean = false;
  private config: Config;
  private socket: Socket | null = null;

  private initialized: boolean = false;
  private analyticsClient?: AnalyticsWebClient;

  constructor(config: Config) {
    super();
    this.config = config;
    if (config.analyticsClient) {
      this.analyticsClient = config.analyticsClient;
    }
  }

  // read-only getters used for tests
  getInitialized = () => this.initialized;
  getConnected = () => this.connected;
  getSocket = () => this.socket;

  /**
   * Connect to collab service using websockets
   */
  connect() {
    const { documentAri, url } = this.config;
    const { createSocket } = this.config;
    const { permissionTokenRefresh } = this.config;
    if (permissionTokenRefresh) {
      const authCb = (cb: (data: object) => void) => {
        permissionTokenRefresh()
          .then((token) => {
            cb({
              // The permission token.
              token,
              // The initialized status. If false, BE will send document, otherwise not.
              initialized: this.initialized,
            });
          })
          .catch((err) => {
            this.emit('error', err);
          });
      };
      this.socket = createSocket(`${url}/session/${documentAri}`, authCb);
    } else {
      const authCb = (cb: (data: object) => void) => {
        cb({
          // The initialized status. If false, BE will send document, otherwise not.
          initialized: this.initialized,
        });
      };
      this.socket = createSocket(`${url}/session/${documentAri}`, authCb);
    }

    // Due to https://github.com/socketio/socket.io-client/issues/1473,
    // reconnect no longer fired on the socket.
    // We should use `connect` for better cross platform compatibility(Mobile/Web).
    this.socket.on('connect', this.onConnect);
    this.socket.on('data', this.onReceiveData);
    this.socket.on('steps:added', (data: StepsPayload) => {
      this.emit('steps:added', data);
    });
    this.socket.on(
      'participant:telepointer',
      (payload: { data: TelepointerPayload }) => {
        this.emit('participant:telepointer', payload.data);
      },
    );
    this.socket.on('participant:joined', (data: ParticipantPayload) => {
      this.emit('participant:joined', data);
    });
    this.socket.on('participant:left', (data: ParticipantPayload) => {
      this.emit('participant:left', data);
    });
    this.socket.on(
      'participant:updated',
      ({
        sessionId,
        timestamp,
        data,
        clientId,
      }: ParticipantPayload & { data: { userId: string } }) => {
        this.emit('participant:updated', {
          sessionId,
          timestamp,
          clientId,
          ...data,
        });
      },
    );
    this.socket.on('metadata:changed', (payload: Metadata) => {
      this.emit('metadata:changed', payload);
    });
    this.socket.on('disconnect', async (reason: string) => {
      this.connected = false;
      logger(`disconnect reason: ${reason}`);
      this.emit('disconnect', { reason });
      if (reason === 'io server disconnect' && this.socket) {
        // The disconnection was initiated by the server, we need to reconnect manually.
        this.socket.connect();
      }
    });

    // Socket error, including errors from `packetMiddleware`, `controllers` and `onconnect` and more. Paramter is a plain JSON object.
    this.socket.on('error', (error: ErrorPayload) => {
      this.emit('error', error);
    });

    // `connect_error`'s paramter type is `Error`.
    // Ensure the error emit to the provider has the same structure, so we can handle them unified.
    this.socket.on('connect_error', (error: Error) => {
      // If error received with `data`, it means the connection is rejected
      // by the server on purpose for example no permission, so no need to
      // keep the underneath connection, need to close. But some error like
      // `xhr polling error` needs to retry.
      if (!!(error as ErrorPayload).data) {
        this.socket?.close();
      }
      this.emit('error', {
        message: error.message,
        data: (error as ErrorPayload).data,
      });
    });
  }

  private onConnect = () => {
    this.connected = true;
    logger('Connected.', this.socket!.id);

    this.emit('connected', {
      sid: this.socket!.id,
      initialized: this.initialized,
    });
  };

  private onReceiveData = (data: any) => {
    logger('Received data', data);

    logger('Session ID is', this.socket!.id);

    if (data.type === 'initial') {
      if (!this.initialized) {
        const { doc, version, userId, metadata }: InitPayload = data;
        this.initialized = true;
        this.emit('init', {
          doc,
          version,
          userId,
          metadata,
        });
      }
    } else {
      this.emit('steps:added', data);
    }
  };

  async fetchCatchup(fromVersion: number): Promise<CatchupResponse> {
    try {
      startMeasure('callingCatchupApi');
      const { doc, version, stepMaps, metadata } = await utils.requestService<
        any
      >(this.config, {
        path: `document/${encodeURIComponent(this.config.documentAri)}/catchup`,
        queryParams: {
          version: fromVersion,
        },
        ...(this.config.permissionTokenRefresh
          ? {
              requestInit: {
                headers: {
                  'x-token': await this.config.permissionTokenRefresh(),
                },
              },
            }
          : {}),
      });
      return {
        doc,
        version,
        stepMaps,
        metadata,
      };
    } catch (err) {
      logger("Can't fetch the catchup", err.message);
      const errorCatchup: ErrorPayload = {
        message: ErrorCodeMapper.catchupFail.message,
        data: {
          status: err.status,
          code: ErrorCodeMapper.catchupFail.code,
        },
      };
      this.emit('error', errorCatchup);
      return {};
    } finally {
      stopMeasure('callingCatchupApi', (duration, _) => {
        triggerAnalyticsForCatchupSuccessfulWithLatency(
          this.analyticsClient,
          duration,
        );
      });
    }
  }

  /**
   * Send message to service. Timestamp will be added server side.
   */
  broadcast<K extends keyof ChannelEvent>(
    type: K,
    data: Omit<ChannelEvent[K], 'timestamp'>,
  ) {
    if (!this.connected || !this.socket) {
      return;
    }

    this.socket.emit('broadcast', { type, ...data });
  }

  sendMetadata(metadata: Metadata) {
    if (!this.connected || !this.socket) {
      return;
    }
    this.socket.emit('metadata', metadata);
  }

  disconnect() {
    this.unsubscribeAll();

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
