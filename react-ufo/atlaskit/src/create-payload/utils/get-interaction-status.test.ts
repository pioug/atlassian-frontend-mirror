import type { InteractionMetrics } from '../../common';

import getInteractionStatus from './get-interaction-status';

describe('getInteractionStatus', () => {
	// Helper function to create test interaction metrics
	const createInteractionMetrics = (
		abortReason?: string,
		apdex: any[] = [],
		errors: any[] = [],
	): InteractionMetrics =>
		({
			abortReason,

			// Add other required properties of InteractionMetrics interface
			// with dummy values if needed
			apdex,
			errors,
		}) as InteractionMetrics;

	it('should return ABORTED original status when there is abort reason', () => {
		const interaction = createInteractionMetrics('some reason', []);

		const result = getInteractionStatus(interaction);

		expect(result).toEqual({
			originalInteractionStatus: 'ABORTED',
			overrideStatus: 'ABORTED',
		});
	});

	it('should return SUCCEEDED status when there is no abort reason', () => {
		const interaction = createInteractionMetrics(undefined, []);

		const result = getInteractionStatus(interaction);

		expect(result).toEqual({
			originalInteractionStatus: 'SUCCEEDED',
			overrideStatus: 'SUCCEEDED',
		});
	});

	it('should return FAILED when there is an error', () => {
		const interaction = createInteractionMetrics(undefined, [], [{ error: 'test' }]);

		const result = getInteractionStatus(interaction);

		expect(result).toEqual({
			originalInteractionStatus: 'FAILED',
			overrideStatus: 'FAILED',
		});
	});
});
