import { type APSTransportParams } from '../index';
import { EventType } from '../../../../types';
import { logDebug } from '../../../../util/logger';
import { APSTransportType } from '../../../../apiTypes';
import { getTimestampBasedSequenceNumber } from '../../utils';
import AbstractApsTransport from '../abstract-aps-transport';

export default class HttpTransport extends AbstractApsTransport {
	private static readonly MSG_BOUNDARY = '\n';
	private static readonly PARAM_SUBSCRIBE_TO_CHANNELS = 'subscribeToChannels';
	private static readonly PARAM_REPLAY_FROM = 'replayFrom';

	private networkUp: boolean = false;
	private abortController: AbortController | null = null;

	private isHidden = false;
	private visibilityChangeListener = this.onVisibilityChange.bind(this);

	constructor(params: APSTransportParams) {
		super(params);
	}

	transportType() {
		return APSTransportType.HTTP;
	}

	onVisibilityChange(): void {
		this.isHidden = document.visibilityState === 'hidden';
	}

	subscribe(channels: Set<string>): Promise<void> {
		if (channels == null || channels.size === 0) {
			logDebug('channel list is null or empty. HTTP request is not going to be sent.');
			return Promise.resolve();
		}

		const url = new URL(this.baseUrl);
		url.searchParams.set(
			// The list of channels to subscribe to is passed as a query parameter.
			HttpTransport.PARAM_SUBSCRIBE_TO_CHANNELS,
			[...channels].join(','),
		);

		if (this.abortController !== null) {
			return this.connectWithBackoff(() => this.reconnectWithNewSubscriptionSet(url));
		}

		return this.connectWithBackoff(() => this.makeHttpRequest(url));
	}

	close(): void {
		logDebug('Connection was closed by client');
		this.networkUp = false;
		// @ts-ignore: not sure why typecheck doesn't allow me to pass a parameter here. https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort#syntax
		this.abortController?.abort('CLOSED_BY_CLIENT');
	}

	private reconnectWithNewSubscriptionSet(url: URL): Promise<any> {
		// @ts-ignore: not sure why typecheck doesn't allow me to pass a parameter here. https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort#syntax
		this.abortController.abort('NEW_SUBSCRIPTION_SET');
		return new Promise((resolve) => {
			// puts the call to makeHttpRequest at the back of the execution queue,
			// so the error handler code triggered by aborting the request can execute first.
			setTimeout(() => {
				resolve(this.makeHttpRequest(url));
			}, 0);
		});
	}

	private reconnect(url: URL): Promise<any> {
		if (this.abortController?.signal?.aborted) {
			// if the request was aborted, we don't reconnect.
			return Promise.resolve();
		}
		if (this.lastSeenSequenceNumber) {
			// Apply the "replay" mechanism to the request. This will ensure that, as soon as the connection is established,
			// APS will deliver all messages that were emitted in the time between when the previous request was closed (due
			// to time out) and the time the new request is successfully established.
			url.searchParams.set(HttpTransport.PARAM_REPLAY_FROM, this.lastSeenSequenceNumber.toString());
		}

		return this.makeHttpRequest(url);
	}

	private async makeHttpRequest(urlWithParams: URL): Promise<void> {
		// AbortController allows us to abort the HTTP request - in case the "close" function is called, or the list of
		// subscribed channels change.
		document.addEventListener('visibilitychange', this.visibilityChangeListener);
		this.abortController = new AbortController();

		// @ts-ignore "fetch" should be able to take a URL as parameter. https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters
		const response = await fetch(urlWithParams, {
			signal: this.abortController?.signal,
		});
		this.onFetchSuccessful(response);

		try {
			await this.processResponse(response);
		} catch (error: any) {
			if (!this.isAbortError(error)) {
				this.analyticsClient.sendEvent('aps-http', 'reconnecting');
				return this.reconnectWithBackoff(this.isHidden, () => this.reconnect(urlWithParams));
			}
		}
	}

	private onFetchSuccessful(response: Response) {
		if (!this.networkUp) {
			this.networkUp = true;
			// Emit the "NETWORK_UP" event only when the first request is completed. This ensures that the event
			// is not sent on reconnects that happen due to natural timeout.
			this.eventEmitter.emit(EventType.NETWORK_UP, {});
		}
		this.lastSeenSequenceNumber = getTimestampBasedSequenceNumber();

		return response;
	}

	private isAbortError(error: any) {
		if (error.name === 'AbortError') {
			logDebug(
				'Request was intentionally aborted. Reason: ' +
					// @ts-ignore AbortSignal does contain a property called "reason". https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/reason
					this.abortController?.signal?.reason,
			);
			return true;
		}

		return false;
	}

	private emitMessage(sanitizedChunk: string) {
		const messageData = JSON.parse(sanitizedChunk);

		this.lastSeenSequenceNumber = messageData.sequenceNumber || null;
		this.eventEmitter.emit(EventType.MESSAGE, messageData.type, messageData.payload);
	}

	private async processResponse(response: Response) {
		// Read the contents of the response using a "reader", so the chunks can be consumed as soon as they're received,
		// in other words, we don't need to wait for the request to be completed (which can take a long time) to process
		// response contents.
		const reader = response?.body?.getReader();

		if (reader === null || reader === undefined) {
			this.analyticsClient.sendEvent('aps-http', 'null response');
			logDebug('Response body from APS request was null');
			return;
		}

		const decoder = new TextDecoder();

		const consumeChunk = (result: any) => {
			const chunk = decoder.decode(result.value || new Uint8Array(), {
				stream: !result.done,
			});

			chunk
				// Multiple messages can be delivered in the same chunk, so we split the chunk using the boundary character(s)
				.split(HttpTransport.MSG_BOUNDARY)
				.filter((chunkPart) => chunkPart.trim() !== '')
				.forEach((sanitizedChunk) => this.emitMessage(sanitizedChunk));

			if (result.done) {
				return;
			} else {
				return readChunk();
			}
		};
		const readChunk = async (): Promise<any> => {
			const chunk = await reader.read();
			return consumeChunk(chunk);
		};

		return readChunk();
	}
}
