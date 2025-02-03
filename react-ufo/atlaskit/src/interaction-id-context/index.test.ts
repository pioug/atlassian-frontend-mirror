// This test isn't using the ffTest from import { ffTest } from '@atlassian/feature-flags-test-utils';
// Because that helper doesn't work well with isolated modules
const fgMock = jest.fn();
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: fgMock,
}));

describe('InteractionID', () => {
	beforeEach(() => {
		// Clear the module cache before each test
		jest.resetModules();
		// Clear the global object
		delete (global as any).__react_ufo__DefaultInteractionID;
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('when platform_ufo_AFO-3379_fix_default_interaction is enabled', () => {
		beforeEach(() => {
			fgMock.mockReturnValue(true);
		});

		it('should define the __react_ufo__DefaultInteractionID in the global context', () => {
			expect((global as any).__react_ufo__DefaultInteractionID).not.toBeDefined();

			jest.isolateModules(() => {
				require('./index');
			});

			expect((global as any).__react_ufo__DefaultInteractionID).toBeDefined();
		});

		it('should share the same DefaultInteractionID reference across different imports', () => {
			let module1, module2;
			let DefaultInteractionID1: { current: null | string };
			let DefaultInteractionID2: { current: null | string };
			jest.isolateModules(() => {
				module1 = require('./index');
				DefaultInteractionID1 = module1!.DefaultInteractionID;
			});

			// Set a value
			DefaultInteractionID1!.current = 'test-id';

			// Simulate second import (as if from a different bundle)
			jest.isolateModules(() => {
				module2 = require('./index');
				DefaultInteractionID2 = module2!.DefaultInteractionID;
			});

			// Check if the value persists across imports
			expect(DefaultInteractionID2!.current).toBe('test-id');

			// Ensure they are the same object
			expect(DefaultInteractionID1!).toBe(DefaultInteractionID2!);
		});
	});

	describe('when platform_ufo_AFO-3379_fix_default_interaction is disabled', () => {
		beforeEach(() => {
			fgMock.mockReturnValue(false);
		});

		it('should not define the __react_ufo__DefaultInteractionID in the global context', () => {
			expect((global as any).__react_ufo__DefaultInteractionID).not.toBeDefined();

			jest.isolateModules(() => {
				require('./index');
			});

			expect((global as any).__react_ufo__DefaultInteractionID).not.toBeDefined();
		});

		it('should not share the same DefaultInteractionID reference across different imports', () => {
			let module1, module2;
			let DefaultInteractionID1: { current: null | string };
			let DefaultInteractionID2: { current: null | string };
			jest.isolateModules(() => {
				module1 = require('./index');
				DefaultInteractionID1 = module1!.DefaultInteractionID;
			});

			// Set a value
			DefaultInteractionID1!.current = 'test-id';

			// Simulate second import (as if from a different bundle)
			jest.isolateModules(() => {
				module2 = require('./index');
				DefaultInteractionID2 = module2!.DefaultInteractionID;
			});

			// When feature flag is disabled, references should not be shared
			expect(DefaultInteractionID2!.current).toBeNull();
			// Ensure they are the same object
			expect(DefaultInteractionID1!).not.toBe(DefaultInteractionID2!);
		});
	});
});
