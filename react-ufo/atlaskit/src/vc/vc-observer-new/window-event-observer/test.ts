import WindowEventObserver, { type OnEventCallback } from './index';

jest.mock('bind-event-listener', () => ({
	bind: jest.fn((_target, { type: _type, listener: _listener }) => {
		return jest.fn();
	}),
}));

describe('WindowEventObserver', () => {
	let onEventCallback: jest.MockedFunction<OnEventCallback>;

	beforeEach(() => {
		onEventCallback = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should bind window events and capture scroll listener on start', () => {
		const observer = new WindowEventObserver({ onEvent: onEventCallback });
		observer.start();

		const { bind } = require('bind-event-listener');

		expect(bind).toHaveBeenCalledTimes(5);
		expect(bind).toHaveBeenCalledWith(
			window,
			expect.objectContaining({
				type: 'wheel',
				options: {
					passive: true,
					once: true,
				},
			}),
		);
		expect(bind).toHaveBeenCalledWith(
			window,
			expect.objectContaining({
				type: 'scroll',
				options: {
					passive: true,
					once: true,
				},
			}),
		);
		expect(bind).toHaveBeenCalledWith(
			window,
			expect.objectContaining({
				type: 'keydown',
				options: {
					passive: true,
					once: true,
				},
			}),
		);
		expect(bind).toHaveBeenCalledWith(
			window,
			expect.objectContaining({
				type: 'resize',
				options: {
					passive: true,
					once: true,
				},
			}),
		);
		expect(bind).toHaveBeenCalledWith(
			document,
			expect.objectContaining({
				type: 'scroll',
				options: expect.objectContaining({
					capture: true,
					passive: true,
					once: true,
				}),
			}),
		);
	});

	test('should call onEvent callback when trusted window event occurs', () => {
		const observer = new WindowEventObserver({ onEvent: onEventCallback });
		observer.start();

		const { bind } = require('bind-event-listener');
		const mockListener = bind.mock.calls[0][1].listener;
		const mockEvent = { timeStamp: 1234, isTrusted: true } as Event;

		mockListener(mockEvent);

		expect(onEventCallback).toHaveBeenCalledWith({
			time: 1234,
			type: 'wheel',
			event: mockEvent,
		});
	});

	test('should not call onEvent callback for untrusted window event', () => {
		const observer = new WindowEventObserver({ onEvent: onEventCallback });
		observer.start();

		const { bind } = require('bind-event-listener');
		const mockListener = bind.mock.calls[0][1].listener;
		const mockEvent = { timeStamp: 1234, isTrusted: false } as Event;

		mockListener(mockEvent);

		expect(onEventCallback).not.toHaveBeenCalled();
	});

	test('should call onEvent with scroll-container type when capture scroll fires', () => {
		const observer = new WindowEventObserver({ onEvent: onEventCallback });
		observer.start();

		const { bind } = require('bind-event-listener');
		const scrollCall = bind.mock.calls.find(
			(call: [EventTarget, { type: string; listener: (event: Event) => void }]) =>
				call[0] === document && call[1].type === 'scroll',
		);
		const mockEvent = { timeStamp: 5678, isTrusted: true } as Event;

		expect(scrollCall).toBeDefined();
		scrollCall?.[1].listener(mockEvent);

		expect(onEventCallback).toHaveBeenCalledWith({
			time: 5678,
			type: 'scroll-container',
			event: mockEvent,
		});
	});

	test('should not call onEvent for untrusted capture scroll events', () => {
		const observer = new WindowEventObserver({ onEvent: onEventCallback });
		observer.start();

		const { bind } = require('bind-event-listener');
		const scrollCall = bind.mock.calls.find(
			(call: [EventTarget, { type: string; listener: (event: Event) => void }]) =>
				call[0] === document && call[1].type === 'scroll',
		);
		const mockEvent = { timeStamp: 5678, isTrusted: false } as Event;

		expect(scrollCall).toBeDefined();
		scrollCall?.[1].listener(mockEvent);

		expect(onEventCallback).not.toHaveBeenCalled();
	});

	test('should unbind all listeners on stop', () => {
		const observer = new WindowEventObserver({ onEvent: onEventCallback });
		observer.start();
		observer.stop();

		const { bind } = require('bind-event-listener');

		for (let i = 0; i < 5; i++) {
			const mockUnbindCallback = bind.mock.results[i].value;
			expect(mockUnbindCallback).toHaveBeenCalledTimes(1);
		}
	});
});
