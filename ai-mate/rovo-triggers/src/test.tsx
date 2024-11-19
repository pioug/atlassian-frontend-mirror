import { renderHook } from '@testing-library/react-hooks';

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
});
