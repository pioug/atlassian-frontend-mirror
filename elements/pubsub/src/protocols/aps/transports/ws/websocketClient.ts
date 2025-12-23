const noop: OnWebSocketEvent = () => {};

interface OnWebSocketEvent<T = any> {
	(data?: T): void;
}

export interface WebsocketClientParams {
	onClose?: OnWebSocketEvent;
	onError?: OnWebSocketEvent;
	onMessage?: OnWebSocketEvent;
	onMessageSendError?: OnWebSocketEvent;
	onOpen?: OnWebSocketEvent;
	url: URL;
}

interface Message {
	channels: string[];
	replayFrom?: number;
	type: 'subscribe' | 'unsubscribe';
}

export default class WebsocketClient {
	readonly url: URL;
	private readonly promise: Promise<WebSocket>;
	private readonly onMessageSendError;

	constructor(params: WebsocketClientParams) {
		this.url = params.url;
		this.onMessageSendError = params.onMessageSendError || noop;
		this.promise = this.initializeClient(params);
	}

	private async initializeClient({
		url,
		onMessage = noop,
		onClose = noop,
		onOpen = noop,
		onError = noop,
	}: WebsocketClientParams): Promise<WebSocket> {
		return new Promise((resolve, reject) => {
			const websocket = new WebSocket(url.toString());

			websocket.addEventListener('open', (event) => {
				onOpen(event);
				resolve(websocket);
			});

			websocket.addEventListener('message', (event) => onMessage(event));

			websocket.addEventListener('error', (event) => {
				onError(event);
			});

			websocket.addEventListener('close', (event) => {
				onClose(event);
			});
		});
	}

	public async send(message: Message): Promise<void> {
		const websocket = await this.promise;

		if (websocket.readyState === WebSocket.OPEN) {
			websocket.send(JSON.stringify(message));
		} else {
			this.onMessageSendError(websocket.readyState);
		}
	}

	public async close(): Promise<void> {
		const websocket = await this.promise;
		if (websocket.readyState === WebSocket.OPEN || websocket.readyState === WebSocket.CONNECTING) {
			websocket.close();
		}
	}
}
