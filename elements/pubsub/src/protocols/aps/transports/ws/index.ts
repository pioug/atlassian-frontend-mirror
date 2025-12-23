import { logDebug } from '../../../../util/logger';
import { EventType } from '../../../../types';
import WebsocketClient from './websocketClient';
import { type MessageData } from '../../types';
import { type Message } from '../../../types';
import { type APSTransportParams } from '../index';
import { APSTransportType } from '../../../../apiTypes';
import { getTimestampBasedSequenceNumber } from '../../utils';
import AbstractApsTransport from '../abstract-aps-transport';

enum State {
	CLOSED,
	CONNECTING,
	OPEN,
	RECONNECTING,
}

export default class WebsocketTransport extends AbstractApsTransport {
	private readonly activeChannels = new Set<string>();
	private closedByClient = false;
	private state: State = State.CLOSED;
	private websocketClient?: WebsocketClient;
	private isHidden = false;
	private visibilityChangeListener = this.onVisibilityChange.bind(this);
	readonly url: URL;

	constructor(params: APSTransportParams) {
		super(params);
		this.url = WebsocketTransport.toWssUrl(params.url);
	}

	transportType() {
		return APSTransportType.WEBSOCKET;
	}

	onVisibilityChange(): void {
		this.isHidden = document.visibilityState === 'hidden';
	}

	private async initClient(channels: string[]): Promise<WebsocketClient> {
		document.addEventListener('visibilitychange', this.visibilityChangeListener);
		return new Promise((resolve, reject) => {
			const ws = new WebsocketClient({
				url: this.url,
				onOpen: () => {
					this.eventEmitter.emit(EventType.NETWORK_UP, {});
					this.closedByClient = false;
					ws.send({
						type: 'subscribe',
						channels: channels,
						replayFrom: this.lastSeenSequenceNumber || undefined,
					});
					this.lastSeenSequenceNumber = getTimestampBasedSequenceNumber();
					resolve(ws);
				},
				onMessage: (event: MessageEvent) => {
					const data = JSON.parse(event.data) as MessageData;

					if (data.type === 'CHANNEL_ACCESS_DENIED') {
						this.eventEmitter.emit(EventType.ACCESS_DENIED, data.payload);
						return;
					}

					this.lastSeenSequenceNumber = (data as Message).sequenceNumber;

					this.eventEmitter.emit(EventType.MESSAGE, data.type, data.payload);
				},
				onClose: (event: CloseEvent) => {
					if (this.closedByClient) {
						return;
					}

					this.eventEmitter.emit(EventType.NETWORK_DOWN, {});

					if (this.state === State.CONNECTING || this.state === State.RECONNECTING) {
						reject('connection closed');
						return;
					}

					if (this.state === State.OPEN) {
						this.reconnect([...this.activeChannels])
							.then((websocketClient) => {
								this.websocketClient = websocketClient;
							})
							.catch(reject);
					}
				},
				onMessageSendError: (readyState: number) => {},
				onError: (event: ErrorEvent) => {
					logDebug('Websocket onError', event);
				},
			});
		});
	}

	private async connect(channels: string[]) {
		this.state = State.CONNECTING;

		return this.connectWithBackoff(async () => this.initClient(channels)).then((ws) => {
			this.state = State.OPEN;
			return ws;
		});
	}

	private async reconnect(channels: string[]) {
		this.state = State.RECONNECTING;

		return this.reconnectWithBackoff(this.isHidden, async () => this.initClient(channels)).then(
			(ws) => {
				this.state = State.OPEN;
				return ws;
			},
		);
	}

	async subscribe(channels: Set<string>): Promise<void> {
		const newChannels = [...channels].filter(
			(channelName) => !this.activeChannels.has(channelName),
		);
		const removedChannels = [...this.activeChannels].filter(
			(channelName) => !channels.has(channelName),
		);

		if (removedChannels.length === 0 && newChannels.length === 0) {
			return Promise.resolve();
		}

		newChannels.forEach((channel) => this.activeChannels.add(channel));
		removedChannels.forEach((channel) => this.activeChannels.delete(channel));

		if (!this.websocketClient) {
			this.websocketClient = await this.connect(newChannels);
		} else {
			if (newChannels.length > 0) {
				await this.websocketClient?.send({
					type: 'subscribe',
					channels: Array.from(newChannels),
				});
			}

			if (removedChannels.length > 0) {
				await this.websocketClient?.send({
					type: 'unsubscribe',
					channels: Array.from(removedChannels),
				});
			}
		}
	}

	close(): void {
		if (this.activeChannels.size > 0) {
			this.websocketClient?.send({
				type: 'unsubscribe',
				channels: Array.from(this.activeChannels),
			});

			this.activeChannels.clear();
		}

		this.closedByClient = true;
		this.lastSeenSequenceNumber = null;
		this.websocketClient?.close();
		this.websocketClient = undefined;
		this.state = State.CLOSED;
	}

	private static toWssUrl = (apsUrl: URL) => {
		const wssUrl = new URL(apsUrl);
		wssUrl.protocol = 'wss';

		return wssUrl;
	};
}
