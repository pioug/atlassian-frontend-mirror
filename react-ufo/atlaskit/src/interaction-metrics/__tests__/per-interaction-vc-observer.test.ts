import { fg } from '@atlaskit/platform-feature-flags';

import { getCapabilityRate, getConfig } from '../../config';
import { DefaultInteractionID } from '../../interaction-id-context';
import { getVCObserver, newVCObserver } from '../../vc';
import { addNewInteraction, getActiveInteraction, remove } from '../index';

// Mock the feature flag
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

// Mock the VC observer
jest.mock('../../vc', () => ({
	getVCObserver: jest.fn(),
	newVCObserver: jest.fn(),
}));

// Mock the config
jest.mock('../../config', () => ({
	getConfig: jest.fn(),
	getCapabilityRate: jest.fn(),
	getAwaitBM3TTIList: jest.fn(() => []),
	getInteractionTimeout: jest.fn(() => 60000),
	getPostInteractionRate: jest.fn(() => 1),
	getExperimentalInteractionRate: jest.fn(() => 0),
}));

// Mock coinflip
jest.mock('../../coinflip', () => ({
	__esModule: true,
	default: jest.fn(() => false),
}));

describe('Per-interaction VC observer', () => {
	const mockVCObserver = {
		start: jest.fn(),
		stop: jest.fn(),
		getVCRawData: jest.fn(),
		getVCResult: jest.fn(),
		setSSRElement: jest.fn(),
		setReactRootRenderStart: jest.fn(),
		setReactRootRenderStop: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(getVCObserver as jest.MockedFunction<typeof getVCObserver>).mockReturnValue(mockVCObserver);
		(newVCObserver as jest.MockedFunction<typeof newVCObserver>).mockReturnValue(mockVCObserver);
		(getConfig as jest.MockedFunction<typeof getConfig>).mockReturnValue({
			product: 'test',
			region: 'test',
			vc: { enabled: true },
		});
		(getCapabilityRate as jest.MockedFunction<typeof getCapabilityRate>).mockReturnValue(0);
		// Set up the interaction ID context
		DefaultInteractionID.current = null;
	});

	afterEach(() => {
		// Clean up any interactions
		const activeInteraction = getActiveInteraction();
		if (activeInteraction) {
			remove(activeInteraction.id);
		}
	});

	describe('when platform_ufo_enable_vc_observer_per_interaction is enabled', () => {
		beforeEach(() => {
			(fg as jest.MockedFunction<typeof fg>).mockImplementation((flagName: string) => {
				if (flagName === 'platform_ufo_enable_vc_observer_per_interaction') {
					return true;
				}
				return false;
			});
		});

		it('should create a per-interaction VC observer for transition interactions', () => {
			(fg as jest.MockedFunction<typeof fg>).mockReturnValue(true);

			const interactionId = 'test-transition-interaction';
			const startTime = 1000;

			// Set the current interaction ID
			DefaultInteractionID.current = interactionId;

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'transition',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = getActiveInteraction();
			expect(interaction).toBeDefined();
			expect(interaction?.vcObserver).toBe(mockVCObserver);
			expect(mockVCObserver.start).toHaveBeenCalledWith({
				startTime,
				experienceKey: 'test-ufo-name',
			});
		});

		it('should create a per-interaction VC observer for press interactions when VC is enabled', () => {
			(fg as jest.MockedFunction<typeof fg>).mockImplementation((flagName: string) => {
				if (flagName === 'platform_ufo_enable_vc_press_interactions') {
					return true;
				}
				if (flagName === 'platform_ufo_enable_vc_observer_per_interaction') {
					return true;
				}
				return false;
			});

			const interactionId = 'test-press-interaction';
			const startTime = 1000;

			// Set the current interaction ID
			DefaultInteractionID.current = interactionId;

			addNewInteraction(interactionId, 'test-ufo-name', 'press', startTime, 1, null, null, null);

			const interaction = getActiveInteraction();
			expect(interaction).toBeDefined();
			expect(interaction?.vcObserver).toBe(mockVCObserver);
			expect(mockVCObserver.start).toHaveBeenCalledWith({
				startTime,
				experienceKey: 'test-ufo-name',
			});
		});

		it('should stop the per-interaction VC observer when interaction is removed', () => {
			(fg as jest.MockedFunction<typeof fg>).mockReturnValue(true);

			const interactionId = 'test-cleanup-interaction';
			const startTime = 1000;

			// Set the current interaction ID
			DefaultInteractionID.current = interactionId;

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'transition',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = getActiveInteraction();
			expect(interaction).toBeDefined();

			// Simulate cleanup by calling the cleanup callbacks
			interaction?.cleanupCallbacks.forEach((callback) => callback());

			expect(mockVCObserver.stop).toHaveBeenCalledWith('test-ufo-name');
		});
	});

	describe('when platform_ufo_enable_vc_press_interactions is disabled', () => {
		beforeEach(() => {
			(fg as jest.MockedFunction<typeof fg>).mockImplementation((flagName: string) => {
				if (flagName === 'platform_ufo_enable_vc_press_interactions') {
					return false;
				}
				return false;
			});
		});

		it('should not create a per-interaction VC observer', () => {
			(fg as jest.MockedFunction<typeof fg>).mockReturnValue(false);

			const interactionId = 'test-disabled-interaction';
			const startTime = 1000;

			// Set the current interaction ID
			DefaultInteractionID.current = interactionId;

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'transition',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = getActiveInteraction();
			expect(interaction).toBeDefined();
			expect(interaction?.vcObserver).toBeUndefined();
			// Should still call start on the global observer
			expect(mockVCObserver.start).toHaveBeenCalledWith({
				startTime,
				experienceKey: 'test-ufo-name',
			});
		});
	});
});
