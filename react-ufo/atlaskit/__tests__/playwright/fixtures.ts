/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
/* eslint-disable compat/compat */
/* eslint-disable no-unused-vars */
import type { PlaywrightCoverageOptions } from 'build/test-tooling/integration-testing/src/fixtures';
import type {
	PlaywrightTestArgs,
	PlaywrightTestOptions,
	PlaywrightWorkerArgs,
	PlaywrightWorkerOptions,
	TestType,
} from 'playwright/test';

import {
	test as base,
	expect as baseExpect,
	type Expect,
	type Page,
} from '@af/integration-testing';

import type {
	PostInteractionLogPayload,
	ReactUFOPayload,
} from '../../src/common/react-ufo-payload-schema';
import { type CriticalMetricsPayload } from '../../src/create-payload/critical-metrics-payload/types';
import type { TerminalErrorPayload } from '../../src/create-terminal-error-payload';

import type { WindowWithReactUFOTestGlobals } from './window-type';

const prepareParams = (params?: { [key: string]: string | boolean }) => {
	if (!params) {
		return { urlParams: {}, featureFlags: '' };
	}
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { featureFlag, ...rest } = params;

	// url param in string format: '&featureFlag=feature-flag-key&featureFlag=feature-flag-key'
	const featureFlags =
		typeof params.featureFlag === 'string'
			? // Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				`&featureFlag=${params.featureFlag.split(/[ ,;]+/).join('&featureFlag=')}`
			: '';

	return { urlParams: rest, featureFlags };
};

const getExampleURL = (props: {
	baseURL: string | undefined;
	groupId: string;
	packageId: string;
	exampleId: string | undefined;
	params: Record<string, string | boolean> | undefined;
}) => {
	const { baseURL, groupId, packageId, exampleId, params } = props;
	const { urlParams, featureFlags } = prepareParams(params);
	const searchParams = new URLSearchParams({
		groupId,
		packageId,
		isTestRunner: 'true',
		...(exampleId ? { exampleId } : {}),
		mode: 'light',
		...urlParams,
	});

	const url = `${baseURL}/examples.html?${searchParams.toString()}${featureFlags}`;
	return url;
};

