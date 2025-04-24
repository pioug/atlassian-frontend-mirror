import type { InteractionMetrics } from '../../common';
import { getPageVisibilityState } from '../../hidden-timing';

import getPageVisibilityUpToTTAI from './get-page-visibility-up-to-ttai';

// Mock the external dependency
jest.mock('../../hidden-timing', () => ({
	getPageVisibilityState: jest.fn(),
}));

describe('getPageVisibilityUpToTTAI', () => {
	// Helper function to create test interaction metrics
	const createInteractionMetrics = (start: number, end: number): InteractionMetrics =>
		({
			start,

			// Add other required properties of InteractionMetrics interface
			// with dummy values if needed
			end,
		}) as InteractionMetrics;

	// Clear all mocks before each test
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return visible state', () => {
		const start = 1000;
		const end = 2000;
		const interaction = createInteractionMetrics(start, end);

		(getPageVisibilityState as jest.Mock).mockReturnValue('visible');

		const result = getPageVisibilityUpToTTAI(interaction);

		expect(getPageVisibilityState).toHaveBeenCalledWith(start, end);
		expect(getPageVisibilityState).toHaveBeenCalledTimes(1);
		expect(result).toBe('visible');
	});

	it('should return hidden state', () => {
		const interaction = createInteractionMetrics(1000, 2000);

		(getPageVisibilityState as jest.Mock).mockReturnValue('hidden');

		const result = getPageVisibilityUpToTTAI(interaction);

		expect(getPageVisibilityState).toHaveBeenCalledWith(1000, 2000);
		expect(result).toBe('hidden');
	});

	it('should return mixed state', () => {
		const interaction = createInteractionMetrics(1000, 2000);

		(getPageVisibilityState as jest.Mock).mockReturnValue('mixed');

		const result = getPageVisibilityUpToTTAI(interaction);

		expect(getPageVisibilityState).toHaveBeenCalledWith(1000, 2000);
		expect(result).toBe('mixed');
	});

	it('should handle zero start and end times', () => {
		const interaction = createInteractionMetrics(0, 0);

		(getPageVisibilityState as jest.Mock).mockReturnValue('visible');

		const result = getPageVisibilityUpToTTAI(interaction);

		expect(getPageVisibilityState).toHaveBeenCalledWith(0, 0);
		expect(result).toBe('visible');
	});

	it('should handle negative time differences', () => {
		const interaction = createInteractionMetrics(2000, 1000);

		(getPageVisibilityState as jest.Mock).mockReturnValue('hidden');

		const result = getPageVisibilityUpToTTAI(interaction);

		expect(getPageVisibilityState).toHaveBeenCalledWith(2000, 1000);
		expect(result).toBe('hidden');
	});
});
