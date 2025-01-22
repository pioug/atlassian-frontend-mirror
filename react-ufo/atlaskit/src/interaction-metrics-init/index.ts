import {
	unstable_IdlePriority as idlePriority,
	unstable_scheduleCallback as scheduleCallback,
} from 'scheduler';

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

function sinkInteraction(
	instance: GenericAnalyticWebClientInstance,
	payloadPackage: {
		createPayloads: (interactionId: string, interaction: InteractionMetrics) => any[];
	},
) {
	sinkInteractionHandler((interactionId: string, interaction: InteractionMetrics) => {
		scheduleCallback(idlePriority, () => {
			const payloads = payloadPackage.createPayloads(interactionId, interaction);
			payloads?.forEach((payload: any) => {
				instance.sendOperationalEvent(payload);
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
		) => any;
	},
) {
	sinkExperimentalHandler((interactionId: string, interaction: InteractionMetrics) => {
		scheduleCallback(idlePriority, () => {
			const payload = payloadPackage.createExperimentalMetricsPayload(interactionId, interaction);
			if (payload) {
				instance.sendOperationalEvent(payload);
			}
		});
	});
}

function sinkPostInteractionLog(
	instance: GenericAnalyticWebClientInstance,
	createPostInteractionLogPayload: (logOutput: PostInteractionLogOutput) => any,
) {
	sinkPostInteractionLogHandler((logOutput: PostInteractionLogOutput) => {
		scheduleCallback(idlePriority, () => {
			const payload = createPostInteractionLogPayload(logOutput);
			if (payload) {
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
