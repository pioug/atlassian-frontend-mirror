import type { InteractionMetrics } from '../../common';

import getInteractionStatus from './get-interaction-status';

describe('getInteractionStatus', () => {
	// Helper function to create test interaction metrics
	const createInteractionMetrics = (abortReason?: string, apdex: any[] = []): InteractionMetrics =>
		({
			abortReason,

			// Add other required properties of InteractionMetrics interface
			// with dummy values if needed
			apdex,
		}) as InteractionMetrics;

	it('should return SUCCEEDED status when there is no abort reason and has BM3 TTI', () => {
		const interaction = createInteractionMetrics(undefined, [1]);

		const result = getInteractionStatus(interaction);

		expect(result).toEqual({
			originalInteractionStatus: 'SUCCEEDED',
			overrideStatus: 'SUCCEEDED',
		});
	});

	it('should return ABORTED original status when there is abort reason', () => {
		const interaction = createInteractionMetrics('some reason', []);

		const result = getInteractionStatus(interaction);

		expect(result).toEqual({
			originalInteractionStatus: 'ABORTED',
			overrideStatus: 'ABORTED',
		});
	});

	it('should return SUCCEEDED override status when there is BM3 TTI, even with abort reason', () => {
		const interaction = createInteractionMetrics('some reason', [1]);

		const result = getInteractionStatus(interaction);

		expect(result).toEqual({
			originalInteractionStatus: 'ABORTED',
			overrideStatus: 'SUCCEEDED',
		});
	});

	it('should return SUCCEEDED status when there is no abort reason and no BM3 TTI', () => {
		const interaction = createInteractionMetrics(undefined, []);

		const result = getInteractionStatus(interaction);

		expect(result).toEqual({
			originalInteractionStatus: 'SUCCEEDED',
			overrideStatus: 'SUCCEEDED',
		});
	});
});
