import { utils } from '@atlaskit/util-service-support';
import { Emitter } from './emitter';
import { ErrorCodeMapper } from './errors/error-code-mapper';
import type {
  Config,
  ChannelEvent,
  StepsPayload,
  InitAndAuthData,
  InitPayload,
  TelepointerPayload,
  CatchupResponse,
  PresencePayload,
  Metadata,
  ErrorPayload,
  NamespaceStatus,
  AuthCallback,
} from './types';
import { createLogger, getProduct, getSubProduct } from './helpers/utils';
import {
  MEASURE_NAME,
  startMeasure,
  stopMeasure,
} from './analytics/performance';
import { EVENT_ACTION, EVENT_STATUS } from './helpers/const';
import type { Socket } from 'socket.io-client';
import ReconnectHelper from './connectivity/reconnect-helper';
import { UFOExperience } from '@atlaskit/ufo';
import { createDocInitExp } from './analytics/ufo';
import { socketIOReasons } from './disconnected-reason-mapper';
import Network from './connectivity/network';
import AnalyticsHelper from './analytics';
import { NotConnectedError, NotInitializedError } from './errors/error-types';

const logger = createLogger('Channel', 'green');

export class Channel extends Emitter<ChannelEvent> {
  private connected: boolean = false;
  private config: Config;
  private socket: Socket | null = null;
  private reconnectHelper?: ReconnectHelper | null = null;
  private initialized: boolean = false;
  private analyticsHelper?: AnalyticsHelper;
  private initExperience?: UFOExperience;
  private token?: string;
  private network: Network | null = null;

  constructor(config: Config, analyticsHelper: AnalyticsHelper) {
    super();
    this.config = config;
    this.analyticsHelper = analyticsHelper;
    this.initExperience = createDocInitExp(this.analyticsHelper);
  }

  // read-only getters used for tests
  getInitialized = () => this.initialized;
  getConnected = () => this.connected;
  getSocket = () => this.socket;
  getToken = () => this.token;

  private setToken = (value?: string) => {
    if (this.config.cacheToken) {
      this.token = value;
    }
  };
  // sets the token as undefined
  private unsetToken = () => this.setToken();

