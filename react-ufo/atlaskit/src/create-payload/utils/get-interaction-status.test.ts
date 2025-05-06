import { fg } from '@atlaskit/platform-feature-flags';

import type { InteractionMetrics } from '../../common';

jest.mock('@atlaskit/platform-feature-flags');
const mockFg = fg as jest.Mock;

import getInteractionStatus from './get-interaction-status';

describe('getInteractionStatus', () => {
	afterEach(() => {
		mockFg.mockClear();
	});

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

	it('should return ABORTED override status when there is BM3 TTI and an abort reason - platform_ufo_ignore_bm3_tti_event_status FG on', () => {
		mockFg.mockImplementation((key) => {
			if (key === 'platform_ufo_ignore_bm3_tti_event_status') {
				return true;
			}

			return false;
		});

		const interaction = createInteractionMetrics('some reason', [1]);

		const result = getInteractionStatus(interaction);

		expect(result).toEqual({
			originalInteractionStatus: 'ABORTED',
			overrideStatus: 'ABORTED',
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

	it('should return FAILED when there is an error', () => {
		mockFg.mockImplementation((key) => {
			if (key === 'platform_ufo_set_event_failed_status_in_client') {
				return true;
			}

			return false;
		});

		const interaction = createInteractionMetrics(undefined, [], [{ error: 'test' }]);

		const result = getInteractionStatus(interaction);

		expect(result).toEqual({
			originalInteractionStatus: 'FAILED',
			overrideStatus: 'FAILED',
		});
	});
});
