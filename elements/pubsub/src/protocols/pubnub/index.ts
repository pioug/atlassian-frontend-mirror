import PubNub from 'pubnub';
import { MessageEvent, StatusEvent, SubscribeParameters } from 'pubnub';
import { OnEvent } from '../../apiTypes';
import { Protocol, EventType } from '../../types';
import { ConnectionState, PubNubPayload, PubNubProtocolConfig } from '../types';
import { logDebug } from '../../util/logger';
import { EventEmitter2 } from 'eventemitter2';
import { FeatureFlags } from '../../featureFlags';
import HistoryFetcher from './pubNubHistoryFetcher';

const REQUEST_MESSAGE_COUNT_THRESHOLD = 100;

export default class PubNubProtocol implements Protocol {
  private pubNubClient?: PubNub;
  private historyFetcher?: HistoryFetcher;

  private eventEmitter = new EventEmitter2();

  private lastTimeToken?: string;
  private lastTimeTokenBeforeNetworkDisconnection?: string;

  private config!: PubNubProtocolConfig;

  private connectionState: ConnectionState;

  // @ts-ignore: We will need that at some point
  private featureFlags: FeatureFlags;

  constructor(featureFlags: FeatureFlags) {
    this.featureFlags = featureFlags;
    this.connectionState = ConnectionState.OFFLINE;
  }

  public getType() {
    return 'pubnub';
  }

  public getCapabilities() {
    return ['PUBNUB'];
  }

  public subscribe(config: PubNubProtocolConfig) {
    logDebug('Subscribing');
    this.connectionState = ConnectionState.CONNECTING;
    if (
      !this.pubNubClient ||
      config.subscribeKey !== this.config.subscribeKey
    ) {
      this.pubNubClient = this.initializeClient(config);
    } else {
      this.updateClientConfig(config);
    }

    this.config = config;

    const subscribeParams: SubscribeParameters = {
      channels: config.channels,
      channelGroups: config.channelGroups,
    };

    this.pubNubClient.subscribe(subscribeParams);
  }

  public unsubscribeAll() {
    if (this.pubNubClient) {
      this.pubNubClient.unsubscribeAll();
      this.eventEmitter.removeAllListeners();
    }
  }

  public on(event: EventType, handler: OnEvent) {
    this.eventEmitter.on(event, handler);
  }

  public off(event: EventType, handler: OnEvent) {
    this.eventEmitter.off(event, handler);
  }

  public networkUp(): void {
    // if no connected yet
    if (this.connectionState === ConnectionState.OFFLINE && this.pubNubClient) {
      this.connectionState = ConnectionState.CONNECTING;
      this.pubNubClient.reconnect();
    }
  }

  public networkDown(): void {
    if (this.pubNubClient) {
      // Check for ourselves
      this.pubNubClient.reconnect();
    }
  }

  public getLastTimeToken() {
    return this.lastTimeToken;
  }

  public getConnectionState() {
    return this.connectionState;
  }

  private updateClientConfig(config: PubNubProtocolConfig) {
    if (this.pubNubClient) {
      this.pubNubClient.setAuthKey(config.authKey);
      this.pubNubClient.setUUID(config.userUuid);
    }
  }

  private initializeClient(config: PubNubProtocolConfig) {
    const pubNubClient = new PubNub({
      subscribeKey: config.subscribeKey,
      authKey: config.authKey,
      uuid: config.userUuid,
      dedupeOnSubscribe: true,
      restore: true,
      ssl: true,
      requestMessageCountThreshold: REQUEST_MESSAGE_COUNT_THRESHOLD,
    });
    this.historyFetcher = new HistoryFetcher({
      pubNubClient: pubNubClient,
      messageHandler: this.onMessageEvent,
      tooMuchHistoryHandler: () => this.eventEmitter.emit(EventType.RECONNECT),
    });

    pubNubClient.addListener({
      message: this.onMessageEvent,
      status: this.onStatusEvent,
    });

    return pubNubClient;
  }

  private onMessageEvent = (messageEvent: MessageEvent) => {
    if (!this.lastTimeToken || this.lastTimeToken < messageEvent.timetoken) {
      this.lastTimeToken = messageEvent.timetoken;
    }

    const payload = messageEvent.message as PubNubPayload;

    for (let message of payload.messages) {
      this.eventEmitter.emit(EventType.MESSAGE, message.type, message.payload);
    }
  };

  private onStatusEvent = (statusEvent: StatusEvent) => {
    switch (statusEvent.category) {
      case 'PNConnectedCategory':
        this.onConnected();
        break;
      case 'PNNetworkIssuesCategory':
      case 'PNNetworkDownCategory':
        this.onNetworkDown();
        break;
      case 'PNAccessDeniedCategory':
        this.onAccessDenied();
        break;
      case 'PNNetworkUpCategory':
      case 'PNReconnectedCategory':
        this.onReconnect();
        break;
      case 'PNRequestMessageCountExceededCategory':
        this.onMessageCountExceeded();
        break;
      default:
        break;
    }
  };

  private onConnected() {
    logDebug('Connected');
    this.connectionState = ConnectionState.CONNECTED;
    this.eventEmitter.emit(EventType.NETWORK_UP, {});
  }

  private onNetworkDown() {
    if (this.connectionState === ConnectionState.OFFLINE) {
      return;
    }

    logDebug('Network down');

    this.connectionState = ConnectionState.OFFLINE;
    let lastTimeToken = this.lastTimeToken;
    if (!lastTimeToken) {
      lastTimeToken = new Date().getTime() + '0000';
    }
    this.lastTimeTokenBeforeNetworkDisconnection = lastTimeToken;
    logDebug(
      'Last time token: ' + this.lastTimeTokenBeforeNetworkDisconnection,
    );

    this.eventEmitter.emit(EventType.NETWORK_DOWN, {});
  }

  private onAccessDenied() {
    if (this.connectionState === ConnectionState.ACCESS_DENIED) {
      // We've already signaled the access denied error. Nothing to do here
      return;
    }

    logDebug('Access denied');
    this.connectionState = ConnectionState.ACCESS_DENIED;
    this.eventEmitter.emit(EventType.ACCESS_DENIED, {});
  }

  private onReconnect() {
    logDebug('Reconnected');
    this.eventEmitter.emit(EventType.NETWORK_UP, {});
  }

  private onMessageCountExceeded() {
    logDebug('Message count exceeded, fetching history');

    if (this.historyFetcher) {
      this.historyFetcher.fetch(
        this.config.channels,
        this.lastTimeTokenBeforeNetworkDisconnection,
      );
    }
  }
}
