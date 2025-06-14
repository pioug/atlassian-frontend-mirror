import WindowEventObserver, { type OnEventCallback } from './index';

// Mock the `bind` function from 'bind-event-listener'
jest.mock('bind-event-listener', () => ({
	bind: jest.fn((_, { type, listener }) => {
		// Return a mock unbind function
		return jest.fn(() => {
			// Optionally, verify that unbind is called for cleanup
		});
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

	test('should bind events on start', () => {
		const observer = new WindowEventObserver({ onEvent: onEventCallback });
		observer.start();

		const { bind } = require('bind-event-listener');

		expect(bind).toHaveBeenCalledTimes(4);
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
	});

	test('should call onEvent callback when event occurs', () => {
		const observer = new WindowEventObserver({ onEvent: onEventCallback });
		observer.start();

		const { bind } = require('bind-event-listener');
		const mockListener = bind.mock.calls[0][1].listener;

		const mockEvent = { timeStamp: 1234, isTrusted: true } as Event;
		mockListener(mockEvent);

		expect(onEventCallback).toHaveBeenCalledWith({
			time: 1234,
			type: 'wheel', // The type can vary depending on which test case we're simulating
			event: mockEvent,
		});
	});

	test('should call onEvent callback when an syntethic event occurs', () => {
		const observer = new WindowEventObserver({ onEvent: onEventCallback });
		observer.start();

		const { bind } = require('bind-event-listener');
		const mockListener = bind.mock.calls[0][1].listener;

		const mockEvent = { timeStamp: 1234, isTrusted: false } as Event;
		mockListener(mockEvent);

		expect(onEventCallback).not.toHaveBeenCalled();
	});

	test('should unbind events on stop', () => {
		const observer = new WindowEventObserver({ onEvent: onEventCallback });
		observer.start();
		observer.stop();

		const { bind } = require('bind-event-listener');

		for (let i = 0; i < 4; i++) {
			const mockUnbindCallback = bind.mock.results[i].value;
			expect(mockUnbindCallback).toHaveBeenCalledTimes(1);
		}
	});
});
