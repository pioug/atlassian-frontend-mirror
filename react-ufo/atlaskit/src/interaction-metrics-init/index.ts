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
	sinkInteractionHandler((interactionId: string, interaction: InteractionMetrics) => {
		scheduleIdleCallback(() => {
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
		});
	});
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
	sinkExperimentalHandler((interactionId: string, interaction: InteractionMetrics) => {
		scheduleIdleCallback(() => {
			const payloadPromise = payloadPackage.createExperimentalMetricsPayload(
				interactionId,
				interaction,
			);

			payloadPromise.then((payload) => {
				if (payload) {
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
		});
	});
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

export const init = (
	analyticsWebClientAsync:
		| Promise<GenericAnalyticWebClientPromise>
		| Promise<GenericAnalyticWebClientInstance>,
	config: Config,
) => {
	if (initialized) {
		return;
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
};
