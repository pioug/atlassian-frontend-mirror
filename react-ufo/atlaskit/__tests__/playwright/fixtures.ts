/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
/* eslint-disable compat/compat */
import {
	test as base,
	expect as baseExpect,
	type Expect,
	type Page,
} from '@af/integration-testing';

import { ReactUFOPayload, WindowWithReactUFOTestGlobals } from './window-type';

const prepareParams = (params?: { [key: string]: string | boolean }) => {
	if (!params) {
		return { urlParams: {}, featureFlags: '' };
	}

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

export const test = base.extend<{
	viewport: {
		width: number;
		height: number;
	};
	examplePage: string;
	waitForReactUFOPayload: () => Promise<ReactUFOPayload | null>;
	getSectionVisibleAt: (sectionTestId: string) => Promise<DOMHighResTimeStamp | null>;
}>({
	viewport: {
		width: 900,
		height: 600,
	},
	examplePage: 'basic',
	page: async ({ browser, baseURL, viewport, examplePage }, use, testInfo) => {
		// For the tests work properly, it is really important the page isn't cached
		const context = await browser.newContext();
		const page = await context.newPage();

		await page.addInitScript(() => {
			(window as WindowWithReactUFOTestGlobals).__sectionAddedAt = new Map();
			// setup integration testing globals
			const observer = new MutationObserver((records) => {
				for (const record of records) {
					for (const addedNode of record.addedNodes) {
						if (addedNode instanceof HTMLElement) {
							const testId = addedNode.getAttribute('data-testid');
							if (testId) {
								(window as WindowWithReactUFOTestGlobals).__sectionAddedAt.set(
									testId,
									performance.now(),
								);
							}
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
					});
				}
			});
		});

		// page.on('console', async (msg) => {
		// 	const t = msg.text();

		// 	console.log(t);
		// });

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

		// @ts-ignore
		((await page) as unknown as Page).visitExample('react-ufo', 'atlaskit', examplePage);

		await use(page);
	},
	waitForReactUFOPayload: async ({ page }, use) => {
		const reset = async () => {
			// THis is hardcoded applied when the `sendOperationalEvent` is called
			// See: website/src/metrics.ts
			const mainDivAfterTTVCFinished = page.locator('[data-is-ttvc-ready="true"]');

			await expect(mainDivAfterTTVCFinished).toBeVisible();

			let reactUFOPayload: ReactUFOPayload | null = null;
			await expect
				.poll(
					async () => {
						const value = await page.evaluate(() => {
							const payloads = (window as WindowWithReactUFOTestGlobals).__websiteReactUfo || [];
							if (payloads.length < 1) {
								return Promise.resolve(null);
							}

							return Promise.resolve(payloads[0]);
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
	getSectionVisibleAt: async ({ page }, use) => {
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
						message: `React UFO payload never received.`,
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
	 * It checks only the first two decimal values.
	 *
	 *
	 * @param selection
	 */
	toMatchTimeInSeconds(
		this: ReturnType<Expect['getState']>,
		timestampReceived: DOMHighResTimeStamp | undefined | null,
		timestampExpected: DOMHighResTimeStamp | null,
	) {
		const receivedInSeconds = Math.round(timestampReceived!) / 1000;
		const expectedInSeconds = Math.round(timestampExpected!) / 1000;

		let pass: boolean;
		let matcherResult: any;
		try {
			baseExpect(receivedInSeconds).toBeCloseTo(expectedInSeconds, 2);
			pass = true;
		} catch (e: any) {
			matcherResult = e.matcherResult;
			pass = false;
		}

		return {
			pass,
			message: () => {
				return !pass ? matcherResult.message : '';
			},
		};
	},
};

export const expect = baseExpect.extend(customMatchers);
