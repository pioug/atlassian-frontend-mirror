import { shapeResourceTimingData } from './shape-resource-timing';

describe('shapeResourceTimingData — `source` field', () => {
	const baseEvent = (source: unknown) => ({
		payload: {
			name: 'https://example.com/x.js',
			startTime: 100,
			duration: 50,
			initiatorType: 'script',
			source,
		},
	});

	it.each([
		['forge-framework', 'forge-framework'],
		['forge-app', 'forge-app'],
		['external', 'external'],
		// Legacy values from PR #769, kept for rollout compatibility while
		// forge-cdn bridges in the wild transition to the 3-bucket values.
		['internal', 'internal'],
	])('passes through accepted source value %s', (input, expected) => {
		const shaped = shapeResourceTimingData(baseEvent(input));
		expect(shaped.source).toBe(expected);
	});

	it.each([undefined, null, '', 'unknown', 42, true, {}, []])(
		'drops unknown / malformed source value: %p',
		(input) => {
			const shaped = shapeResourceTimingData(baseEvent(input));
			expect(shaped.source).toBeUndefined();
		},
	);

	it('omits the source key entirely when the bridge did not send one', () => {
		const shaped = shapeResourceTimingData({
			payload: {
				name: 'https://example.com/x.js',
				startTime: 100,
				duration: 50,
				initiatorType: 'script',
			},
		});
		expect('source' in shaped).toBe(false);
	});
});
