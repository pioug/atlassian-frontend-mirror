import { utils } from '@atlaskit/util-service-support';

import { Emitter } from './emitter';
import {
  ChannelEvent,
  Config,
  TelepointerPayload,
  ParticipantPayload,
  StepsPayload,
  TitlePayload,
  Socket,
} from './types';

import { createLogger } from './utils';

const logger = createLogger('Channel', 'green');

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
    this.socket = createSocket(`${url}/session/${documentAri}`);
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
    this.socket.on('disconnect', (reason: string) => {
      this.connected = false;
      this.emit('disconnect', { reason });
      if (reason === 'io server disconnect' && this.socket) {
        // the disconnection was initiated by the server, we need to reconnect manually
        this.socket.connect();
      }
    });
  }

  private onConnect = (data: any) => {
    this.connected = true;
    logger('Connected.', this.socket!.id);

    this.emit('connected', { sid: this.socket!.id });
  };

  private onReceiveData = (data: any) => {
    logger('Received data', data);

    logger('Session ID is', this.socket!.id);

    if (data.type === 'initial') {
      if (!this.initialized) {
        const { doc, version } = data;
        this.initialized = true;
        this.emit('init', {
          doc,
          version,
        });
      }
    } else {
      this.emit('steps:added', data);
    }
  };

  async fetchCatchup(fromVersion: number) {
    try {
      const { doc, version, stepMaps } = await utils.requestService<any>(
        this.config,
        {
          path: `document/${encodeURIComponent(
            this.config.documentAri,
          )}/catchup`,
          queryParams: {
            version: fromVersion,
          },
        },
      );
      return {
        doc,
        version,
        stepMaps,
      };
    } catch (err) {
      logger("Can't fetch the catchup", err.message);
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
