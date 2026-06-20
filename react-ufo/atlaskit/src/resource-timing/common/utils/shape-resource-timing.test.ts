import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { shapeResourceTimingData } from './shape-resource-timing';

const THIRD_PARTY_SEGMENT_TIMINGS_GATE = 'platform_ufo_3p_segment_timings';

function makeResourceTimingEvent({
	name = 'https://example.com/static/app.js',
	initiatorType = 'script',
	source,
}: {
	name?: string;
	initiatorType?: string;
	source?: unknown;
} = {}) {
	return {
		payload: {
			name,
			startTime: 100,
			duration: 50,
			initiatorType,
			transferSize: 123,
			encodedBodySize: 100,
			decodedBodySize: 200,
			timing: {
				fetchStart: 90,
				requestStart: 110,
				responseStart: 140,
				workerStart: 80,
			},
			...(source !== undefined ? { source } : {}),
		},
	};
}

describe('shapeResourceTimingData — `source` field', () => {
	beforeEach(() => {
		passGate(THIRD_PARTY_SEGMENT_TIMINGS_GATE);
	});

	it.each([
		['forge-framework', 'forge-framework'],
		['forge-app', 'forge-app'],
		['external', 'external'],
		// Legacy values from PR #769, kept for rollout compatibility while
		// forge-cdn bridges in the wild transition to the 3-bucket values.
		['internal', 'internal'],
	])('passes through accepted source value %s', (input, expected) => {
		const shaped = shapeResourceTimingData(makeResourceTimingEvent({ source: input }));
		expect(shaped).toBeDefined();
		expect(shaped?.source).toBe(expected);
	});

	it.each([undefined, null, '', 'unknown', 42, true, {}, []])(
		'drops unknown / malformed source value: %p',
		(input) => {
			const shaped = shapeResourceTimingData(makeResourceTimingEvent({ source: input }));
			expect(shaped).toBeDefined();
			expect(shaped?.source).toBeUndefined();
		},
	);

	it('omits the source key entirely when the bridge did not send one', () => {
		const shaped = shapeResourceTimingData(makeResourceTimingEvent());
		expect(shaped).toBeDefined();
		expect('source' in shaped!).toBe(false);
	});
});

describe('shapeResourceTimingData — legacy resource behavior', () => {
	it('keeps URL-derived labels and non CSS/JS resources when third-party segment timings are off', () => {
		failGate(THIRD_PARTY_SEGMENT_TIMINGS_GATE);

		const pdfTiming = shapeResourceTimingData(
			makeResourceTimingEvent({
				name: 'https://cdn.example.com/uploads/customer-plan.pdf',
				initiatorType: 'link',
			}),
		);
		const fetchTiming = shapeResourceTimingData(
			makeResourceTimingEvent({
				name: 'https://api.example.com/wiki/private-space/roadmap',
				initiatorType: 'fetch',
			}),
		);

		expect(pdfTiming).toMatchObject({ label: 'customer-plan.pdf', type: 'link' });
		expect(fetchTiming).toMatchObject({ label: 'roadmap', type: 'fetch' });
	});
});

