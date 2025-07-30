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

	describe('when VC is enabled', () => {
		beforeEach(() => {
			(getConfig as jest.MockedFunction<typeof getConfig>).mockReturnValue({
				product: 'test',
				region: 'test',
				vc: { enabled: true },
			});
		});

		it('should create a per-interaction VC observer for transition interactions', () => {
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

		it('should create a per-interaction VC observer for press interactions when feature flag is enabled', () => {
			(fg as jest.MockedFunction<typeof fg>).mockImplementation((flagName: string) => {
				if (flagName === 'platform_ufo_enable_vc_press_interactions') {
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

	describe('when VC is disabled', () => {
		beforeEach(() => {
			(getConfig as jest.MockedFunction<typeof getConfig>).mockReturnValue({
				product: 'test',
				region: 'test',
				// When VC is disabled, config.vc should be undefined or null
				vc: undefined,
			});
			// When VC is disabled, newVCObserver should not be called
			(newVCObserver as jest.MockedFunction<typeof newVCObserver>).mockClear();
		});

		it('should not create a per-interaction VC observer when VC is disabled', () => {
			const interactionId = 'test-disabled-vc-interaction';
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
			expect(mockVCObserver.start).not.toHaveBeenCalled();
			// newVCObserver should not be called when VC is disabled
			expect(newVCObserver).not.toHaveBeenCalled();
		});
	});
});
