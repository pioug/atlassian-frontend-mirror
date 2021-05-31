import { EventEmitter2 } from 'eventemitter2';
import {
  ActionablePubSubClient,
  ARI,
  OnEvent,
  PubSubClient,
  PubSubClientConfig,
  SpecialEventType,
} from './apiTypes';
import { EventType, Protocol, SubscribeServiceResponse } from './types';
import PubNubProtocol from './protocols/pubnub';
import NoopProtocol from './protocols/noop';
import { logDebug, logError, logInfo } from './util/logger';
import { utils as serviceUtils } from '@atlaskit/util-service-support';
import { FeatureFlags } from './featureFlags';
import { version } from './version.json';

const PLATFORM = 'WEB';

export const RETRY_STEP_IN_MILLISECONDS = 1000;
export const MAX_RETRY = 10;
const SUBSCRIBE_DEBOUNCE_TIME_IN_MILLISECONDS = 10;

export class Client implements ActionablePubSubClient {
  private config: PubSubClientConfig;
  private eventEmitter = new EventEmitter2({
    maxListeners: 500,
    wildcard: true,
    delimiter: ':',
  });
  private currentChannels = new Set<ARI>();

  private capabilities: string[] = [];
  private protocols: Map<string, Protocol> = new Map();

  private currentProtocol: Protocol | undefined;

  private retryCount = 0;

  private subscribeDebounced: number | null = null;

  private subscribedToBaseEvents = false;

  private subscribeBaseRequest = {
    clientInfo: {
      version: version,
      platform: PLATFORM,
      capabilities: this.capabilities,
    },
  };

  private featureFlags: FeatureFlags;

  constructor(config: PubSubClientConfig, protocols?: Protocol[]) {
    this.config = config;
    this.featureFlags = new FeatureFlags(this.config.featureFlags);
    if (!protocols) {
      protocols = [new PubNubProtocol(this.featureFlags)];
    }

    this.subscribeBaseRequest.clientInfo.capabilities = this.registerProtocols(
      protocols,
    );
  }

  on(event: string, listener: OnEvent): PubSubClient {
    this.eventEmitter.on(event, listener);
    return this;
  }

  off(event: string, listener: OnEvent): PubSubClient {
    this.eventEmitter.removeListener(event, listener);
    return this;
  }

  join(aris: ARI[]): Promise<PubSubClient> {
    let channelsChanged = false;
    aris.forEach((ari) => {
      if (!this.currentChannels.has(ari)) {
        this.currentChannels.add(ari);
        channelsChanged = true;
      }
    });

    if (channelsChanged) {
      return this.debouncedSubscribeToCurrentChannels();
    }

    return Promise.resolve(this);
  }

  leave(aris: ARI[]): Promise<PubSubClient> {
    let channelsChanged = false;
    aris.forEach((ari) => {
      if (this.currentChannels.has(ari)) {
        this.currentChannels.delete(ari);
        channelsChanged = true;
      }
    });

    if (channelsChanged) {
      return this.debouncedSubscribeToCurrentChannels();
    }

    return Promise.resolve(this);
  }

  networkUp(): void {
    this.retryCount = 0;
    if (this.currentProtocol) {
      this.currentProtocol.networkUp();
    }
  }

  networkDown(): void {
    if (this.currentProtocol) {
      this.currentProtocol.networkDown();
    }
  }

  private debouncedSubscribeToCurrentChannels(): Promise<PubSubClient> {
    return new Promise((resolve, reject) => {
      if (this.subscribeDebounced) {
        window.clearTimeout(this.subscribeDebounced);
      }

      this.subscribeDebounced = window.setTimeout(() => {
        this.subscribeToCurrentChannels()
          .then(() => resolve(this))
          .catch(reject);
      }, SUBSCRIBE_DEBOUNCE_TIME_IN_MILLISECONDS);
    });
  }

  private registerProtocols(protocols: Protocol[]) {
    let capabilities: string[] = [];
    protocols.forEach((protocol) => {
      this.protocols.set(protocol.getType(), protocol);

      capabilities = capabilities.concat(protocol.getCapabilities());
    });

    return capabilities;
  }

  private subscribeToCurrentChannels() {
    const channels = Array.from(this.currentChannels.values());
    if (channels.length === 0) {
      this.currentProtocol = undefined;
      this.protocols.forEach((protocol) => protocol.unsubscribeAll());
      this.eventEmitter.removeAllListeners();
      this.subscribedToBaseEvents = false;

      return Promise.resolve();
    } else if (!this.subscribedToBaseEvents) {
      this.protocols.forEach((protocol) => {
        protocol.on(EventType.MESSAGE, this.onMessage);
        protocol.on(EventType.ACCESS_DENIED, this.onAccessDenied);
        protocol.on(EventType.NETWORK_UP, this.onNetworkUp);
        protocol.on(EventType.RECONNECT, this.onReconnect);
      });
      this.subscribedToBaseEvents = true;
    }

    return this.fetchSubscribeProtocol(channels).then((subscribeProtocol) => {
      const protocolConfig = subscribeProtocol.protocol;
      if (!protocolConfig) {
        logError(
          'Failed to retrieve subscription configuration',
          subscribeProtocol.errors,
        );
        return;
      }

      this.currentProtocol = this.protocols.get(protocolConfig.type);
      if (!this.currentProtocol) {
        logInfo(`Unknown protocol ${protocolConfig.type}, using noop one.`);
        this.currentProtocol = new NoopProtocol();
      }

      this.currentProtocol.subscribe(protocolConfig);
    });
  }

  private onMessage = (event: string, data: any) => {
    this.eventEmitter.emit(event, event, data);
  };

  private onAccessDenied = () => {
    logDebug('Access denied');
    if (this.retryCount > MAX_RETRY) {
      logError('Retry count exceeded');
      return;
    }

    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        this.subscribeToCurrentChannels()
          .then(() => resolve(this))
          .catch(reject);
      }, RETRY_STEP_IN_MILLISECONDS * 2 ** this.retryCount);
      this.retryCount++;
    });
  };

  private onNetworkUp = () => {
    this.retryCount = 0;
    this.eventEmitter.emit(SpecialEventType.CONNECTED);
  };

  private onReconnect = () => {
    this.eventEmitter.emit(SpecialEventType.RECONNECT);
  };

  private fetchSubscribeProtocol(
    aris: ARI[],
  ): Promise<SubscribeServiceResponse> {
    return serviceUtils
      .requestService<SubscribeServiceResponse>(this.config, {
        path: 'subscribe',
        requestInit: {
          method: 'POST',
          body: JSON.stringify({
            ...this.subscribeBaseRequest,
            product: this.config.product,
            channels: aris,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
      .then((data: SubscribeServiceResponse) => {
        return data;
      });
  }
}
