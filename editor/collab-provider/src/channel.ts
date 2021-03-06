import { utils } from '@atlaskit/util-service-support';
import { Emitter } from './emitter';
import { ErrorCodeMapper } from './error-code-mapper';
import { Config, Socket } from './types';
import { createLogger } from './utils';

const logger = createLogger('Channel', 'green');

export interface Metadata {
  title?: string;
  editorWidth?: string;
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

export type TitlePayload = {
  title: string;
};

export type EditorWidthPayload = {
  editorWidth: string;
};

export type ErrorPayload = {
  status: number;
  code?: string;
  message?: string;
  meta?: string;
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
  'title:changed': TitlePayload;
  'width:changed': EditorWidthPayload;
  error: ErrorPayload | string;
  disconnect: { reason: string };
};

export class Channel extends Emitter<ChannelEvent> {
  private connected: boolean = false;
  private config: Config;
  private socket: Socket | null = null;

  private initialized: boolean = false;

  constructor(config: Config) {
    super();
    this.config = config;
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
    this.socket = createSocket(
      `${url}/session/${documentAri}`,
      this.config.permissionToken?.initializationToken,
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
    this.socket.on('title:changed', (payload: { data: TitlePayload }) => {
      this.emit('title:changed', payload.data);
    });
    this.socket.on('width:changed', (payload: { data: EditorWidthPayload }) => {
      this.emit('width:changed', payload.data);
    });
    this.socket.on('disconnect', async (reason: string) => {
      this.connected = false;

      // refresh permission token for all disconnect event
      if (this.config.permissionToken?.tokenRefresh && this.socket) {
        (this.socket as any).io.opts.transportOptions.polling.extraHeaders = {
          'x-token': await this.config.permissionToken.tokenRefresh(),
        };
      }

      logger(`disconnect: ${reason}`);
      this.emit('disconnect', { reason });
      if (reason === 'io server disconnect' && this.socket) {
        // the disconnection was initiated by the server, we need to reconnect manually
        this.socket.connect();
      }
    });

    this.socket.on('error', (error: ErrorPayload | string) => {
      this.emit('error', error);
    });

    this.socket.on('connect_error', (error: ErrorPayload | string) => {
      this.emit('error', error);
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

  async fetchCatchup(fromVersion: number) {
    try {
      const { doc, version, stepMaps, metadata } = await utils.requestService<
        any
      >(this.config, {
        path: `document/${encodeURIComponent(this.config.documentAri)}/catchup`,
        queryParams: {
          version: fromVersion,
        },
        ...(this.config.permissionToken
          ? {
              requestInit: {
                headers: {
                  'x-token': await this.config.permissionToken.tokenRefresh(),
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
        status: err.status,
        code: ErrorCodeMapper.catchupFail.code,
        message: ErrorCodeMapper.catchupFail.message,
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
  ) {
    if (!this.connected || !this.socket) {
      return;
    }

    this.socket.emit('broadcast', { type, ...data });
  }

  disconnect() {
    this.unsubscribeAll();

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
