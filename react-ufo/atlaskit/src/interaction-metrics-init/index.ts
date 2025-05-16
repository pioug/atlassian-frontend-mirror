import { fg } from '@atlaskit/platform-feature-flags';

import { startLighthouseObserver } from '../additional-payload';
import { type PostInteractionLogOutput } from '../common';
import { type Config, setUFOConfig } from '../config';
import {
	experimentalVC,
	sinkExperimentalHandler,
} from '../create-experimental-interaction-metrics-payload';
import { setupHiddenTimingCapture } from '../hidden-timing';
import {
	type InteractionMetrics,
	postInteractionLog,
	sinkInteractionHandler,
	sinkPostInteractionLogHandler,
} from '../interaction-metrics';
import { getPerformanceObserver } from '../interactions-performance-observer';
import { initialisePressureObserver } from '../machine-utilisation';
import { getVCObserver } from '../vc';

import scheduleIdleCallback from './schedule-idle-callback';

export interface GenericAnalyticWebClientInstance {
	sendOperationalEvent: (payload: any) => void;
}

export interface GenericAnalyticWebClient {
	getInstance: () => GenericAnalyticWebClientInstance;
}

export interface GenericAnalyticWebClientPromise {
	getAnalyticsWebClientPromise: () => Promise<GenericAnalyticWebClient>;
}

let initialized = false;

type UFOPayload = any;

interface WindowWithUfoDevToolExtension extends Window {
	__ufo_devtool_onUfoPayload?: (payload: UFOPayload) => void;
}

function sinkInteraction(
	instance: GenericAnalyticWebClientInstance,
	payloadPackage: {
		createPayloads: (interactionId: string, interaction: InteractionMetrics) => Promise<any[]>;
	},
) {
	function sinkFn(interactionId: string, interaction: InteractionMetrics) {
		function onIdle() {
			payloadPackage
				.createPayloads(interactionId, interaction)
				.then((payloads) => {
					// NOTE: This API is used by the UFO DevTool Chrome Extension and Criterion
					const devToolObserver = (globalThis as unknown as WindowWithUfoDevToolExtension)
						.__ufo_devtool_onUfoPayload;
					payloads?.forEach((payload: UFOPayload) => {
						if (typeof devToolObserver === 'function') {
							devToolObserver?.(payload);
						}

						instance.sendOperationalEvent(payload);
					});
				})
				.catch((error) => {
					throw error;
				});
		}

		scheduleIdleCallback(onIdle);
	}

	sinkInteractionHandler(sinkFn);
}

function sinkExperimentalInteractionMetrics(
	instance: GenericAnalyticWebClientInstance,
	payloadPackage: {
		createExperimentalMetricsPayload: (
			interactionId: string,
			interaction: InteractionMetrics,
		) => Promise<any>;
	},
) {
	function experimentalMetricsSinkFn(interactionId: string, interaction: InteractionMetrics) {
		function experimentalMetricsOnIdle() {
			const payloadPromise = payloadPackage.createExperimentalMetricsPayload(
				interactionId,
				interaction,
			);

			payloadPromise.then((payload) => {
				if (payload) {
					// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
					if (fg('enable_ufo_devtools_api_for_extra_events')) {
						// NOTE: This API is used by the UFO DevTool Chrome Extension and Criterion
						const devToolObserver = (globalThis as unknown as WindowWithUfoDevToolExtension)
							.__ufo_devtool_onUfoPayload;

						if (typeof devToolObserver === 'function') {
							devToolObserver?.(payload);
						}
					}

					instance.sendOperationalEvent(payload);
				}
			});
		}

		scheduleIdleCallback(experimentalMetricsOnIdle);
	}

	sinkExperimentalHandler(experimentalMetricsSinkFn);
}

function sinkPostInteractionLog(
	instance: GenericAnalyticWebClientInstance,
	createPostInteractionLogPayload: (logOutput: PostInteractionLogOutput) => any,
) {
	sinkPostInteractionLogHandler((logOutput: PostInteractionLogOutput) => {
		scheduleIdleCallback(() => {
			const payload = createPostInteractionLogPayload(logOutput);
			if (payload) {
				// NOTE: This API is used by the UFO DevTool Chrome Extension and also by Criterion
				// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
				if (fg('enable_ufo_devtools_api_for_extra_events')) {
					const devToolObserver = (globalThis as unknown as WindowWithUfoDevToolExtension)
						.__ufo_devtool_onUfoPayload;

					if (typeof devToolObserver === 'function') {
						devToolObserver?.(payload);
					}
				}

				instance.sendOperationalEvent(payload);
			}
		});
	});
}

export function init(
	analyticsWebClientAsync:
		| Promise<GenericAnalyticWebClientPromise>
		| Promise<GenericAnalyticWebClientInstance>,
	config: Config,
) {
	if (initialized) {
		return;
	}

	if (fg('platform_ufo_report_cpu_usage')) {
		initialisePressureObserver();
	}

	setUFOConfig(config);

	if (config.vc?.enabled) {
		const vcOptions = {
			heatmapSize: config.vc.heatmapSize,
			oldDomUpdates: config.vc.oldDomUpdates,
			devToolsEnabled: config.vc.devToolsEnabled,
			selectorConfig: config.vc.selectorConfig,
		};

		getVCObserver(vcOptions).start({ startTime: 0 });
		postInteractionLog.initializeVCObserver(vcOptions);
		postInteractionLog.startVCObserver({ startTime: 0 });
		if (config?.experimentalInteractionMetrics?.enabled) {
			experimentalVC.initialize(vcOptions).start({ startTime: 0 });
		}
	}

	setupHiddenTimingCapture();
	startLighthouseObserver();

	initialized = true;

	if (fg('platform_ufo_enable_events_observer')) {
		if (typeof PerformanceObserver !== 'undefined') {
			const observer = getPerformanceObserver();
			observer.observe({
				type: 'event',
				buffered: true,
				durationThreshold: 16,
			} as PerformanceObserverInit);
		}
	}

	Promise.all([
		analyticsWebClientAsync,
		import(/* webpackChunkName: "create-payloads" */ '../create-payload'),
		import(
			/* webpackChunkName: "create-post-interaction-log-payload" */ '../create-post-interaction-log-payload'
		),
	]).then(([awc, payloadPackage, createPostInteractionLogPayloadPackage]) => {
		if ((awc as GenericAnalyticWebClientPromise).getAnalyticsWebClientPromise) {
			(awc as GenericAnalyticWebClientPromise).getAnalyticsWebClientPromise().then((client) => {
				const instance = client.getInstance();
				sinkInteraction(instance, payloadPackage);
				if (config?.experimentalInteractionMetrics?.enabled) {
					sinkExperimentalInteractionMetrics(instance, payloadPackage);
				}
				if (config.postInteractionLog?.enabled) {
					sinkPostInteractionLog(instance, createPostInteractionLogPayloadPackage.default);
				}
			});
		} else if ((awc as GenericAnalyticWebClientInstance).sendOperationalEvent) {
			sinkInteraction(awc as GenericAnalyticWebClientInstance, payloadPackage);
			if (config?.experimentalInteractionMetrics?.enabled) {
				sinkExperimentalInteractionMetrics(awc as GenericAnalyticWebClientInstance, payloadPackage);
			}
			if (config.postInteractionLog?.enabled) {
				sinkPostInteractionLog(
					awc as GenericAnalyticWebClientInstance,
					createPostInteractionLogPayloadPackage.default,
				);
			}
		}
	});
}
