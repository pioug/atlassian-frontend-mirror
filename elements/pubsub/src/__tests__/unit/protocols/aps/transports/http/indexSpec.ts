import { EventEmitter2 } from 'eventemitter2';
import HttpTransport from '../../../../../../protocols/aps/transports/http';
import { TextDecoder as TextDecoderNode, TextEncoder as TextEncoderNode } from 'util';
import { EventType } from '../../../../../../types';
import getAnalyticsClient from '../../../../../../protocols/aps/APSAnalyticsClient';
import * as sinon from 'sinon';

const textEncoder = new TextEncoderNode();

jest.mock('../../../../../../protocols/aps/utils', () => {
	const originalModule = jest.requireActual('../../../../../../protocols/aps/utils');
	return {
		...originalModule,
		reconnectBackoffOptions: jest.fn(() => ({
			delayFirstAttempt: false,
			startingDelay: 0,
			timeMultiple: 1,
			numOfAttempts: 3,
		})),
		firstConnectBackoffOptions: jest.fn(() => ({
			delayFirstAttempt: false,
			startingDelay: 0,
			timeMultiple: 1,
			numOfAttempts: 3,
		})),
	};
});

const mockResponseWithReader = async (messages: string[]) => {
	const msgSize = messages.length;
	let msgCounter = 0;
	return {
		body: {
			getReader: () => ({
				read: () => {
					return Promise.resolve({
						value: textEncoder.encode(messages[msgCounter++]),
						done: msgCounter >= msgSize,
					});
				},
			}),
		},
	};
};

const mockRequestThatNeverCompletes = async () => ({
	body: {
		getReader: () => ({
			read: () => {
				return new Promise(() => {});
			},
		}),
	},
});

const consumeMessageEvents = async (
	eventEmitter: EventEmitter2,
	expectedNumberOfEvents: number,
) => {
	const messages: { type: any; payload: any }[] = [];
	await new Promise((resolve) => {
		eventEmitter.on(EventType.MESSAGE, (type, payload) => {
			messages.push({ type, payload });
			if (messages.length === expectedNumberOfEvents) {
				resolve(undefined);
			}
		});
	});

	return messages;
};

const restoreStub = (stub: any) => {
	if (stub.restore) {
		stub.restore();
	}
};

const wait = (time: number = 100) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

describe('HttpTransport', () => {
	let eventEmitter = new EventEmitter2();
	let httpTransport: HttpTransport;

	beforeAll(() => {
		// @ts-ignore
		global.TextDecoder = TextDecoderNode;
	});

	afterAll(() => {
		// @ts-ignore
		global.TextDecoder = undefined;
	});

	beforeEach(() => {
		httpTransport = new HttpTransport({
			url: new URL('https://mock.com'),
			eventEmitter,
			analyticsClient: getAnalyticsClient(),
			isFallback: false,
		});
	});

	afterEach(() => {
		eventEmitter = new EventEmitter2();
		restoreStub(fetch);
	});

	describe('#subscribe', () => {
		it("won't call the http endpoint when list of channels is empty", async () => {
			const stubbedFetch = sinon
				.stub(window, 'fetch')
				.resolves(mockResponseWithReader([JSON.stringify({ type: 'event', payload: 'hello' })]));

			await httpTransport.subscribe(new Set());

			expect(stubbedFetch.getCalls().length).toBe(0);

			httpTransport.close();
		});

		it('can consume multiple messages', async () => {
			const stubbedFetch = sinon
				.stub(window, 'fetch')
				.resolves(
					mockResponseWithReader([
						JSON.stringify({ type: 'event', payload: 'hello' }),
						JSON.stringify({ type: 'event', payload: 'goodbye' }),
					]),
				);

			httpTransport.subscribe(new Set(['channel-1']));

			const [msg1, msg2] = await consumeMessageEvents(eventEmitter, 2);

			expect(stubbedFetch.getCalls().length).toBe(1);

			expect(msg1).toStrictEqual({ type: 'event', payload: 'hello' });
			expect(msg2).toStrictEqual({ type: 'event', payload: 'goodbye' });

			httpTransport.close();
		});

		it('can consume messages separated by line break', async () => {
			const stubbedFetch = sinon
				.stub(window, 'fetch')
				.resolves(
					mockResponseWithReader([
						JSON.stringify({ type: 'event', payload: 'hello' }) +
							'\n' +
							JSON.stringify({ type: 'event', payload: 'goodbye' }),
					]),
				);

			httpTransport.subscribe(new Set(['channel-1']));

			const [msg1, msg2] = await consumeMessageEvents(eventEmitter, 2);

			expect(stubbedFetch.getCalls().length).toBe(1);

			expect(msg1).toStrictEqual({ type: 'event', payload: 'hello' });
			expect(msg2).toStrictEqual({ type: 'event', payload: 'goodbye' });

			httpTransport.close();
		});
	});

	describe('#close', () => {
		it('does not try to reconnect when subscription is closed', async () => {
			sinon.stub(window, 'fetch').resolves(mockRequestThatNeverCompletes());

			httpTransport.subscribe(new Set(['channel-1']));

			await wait(0);

			httpTransport.close();

			// @ts-ignore
			expect(window.fetch.callCount).toBe(1);
		});
	});
});
