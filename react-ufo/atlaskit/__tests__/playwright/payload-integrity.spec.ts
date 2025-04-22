/* eslint-disable playwright/no-conditional-expect */
/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { VCObserver } from '../../src/vc/vc-observer';

import { expect, test } from './fixtures';

function expectValidNumber(value: any) {
	expect(typeof value === 'number' && Number.isFinite(value)).toBe(true);
}

test.describe('React UFO: Payload integrity - v2.0.0, with TTVC v1 fields', () => {
	test.use({
		examplePage: 'basic',
		viewport: {
			width: 1920,
			height: 1080,
		},
		featureFlags: ['ufo_payload_use_idle_callback', 'platform_ufo_vc_ttai_on_paint'],
	});

	test(`UFO payload contains expected fields for a basic implementation`, async ({
		page,
		waitForReactUFOPayload,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		const sections = page.locator('[data-testid="main"] > div');

		await expect(mainDiv).toBeVisible();
		await expect(sections.nth(9)).toBeVisible();

		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
		const ufoProperties = reactUFOPayload!.attributes.properties;

		expect(typeof ufoProperties.interactionMetrics).toBe('object');
		const { interactionMetrics } = ufoProperties;

		// Static GASv3 fields that should _never_ change, unless GASv3 itself requires changes
		expect(reactUFOPayload!.action).toBe('measured');
		expect(reactUFOPayload!.actionSubject).toBe('experience');
		expect(reactUFOPayload!.eventType).toBe('operational');
		expect(reactUFOPayload!.source).toBe('measured');
		expect(reactUFOPayload!.tags).toStrictEqual(['observability']);

		// Test for deterministic values within the payload
		expect(ufoProperties).toMatchObject({
			'event:product': 'atlaskit',
			'event:schema': '1.0.0',
			'event:source': { name: 'react-ufo/web', version: '2.0.0' },
			'event:region': 'unknown',
			'experience:key': 'custom.interaction-metrics',
			'experience:name': 'test-UFO',
			'ssr:success': false,
			'ssr:featureFlags': undefined,
			'ufo:errors:globalCount': 0,
			'ufo:errors:count': 0,
		});

		expect(interactionMetrics).toMatchObject({
			namePrefix: '',
			segmentPrefix: '',
			pageVisibilityAtTTI: 'visible',
			pageVisibilityAtTTAI: 'visible',
			experimental__pageVisibilityAtTTI: null,
			experimental__pageVisibilityAtTTAI: null,
			rate: 1,
			routeName: 'test-UFO',
			type: 'page_load',
			abortReason: undefined,
			featureFlags: undefined,
			previousInteractionName: undefined,
			isPreviousInteractionAborted: false,
			abortedByInteractionName: undefined,
			apdex: [],
			start: 0,
			marks: [],
			customData: [],
			isBM3ConfigSSRDoneAsFmp: undefined,
			isUFOConfigSSRDoneAsFmp: false,
			errors: [],
			holdActive: [],
			redirects: [],
			spans: [],
			requestInfo: [],
			customTimings: [],
			bundleEvalTimings: [],
			initialPageLoadExtraTimings: [],
			SSRTimings: [],
			'metric:ttai': undefined,
			'metric:experimental:ttai': undefined,
		});

		// Test for non-deterministic bounded values within the payload - i.e. from the browser APIs
		expect([0.25, 0.5, 1, 2, 4, 8].includes(ufoProperties['event:memory'])).toBe(true);
		expect(
			['slow-2g', '2g', '3g', '4g'].includes(ufoProperties['event:network:effectiveType']),
		).toBe(true);
		expect(
			['navigate', 'reload', 'back_forward', 'prerender'].includes(
				ufoProperties['metrics:navigation']?.type ?? '',
			),
		).toBe(true);
		expect(
			['http/0.9', 'http/1.0', 'http/1.1', 'h2', 'h2c', 'h3'].includes(
				ufoProperties['metrics:navigation']?.nextHopProtocol ?? '',
			),
		).toBe(true);

		// Test for non-deterministic unbounded values within the payload
		expect(typeof ufoProperties['event:browser:name']).toBe('string');
		expect(typeof ufoProperties['event:browser:version']).toBe('string');
		expectValidNumber(ufoProperties['event:sizeInKb']);
		expectValidNumber(ufoProperties['event:localHour']);
		expectValidNumber(ufoProperties['event:localDayOfWeek']);
		expectValidNumber(ufoProperties['event:localTimezoneOffset']);
		expectValidNumber(ufoProperties['event:cpus']);
		expectValidNumber(ufoProperties['event:network:rtt']);
		expectValidNumber(ufoProperties['event:network:downlink']);
		expectValidNumber(ufoProperties['metric:fp']);
		expectValidNumber(ufoProperties['metric:fcp']);
		expectValidNumber(ufoProperties['metric:lcp']);
		expectValidNumber(ufoProperties['metrics:navigation']?.redirectStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.redirectEnd);
		expectValidNumber(ufoProperties['metrics:navigation']?.fetchStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.domainLookupStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.domainLookupEnd);
		expectValidNumber(ufoProperties['metrics:navigation']?.connectStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.connectEnd);
		expectValidNumber(ufoProperties['metrics:navigation']?.secureConnectionStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.requestStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.responseStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.responseEnd);
		expectValidNumber(ufoProperties['metrics:navigation']?.encodedBodySize);
		expectValidNumber(ufoProperties['metrics:navigation']?.decodedBodySize);
		expectValidNumber(ufoProperties['metrics:navigation']?.transferSize);
		expectValidNumber(ufoProperties['metrics:navigation']?.redirectCount);
		expectValidNumber(ufoProperties['metrics:navigation']?.unloadEventEnd);
		expectValidNumber(ufoProperties['metrics:navigation']?.unloadEventStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.workerStart);
		expectValidNumber(ufoProperties['ufo:payloadTime']);
		expectValidNumber(interactionMetrics.end);

		// Testing fields that are iterables
		expect(Array.isArray(interactionMetrics.resourceTimings)).toBe(true);
		for (const resourceTiming of interactionMetrics.resourceTimings!) {
			// Test for deterministic values within the payload
			expect(resourceTiming.data.serverTime).toBeUndefined();
			expect(resourceTiming.data.networkTime).toBeUndefined();
			expect(resourceTiming.data.encodedSize).toBeUndefined();
			expect(resourceTiming.data.decodedSize).toBeUndefined();

			// Test for non-deterministic bounded values within the payload - i.e. from the browser APIs
			expect(['network', 'memory', 'disk'].includes(resourceTiming.data.transferType)).toBe(true);
			expect(['script', 'link'].includes(resourceTiming.data.type)).toBe(true);

			// Test for non-deterministic unbounded values within the payload
			expect(typeof resourceTiming.label).toBe('string');
			expectValidNumber(resourceTiming.data.startTime);
			expectValidNumber(resourceTiming.data.duration);
			expectValidNumber(resourceTiming.data.workerStart);
			expectValidNumber(resourceTiming.data.fetchStart);
			expectValidNumber(resourceTiming.data.ttfb);
			expectValidNumber(resourceTiming.data.size);
		}

		expect(typeof interactionMetrics.segments).toBe('object');
		// @ts-ignore - this is an object in `v2.0.0`, but an array in `v1.0.1`
		expect(interactionMetrics.segments?.r?.n).toBe('segment-tree-root');
		// @ts-ignore
		expect(typeof interactionMetrics.segments?.r?.c).toBe('object');
		// @ts-ignore
		const segmentId = Object.keys(interactionMetrics.segments?.r?.c)[0];
		// @ts-ignore
		expect(interactionMetrics.segments?.r?.c?.[segmentId]).toStrictEqual({ n: 'app-root' });

		expect(Array.isArray(interactionMetrics.reactProfilerTimings)).toBe(true);
		for (const reactProfilerTiming of interactionMetrics.reactProfilerTimings) {
			expect(typeof reactProfilerTiming.labelStack).toBe('string');
			expectValidNumber(reactProfilerTiming.startTime);
			expectValidNumber(reactProfilerTiming.endTime);
			expectValidNumber(reactProfilerTiming.mountCount);
			expectValidNumber(reactProfilerTiming.rerenderCount);
			expectValidNumber(reactProfilerTiming.renderDuration);
		}

		// seperate assertions for TTVC information
		expect(Array.isArray(ufoProperties['ufo:vc:rev'])).toBe(true);
		for (const vcRevision of ufoProperties['ufo:vc:rev']) {
			expectValidNumber(vcRevision['metric:vc90']);
			expect(vcRevision['metric:vc90']! <= interactionMetrics.end).toBe(true);
			// @ts-ignore
			expect(vcRevision.vcDetails?.['99'].t <= interactionMetrics.end).toBe(true);
			expect(vcRevision.revision).toMatch(/fy\d\d\.\d\d/);
			expect(vcRevision.clean).toBe(true);

			for (let i = 0; i < VCObserver.VCParts.length; i++) {
				const vcPart = VCObserver.VCParts[i];
				expectValidNumber(vcRevision.vcDetails?.[vcPart]?.t);

				if (i !== VCObserver.VCParts.length - 1) {
					const nextVCPart = VCObserver.VCParts[i + 1];
					// @ts-ignore
					expect(vcRevision.vcDetails?.[vcPart]?.t <= vcRevision.vcDetails?.[nextVCPart]?.t).toBe(
						true,
					);
				}

				expect(Array.isArray(vcRevision.vcDetails?.[vcPart]?.e)).toBe(true);
				// @ts-ignore
				for (const element of vcRevision.vcDetails?.[vcPart]?.e) {
					expect(typeof element).toBe('string');
				}
			}
		}

		expectValidNumber(ufoProperties['metric:vc90']);
		expect(ufoProperties['metric:vc90']! <= interactionMetrics.end).toBe(true);
		expect(ufoProperties).toMatchObject({
			'ufo:vc:state': true,
			'ufo:vc:clean': true,
			'ufo:vc:dom': {
				'25': ['div[testid=sectionThree]'],
				'50': ['div[testid=sectionFive]'],
				'75': ['div[testid=sectionEight]'],
				'80': ['div[testid=sectionEight]'],
				'85': ['div[testid=sectionNine]'],
				'90': ['div[testid=sectionNine]'],
				'95': ['div[testid=sectionTen]'],
				'98': ['div[testid=sectionTen]'],
				'99': ['div[testid=sectionTen]'],
			},
			'ufo:vc:next:dom': {
				'25': ['div[testid=sectionThree]'],
				'50': ['div[testid=sectionFive]'],
				'75': ['div[testid=sectionEight]'],
				'80': ['div[testid=sectionEight]'],
				'85': ['div[testid=sectionNine]'],
				'90': ['div[testid=sectionNine]'],
				'95': ['div[testid=sectionTen]'],
				'98': ['div[testid=sectionTen]'],
				'99': ['div[testid=sectionTen]'],
			},
			'ufo:vc:total': 40000,
			'ufo:vc:ratios': {
				'div[testid=main]': 1,
				'div[testid=sectionOne]': 0.1,
				'div[testid=sectionTwo]': 0.1,
				'div[testid=sectionThree]': 0.1,
				'div[testid=sectionFour]': 0.1,
				'div[testid=sectionFive]': 0.1,
				'div[testid=sectionSix]': 0.1,
				'div[testid=sectionSeven]': 0.1,
				'div[testid=sectionEight]': 0.1,
				'div[testid=sectionNine]': 0.1,
				'div[testid=sectionTen]': 0.1,
			},
		});
		expect(typeof ufoProperties['metrics:vc']).toBe('object');
		// @ts-ignore
		expect(ufoProperties['metrics:vc']?.['99'] <= interactionMetrics.end).toBe(true);
		for (let i = 0; i < VCObserver.VCParts.length; i++) {
			const vcPart = VCObserver.VCParts[i];
			expectValidNumber(ufoProperties['metrics:vc']?.[vcPart]);

			if (i !== VCObserver.VCParts.length - 1) {
				const nextVCPart = VCObserver.VCParts[i + 1];
				expect(
					// @ts-expect-error
					ufoProperties['metrics:vc']?.[vcPart] <= ufoProperties['metrics:vc']?.[nextVCPart],
				).toBe(true);
			}
		}

		expect(Array.isArray(ufoProperties['ufo:vc:updates'])).toBe(true);
		for (let i = 0; i < ufoProperties['ufo:vc:updates']!.length; i++) {
			const vcUpdate = ufoProperties['ufo:vc:updates']![i];
			expectValidNumber(vcUpdate.time);
			expectValidNumber(vcUpdate.vc);

			if (i !== 0) {
				const previousVCUpdate = ufoProperties['ufo:vc:updates']![i - 1];
				expect(vcUpdate.time >= previousVCUpdate.time).toBe(true);
				expect(vcUpdate.vc >= previousVCUpdate.vc).toBe(true);
			}

			expect(Array.isArray(vcUpdate.elements)).toBe(true);
			for (const element of vcUpdate.elements) {
				expect(typeof element).toBe('string');
			}
		}

		expect(typeof ufoProperties['ufo:vc:next']).toBe('object');

		for (let i = 0; i < VCObserver.VCParts.length; i++) {
			const vcPart = VCObserver.VCParts[i];
			expectValidNumber(ufoProperties['ufo:vc:next']?.[vcPart]);

			if (i !== VCObserver.VCParts.length - 1) {
				const nextVCPart = VCObserver.VCParts[i + 1];
				expect(
					// @ts-expect-error
					ufoProperties['ufo:vc:next']?.[vcPart] <= ufoProperties['ufo:vc:next']?.[nextVCPart],
				).toBe(true);
			}
		}

		expect(Array.isArray(ufoProperties['ufo:vc:next:updates'])).toBe(true);
		for (let i = 0; i < ufoProperties['ufo:vc:next:updates']!.length; i++) {
			const vcUpdate = ufoProperties['ufo:vc:next:updates']![i];
			expectValidNumber(vcUpdate.time);
			expectValidNumber(vcUpdate.vc);

			if (i !== 0) {
				const previousVCUpdate = ufoProperties['ufo:vc:next:updates']![i - 1];
				expect(vcUpdate.time >= previousVCUpdate.time).toBe(true);
				expect(vcUpdate.vc >= previousVCUpdate.vc).toBe(true);
			}

			expect(Array.isArray(vcUpdate.elements)).toBe(true);
			for (const element of vcUpdate.elements) {
				expect(typeof element).toBe('string');
			}
		}
	});
});

test.describe('React UFO: Payload integrity - v2.0.0, without TTVC v1 fields', () => {
	test.use({
		examplePage: 'basic',
		viewport: {
			width: 1920,
			height: 1080,
		},
		featureFlags: [
			'ufo_payload_use_idle_callback',
			'platform_ufo_vc_ttai_on_paint',
			'platform_ufo_disable_ttvc_v1',
		],
	});

	test(`UFO payload contains expected fields for a basic implementation`, async ({
		page,
		waitForReactUFOPayload,
	}) => {
		const mainDiv = page.locator('[data-testid="main"]');
		const sections = page.locator('[data-testid="main"] > div');

		await expect(mainDiv).toBeVisible();
		await expect(sections.nth(9)).toBeVisible();

		const reactUFOPayload = await waitForReactUFOPayload();
		expect(reactUFOPayload).toBeDefined();

		expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
		const ufoProperties = reactUFOPayload!.attributes.properties;

		expect(typeof ufoProperties.interactionMetrics).toBe('object');
		const { interactionMetrics } = ufoProperties;

		// Static GASv3 fields that should _never_ change, unless GASv3 itself requires changes
		expect(reactUFOPayload!.action).toBe('measured');
		expect(reactUFOPayload!.actionSubject).toBe('experience');
		expect(reactUFOPayload!.eventType).toBe('operational');
		expect(reactUFOPayload!.source).toBe('measured');
		expect(reactUFOPayload!.tags).toStrictEqual(['observability']);

		// Test for deterministic values within the payload
		expect(ufoProperties).toMatchObject({
			'event:product': 'atlaskit',
			'event:schema': '1.0.0',
			'event:source': { name: 'react-ufo/web', version: '2.0.0' },
			'event:region': 'unknown',
			'experience:key': 'custom.interaction-metrics',
			'experience:name': 'test-UFO',
			'ssr:success': false,
			'ssr:featureFlags': undefined,
			'ufo:errors:globalCount': 0,
			'ufo:errors:count': 0,
		});

		expect(interactionMetrics).toMatchObject({
			namePrefix: '',
			segmentPrefix: '',
			pageVisibilityAtTTI: 'visible',
			pageVisibilityAtTTAI: 'visible',
			experimental__pageVisibilityAtTTI: null,
			experimental__pageVisibilityAtTTAI: null,
			rate: 1,
			routeName: 'test-UFO',
			type: 'page_load',
			abortReason: undefined,
			featureFlags: undefined,
			previousInteractionName: undefined,
			isPreviousInteractionAborted: false,
			abortedByInteractionName: undefined,
			apdex: [],
			start: 0,
			marks: [],
			customData: [],
			isBM3ConfigSSRDoneAsFmp: undefined,
			isUFOConfigSSRDoneAsFmp: false,
			errors: [],
			holdActive: [],
			redirects: [],
			spans: [],
			requestInfo: [],
			customTimings: [],
			bundleEvalTimings: [],
			initialPageLoadExtraTimings: [],
			SSRTimings: [],
			'metric:ttai': undefined,
			'metric:experimental:ttai': undefined,
		});

		// Test for non-deterministic bounded values within the payload - i.e. from the browser APIs
		expect([0.25, 0.5, 1, 2, 4, 8].includes(ufoProperties['event:memory'])).toBe(true);
		expect(
			['slow-2g', '2g', '3g', '4g'].includes(ufoProperties['event:network:effectiveType']),
		).toBe(true);
		expect(
			['navigate', 'reload', 'back_forward', 'prerender'].includes(
				ufoProperties['metrics:navigation']?.type ?? '',
			),
		).toBe(true);
		expect(
			['http/0.9', 'http/1.0', 'http/1.1', 'h2', 'h2c', 'h3'].includes(
				ufoProperties['metrics:navigation']?.nextHopProtocol ?? '',
			),
		).toBe(true);

		// Test for non-deterministic unbounded values within the payload
		expect(typeof ufoProperties['event:browser:name']).toBe('string');
		expect(typeof ufoProperties['event:browser:version']).toBe('string');
		expectValidNumber(ufoProperties['event:sizeInKb']);
		expectValidNumber(ufoProperties['event:localHour']);
		expectValidNumber(ufoProperties['event:localDayOfWeek']);
		expectValidNumber(ufoProperties['event:localTimezoneOffset']);
		expectValidNumber(ufoProperties['event:cpus']);
		expectValidNumber(ufoProperties['event:network:rtt']);
		expectValidNumber(ufoProperties['event:network:downlink']);
		expectValidNumber(ufoProperties['metric:fp']);
		expectValidNumber(ufoProperties['metric:fcp']);
		expectValidNumber(ufoProperties['metric:lcp']);
		expectValidNumber(ufoProperties['metrics:navigation']?.redirectStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.redirectEnd);
		expectValidNumber(ufoProperties['metrics:navigation']?.fetchStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.domainLookupStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.domainLookupEnd);
		expectValidNumber(ufoProperties['metrics:navigation']?.connectStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.connectEnd);
		expectValidNumber(ufoProperties['metrics:navigation']?.secureConnectionStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.requestStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.responseStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.responseEnd);
		expectValidNumber(ufoProperties['metrics:navigation']?.encodedBodySize);
		expectValidNumber(ufoProperties['metrics:navigation']?.decodedBodySize);
		expectValidNumber(ufoProperties['metrics:navigation']?.transferSize);
		expectValidNumber(ufoProperties['metrics:navigation']?.redirectCount);
		expectValidNumber(ufoProperties['metrics:navigation']?.unloadEventEnd);
		expectValidNumber(ufoProperties['metrics:navigation']?.unloadEventStart);
		expectValidNumber(ufoProperties['metrics:navigation']?.workerStart);
		expectValidNumber(ufoProperties['ufo:payloadTime']);
		expectValidNumber(interactionMetrics.end);

		// Testing fields that are iterables
		expect(Array.isArray(interactionMetrics.resourceTimings)).toBe(true);
		for (const resourceTiming of interactionMetrics.resourceTimings!) {
			// Test for deterministic values within the payload
			expect(resourceTiming.data.serverTime).toBeUndefined();
			expect(resourceTiming.data.networkTime).toBeUndefined();
			expect(resourceTiming.data.encodedSize).toBeUndefined();
			expect(resourceTiming.data.decodedSize).toBeUndefined();

			// Test for non-deterministic bounded values within the payload - i.e. from the browser APIs
			expect(['network', 'memory', 'disk'].includes(resourceTiming.data.transferType)).toBe(true);
			expect(['script', 'link'].includes(resourceTiming.data.type)).toBe(true);

			// Test for non-deterministic unbounded values within the payload
			expect(typeof resourceTiming.label).toBe('string');
			expectValidNumber(resourceTiming.data.startTime);
			expectValidNumber(resourceTiming.data.duration);
			expectValidNumber(resourceTiming.data.workerStart);
			expectValidNumber(resourceTiming.data.fetchStart);
			expectValidNumber(resourceTiming.data.ttfb);
			expectValidNumber(resourceTiming.data.size);
		}

		expect(typeof interactionMetrics.segments).toBe('object');
		// @ts-ignore - this is an object in `v2.0.0`, but an array in `v1.0.1`
		expect(interactionMetrics.segments?.r?.n).toBe('segment-tree-root');
		// @ts-ignore
		expect(typeof interactionMetrics.segments?.r?.c).toBe('object');
		// @ts-ignore
		const segmentId = Object.keys(interactionMetrics.segments?.r?.c)[0];
		// @ts-ignore
		expect(interactionMetrics.segments?.r?.c?.[segmentId]).toStrictEqual({ n: 'app-root' });

		expect(Array.isArray(interactionMetrics.reactProfilerTimings)).toBe(true);
		for (const reactProfilerTiming of interactionMetrics.reactProfilerTimings) {
			expect(typeof reactProfilerTiming.labelStack).toBe('string');
			expectValidNumber(reactProfilerTiming.startTime);
			expectValidNumber(reactProfilerTiming.endTime);
			expectValidNumber(reactProfilerTiming.mountCount);
			expectValidNumber(reactProfilerTiming.rerenderCount);
			expectValidNumber(reactProfilerTiming.renderDuration);
		}

		// seperate assertions for TTVC information
		expect(Array.isArray(ufoProperties['ufo:vc:rev'])).toBe(true);
		for (const vcRevision of ufoProperties['ufo:vc:rev']) {
			expectValidNumber(vcRevision['metric:vc90']);
			expect(vcRevision['metric:vc90']! <= interactionMetrics.end).toBe(true);
			// @ts-ignore
			expect(vcRevision.vcDetails?.['99'].t <= interactionMetrics.end).toBe(true);
			expect(vcRevision.revision).toMatch(/fy\d\d\.\d\d/);
			expect(vcRevision.clean).toBe(true);

			for (let i = 0; i < VCObserver.VCParts.length; i++) {
				const vcPart = VCObserver.VCParts[i];
				expectValidNumber(vcRevision.vcDetails?.[vcPart]?.t);

				if (i !== VCObserver.VCParts.length - 1) {
					const nextVCPart = VCObserver.VCParts[i + 1];
					// @ts-ignore
					expect(vcRevision.vcDetails?.[vcPart]?.t <= vcRevision.vcDetails?.[nextVCPart]?.t).toBe(
						true,
					);
				}

				expect(Array.isArray(vcRevision.vcDetails?.[vcPart]?.e)).toBe(true);
				// @ts-ignore
				for (const element of vcRevision.vcDetails?.[vcPart]?.e) {
					expect(typeof element).toBe('string');
				}
			}
		}

		expectValidNumber(ufoProperties['metric:vc90']);
		expect(ufoProperties['metric:vc90']! <= interactionMetrics.end).toBe(true);
		expect(ufoProperties).toMatchObject({
			'ufo:vc:ratios': {
				'div[testid=main]': 1,
				'div[testid=sectionOne]': 0.1,
				'div[testid=sectionTwo]': 0.1,
				'div[testid=sectionThree]': 0.1,
				'div[testid=sectionFour]': 0.1,
				'div[testid=sectionFive]': 0.1,
				'div[testid=sectionSix]': 0.1,
				'div[testid=sectionSeven]': 0.1,
				'div[testid=sectionEight]': 0.1,
				'div[testid=sectionNine]': 0.1,
				'div[testid=sectionTen]': 0.1,
			},
		});
	});
});
