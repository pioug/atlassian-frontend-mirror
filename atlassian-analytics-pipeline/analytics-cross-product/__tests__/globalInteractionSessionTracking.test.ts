const globalAny: any = global;

import GlobalInteractionSessionTracking, {
	INTERNAL_CLIENT_WINDOW_KEY,
	type InteractionSessionTracking,
} from '../src/globalInteractionSessionTracking';

const MockedInteractionSessionTracking = jest.fn();

describe('GlobalInteractionSessionTracking', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		if (globalAny.window[INTERNAL_CLIENT_WINDOW_KEY]) {
			delete globalAny.window[INTERNAL_CLIENT_WINDOW_KEY];
		}
	});

	describe('when interactionSessionTracking exists on window', () => {
		let interactionSessionTracking: InteractionSessionTracking;
		beforeEach(() => {
			// Set instance of our mocked class in the window
			interactionSessionTracking = new MockedInteractionSessionTracking();
			globalAny.window[INTERNAL_CLIENT_WINDOW_KEY] = interactionSessionTracking;
		});

		test('should use existing interactionSessionTracking if it exists on global window object', () => {
			const sut = GlobalInteractionSessionTracking.getInstance();

			expect(sut).not.toBeNull();
			expect(sut).toBe(interactionSessionTracking);

			// Only expect original initialisation call - getInstance does not trigger additional call
			expect(MockedInteractionSessionTracking).toHaveBeenCalledTimes(1);
		});
	});

	describe('when interactionSessionTracking does not exist on window', () => {
		test('should return undefined', () => {
			expect(globalAny.window[INTERNAL_CLIENT_WINDOW_KEY]).toBeUndefined();

			const sut = GlobalInteractionSessionTracking.getInstance();

			expect(sut).toBeUndefined();
		});
	});
});