  /**
   * Connect to collab service using websockets
   */
  connect() {
    startMeasure(MEASURE_NAME.SOCKET_CONNECT, this.analyticsHelper);
    if (!this.initialized) {
      startMeasure(MEASURE_NAME.DOCUMENT_INIT, this.analyticsHelper);
      this.initExperience?.start();
    }
    const { documentAri, url } = this.config;
    const { createSocket } = this.config;
    const { permissionTokenRefresh, cacheToken } = this.config;

    let auth: InitAndAuthData | AuthCallback;
    const authData: InitAndAuthData = {
      // The initialized status. If false, BE will send document, otherwise not.
      initialized: this.initialized,
      // ESS-1009 Allow to opt-in into 404 response
      need404: this.config.need404,
    };

    if (permissionTokenRefresh) {
      auth = async (cb: (data: InitAndAuthData) => void) => {
        // use the cached token if caching in enabled and token valid
        if (cacheToken && this.token) {
          authData.token = this.token;
          cb(authData);
        } else {
          try {
            const token = await permissionTokenRefresh();

            if (token) {
              // save token locally
              this.setToken(token);
              authData.token = token;
            }

            cb(authData);
          } catch (err: any) {
            const newErr: ErrorPayload = {
              message: err.message ? err.message : 'Content not found',
              data: {
                status: 403,
                code: err.data.code
                  ? err.data.code
                  : 'INSUFFICIENT_EDITING_PERMISSION',
                meta: {
                  description: err.data.meta.description
                    ? err.data.meta.description
                    : 'RESOURCE_DELETED',
                  reason: err.data.meta.reason
                    ? err.data.meta.reason
                    : 'RESOURCE_DELETED',
                },
              },
            };
            this.emit('error', newErr);
          }
        }
      };
    } else {
      auth = authData;
    }

    this.socket = createSocket(
      `${url}/session/${documentAri}`,
      auth,
      this.config.productInfo,
    ) as Socket;

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
      if (reason === socketIOReasons.IO_SERVER_DISCONNECT && this.socket) {
        // The disconnection was initiated by the server, we need to reconnect manually.
        try {
          this.socket.connect();
        } catch (error) {
          this.analyticsHelper?.sendErrorEvent(
            error,
            'Error while reconnecting the channel',
          );
          this.emit('error', {
            message: 'Caught error during reconnection.',
            data: {
              status: 500,
              code: 'RECONNECTION_ERROR',
            },
          });
        }
      }
    });

    // Socket error, including errors from `packetMiddleware`, `controllers` and `onconnect` and more. Parameter is a plain JSON object.
    this.socket.on('error', (error: ErrorPayload) => {
      this.emit('error', error);
    });

    // `connect_error`'s parameter type is `Error`.
    // Ensure the error emit to the provider has the same structure, so we can handle them unified.
    this.socket.on('connect_error', this.onConnectError);
    this.socket.on(
      'permission:invalidateToken',
      this.handlePermissionInvalidateToken,
    );

    // To trigger reconnection when browser comes back online
    if (!this.network) {
      this.network = new Network({
        onlineCallback: this.onOnlineHandler,
      });
    }

    // Helper class to track reconnection issues, to emit an error if too many failed reconnection attempts happen
    this.reconnectHelper = new ReconnectHelper();
    // Fired upon a reconnection attempt error (from Socket.IO Manager)
    this.socket.io.on('reconnect_error', this.onReconnectError);
  }

  private handlePermissionInvalidateToken = (data: { reason: string }) => {
    logger('Received permission invalidate event ', data);
    this.analyticsHelper?.sendActionEvent(
      EVENT_ACTION.INVALIDATE_TOKEN,
      EVENT_STATUS.SUCCESS,
      {
        reason: data.reason,
        // Potentially incorrect when value of token changes between connecting and connect.
        // See: https://bitbucket.org/atlassian/%7Bc8e2f021-38d2-46d0-9b7a-b3f7b428f724%7D/pull-requests/29905#comment-375308874
        usedCachedToken: this.token ? true : false,
      },
    );
    this.unsetToken();
  };

  private onConnectError = (error: Error) => {
    const measure = stopMeasure(
      MEASURE_NAME.SOCKET_CONNECT,
      this.analyticsHelper,
    );

    this.analyticsHelper?.sendActionEvent(
      EVENT_ACTION.CONNECTION,
      EVENT_STATUS.FAILURE,
      {
        latency: measure?.duration,
        // Potentially incorrect when value of token changes between connecting and connect.
        // See: https://bitbucket.org/atlassian/%7Bc8e2f021-38d2-46d0-9b7a-b3f7b428f724%7D/pull-requests/29905#comment-375308874
        usedCachedToken: this.token ? true : false,
      },
    );
    this.analyticsHelper?.sendErrorEvent(
      error,
      'Error while establishing connection',
    );
    // If error received with `data`, it means the connection is rejected
    // by the server on purpose for example no permission, so no need to
    // keep the underneath connection, need to close. But some error like
    // `xhr polling error` needs to retry.
    const errorData = (error as ErrorPayload).data;
    if (errorData) {
      // We only want to refresh the token if only its invalid
      if ([401, 403].includes(errorData.status)) {
        //nullify token so it is forced to generate new token on reconnect
        this.unsetToken();
      }
      this.socket?.close();
    }
    this.emit('error', {
      message: error.message,
      data: errorData,
    });
  };

  private onReconnectError = (error: Error) => {
    this.reconnectHelper?.countReconnectError();
    if (this.reconnectHelper?.isLikelyNetworkIssue()) {
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Likely network issue while reconnecting the channel',
      );
      this.emit('error', {
        message:
          'Reconnection failed 8 times when browser was offline, likely there was a network issue.',
        data: {
          status: 400,
          code: 'RECONNECTION_NETWORK_ISSUE',
        },
      });
    }
  };

  private onConnect = () => {
    this.connected = true;
    logger('Connected.', this.socket!.id);
    const measure = stopMeasure(
      MEASURE_NAME.SOCKET_CONNECT,
      this.analyticsHelper,
    );

    this.analyticsHelper?.sendActionEvent(
      EVENT_ACTION.CONNECTION,
      EVENT_STATUS.SUCCESS,
      {
        latency: measure?.duration,
        // Potentially incorrect when value of token changes between connecting and connect.
        // See: https://bitbucket.org/atlassian/%7Bc8e2f021-38d2-46d0-9b7a-b3f7b428f724%7D/pull-requests/29905#comment-375308874
        usedCachedToken: this.token ? true : false,
      },
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
        const measure = stopMeasure(
          MEASURE_NAME.DOCUMENT_INIT,
          this.analyticsHelper,
        );
        this.initExperience?.success();
        this.analyticsHelper?.sendActionEvent(
          EVENT_ACTION.DOCUMENT_INIT, // TODO: detect when document init fails and fire corresponding event for it
          EVENT_STATUS.SUCCESS,
          {
            latency: measure?.duration,
            resetReason: data?.resetReason,
            ttlEnabled: data?.ttlEnabled,
          },
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
                      this.token ??
                      (await this.config
                        .permissionTokenRefresh()
                        .then((token) => {
                          if (token) {
                            this.setToken(token);
                          }
                          return token;
                        })) ??
                      undefined,
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
      if (error.code === 404) {
        const errorNotFound: ErrorPayload = {
          message: ErrorCodeMapper.documentNotFound.message,
          data: {
            status: error.code,
            code: ErrorCodeMapper.documentNotFound.code,
          },
        };
        this.emit('error', errorNotFound);
        return {};
      }

      //nullify token so it is forced to generate new token on reconnect
      this.unsetToken();

      logger("Can't fetch the catchup", error.message);
      const errorCatchup: ErrorPayload = {
        message: ErrorCodeMapper.catchupFail.message,
        data: {
          status: error.status,
          code: ErrorCodeMapper.catchupFail.code,
        },
      };
      this.emit('error', errorCatchup);
      throw error;
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
    if (!this.socket) {
      throw new NotInitializedError('Cannot broadcast, not initialized yet');
    }
    if (!this.connected) {
      if (this.config.throwOnNotConnected) {
        throw new NotConnectedError('Cannot broadcast, currently offline.');
      }
      return;
    }

    this.socket.emit('broadcast', { type, ...data }, callback);
  }

  sendMetadata(metadata: Metadata) {
    if (!this.socket) {
      throw new NotInitializedError(
        'Cannot send metadata, not initialized yet',
      );
    }
    if (!this.connected) {
      if (this.config.throwOnNotConnected) {
        throw new NotConnectedError('Cannot send metadata, currently offline.');
      }
    }
    this.socket.emit('metadata', metadata);
  }

  sendPresenceJoined() {
    if (!this.connected || !this.socket) {
      return;
    }
    this.socket.emit('presence:joined');
  }

  onOnlineHandler = () => {
    // Force an immediate reconnect, the socket must first be closed to reset reconnection delay logic
    if (!this.connected) {
      this.socket?.close();
      this.socket?.connect();
    }
  };

  disconnect() {
    this.unsubscribeAll();
    this.network?.destroy();
    this.network = null;
    //nullify token so it is forced to generate new token on reconnect
    this.unsetToken();

    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.reconnectHelper?.destroy();
    }
  }
}
