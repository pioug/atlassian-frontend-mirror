import { fg } from '@atlaskit/platform-feature-flags';

import { interactions } from '../common/constants';
import { addCustomTiming, addNewInteraction } from '../index';

jest.mock('@atlaskit/platform-feature-flags');

const mockFg = fg as jest.Mock;

describe('addCustomTiming timing name length validation', () => {
	beforeEach(() => {
		interactions.clear();
		mockFg.mockReset();
		mockFg.mockReturnValue(false);
	});

	afterEach(() => {
		interactions.clear();
	});

	it('keeps long custom timing names when the gate is disabled', () => {
		const interactionId = 'test-interaction-id';
		addNewInteraction(interactionId, 'test-ufo-name', 'page_load', performance.now(), 1.0, []);
		const longKey = 'a'.repeat(300);

		addCustomTiming(interactionId, [], {
			[longKey]: { startTime: 10, endTime: 20 },
		});

		const interaction = interactions.get(interactionId);
		expect(Object.keys(interaction!.customTimings[0].data)).toEqual([longKey]);
	});

	it('truncates long custom timing names when the gate is enabled', () => {
		const interactionId = 'test-interaction-id';
		mockFg.mockImplementation(
			(flagName: string) => flagName === 'platform_ufo_validate_timing_name_length',
		);
		addNewInteraction(interactionId, 'test-ufo-name', 'page_load', performance.now(), 1.0, []);
		const longKey = 'a'.repeat(300);

		addCustomTiming(interactionId, [], {
			[longKey]: { startTime: 10, endTime: 20 },
		});

		const interaction = interactions.get(interactionId);
		const [timingKey] = Object.keys(interaction!.customTimings[0].data);
		expect(timingKey).toHaveLength(255);
		expect(timingKey).toBe(longKey.slice(0, 255));
	});
});
