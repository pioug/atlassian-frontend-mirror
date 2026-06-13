import { renderHook } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { usePublish, useSubscribe, useSubscribeAll } from './main';
import type { Payload, Topic } from './types';

describe('PubSub', () => {
	let callback = jest.fn();
	const topic = 'ai-mate';
	const payload: Payload = {
		type: 'message-send',
		data: { prompt: 'Hello, world!' },
		source: 'my-source',
	};

	afterEach(() => {
		callback.mockClear();
	});

	describe('useSubscribe and usePublish', () => {
		it('should subscribe and publish correctly', () => {
			const { unmount } = renderHook(() => useSubscribe({ topic }, callback));
			const { result } = renderHook(() => usePublish(topic));
			result.current(payload);
			expect(callback).toHaveBeenCalled();
			unmount();
		});

		it('should not call the callback if the topic does not match', () => {
			const wrongTopic = 'sain';
			const unrelatedCallback = jest.fn();
			const { unmount } = renderHook(() =>
				useSubscribe({ topic: wrongTopic as Topic }, unrelatedCallback),
			);
			const { result } = renderHook(() => usePublish(topic));
			result.current(payload);
			expect(unrelatedCallback).not.toHaveBeenCalled();
			unmount();
		});

		it('should unsubscribe when the component unmounts', () => {
			const { unmount } = renderHook(() => useSubscribe({ topic }, callback));
			unmount();
			const { result } = renderHook(() => usePublish(topic));
			result.current(payload);
			expect(callback).not.toHaveBeenCalled();
		});

		it('should unsubscribe the correct callback when multiple subscribers exist', () => {
			const callbackA = jest.fn();
			const callbackB = jest.fn();

			const { unmount: unmountA } = renderHook(() => useSubscribe({ topic }, callbackA));
			const { unmount: unmountB } = renderHook(() => useSubscribe({ topic }, callbackB));
			// Expected stack: [callbackA, callbackB]

			unmountA();
			// Expected stack: [callbackB]

			renderHook(() => useSubscribe({ topic }, callbackA));
			// Expected stack: [callbackB, callbackA]

			unmountB();
			// Expected stack: [callbackA]

			const { result } = renderHook(() => usePublish(topic));
			result.current(payload);

			expect(callbackA).toHaveBeenCalled();
			expect(callbackB).not.toHaveBeenCalled();
		});

		describe('useSubscribe with triggerLatest', () => {
			it('should call the latest topic event when subscribing after the event was published', () => {
				const { result } = renderHook(() => usePublish(topic));
				result.current(payload);
				const { unmount } = renderHook(() =>
					useSubscribe({ topic, triggerLatest: true }, callback),
				);
				expect(callback).toHaveBeenCalledWith(payload);
				unmount();
			});

			it('should not call the latest topic event when triggerLatest is false', () => {
				const { result } = renderHook(() => usePublish(topic));
				result.current(payload);
				const { unmount } = renderHook(() =>
					useSubscribe({ topic, triggerLatest: false }, callback),
				);
				expect(callback).not.toHaveBeenCalled();
				unmount();
			});

			it('should not call the latest topic event if another subscriber has already consumed it', () => {
				const { result } = renderHook(() => usePublish(topic));
				const anotherCallback = jest.fn();

				result.current(payload);
				const { unmount: unmount1 } = renderHook(() =>
					useSubscribe({ topic, triggerLatest: true }, anotherCallback),
				);
				const { unmount: unmount2 } = renderHook(() =>
					useSubscribe({ topic, triggerLatest: true }, callback),
				);

				expect(anotherCallback).toHaveBeenCalledWith(payload);
				expect(callback).not.toHaveBeenCalled();
				unmount1();
				unmount2();
			});

			it('should not put certain events to `triggerLatest`', () => {
				const { result } = renderHook(() => usePublish(topic));
				const callback = jest.fn();

				result.current({
					type: 'agent-changed',
					data: { agent: { id: '123', name: 'John Doe', identityAccountId: '456' } },
					source: 'test-source',
				});

				const { unmount } = renderHook(() =>
					useSubscribe({ topic, triggerLatest: true }, callback),
				);

				expect(callback).not.toHaveBeenCalled();
				unmount();
			});

			it('does not let `set-message-context` overwrite a queued action event when the gate is on', () => {
				passGate('rovo_chat_fix_cold_start_prompt_insertion');
				const insertPrompt: Payload = {
					type: 'insert-prompt',
					data: { prompt: '/create-work-items', overrideAutoSend: true },
					source: 'rovo-action-trigger',
				};
				const setMessageContext: Payload = {
					type: 'set-message-context',
					data: { contextKey: 'agents_and_mcps_in_jira', setContext: (ctx) => ctx },
					source: 'rovo-for-jira-onboarding',
				};

				const { result } = renderHook(() => usePublish(topic));
				const callback = jest.fn();

				result.current(insertPrompt);
				result.current(setMessageContext);

				const { unmount } = renderHook(() =>
					useSubscribe({ topic, triggerLatest: true }, callback),
				);

				expect(callback).toHaveBeenCalledTimes(1);
				expect(callback).toHaveBeenCalledWith(insertPrompt);
				unmount();
			});

			it('lets `set-message-context` overwrite the replay slot when the gate is off', () => {
				failGate('rovo_chat_fix_cold_start_prompt_insertion');

				const insertPrompt: Payload = {
					type: 'insert-prompt',
					data: { prompt: '/create-work-items', overrideAutoSend: true },
					source: 'rovo-action-trigger',
				};
				const setMessageContext: Payload = {
					type: 'set-message-context',
					data: { contextKey: 'agents_and_mcps_in_jira', setContext: (ctx) => ctx },
					source: 'rovo-for-jira-onboarding',
				};

				const { result } = renderHook(() => usePublish(topic));
				const callback = jest.fn();

				result.current(insertPrompt);
				result.current(setMessageContext);

				const { unmount } = renderHook(() =>
					useSubscribe({ topic, triggerLatest: true }, callback),
				);

				expect(callback).toHaveBeenCalledTimes(1);
				expect(callback).toHaveBeenCalledWith(setMessageContext);
				unmount();
			});
		});
	});
	describe('useSubscribeAll', () => {
		it('should call the callback for all topics', () => {
			const callbackAll = jest.fn();
			const { unmount: unmount1 } = renderHook(() =>
				useSubscribe({ topic: 'another-topic' as Topic }, callback),
			);
			const { unmount: unmount2 } = renderHook(() => useSubscribe({ topic }, callback));
			const { unmount: unmount3 } = renderHook(() => useSubscribe({ topic }, callback));
			renderHook(() => useSubscribeAll(callbackAll));
			const { result } = renderHook(() => usePublish(topic));
			result.current(payload);
			const { result: result2 } = renderHook(() => usePublish('another-topic' as Topic));
			result2.current(payload);
			// should match number of subscribers using `callback`
			expect(callback).toHaveBeenCalledTimes(3);
			expect(callbackAll).toHaveBeenCalledWith(payload);
			// should match number of publish events
			expect(callbackAll).toHaveBeenCalledTimes(2);
			unmount1();
			unmount2();
			unmount3();
		});
	});
	describe('consumeOnce', () => {
		it('should continue broadcasting events that are not marked as consumeOnce', () => {
			const callbackA = jest.fn();
			const callbackB = jest.fn();

			const { unmount: unmountA } = renderHook(() =>
				useSubscribe({ topic, consumeOnceKey: 'same-key' }, callbackA),
			);
			const { unmount: unmountB } = renderHook(() =>
				useSubscribe({ topic, consumeOnceKey: 'same-key' }, callbackB),
			);
			const { result } = renderHook(() => usePublish(topic));

			result.current(payload);

			expect(callbackA).toHaveBeenCalledWith(payload);
			expect(callbackB).toHaveBeenCalledWith(payload);
			unmountA();
			unmountB();
		});

		it('should process consumeOnce events once for subscribers sharing the same key', () => {
			const callbackA = jest.fn();
			const callbackB = jest.fn();
			const consumeOncePayload: Payload = { ...payload, consumeOnce: true };

			const { unmount: unmountA } = renderHook(() =>
				useSubscribe({ topic, consumeOnceKey: 'same-key' }, callbackA),
			);
			const { unmount: unmountB } = renderHook(() =>
				useSubscribe({ topic, consumeOnceKey: 'same-key' }, callbackB),
			);
			const { result } = renderHook(() => usePublish(topic));

			result.current(consumeOncePayload);

			expect(callbackA).toHaveBeenCalledWith(consumeOncePayload);
			expect(callbackB).not.toHaveBeenCalled();
			unmountA();
			unmountB();
		});

		it('should process consumeOnce events once per consumeOnceKey', () => {
			const callbackA = jest.fn();
			const callbackB = jest.fn();
			const consumeOncePayload: Payload = { ...payload, consumeOnce: true };

			const { unmount: unmountA } = renderHook(() =>
				useSubscribe({ topic, consumeOnceKey: 'first-key' }, callbackA),
			);
			const { unmount: unmountB } = renderHook(() =>
				useSubscribe({ topic, consumeOnceKey: 'second-key' }, callbackB),
			);
			const { result } = renderHook(() => usePublish(topic));

			result.current(consumeOncePayload);

			expect(callbackA).toHaveBeenCalledWith(consumeOncePayload);
			expect(callbackB).toHaveBeenCalledWith(consumeOncePayload);
			unmountA();
			unmountB();
		});

		it('should let subscribers without consumeOnceKey observe consumeOnce events', () => {
			const observerCallback = jest.fn();
			const consumingCallback = jest.fn();
			const consumeOncePayload: Payload = { ...payload, consumeOnce: true };

			const { unmount: unmountObserver } = renderHook(() =>
				useSubscribe({ topic }, observerCallback),
			);
			const { unmount: unmountConsuming } = renderHook(() =>
				useSubscribe({ topic, consumeOnceKey: 'consuming-key' }, consumingCallback),
			);
			const { result } = renderHook(() => usePublish(topic));

			result.current(consumeOncePayload);

			expect(observerCallback).toHaveBeenCalledWith(consumeOncePayload);
			expect(consumingCallback).toHaveBeenCalledWith(consumeOncePayload);
			unmountObserver();
			unmountConsuming();
		});

		it('should not replay consumed consumeOnce events to triggerLatest subscribers with the same key', () => {
			const callbackA = jest.fn();
			const callbackB = jest.fn();
			const consumeOncePayload: Payload = { ...payload, consumeOnce: true };

			const { unmount: unmountA } = renderHook(() =>
				useSubscribe({ topic, consumeOnceKey: 'trigger-latest-key' }, callbackA),
			);
			const { result } = renderHook(() => usePublish(topic));
			result.current(consumeOncePayload);

			const { unmount: unmountB } = renderHook(() =>
				useSubscribe(
					{ topic, triggerLatest: true, consumeOnceKey: 'trigger-latest-key' },
					callbackB,
				),
			);

			expect(callbackA).toHaveBeenCalledWith(consumeOncePayload);
			expect(callbackB).not.toHaveBeenCalled();
			unmountA();
			unmountB();
		});

		it('should allow useSubscribeAll observers to receive consumeOnce events without consuming them', () => {
			const callbackA = jest.fn();
			const callbackB = jest.fn();
			const callbackAll = jest.fn();
			const consumeOncePayload: Payload = { ...payload, consumeOnce: true };

			const { unmount: unmountAll } = renderHook(() => useSubscribeAll(callbackAll));
			const { unmount: unmountA } = renderHook(() =>
				useSubscribe({ topic, consumeOnceKey: 'same-key-with-observer' }, callbackA),
			);
			const { unmount: unmountB } = renderHook(() =>
				useSubscribe({ topic, consumeOnceKey: 'same-key-with-observer' }, callbackB),
			);
			const { result } = renderHook(() => usePublish(topic));

			result.current(consumeOncePayload);

			expect(callbackAll).toHaveBeenCalledWith(consumeOncePayload);
			expect(callbackA).toHaveBeenCalledWith(consumeOncePayload);
			expect(callbackB).not.toHaveBeenCalled();
			unmountAll();
			unmountA();
			unmountB();
		});
	});
});