export const test: TestType<
	PlaywrightTestArgs &
		PlaywrightTestOptions & {
			skipAxeCheck: () => void;
		} & PlaywrightCoverageOptions & {
			viewport: {
				width: number;
				height: number;
			};
			featureFlags: string[];
			examplePage: string;
			waitForReactUFOPayload: () => Promise<ReactUFOPayload | null>;
			waitForReactUFOPayloadCriticalMetrics: () => Promise<CriticalMetricsPayload[] | null>;
			waitForReactUFOInteractionPayload: () => Promise<ReactUFOPayload | null>;
			waitForPostInteractionLogPayload: () => Promise<PostInteractionLogPayload | null>;
			waitForInteractionExtraMetricsPayload: () => Promise<ReactUFOPayload | null>;
			waitForExtraSearchPageInteractionPayload: () => Promise<ReactUFOPayload | null>;
			waitForTerminalErrorPayload: () => Promise<TerminalErrorPayload | null>;
			waitForAllTerminalErrorPayloads: (expectedCount: number) => Promise<TerminalErrorPayload[]>;
			/*
			 * ATTENTION: This function uses a `performance.now()` from the DOMMutation callback.
			 * This is not valid for the last ReactUFO TTVC version,
			 * the new versions uses the IntersectionObserver `entry.time`.
			 * Please, if you are writting a new test, then use the `getSectionVisibleAt`
			 *
			 * Usage:
			 *
			 * Best way to found out when a Section div was "rendered".
			 *
			 * When a DOM Element with `data-testid` is added into the DOM for the first time,
			 * we save the timestamp in a map.
			 *
			 * This function will wait until the given Element testId is added into an internal map.
			 * It does that by using a `expect.poll`.
			 *
			 */
			getSectionDOMAddedAt: (sectionTestId: string) => Promise<DOMHighResTimeStamp | null>;
			/*
			 * Usage:
			 *
			 * Best way to found out when a Section div was "painted".
			 *
			 * When a DOM Element with `data-testid` is painted for the first time,
			 *
			 * This function will wait until the given Element testId is added into an internal map.
			 * It does that by using a `expect.poll`.
			 */
			getSectionVisibleAt: (sectionTestId: string) => Promise<DOMHighResTimeStamp | null>;
			/*
			 * Usage:
			 *
			 * Best way to found out when a Section div has attribute mutation.
			 *
			 * This function will wait until the given Element testId is added into an internal map.
			 * It does that by using a `expect.poll`.
			 */
			getSectionAttributeNthChange: (
				sectionTestId: string,
				nthChange: number,
			) => Promise<DOMHighResTimeStamp | null>;
		},
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
> = base.extend<{
	viewport: {
		width: number;
		height: number;
	};
	featureFlags: string[];
	examplePage: string;
	waitForReactUFOPayload: () => Promise<ReactUFOPayload | null>;
	waitForReactUFOPayloadCriticalMetrics: () => Promise<CriticalMetricsPayload[] | null>;
	waitForReactUFOInteractionPayload: () => Promise<ReactUFOPayload | null>;
	waitForPostInteractionLogPayload: () => Promise<PostInteractionLogPayload | null>;
	waitForInteractionExtraMetricsPayload: () => Promise<ReactUFOPayload | null>;
	waitForExtraSearchPageInteractionPayload: () => Promise<ReactUFOPayload | null>;
	waitForTerminalErrorPayload: () => Promise<TerminalErrorPayload | null>;
	waitForAllTerminalErrorPayloads: (expectedCount: number) => Promise<TerminalErrorPayload[]>;
	/*
	 * ATTENTION: This function uses a `performance.now()` from the DOMMutation callback.
	 * This is not valid for the last ReactUFO TTVC version,
	 * the new versions uses the IntersectionObserver `entry.time`.
	 * Please, if you are writting a new test, then use the `getSectionVisibleAt`
	 *
	 * Usage:
	 *
	 * Best way to found out when a Section div was "rendered".
	 *
	 * When a DOM Element with `data-testid` is added into the DOM for the first time,
	 * we save the timestamp in a map.
	 *
	 * This function will wait until the given Element testId is added into an internal map.
	 * It does that by using a `expect.poll`.
	 *
	 */
	getSectionDOMAddedAt: (sectionTestId: string) => Promise<DOMHighResTimeStamp | null>;

	/*
	 * Usage:
	 *
	 * Best way to found out when a Section div was "painted".
	 *
	 * When a DOM Element with `data-testid` is painted for the first time,
	 *
	 * This function will wait until the given Element testId is added into an internal map.
	 * It does that by using a `expect.poll`.
	 */
	getSectionVisibleAt: (sectionTestId: string) => Promise<DOMHighResTimeStamp | null>;

	/*
	 * Usage:
	 *
	 * Best way to found out when a Section div has attribute mutation.
	 *
	 * This function will wait until the given Element testId is added into an internal map.
	 * It does that by using a `expect.poll`.
	 */
	getSectionAttributeNthChange: (
		sectionTestId: string,
		nthChange: number,
	) => Promise<DOMHighResTimeStamp | null>;
}>({
	viewport: {
		width: 900,
		height: 600,
	},
	featureFlags: [],
	examplePage: 'basic',
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	page: async ({ browser, baseURL, viewport, examplePage, featureFlags }, use, testInfo) => {
		// For the tests work properly, it is really important the page isn't cached
		const context = await browser.newContext();
		const page = await context.newPage();

		//page.on('console', (msg) => console.log(msg.text()));
		await page.addInitScript(() => {
			(window as WindowWithReactUFOTestGlobals).__sectionAddedAt = new Map();
			(window as WindowWithReactUFOTestGlobals).__sectionVisibleAt = new Map();
			(window as WindowWithReactUFOTestGlobals).__sectionAttributeChanges = new Map();

			const intersectionObserver = new IntersectionObserver((entries) => {
				for (const entry of entries) {
					const { target } = entry;
					intersectionObserver.unobserve(target);

					const testId = target.getAttribute('data-testid');
					if (testId) {
						(window as WindowWithReactUFOTestGlobals).__sectionVisibleAt.set(testId, entry.time);
					}
				}
			});

			const recordNodeAdded = (node: Element) => {
				const testId = node.getAttribute('data-testid');
				if (testId) {
					(window as WindowWithReactUFOTestGlobals).__sectionAddedAt.set(testId, performance.now());
					intersectionObserver.observe(node);
				}
			};
			// setup integration testing globals
			const observer = new MutationObserver((records) => {
				for (const record of records) {
					for (const addedNode of record.addedNodes) {
						if (addedNode instanceof Element) {
							recordNodeAdded(addedNode);

							addedNode.querySelectorAll('*').forEach((node) => {
								recordNodeAdded(node);
							});
						}
					}

					if (record.type === 'attributes' && record.target instanceof HTMLElement) {
						const testId = record.target.getAttribute('data-testid');
						if (testId) {
							intersectionObserver.observe(record.target);
							type MutationRecordWithTimestamp = MutationRecord & { timestamp: number };
							const mutation = record as MutationRecordWithTimestamp;

							const changes =
								(window as WindowWithReactUFOTestGlobals).__sectionAttributeChanges.get(testId) ||
								[];
							const changeTimestamp = mutation.timestamp ?? performance.now();
							changes.push(changeTimestamp);
							(window as WindowWithReactUFOTestGlobals).__sectionAttributeChanges.set(
								testId,
								changes,
							);
						}
					}
				}
			});

			window.addEventListener('load', () => {
				const divExamples = document.querySelector('#examples');
				if (divExamples) {
					observer.observe(divExamples, {
						childList: true,
						subtree: true,
						attributes: true,
					});
				}
			});
		});

		// @ts-ignore
		(page as unknown as Page).visitExample = (
			groupId: string,
			packageId: string,
			exampleId?: string,
			params?: Record<string, string | boolean>,
		) => {
			const url = getExampleURL({
				groupId,
				packageId,
				exampleId,
				params,
				baseURL,
			});

			return page.goto(url, {
				waitUntil: 'domcontentloaded',
			});
		};

		await page.setViewportSize({
			width: viewport.width,
			height: viewport.height,
		});

		const params: Record<string, string | boolean> = {};

		if (featureFlags && featureFlags.length > 0) {
			params.featureFlag = featureFlags.join(';');
		}
		// @ts-ignore
		((await page) as unknown as Page).visitExample('react-ufo', 'atlaskit', examplePage, params);

		await use(page);
	},
	waitForReactUFOPayload: async ({ page }, use) => {
		const reset = async () => {
			// THis is hardcoded applied when the `sendOperationalEvent` is called
			// See: website/src/metrics.ts
			const mainDivAfterTTVCFinished = page.locator('[data-is-ttvc-ready="true"]');

			await expect(mainDivAfterTTVCFinished).toBeVisible({ timeout: 20000 });

			let reactUFOPayload: ReactUFOPayload | null = null;
			await expect
				.poll(
					async () => {
						const value = await page.evaluate(() => {
							const payloads = (window as WindowWithReactUFOTestGlobals).__websiteReactUfo || [];
							if (payloads.length < 1) {
								return Promise.resolve(null);
							}
							const firstPayload = payloads.shift() ?? null;

							return Promise.resolve(firstPayload);
						});

						reactUFOPayload = value;

						return reactUFOPayload;
					},
					{
						message: `React UFO payload never received.`,
						intervals: [500],
						timeout: 10000,
					},
				)
				.not.toBeNull();

			return reactUFOPayload;
		};

		await use(reset);
	},
	waitForReactUFOInteractionPayload: async ({ page }, use) => {
		const reset = async () => {
			// THis is hardcoded applied when the `sendOperationalEvent` is called
			// See: website/src/metrics.ts
			const mainDivAfterTTVCFinished = page.locator('[data-is-ttvc-ready="true"]');

			await expect(mainDivAfterTTVCFinished).toBeVisible({ timeout: 20000 });
			let reactUFOPayload: ReactUFOPayload | null = null;
			await expect
				.poll(
					async () => {
						const value = await page.evaluate(() => {
							const payloads = (window as WindowWithReactUFOTestGlobals).__websiteReactUfo || [];
							if (payloads.length < 1) {
								return Promise.resolve(null);
							}
							const payload = payloads.shift() ?? null;

							if (payload && payload.attributes.properties.interactionMetrics.type === 'press') {
								return Promise.resolve(payload);
							}
							return Promise.resolve(null);
						});

						reactUFOPayload = value;

						return reactUFOPayload;
					},
					{
						message: `React UFO payload never received.`,
						intervals: [500],
						timeout: 10000,
					},
				)
				.not.toBeNull();

			return reactUFOPayload;
		};

		await use(reset);
	},
	waitForPostInteractionLogPayload: async ({ page }, use) => {
		const reset = async () => {
			// This is hardcoded applied when the `sendOperationalEvent` is called
			// See: website/src/metrics.ts
			const mainDivAfterTTVCFinished = page.locator('[data-is-ttvc-ready="true"]');

			await expect(mainDivAfterTTVCFinished).toBeVisible({ timeout: 20000 });

			let postInteractionLogPayload: PostInteractionLogPayload | null = null;
			await expect
				.poll(
					async () => {
						const value = await page.evaluate(() => {
							const payloads =
								(window as WindowWithReactUFOTestGlobals).__websiteReactUfoPostInteraction || [];
							if (payloads.length < 1) {
								return Promise.resolve(null);
							}

							return Promise.resolve(payloads[0]);
						});

						postInteractionLogPayload = value;

						return postInteractionLogPayload;
					},
					{
						message: `React UFO payload never received.`,
						intervals: [500],
						timeout: 10000,
					},
				)
				.not.toBeNull();

			return postInteractionLogPayload;
		};

		await use(reset);
	},
	waitForReactUFOPayloadCriticalMetrics: async ({ page }, use) => {
		const reset = async () => {
			const mainDivAfterTTVCFinished = page.locator('[data-is-ttvc-ready="true"]');
			await expect(mainDivAfterTTVCFinished).toBeVisible({ timeout: 20000 });

			let criticalMetricsPayloads: CriticalMetricsPayload[] | null = null;
			await expect
				.poll(
					async () => {
						const value = await page.evaluate(() => {
							const payloads =
								(window as WindowWithReactUFOTestGlobals).__websiteReactUfoCriticalMetrics || [];
							if (payloads.length < 1) {
								return Promise.resolve(null);
							}

							return Promise.resolve(payloads);
						});

						criticalMetricsPayloads = value;

						return criticalMetricsPayloads;
					},
					{
						message: `React UFO Critical Metric payloads never received.`,
						intervals: [500],
						timeout: 10000,
					},
				)
				.not.toBeNull();

			return criticalMetricsPayloads;
		};
		await use(reset);
	},
	waitForInteractionExtraMetricsPayload: async ({ page }, use) => {
		const reset = async () => {
			// This is hardcoded applied when the `sendOperationalEvent` is called
			// See: website/src/metrics.ts
			const mainDivAfterTTVCFinished = page.locator('[data-is-ttvc-ready="true"]');

			await expect(mainDivAfterTTVCFinished).toBeVisible({ timeout: 20000 });

			let interactionExtraMetricsPayload: ReactUFOPayload | null = null;
			await expect
				.poll(
					async () => {
						const value = await page.evaluate(() => {
							const payloads =
								(window as WindowWithReactUFOTestGlobals).__websiteReactUfoExtraMetrics || [];
							if (payloads.length < 1) {
								return Promise.resolve(null);
							}

							return Promise.resolve(payloads[0]);
						});

						interactionExtraMetricsPayload = value;

						return interactionExtraMetricsPayload;
					},
					{
						message: `React UFO interaction extra metrics payload never received.`,
						intervals: [500],
						timeout: 10000,
					},
				)
				.not.toBeNull();

			return interactionExtraMetricsPayload;
		};

		await use(reset);
	},
	waitForExtraSearchPageInteractionPayload: async ({ page }, use) => {
		const reset = async () => {
			// This is hardcoded applied when the `sendOperationalEvent` is called
			// See: website/src/metrics.ts
			const mainDivAfterTTVCFinished = page.locator('[data-is-ttvc-ready="true"]');

			await expect(mainDivAfterTTVCFinished).toBeVisible({ timeout: 20000 });

			let extraSearchPageInteractionPayload: ReactUFOPayload | null = null;
			await expect
				.poll(
					async () => {
						const value = await page.evaluate(() => {
							const payloads =
								(window as WindowWithReactUFOTestGlobals)
									.__websiteReactUfoExtraSearchPageInteraction || [];
							if (payloads.length < 1) {
								return Promise.resolve(null);
							}

							return Promise.resolve(payloads[0]);
						});

						extraSearchPageInteractionPayload = value;

						return extraSearchPageInteractionPayload;
					},
					{
						message: `React UFO extra search page metric payload never received.`,
						intervals: [500],
						timeout: 10000,
					},
				)
				.not.toBeNull();

			return extraSearchPageInteractionPayload;
		};

		await use(reset);
	},
	waitForAllTerminalErrorPayloads: async ({ page }, use) => {
		const getPayloads = async (expectedCount: number) => {
			// This is hardcoded applied when the `sendOperationalEvent` is called
			// See: website/src/metrics.ts
			const mainDivAfterTTVCFinished = page.locator('[data-is-ttvc-ready="true"]');

			await expect(mainDivAfterTTVCFinished).toBeVisible({ timeout: 20000 });

			let terminalErrorPayloads: TerminalErrorPayload[] = [];
			await expect
				.poll(
					async () => {
						const value = await page.evaluate(() => {
							const payloads =
								(window as WindowWithReactUFOTestGlobals).__websiteReactUfoTerminalErrors || [];
							return Promise.resolve(payloads);
						});

						terminalErrorPayloads = value;

						return terminalErrorPayloads.length;
					},
					{
						message: `Expected ${expectedCount} terminal error payloads but received ${terminalErrorPayloads.length}.`,
						intervals: [500],
						timeout: 10000,
					},
				)
				.toBeGreaterThanOrEqual(expectedCount);

			return terminalErrorPayloads;
		};

		await use(getPayloads);
	},
	getSectionDOMAddedAt: async ({ page }, use) => {
		const getValue = async (sectionTestId: string) => {
			let result: number | null = null;
			await expect
				.poll(
					async () => {
						const value = await page.evaluate((_sectionTestId) => {
							const myMap = (window as WindowWithReactUFOTestGlobals).__sectionAddedAt;
							return myMap.get(_sectionTestId) || null;
						}, sectionTestId);

						result = value;
						return value;
					},
					{
						message: `Section [data-testid="${sectionTestId}"] isn't added into the DOM.`,
						intervals: [500],
						timeout: 10000,
					},
				)
				.not.toBeNull();

			return result;
		};

		await use(getValue);
	},

	getSectionVisibleAt: async ({ page }, use) => {
		const getValue = async (sectionTestId: string) => {
			let result: number | null = null;
			await expect
				.poll(
					async () => {
						const value = await page.evaluate((_sectionTestId) => {
							const myMap = (window as WindowWithReactUFOTestGlobals).__sectionVisibleAt;
							return myMap.get(_sectionTestId) || null;
						}, sectionTestId);

						result = value;
						return value;
					},
					{
						message: `Element [data-testid="${sectionTestId}"] isn't visible.`,
						intervals: [500],
						timeout: 10000,
					},
				)
				.not.toBeNull();

			return result;
		};

		await use(getValue);
	},

	getSectionAttributeNthChange: async ({ page }, use) => {
		const getValue = async (sectionTestId: string, nthChange: number) => {
			let result: number | null = null;
			await expect
				.poll(
					async () => {
						const value = await page.evaluate(
							({ sectionTestId: _sectionTestId, nthChange: _nthChange }) => {
								const myMap = (window as WindowWithReactUFOTestGlobals).__sectionAttributeChanges;
								const changes = myMap.get(_sectionTestId) || [];
								return changes[_nthChange] || null;
							},
							{ sectionTestId, nthChange },
						);

						result = value;
						return value;
					},
					{
						message: `Element [data-testid="${sectionTestId}"] has no ${nthChange}-th attribute changes.`,
						intervals: [500],
						timeout: 10000,
					},
				)
				.not.toBeNull();

			return result;
		};

		await use(getValue);
	},
});

