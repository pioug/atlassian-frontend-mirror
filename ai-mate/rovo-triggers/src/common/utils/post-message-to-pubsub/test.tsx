import React from 'react';

import { act, render, renderHook, waitFor } from '@testing-library/react';
import { bind } from 'bind-event-listener';

import { usePublish } from '../../../main';

import {
	isAllowedOrigin,
	ROVO_POST_MESSAGE_ACK_EVENT_TYPE,
	ROVO_POST_MESSAGE_EVENT_TYPE,
	RovoPostMessagePubsubListener,
	useRovoPostMessageToPubsub,
} from './index';

describe('isAllowedOrigin', () => {
	[
		{ url: 'https://pug.jira-dev.com', expected: true },
		{ url: 'http://pug.jira-dev.com', expected: false },
		{ url: 'https://jira-dev.com', expected: false },

		{ url: 'https://home.stg.atlassian.com', expected: true },
		{ url: 'https://home.atlassian.com', expected: true },

		{ url: 'https://hello.atlassian.net', expected: true },
		{ url: 'https://atlassian.net', expected: false },

		{ url: 'https://rovo-extension-web.stg-east.frontend.public.atl-paas.net/', expected: true },
		{ url: 'https://governator-ui.prod-east.frontend.public.atl-paas.net/', expected: true },

		{ url: 'https://localhost', expected: true },
		{ url: 'http://localhost:9000', expected: true },

		{ url: 'https://bitbucket.org', expected: true },
		{ url: 'https://trello.com', expected: true },
	].forEach(({ url, expected }) => {
		test(`should return ${expected} for ${url}`, () => {
			expect(isAllowedOrigin(url)).toBe(expected);
		});
	});
});

jest.mock('bind-event-listener');
jest.mock('../../../main', () => ({
	usePublish: jest.fn(),
}));

const usePublishMock = usePublish as jest.Mock;
const bindMock = bind as jest.Mock;

describe('RovoPostMessagePubsubListener', () => {
	const publishMock = jest.fn();
	beforeEach(() => {
		jest.clearAllMocks();
		usePublishMock.mockReturnValue(publishMock);
	});

	test('only publish event if origin is allowed', async () => {
		render(<RovoPostMessagePubsubListener />);

		const event = new MessageEvent('message', {
			data: {
				eventType: ROVO_POST_MESSAGE_EVENT_TYPE,
			},
			origin: 'http://example.com',
		});

		await waitFor(() => {
			expect(bindMock).toHaveBeenCalled();
		});

		const handler = bindMock.mock.calls[0][1].listener;
		handler(event);

		expect(publishMock).not.toHaveBeenCalled();
	});

	test('only publish event if data.eventType is ROVO_POST_MESSAGE_EVENT_TYPE', async () => {
		render(<RovoPostMessagePubsubListener />);

		const event = new MessageEvent('message', {
			data: {
				eventType: 'some-other-event-type',
			},
		});

		await waitFor(() => {
			expect(bindMock).toHaveBeenCalled();
		});

		const handler = bindMock.mock.calls[0][1].listener;
		handler(event);

		expect(publishMock).not.toHaveBeenCalled();
	});

	test('publish event if data.eventType is ROVO_POST_MESSAGE_EVENT_TYPE and origin is allowed', async () => {
		render(<RovoPostMessagePubsubListener />);

		const postMessageMock = jest.fn();
		const event = new MessageEvent('message', {
			data: {
				eventType: ROVO_POST_MESSAGE_EVENT_TYPE,
				payload: { type: 'chat-new' },
				payloadId: '13412',
			},
			origin: 'https://pug.jira-dev.com',
			source: {
				postMessage: postMessageMock,
			} as any,
		});

		await waitFor(() => {
			expect(bindMock).toHaveBeenCalled();
		});

		const handler = bindMock.mock.calls[0][1].listener;
		handler(event);

		expect(publishMock).toHaveBeenCalledTimes(1);
		expect(publishMock).toHaveBeenCalledWith({ type: 'chat-new' });
		expect(postMessageMock).toHaveBeenCalledTimes(1);
		expect(postMessageMock).toHaveBeenCalledWith({
			eventType: ROVO_POST_MESSAGE_ACK_EVENT_TYPE,
			payloadId: '13412',
		});
	});
});