describe('shapeResourceTimingData — resource allowlist', () => {
	beforeEach(() => {
		passGate(THIRD_PARTY_SEGMENT_TIMINGS_GATE);
	});

	it.each([
		['script', 'https://cdn.example.com/static/app.js', 'app.js'],
		['script', 'https://cdn.example.com/static/app.mjs?tenant=my-customer', 'app.mjs'],
		['script', 'https://cdn.example.com/static/app.cjs#hash', 'app.cjs'],
		['link', 'https://cdn.example.com/static/app.css?theme=custom-theme', 'app.css'],
		['css', 'https://cdn.example.com/static/imported.css', 'imported.css'],
		['link', 'https://cdn.example.com/static/preloaded.js', 'preloaded.js'],
		['other', 'https://cdn.example.com/static/runtime.js', 'runtime.js'],
		['other', 'https://cdn.example.com/static/dynamic.css?theme=custom-theme', 'dynamic.css'],
	])('keeps %s timing for CSS/JS asset %s', (initiatorType, name, expectedLabel) => {
		const shaped = shapeResourceTimingData(makeResourceTimingEvent({ name, initiatorType }));

		expect(shaped).toMatchObject({
			label: expectedLabel,
			type: initiatorType,
			startTime: 100,
			duration: 50,
			fetchStart: 90,
			ttfb: 140,
		});
	});

	it.each([
		[
			'fetch',
			'https://api.example.com/rest/api/content/123?expand=body.storage#section',
			'https://api.example.com/rest/api/content/123',
		],
		[
			'xmlhttprequest',
			'https://api.example.com/gateway/api/object-resolver/safe-endpoint?cloudId=secret',
			'https://api.example.com/gateway/api/object-resolver/safe-endpoint',
		],
	])(
		'keeps %s timing with safe URL labels after stripping query and hash',
		(initiatorType, name, expectedLabel) => {
			const shaped = shapeResourceTimingData(makeResourceTimingEvent({ name, initiatorType }));

			expect(shaped).toMatchObject({
				label: expectedLabel,
				type: initiatorType,
				requestStart: 110,
				ttfb: 140,
			});
			expect(shaped?.label).not.toContain('?');
			expect(shaped?.label).not.toContain('#');
		},
	);

	it.each([
		['fetch', 'https://site.atlassian.net/secure/attachment/12345/Screen%20Shot%202026-06-18.jpg'],
		['xmlhttprequest', 'https://cdn.example.com/uploads/customer-roadmap-final-review-version.png'],
		['xmlhttprequest', 'https://cdn.example.com/uploads/photo.jpg'],
		['fetch', 'https://cdn.example.com/uploads/icon.svg'],
	])('normalizes backend image resource %s %s', (initiatorType, name) => {
		const shaped = shapeResourceTimingData(makeResourceTimingEvent({ name, initiatorType }));

		expect(shaped).toMatchObject({
			label: '<image-resource>',
			type: initiatorType,
			requestStart: 110,
			ttfb: 140,
		});
	});

	it.each([
		['fetch', 'https://site.atlassian.net/wiki/download/attachments/12345/design-doc.pdf'],
		['fetch', 'https://site.atlassian.net/wiki/rest/api/content/123/child/attachment'],
		['fetch', 'https://cdn.example.com/uploads/customer-plan.pdf'],
		['fetch', 'https://cdn.example.com/uploads/meeting-recording.mp4'],
		['xmlhttprequest', 'https://cdn.example.com/uploads/customer-font.woff2'],
	])('normalizes backend file/media resource %s %s', (initiatorType, name) => {
		const shaped = shapeResourceTimingData(makeResourceTimingEvent({ name, initiatorType }));

		expect(shaped).toMatchObject({
			label: '<file-resource>',
			type: initiatorType,
			requestStart: 110,
			ttfb: 140,
		});
	});

	it.each([
		'https://avatar-management--avatars.example.com/initials/AB-1.png',
		'https://avatar.example.com/hash?d=https%3A%2F%2Favatar-management.example.com%2Finitials%2FAB-1.png',
		'https://site.atlassian.net/secure/viewavatar?avatarId=12345',
	])('normalizes avatar backend resource %s', (name) => {
		const shaped = shapeResourceTimingData(
			makeResourceTimingEvent({ name, initiatorType: 'fetch' }),
		);

		expect(shaped).toMatchObject({
			label: '<avatar-resource>',
			type: 'fetch',
		});
	});

	it.each([
		['img', 'https://cdn.example.com/uploads/customer-roadmap.png'],
		['image', 'https://cdn.example.com/uploads/customer-diagram.svg'],
		['link', 'https://cdn.example.com/uploads/customer-plan.pdf'],
		['css', 'https://cdn.example.com/uploads/customer-font.woff2'],
		['video', 'https://cdn.example.com/uploads/customer-demo.mp4'],
		['other', 'https://cdn.example.com/uploads/customer-plan.pdf'],
	])('drops %s timing for non CSS/JS asset %s', (initiatorType, name) => {
		const shaped = shapeResourceTimingData(makeResourceTimingEvent({ name, initiatorType }));

		expect(shaped).toBeUndefined();
	});
});