const customMatchers = {
	/**
	 * Matches timestamps converted to seconds.
	 *
	 * It checks only up to 1 decimal value precision.
	 *
	 *
	 * @param selection
	 */
	toMatchTimestamp(
		this: ReturnType<Expect['getState']>,
		timestampReceived: DOMHighResTimeStamp | undefined | null,
		timestampExpected: DOMHighResTimeStamp | null,
	): {
		pass: boolean;
		message: () => string;
	} {
		const receivedInSeconds = Math.round(timestampReceived!) / 1000;
		const expectedInSeconds = Math.round(timestampExpected!) / 1000;

		let pass: boolean;
		try {
			baseExpect(receivedInSeconds).toBeCloseTo(expectedInSeconds, 1);
			pass = true;
		} catch {
			pass = false;
		}

		return {
			pass,
			message: (): string => {
				if (pass) {
					return `Expected timestamp ${timestampReceived} (${receivedInSeconds}s) not to match ${timestampExpected} (${expectedInSeconds}s)`;
				} else {
					return `Expected timestamp ${timestampReceived} (${receivedInSeconds}s) to match ${timestampExpected} (${expectedInSeconds}s)\n\nReceived: ${receivedInSeconds}s\nExpected: ${expectedInSeconds}s (within 0.1s precision)`;
				}
			},
		};
	},
};
// @ts-expect-error - customMatchers is not typed
export const expect: Expect<
	typeof baseExpect & {
		/**
		 * Matches timestamps converted to seconds.
		 *
		 * It checks only up to 1 decimal value precision.
		 *
		 *
		 * @param selection
		 */
		toMatchTimestamp(
			this: ReturnType<Expect['getState']>,
			timestampReceived: DOMHighResTimeStamp | undefined | null,
			timestampExpected: DOMHighResTimeStamp | null,
		): {
			pass: boolean;
			message: () => string;
		};
	}