describe('useRovoPostMessageToPubsub publishWithPostMessage', () => {
	jest.useFakeTimers();

	const publishMock = jest.fn();
	beforeEach(() => {
		jest.clearAllMocks();
		usePublishMock.mockReturnValue(publishMock);
	});

	test('should publish event, set correct `isWaitingForAck` status and call onAcknowledgeTimeout if no ROVO_POST_MESSAGE_ACK_EVENT_TYPE received after timeout', async () => {
		const { result, rerender } = renderHook(() => useRovoPostMessageToPubsub());

		await waitFor(() => {
			expect(bindMock).toHaveBeenCalled();
		});

		const onAcknowledgeTimeout = jest.fn();

		const payload = {
			type: 'chat-new' as const,
			source: 'test source',
			data: {
				dialogues: [],
				name: 'test name',
			},
		};
		act(() => {
			result.current.publishWithPostMessage({
				payload,
				onAcknowledgeTimeout,
			});
		});

		rerender();
		expect(result.current.isWaitingForAck).toBe(true);

		act(() => {
			jest.runAllTimers();
		});

		expect(onAcknowledgeTimeout).toHaveBeenCalledTimes(1);
		expect(onAcknowledgeTimeout).toHaveBeenCalledWith({
			payload,
		});

		rerender();
		expect(result.current.isWaitingForAck).toBe(false);
	});

	test('should NOT call onAcknowledgeTimeout if ROVO_POST_MESSAGE_ACK_EVENT_TYPE received', async () => {
		const postMessageSpy = jest.spyOn(window.parent, 'postMessage');
		const { result, rerender } = renderHook(() => useRovoPostMessageToPubsub());

		await waitFor(() => {
			expect(bindMock).toHaveBeenCalled();
		});

		const onAcknowledgeTimeout = jest.fn();
		const payload = {
			type: 'chat-new' as const,
			source: 'test source',
			data: {
				dialogues: [],
				name: 'test name',
			},
		};
		act(() => {
			result.current.publishWithPostMessage({
				payload,
				onAcknowledgeTimeout,
			});
		});

		rerender();
		expect(result.current.isWaitingForAck).toBe(true);

		const event = new MessageEvent('message', {
			data: {
				eventType: ROVO_POST_MESSAGE_ACK_EVENT_TYPE,
				payloadId: postMessageSpy.mock.calls[0][0].payloadId,
			},
			origin: 'https://pug.jira-dev.com',
		});

		const handler = bindMock.mock.calls[0][1].listener;
		act(() => handler(event));

		act(() => {
			jest.runAllTimers();
		});

		rerender();

		expect(result.current.isWaitingForAck).toBe(false);
		expect(onAcknowledgeTimeout).not.toHaveBeenCalled();
	});

	test('should only cancel onAcknowledgeTimeout that matches payloadId', async () => {
		const postMessageSpy = jest.spyOn(window.parent, 'postMessage');

		// simulate multiple hooks sending publishWithPostMessage at the same time
		// so there are 2 payloads with different payloadId
		// and then acknowledge the first one
		const { result: resultOne, rerender: rerenderOne } = renderHook(() =>
			useRovoPostMessageToPubsub(),
		);
		const { result: resultTwo, rerender: rerenderTwo } = renderHook(() =>
			useRovoPostMessageToPubsub(),
		);

		await waitFor(() => {
			expect(bindMock).toHaveBeenCalledTimes(2);
		});

		const onAcknowledgeTimeout = jest.fn();
		const payloadOne = {
			type: 'chat-new' as const,
			source: 'test source',
			data: {
				dialogues: [],
				name: 'test name',
			},
		};
		const payloadTwo = {
			...payloadOne,
			source: 'test source 2',
		};

		act(() => {
			resultOne.current.publishWithPostMessage({
				payload: payloadOne,
				onAcknowledgeTimeout,
			});
			resultTwo.current.publishWithPostMessage({
				payload: payloadTwo,
				onAcknowledgeTimeout,
			});
		});

		const payloadIdOne = postMessageSpy.mock.calls[0][0].payloadId;

		// cancel the timeout for the first hook
		const event = new MessageEvent('message', {
			data: {
				eventType: ROVO_POST_MESSAGE_ACK_EVENT_TYPE,
				payloadId: payloadIdOne,
			},
			origin: 'https://pug.jira-dev.com',
		});

		const handlerOne = bindMock.mock.calls[0][1].listener;
		const handlerTwo = bindMock.mock.calls[1][1].listener;
		act(() => {
			handlerOne(event);
			handlerTwo(event);
		});

		rerenderOne();
		rerenderTwo();

		expect(resultOne.current.isWaitingForAck).toBe(false);
		expect(resultTwo.current.isWaitingForAck).toBe(true);

		act(() => {
			jest.runAllTimers();
		});

		// the 2nd hook should be timed out
		expect(onAcknowledgeTimeout).toHaveBeenCalledTimes(1);
		expect(onAcknowledgeTimeout).toHaveBeenCalledWith({
			payload: payloadTwo,
		});
	});
});
