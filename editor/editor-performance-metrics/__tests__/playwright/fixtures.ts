/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
/* eslint-disable compat/compat */
import {
	test as base,
	expect as baseExpect,
	type Expect,
	type Page,
} from '@af/integration-testing';
import { EditorPerformanceMetrics } from '@atlaskit/editor-performance-metrics/metrics';
import type { TTVCTargets } from '@atlaskit/editor-performance-metrics/react';
import {
	createTimelineFromEvents,
	type Timeline,
	type TimelineEvent,
} from '@atlaskit/editor-performance-metrics/timeline';

import type { WindowWithEditorPerformanceGlobals } from './window-type';

type TimelineEvents = Array<TimelineEvent>;
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
	exampleId: string | undefined;
	groupId: string;
	packageId: string;
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
	examplePage:
		| 'vc-observer-next'
		| 'vc-observer-react-remount'
		| 'vc-observer-moving-node'
		| 'vc-observer-placeholder'
		| 'vc-observer-attribute-mutation'
		| 'latency-mouse-events'
		| 'editor-full-page'
		| 'basic-react'
		| 'ttai-with-timers'
		| 'latency-keyboard-events';
	getMetrics: () => Promise<EditorPerformanceMetrics | null>;
	getSectionVisibleAt: (sectionTestId: string) => Promise<DOMHighResTimeStamp | null>;
	getTimeline: () => Promise<Timeline | null>;
	getTimelineEvents: () => Promise<TimelineEvents>;
	/**
	 * This fixture allow the tests to get the TTVCTarget value set on the example page.
	 *
	 * ⚠️ Your example needs to manually set the global variable called `__editor_metrics_tests__calculated_ttvc`.
	 */
	getTTVCTargets: () => Promise<TTVCTargets | null>;
	resetTicks: () => Promise<void>;
	viewport: {
		height: number;
		width: number;
	};
	waitForTicks: (tickNth: number) => Promise<DOMHighResTimeStamp>;
}>({
	viewport: {
		width: 800,
		height: 600,
	},
	examplePage: 'vc-observer-next',
	page: async ({ browser, baseURL, viewport, examplePage }, use) => {
		// FOr those tests work properly, it is really important the page isn't cached
		const context = await browser.newContext();
		const page = await context.newPage();

		await page.addInitScript((value) => {
			(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_ticks = [];
			(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_tick = (
				direct = false,
			) => {
				if (direct) {
					const at = performance.now();
					(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_ticks?.push(at);
					return;
				}

				setTimeout(() => {
					const at = performance.now();
					(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_ticks?.push(at);
				}, 50);
			};

			(window as WindowWithEditorPerformanceGlobals).__sectionAddedAt = new Map();

			const intersectionObserver = new IntersectionObserver((entries) => {
				for (const entry of entries) {
					const { target } = entry;

					const testId = target.getAttribute('data-testid');
					if (testId) {
						(window as WindowWithEditorPerformanceGlobals).__sectionAddedAt.set(
							testId,
							performance.now(),
						);
					}
				}
			});
			const observer = new MutationObserver((records) => {
				for (const record of records) {
					for (const addedNode of record.addedNodes) {
						if (addedNode instanceof HTMLElement) {
							intersectionObserver.observe(addedNode);
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

		//page.on('console', (msg) => console.log(msg.text()));

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

		((await page) as unknown as Page).visitExample(
			'editor',
			'editor-performance-metrics',
			examplePage,
		);

		await page.waitForFunction(() => {
			return Boolean(
				(window as WindowWithEditorPerformanceGlobals).__editor_performance_metrics_observer,
			);
		});

		await use(page);
	},
	resetTicks: async ({ page }, use) => {
		const reset = async () => {
			await page.evaluate(() => {
				(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_ticks = [];
			});
		};

		await use(reset);
	},
	waitForTicks: async ({ page }, use) => {
		const reset = async (expectedTick: number) => {
			let lastTickAt = 0;
			await expect
				.poll(
					async () => {
						const value = await page.evaluate((t: number): Promise<DOMHighResTimeStamp | false> => {
							const ticks =
								(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_ticks || [];
							if (ticks.length < t) {
								return Promise.resolve(false);
							}

							const at = ticks[Math.max(t - 1, 0)];
							let resolve = (n: DOMHighResTimeStamp) => {};
							const promise = new Promise<DOMHighResTimeStamp>((_resolve) => {
								resolve = _resolve;
							});
							const later = window.requestIdleCallback || window.requestAnimationFrame;

							later(() => {
								resolve(at);
							});

							return promise;
						}, expectedTick);

						if (typeof value !== 'number') {
							return false;
						}
						lastTickAt = value;

						return true;
					},
					{
						message: `Tick number ${expectedTick} did not happened. Make sure the \`window.__editor_metrics_tests_tick()\` is properly called`,
						intervals: [100],
						timeout: 5000,
					},
				)
				.toBe(true);

			return lastTickAt;
		};

		await use(reset);
	},
	getTimeline: async ({ page }, use) => {
		const waitBrowserIdle = () => {
			return page.evaluate(() => {
				let resolve = () => {};
				const promise = new Promise<void>((_resolve) => {
					resolve = _resolve;
				});
				const later = window.requestIdleCallback || window.requestAnimationFrame;

				later(() => {
					resolve();
				});

				return promise;
			});
		};

		const waitTimelineIdle = () => {
			return page.evaluate(() => {
				let resolve = () => {};
				const promise = new Promise<void>((_resolve) => {
					resolve = _resolve;
				});

				const timeline = (window as WindowWithEditorPerformanceGlobals)
					.__editor_performance_metrics_timeline;

				if (!timeline) {
					resolve();
				} else {
					timeline.onNextIdle(() => {
						resolve();
					});
				}

				return promise;
			});
		};

		const timeline = async () => {
			await waitBrowserIdle();
			await waitTimelineIdle();
			const timelineSerialized = await page.evaluate(() => {
				const timeline = (window as WindowWithEditorPerformanceGlobals)
					.__editor_performance_metrics_timeline;

				return timeline?.serialise();
			});

			if (!timelineSerialized) {
				return null;
			}

			return createTimelineFromEvents(timelineSerialized);
		};

		await use(timeline);
	},
	getMetrics: async ({ page, getTimeline }, use) => {
		const metrics = async () => {
			const timeline = await getTimeline();
			if (!timeline) {
				return null;
			}

			const viewport = await page.evaluate(() => {
				const w = window.innerWidth;
				const h = window.innerHeight;

				return {
					w,
					h,
				};
			});

			const metrics = new EditorPerformanceMetrics(timeline, viewport);

			return metrics;
		};

		await use(metrics);
	},
	getTimelineEvents: async ({ page, viewport, examplePage }, use) => {
		const getEvents = async () => {
			const waitIdle = () => {
				return page.evaluate(() => {
					let resolve = () => {};
					const promise = new Promise<void>((_resolve) => {
						resolve = _resolve;
					});
					const later = window.requestIdleCallback || window.requestAnimationFrame;

					later(() => {
						resolve();
					});

					return promise;
				});
			};

			await waitIdle();

			const timeline = await page.evaluate(() => {
				const timeline = (window as WindowWithEditorPerformanceGlobals)
					.__editor_performance_metrics_timeline;

				return timeline?.getEvents();
			});

			return timeline as TimelineEvents;
		};

		await use(getEvents);
	},
	getSectionVisibleAt: async ({ page }, use) => {
		const getValue = async (sectionTestId: string) => {
			let result: number | null = null;
			await expect
				.poll(
					async () => {
						const value = await page.evaluate((_sectionTestId) => {
							const myMap = (window as WindowWithEditorPerformanceGlobals).__sectionAddedAt;
							return myMap.get(_sectionTestId) || null;
						}, sectionTestId);

						result = value;
						return value;
					},
					{
						message: `Element with data-testid: "${sectionTestId}" wasn't being added to DOM.`,
						intervals: [500],
						timeout: 10000,
					},
				)
				.not.toBeNull();

			return result;
		};

		await use(getValue);
	},
	getTTVCTargets: async ({ page }, use) => {
		const getTargets = async () => {
			const result = await page.evaluate(() => {
				const myTTVCTargets = (window as WindowWithEditorPerformanceGlobals)
					.__editor_metrics_tests__calculated_ttvc;

				if (myTTVCTargets) {
					return myTTVCTargets;
				}

				return null;
			});

			return result;
		};

		await use(getTargets);
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
		timestampExpected: DOMHighResTimeStamp | undefined | null,
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