> = baseExpect.extend(customMatchers);

/*
 *
 * Most used viewports (ordered)
 *
 * - 1920x1080
 * - 1536x864
 * - 2560x1440
 * - 1280x720
 * - 1728x1117
 */
export const viewports: {
	width: number;
	height: number;
}[] = [
	{
		width: 1920,
		height: 1080,
	},
	{
		width: 1536,
		height: 864,
	},
	{
		width: 2560,
		height: 1440,
	},
	{
		width: 1280,
		height: 720,
	},
	{
		width: 1728,
		height: 1117,
	},
];

/**
 * Custom test fixture that allows simulating a page opened in a background tab.
 * This is done by injecting a script before page load that overrides visibilityState.
 */
export const testWithBackgroundTab = base.extend<{
	simulateBackgroundTab: boolean;
	featureFlags: string[];
	waitForReactUFOPayload: () => Promise<ReactUFOPayload | null>;
}>({
	simulateBackgroundTab: false,
	featureFlags: [],
	page: async ({ browser, baseURL, simulateBackgroundTab, featureFlags }, use) => {
		const context = await browser.newContext();
		const page = await context.newPage();

		// If simulating background tab, inject script to override visibilityState BEFORE page loads
		if (simulateBackgroundTab) {
			await page.addInitScript(() => {
				// Override visibilityState to 'hidden' before any other code runs
				// This simulates the page being opened in a background tab
				Object.defineProperty(document, 'visibilityState', {
					configurable: true,
					get: () => 'hidden',
				});

				// Also mock the visibility-state Performance API entries for Chromium
				const originalGetEntriesByType = performance.getEntriesByType.bind(performance);
				performance.getEntriesByType = (type: string) => {
					if (type === 'visibility-state') {
						// Return a mock entry indicating the page was hidden from the start
						return [{
							name: 'hidden',
							entryType: 'visibility-state',
							startTime: 0,
							duration: 0,
							toJSON: () => ({ name: 'hidden', entryType: 'visibility-state', startTime: 0, duration: 0 }),
						}] as unknown as PerformanceEntryList;
					}
					return originalGetEntriesByType(type);
				};

				// Set up test globals for payload capture
				(window as WindowWithReactUFOTestGlobals).__websiteReactUfo = [];
			});
		}

		// Build URL with feature flags
		const params: Record<string, string> = {
			groupId: 'react-ufo',
			packageId: 'atlaskit',
			exampleId: 'basic',
			isTestRunner: 'true',
			mode: 'light',
		};

		const searchParams = new URLSearchParams(params);
		let url = `${baseURL}/examples.html?${searchParams.toString()}`;

		if (featureFlags.length > 0) {
			url += `&featureFlag=${featureFlags.join('&featureFlag=')}`;
		}

		await page.setViewportSize({ width: 1920, height: 1080 });
		await page.goto(url, { waitUntil: 'domcontentloaded' });

		await use(page);
	},
	waitForReactUFOPayload: async ({ page }, use) => {
		const getPayload = async () => {
			const mainDivAfterTTVCFinished = page.locator('[data-is-ttvc-ready="true"]');
			await expect(mainDivAfterTTVCFinished).toBeVisible({ timeout: 20000 });

			let reactUFOPayload: ReactUFOPayload | null = null;
			await expect
				.poll(
					async () => {
						const value = await page.evaluate(() => {
							const payloads = (window as WindowWithReactUFOTestGlobals).__websiteReactUfo || [];
							if (payloads.length < 1) {
								return Promise.resolve(null);
							}
							const firstPayload = payloads.shift() ?? null;
							return Promise.resolve(firstPayload);
						});

						reactUFOPayload = value;
						return reactUFOPayload;
					},
					{
						message: `React UFO payload never received.`,
						intervals: [500],
						timeout: 10000,
					},
				)
				.not.toBeNull();

			return reactUFOPayload;
		};

		await use(getPayload);
	},
});
