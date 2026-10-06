import React, { type ComponentType, useEffect, useState } from 'react';

import { wb, type WorkbenchExample } from '@atlassian/workbench';

import type { RevisionPayload } from '../../src/common';
import { setActiveTrace } from '../../src/experience-trace-id-context';
import { init } from '../../src/interaction-metrics-init';
import traceUFOPageLoad from '../../src/trace-pageload';

type ReactUFOTTVCMetrics = {
	'metric:vc90'?: number;
	'experience:key': string;
	'experience:name': string;
	'ufo:vc:rev'?: RevisionPayload;
};

type ReactUFOPayload = {
	attributes: {
		properties: ReactUFOTTVCMetrics;
	};
};

type ReactUFOTestGlobals = {
	__websiteReactUfo: ReactUFOPayload[];
	__websiteReactUfoDisabled: boolean;
	__websiteReactUfoExtraSearchPageInteraction: ReactUFOPayload[];
	__websiteReactUfoPostInteraction: ReactUFOPayload[];
	__websiteReactUfoShadowMode: ReactUFOPayload[];
	__websiteReactUfoTerminalErrors: ReactUFOPayload[];
};

type ExampleLoader = () => Promise<{ default: ComponentType }>;

let initializationPromise: Promise<void> | undefined;

const initializeReactUFO = (): Promise<void> => {
	if (initializationPromise) {
		return initializationPromise;
	}

	initializationPromise = Promise.all([
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-create-payloads" */ '../../src/create-payload/createPayloads'
		),
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-extra-search-page-payload" */ '../../src/create-payload/createExtraSearchPageInteractionPayload'
		),
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-post-interaction-payload" */ '../../src/create-post-interaction-log-payload'
		),
		import(
			/* webpackChunkName: "@atlaskit-internal_react-ufo-terminal-error-payload" */ '../../src/create-terminal-error-payload'
		),
	]).then(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const ufoDisabled = urlParams.get('ufo_disabled') === 'true';
		const exampleLocation = urlParams.get('exampleId') ?? window.location.pathname;
		const ssr = exampleLocation.toLowerCase().includes('ssr');

		const testGlobals: ReactUFOTestGlobals = {
			__websiteReactUfo: [],
			__websiteReactUfoPostInteraction: [],
			__websiteReactUfoShadowMode: [],
			__websiteReactUfoExtraSearchPageInteraction: [],
			__websiteReactUfoTerminalErrors: [],
			__websiteReactUfoDisabled: ufoDisabled,
		};
		const testWindow = Object.assign(window, testGlobals);

		const mockAWC = {
			sendOperationalEvent: (payload: ReactUFOPayload) => {
				const properties = payload.attributes.properties;
				if (properties['experience:key'] === 'custom.experimental-interaction-metrics') {
					testWindow.__websiteReactUfoShadowMode.push(payload);
				} else if (properties['experience:key'] === 'custom.post-interaction-logs') {
					testWindow.__websiteReactUfoPostInteraction.push(payload);
				} else if (properties['experience:name'] === 'search-page-ignoring-smart-answers') {
					testWindow.__websiteReactUfoExtraSearchPageInteraction.push(payload);
				} else if (properties['experience:key'] === 'custom.terminal-error') {
					testWindow.__websiteReactUfoTerminalErrors.push(payload);
				} else {
					testWindow.__websiteReactUfo.push(payload);
					const examplesRoot = document.querySelector('#examples');
					if (examplesRoot instanceof HTMLElement) {
						examplesRoot.dataset.isTtvcReady = 'true';
					}
				}
			},
		};

		init(Promise.resolve(mockAWC), {
			enabled: !ufoDisabled,
			product: 'atlaskit',
			region: 'unknown',
			kind: {
				page_load: 1,
				transition: 1,
				press: 1,
				typing: 0,
				legacy: 0,
				hover: 0,
			},
			postInteractionLog: {
				enabled: true,
				kind: {
					page_load: 1,
					transition: 1,
					press: 0,
					typing: 0,
					segment: 0,
				},
			},
			extraSearchPageInteraction: {
				enabled: true,
				searchPageMetricName: 'search-page',
				searchPageRoute: window.location.pathname,
			},
			terminalErrors: {
				enabled: true,
			},
			ssr: {
				getSSRDoneTime: ssr
					? () => performance.getEntriesByName('SSR-DONE', 'mark')[0]?.startTime
					: undefined,
			},
			vc: {
				enabled: true,
				heatmapSize: 200,
				oldDomUpdates: false,
				devToolsEnabled: true,
				selectorConfig: {
					id: true,
					role: true,
					className: true,
					testId: true,
				},
				enabledVCRevisions: {
					all: ['fy25.02', 'fy25.03', 'fy26.04', 'next'] as const,
					byExperience: {
						'test-UFO': ['fy25.02', 'fy25.03', 'fy26.04', 'next'] as const,
						'test-SSR-UFO': ['fy25.02', 'fy25.03', 'fy26.04', 'next'] as const,
					},
				},
				ssr: true,
				ssrWhitelist: ['test-SSR-UFO'],
				includeSSRInV3: true,
				includeSSRRatio: true,
				trackLayoutShiftOffenders: true,
			},
			segmentsThreshold: {
				'level1-3': 3,
			},
			finishInteractionOnTransition: ['press-finish-on-transition'],
			enableVCRawDataRates: {
				enabled: true,
				rates: {
					'test-UFO': 1,
				},
			},
		});

		setActiveTrace('test-traceid', 'test-spandid', 'page_load');
		traceUFOPageLoad('test-UFO');

		await new Promise<void>((resolve) => setTimeout(resolve, 0));
	});

	return initializationPromise;
};

const createReactUFOTestApp = (loadExample: ExampleLoader) => {
	function ReactUFOTestApp(): React.JSX.Element {
		const [Example, setExample] = useState<ComponentType | null>(null);

		useEffect(() => {
			let animationFrame: number | undefined;
			let disposed = false;
			void initializeReactUFO()
				.then(loadExample)
				.then(({ default: LoadedExample }) => {
					if (!disposed) {
						animationFrame = requestAnimationFrame(() => {
							setExample(() => LoadedExample);
						});
					}
				});
			return () => {
				disposed = true;
				if (animationFrame !== undefined) {
					cancelAnimationFrame(animationFrame);
				}
			};
		}, []);

		return <div id="examples">{Example ? <Example /> : null}</div>;
	}

	return ReactUFOTestApp;
};

export const wbWithReactUFO = (loadExample: ExampleLoader): WorkbenchExample =>
	wb(createReactUFOTestApp(loadExample));
