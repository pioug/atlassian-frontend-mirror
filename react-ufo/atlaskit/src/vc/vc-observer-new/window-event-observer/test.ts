import WindowEventObserver, { type OnEventCallback } from './index';

// Mock the `bind` function from 'bind-event-listener'
jest.mock('bind-event-listener', () => ({
	bind: jest.fn((_target, { type: _type, listener: _listener }) => {
		// Return a mock unbind function
		return jest.fn(() => {
			// Optionally, verify that unbind is called for cleanup
		});
	}),
}));

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(() => false),
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

	describe('scroll-container capture phase listener', () => {
		test('should bind scroll on document with capture:true when feature flag is enabled', () => {
			const { fg } = require('@atlaskit/platform-feature-flags');
			fg.mockImplementation((flag: string) => flag === 'platform_ufo_detect_container_scroll');

			const observer = new WindowEventObserver({ onEvent: onEventCallback });
			observer.start();

			const { bind } = require('bind-event-listener');

			// 4 window events + 1 document scroll = 5 bind calls
			expect(bind).toHaveBeenCalledTimes(5);
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

		test('should not bind scroll on document when feature flag is disabled', () => {
			const { fg } = require('@atlaskit/platform-feature-flags');
			fg.mockImplementation(() => false);

			const observer = new WindowEventObserver({ onEvent: onEventCallback });
			observer.start();

			const { bind } = require('bind-event-listener');

			// Only 4 window events, no document scroll
			expect(bind).toHaveBeenCalledTimes(4);
			expect(bind).not.toHaveBeenCalledWith(document, expect.objectContaining({ type: 'scroll' }));
		});

		test('should call onEvent with scroll-container type when capture scroll fires', () => {
			const { fg } = require('@atlaskit/platform-feature-flags');
			fg.mockImplementation((flag: string) => flag === 'platform_ufo_detect_container_scroll');

			const observer = new WindowEventObserver({ onEvent: onEventCallback });
			observer.start();

			const { bind } = require('bind-event-listener');

			// Find the document scroll bind call (5th call)
			const scrollCall = bind.mock.calls.find(
				(call: any[]) => call[0] === document && call[1].type === 'scroll',
			);
			expect(scrollCall).toBeDefined();

			const mockEvent = { timeStamp: 5678, isTrusted: true } as Event;
			scrollCall[1].listener(mockEvent);

			expect(onEventCallback).toHaveBeenCalledWith({
				time: 5678,
				type: 'scroll-container',
				event: mockEvent,
			});
		});

		test('should not call onEvent for untrusted capture scroll events', () => {
			const { fg } = require('@atlaskit/platform-feature-flags');
			fg.mockImplementation((flag: string) => flag === 'platform_ufo_detect_container_scroll');

			const observer = new WindowEventObserver({ onEvent: onEventCallback });
			observer.start();

			const { bind } = require('bind-event-listener');

			const scrollCall = bind.mock.calls.find(
				(call: any[]) => call[0] === document && call[1].type === 'scroll',
			);

			const mockEvent = { timeStamp: 5678, isTrusted: false } as Event;
			scrollCall[1].listener(mockEvent);

			expect(onEventCallback).not.toHaveBeenCalled();
		});

		test('should unbind capture scroll listener on stop', () => {
			const { fg } = require('@atlaskit/platform-feature-flags');
			fg.mockImplementation((flag: string) => flag === 'platform_ufo_detect_container_scroll');

			const observer = new WindowEventObserver({ onEvent: onEventCallback });
			observer.start();
			observer.stop();

			const { bind } = require('bind-event-listener');

			// All 5 unbind functions should be called (4 window + 1 document)
			for (let i = 0; i < 5; i++) {
				const mockUnbindCallback = bind.mock.results[i].value;
				expect(mockUnbindCallback).toHaveBeenCalledTimes(1);
			}
		});
	});
});
