import { utils } from '@atlaskit/util-service-support';
// TODO: Validate if this is actually equivalent to the AnalyticsWebClient in @atlassiansox/analytics-web-client
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { Emitter } from './emitter';
import { ErrorCodeMapper } from './error-code-mapper';
import type {
  Config,
  Socket,
  ChannelEvent,
  StepsPayload,
  InitPayload,
  TelepointerPayload,
  CatchupResponse,
  PresencePayload,
  Metadata,
  ErrorPayload,
  NamespaceStatus,
} from './types';
import { createLogger, getProduct, getSubProduct } from './helpers/utils';
import {
  MEASURE_NAME,
  startMeasure,
  stopMeasure,
} from './analytics/performance';
import { triggerAnalyticsEvent } from './analytics';
import { EVENT_ACTION, EVENT_STATUS } from './helpers/const';
import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
  UFOExperience,
} from '@atlaskit/ufo';

const logger = createLogger('Channel', 'green');

export class Channel extends Emitter<ChannelEvent> {
  private connected: boolean = false;
  private config: Config;
  private socket: Socket | null = null;

  private initialized: boolean = false;
  private analyticsClient?: AnalyticsWebClient;
  private initExperience = new UFOExperience('collab-provider.document-init', {
    type: ExperienceTypes.Load,
    performanceType: ExperiencePerformanceTypes.Custom,
    performanceConfig: {
      histogram: {
        [ExperiencePerformanceTypes.Custom]: {
          duration: '250_500_1000_1500_2000_3000_4000',
        },
      },
    },
  });

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
    startMeasure(MEASURE_NAME.SOCKET_CONNECT);
    if (!this.initialized) {
      startMeasure(MEASURE_NAME.DOCUMENT_INIT);
      this.initExperience.start();
    }
    const { documentAri, url } = this.config;
    const { createSocket } = this.config;
    const { permissionTokenRefresh } = this.config;

    let authCb = null;
    if (permissionTokenRefresh) {
      authCb = (cb: (data: object) => void) => {
        permissionTokenRefresh()
          .then((token) => {
            cb({
              // The permission token.
              ...(token ? { token } : {}),
              // The initialized status. If false, BE will send document, otherwise not.
              initialized: this.initialized,
              // ESS-1009 Allow to opt-in into 404 response
              need404: this.config.need404,
            });
          })
          .catch((err) => {
            this.emit('error', err);
          });
      };
    } else {
      authCb = (cb: (data: object) => void) => {
        cb({
          // The initialized status. If false, BE will send document, otherwise not.
          initialized: this.initialized,
          // ESS-1009 Allow to opt-in into 404 response
          need404: this.config.need404,
        });
      };
    }
    this.socket = createSocket(
      `${url}/session/${documentAri}`,
      authCb,
      this.config.productInfo,
    );

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
    this.socket.on('presence:joined', (data: PresencePayload) => {
      this.emit('presence:joined', data);
    });
    this.socket.on('presence', (data: PresencePayload) => {
      this.emit('presence', data);
    });
    this.socket.on('participant:left', (data: PresencePayload) => {
      this.emit('participant:left', data);
    });
    this.socket.on(
      'participant:updated',
      ({
        sessionId,
        timestamp,
        data,
        clientId,
      }: PresencePayload & { data: { userId: string } }) => {
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

    // ESS-2916 namespace status event - lock/unlock
    this.socket.on('status', (data: NamespaceStatus) => {
      this.emit('status', data);
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
      const measure = stopMeasure(MEASURE_NAME.SOCKET_CONNECT);
      triggerAnalyticsEvent(
        {
          eventAction: EVENT_ACTION.CONNECTION,
          attributes: {
            eventStatus: EVENT_STATUS.FAILURE,
            error: error as ErrorPayload,
            latency: measure?.duration,
            documentAri: this.config.documentAri,
          },
        },
        this.analyticsClient,
      );
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
    const measure = stopMeasure(MEASURE_NAME.SOCKET_CONNECT);
    triggerAnalyticsEvent(
      {
        eventAction: EVENT_ACTION.CONNECTION,
        attributes: {
          eventStatus: EVENT_STATUS.SUCCESS,
          latency: measure?.duration,
          documentAri: this.config.documentAri,
        },
      },
      this.analyticsClient,
    );

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
        const measure = stopMeasure(MEASURE_NAME.DOCUMENT_INIT);
        this.initExperience.success();
        triggerAnalyticsEvent(
          {
            eventAction: EVENT_ACTION.DOCUMENT_INIT,
            attributes: {
              eventStatus: EVENT_STATUS.SUCCESS, // TODO: detect when document init fails and fire corresponding event for it
              latency: measure?.duration,
              documentAri: this.config.documentAri,
              requiredPageRecovery: data?.requiredPageRecovery,
              ttlEnabled: data?.ttlEnabled,
            },
          },
          this.analyticsClient,
        );

        const { doc, version, userId, metadata }: InitPayload = data;
        this.initialized = true;
        this.emit('init', {
          doc,
          version,
          userId,
          metadata,
        });
      } else {
        // Page is been just restored, need to fix all the participants as well.
        const { doc, version, userId, metadata }: InitPayload = data;
        this.emit('restore', {
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
      const { doc, version, stepMaps, metadata } =
        await utils.requestService<any>(this.config, {
          path: `document/${encodeURIComponent(
            this.config.documentAri,
          )}/catchup`,
          queryParams: {
            version: fromVersion,
          },
          requestInit: {
            headers: {
              ...(this.config.permissionTokenRefresh
                ? {
                    'x-token':
                      (await this.config.permissionTokenRefresh()) ?? undefined,
                  }
                : {}),
              'x-product': getProduct(this.config.productInfo),
              'x-subproduct': getSubProduct(this.config.productInfo),
            },
          },
        });
      return {
        doc,
        version,
        stepMaps,
        metadata,
      };
    } catch (error: any) {
      logger("Can't fetch the catchup", error.message);
      const errorCatchup: ErrorPayload = {
        message: ErrorCodeMapper.catchupFail.message,
        data: {
          status: error.status,
          code: ErrorCodeMapper.catchupFail.code,
        },
      };
      this.emit('error', errorCatchup);
      return {};
    }
  }

  /**
   * Send message to service. Timestamp will be added server side.
   */
  broadcast<K extends keyof ChannelEvent>(
    type: K,
    data: Omit<ChannelEvent[K], 'timestamp'>,
    callback?: Function,
  ) {
    if (!this.connected || !this.socket) {
      return;
    }

    this.socket.emit('broadcast', { type, ...data }, callback);
  }

  sendMetadata(metadata: Metadata) {
    if (!this.connected || !this.socket) {
      return;
    }
    this.socket.emit('metadata', metadata);
  }

  sendPresenceJoined() {
    if (!this.connected || !this.socket) {
      return;
    }
    this.socket.emit('presence:joined');
  }

  disconnect() {
    this.unsubscribeAll();

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
