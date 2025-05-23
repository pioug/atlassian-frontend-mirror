// bindAbortListeners.test.ts
import * as attachAbortListenersModule from '../../../attachAbortListeners';
import * as getViewportModule from '../../../getViewport';

import { bindAbortListeners } from './bindAbortListeners';

// Mock dependencies
jest.mock('../../../attachAbortListeners');
jest.mock('../../../getViewport');

describe('bindAbortListeners', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Set up basic mocks
		(getViewportModule.getViewportWidth as jest.Mock).mockReturnValue(1024);
		(getViewportModule.getViewportHeight as jest.Mock).mockReturnValue(768);
		(attachAbortListenersModule.attachAbortListeners as jest.Mock).mockReturnValue(['unbind1']);
	});

	it('calls viewport functions and attachAbortListeners', () => {
		// Create simple mock objects
		const mockDocument = {} as Document;
		const mockWindow = {} as Window;

		// Call the function
		bindAbortListeners(mockDocument, mockWindow);

		// Verify that each dependency was called
		expect(getViewportModule.getViewportWidth).toHaveBeenCalled();
		expect(getViewportModule.getViewportHeight).toHaveBeenCalled();
		expect(attachAbortListenersModule.attachAbortListeners).toHaveBeenCalled();
	});

	it('calls attachAbortListeners with a callback function', () => {
		// Create simple mock objects
		const mockDocument = {} as Document;
		const mockWindow = {} as Window;

		// Call the function
		bindAbortListeners(mockDocument, mockWindow);

		// Get the call arguments
		const callArgs = (attachAbortListenersModule.attachAbortListeners as jest.Mock).mock.calls[0];

		// Verify that a callback function was provided as the third argument
		expect(callArgs.length).toBeGreaterThanOrEqual(3);
		expect(typeof callArgs[2]).toBe('function');
	});

	it('creates the __SSR_ABORT_LISTENERS__ object on the window', () => {
		// Create simple mock objects
		const mockDocument = {} as Document;
		const mockWindow = {} as Window & {
			__SSR_ABORT_LISTENERS__?: {
				unbinds: unknown[];
				aborts: Record<string, number>;
			};
		};

		// Call the function
		bindAbortListeners(mockDocument, mockWindow);

		// Verify that __SSR_ABORT_LISTENERS__ was created
		expect(mockWindow.__SSR_ABORT_LISTENERS__).toBeDefined();
		if (mockWindow.__SSR_ABORT_LISTENERS__) {
			expect(mockWindow.__SSR_ABORT_LISTENERS__).toHaveProperty('unbinds');
			expect(mockWindow.__SSR_ABORT_LISTENERS__).toHaveProperty('aborts');

			// Verify the properties
			expect(mockWindow.__SSR_ABORT_LISTENERS__.unbinds).toEqual(['unbind1']);
			expect(mockWindow.__SSR_ABORT_LISTENERS__.aborts).toEqual({});
		}
	});

	it('stores abort events in the aborts object when callback is called', () => {
		// Create simple mock objects
		const mockDocument = {} as Document;
		const mockWindow = {} as Window & {
			__SSR_ABORT_LISTENERS__?: {
				unbinds: unknown[];
				aborts: Record<string, number>;
			};
		};

		// Call the function
		bindAbortListeners(mockDocument, mockWindow);

		// Get the callback function
		const callback = (attachAbortListenersModule.attachAbortListeners as jest.Mock).mock
			.calls[0][2];

		// Call the callback with different events
		callback('wheel', 100);
		callback('keydown', 200);

		// Verify the aborts were stored correctly
		expect(mockWindow.__SSR_ABORT_LISTENERS__?.aborts).toEqual({
			wheel: 100,
			keydown: 200,
		});
	});
});
