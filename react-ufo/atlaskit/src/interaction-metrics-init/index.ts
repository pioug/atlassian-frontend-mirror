import { context } from '@opentelemetry/api';

import { fg } from '@atlaskit/platform-feature-flags';

import { startLighthouseObserver } from '../additional-payload';
import { type PostInteractionLogOutput } from '../common';
import { type VCResult } from '../common/vc/types';
import { type Config, setUFOConfig } from '../config';
import {
	experimentalVC,
	sinkExperimentalHandler,
} from '../create-experimental-interaction-metrics-payload';
import { sinkExtraSearchPageInteractionHandler } from '../create-extra-search-page-interaction-payload';
import {
	setContextManager,
	UFOContextManager,
} from '../experience-trace-id-context/context-manager';
import { setupHiddenTimingCapture, setupThrottleDetection } from '../hidden-timing';
import {
	interactionExtraMetrics,
	type InteractionMetrics,
	postInteractionLog,
	sinkInteractionHandler,
	sinkPostInteractionLogHandler,
} from '../interaction-metrics';
import { getPerformanceObserver } from '../interactions-performance-observer';
import { initialiseMemoryObserver, initialisePressureObserver } from '../machine-utilisation';
import {
	sinkTerminalErrorHandler,
	type TerminalErrorContext,
	type TerminalErrorData,
} from '../set-terminal-error';

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

function sinkTerminalErrors(
	instance: GenericAnalyticWebClientInstance,
	createTerminalErrorPayload: (errorData: TerminalErrorData, context: TerminalErrorContext) => any,
) {
	sinkTerminalErrorHandler((errorData: TerminalErrorData, context: TerminalErrorContext) => {
		scheduleIdleCallback(() => {
			const payload = createTerminalErrorPayload(errorData, context);
			if (payload) {
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

function sinkInteractionExtraMetrics(
	instance: GenericAnalyticWebClientInstance,
	createInteractionExtraLogPayload: (
		interactionId: string,
		interaction: InteractionMetrics,
		lastInteractionFinish: InteractionMetrics | null,
		lastInteractionFinishVCResult?: VCResult,
	) => any,
) {
	interactionExtraMetrics.sinkHandler(
		(
			interactionId: string,
			interaction: InteractionMetrics,
			lastInteractionFinish: InteractionMetrics | null,
			lastInteractionFinishVCResult?: VCResult,
		) => {
			scheduleIdleCallback(async () => {
				const payload = await createInteractionExtraLogPayload(
					interactionId,
					interaction,
					lastInteractionFinish,
					lastInteractionFinishVCResult,
				);
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
		},
	);
}

function sinkExtraSearchPageInteraction(
	instance: GenericAnalyticWebClientInstance,
	payloadPackage: {
		createExtraSearchPageInteractionPayload: (
			interactionId: string,
			interaction: InteractionMetrics,
		) => Promise<any>;
	},
) {
	function sinkFn(interactionId: string, interaction: InteractionMetrics) {
		function onIdle() {
			payloadPackage
				.createExtraSearchPageInteractionPayload(interactionId, interaction)
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

	sinkExtraSearchPageInteractionHandler(sinkFn);
}

export function init(
	analyticsWebClientAsync:
		| Promise<GenericAnalyticWebClientPromise>
		| Promise<GenericAnalyticWebClientInstance>,
	config: Config,
): void {
	if (initialized) {
		return;
	}

	// Initialize pressure observer for CPU usage monitoring
	initialisePressureObserver();

	initialiseMemoryObserver();

	setUFOConfig(config);

	if (fg('platform_ufo_enable_otel_context_manager')) {
		// Configure global OTel context manager
		const contextManager = new UFOContextManager();
		// set the contextmanager somewhere we can reference it later
		setContextManager(contextManager);
		// Register the context manager with the global OTel API
		contextManager.enable();
		context.setGlobalContextManager(contextManager);
	}

	if (config.vc?.enabled) {
		const vcOptions = {
			heatmapSize: config.vc.heatmapSize,
			oldDomUpdates: config.vc.oldDomUpdates,
			devToolsEnabled: config.vc.devToolsEnabled,
			selectorConfig: config.vc.selectorConfig,
			ssrEnablePageLayoutPlaceholder: config.vc.ssrEnablePageLayoutPlaceholder,
		};

		postInteractionLog.initializeVCObserver(vcOptions);
		if (config?.experimentalInteractionMetrics?.enabled) {
			experimentalVC.initialize(vcOptions).start({ startTime: 0 });
		}

		if (config?.extraInteractionMetrics?.enabled) {
			interactionExtraMetrics.initializeVCObserver(vcOptions);
		}
	}

	setupHiddenTimingCapture();
	startLighthouseObserver();

	if (fg('platform_ufo_is_tab_throttled')) {
		setupThrottleDetection();
	}

	initialized = true;

	if (typeof PerformanceObserver !== 'undefined') {
		const observer = getPerformanceObserver();
		observer.observe({
			type: 'event',
			buffered: true,
			durationThreshold: 16,
		} as PerformanceObserverInit);
	}

	Promise.all([
		analyticsWebClientAsync,
		import(/* webpackChunkName: "create-payloads" */ '../create-payload'),
		import(
			/* webpackChunkName: "create-post-interaction-log-payload" */ '../create-post-interaction-log-payload'
		),
		import(
			/* webpackChunkName: "create-interaction-extra-metrics-payload" */ '../create-interaction-extra-metrics-payload'
		),
		import(
			/* webpackChunkName: "create-terminal-error-payload@atlaskit-internal_terminal_errors" */ '../create-terminal-error-payload'
		),
	]).then(
		([
			awc,
			payloadPackage,
			createPostInteractionLogPayloadPackage,
			createInteractionExtraMetricsPayloadPackage,
			createTerminalErrorPayloadPackage,
		]) => {
			if ((awc as GenericAnalyticWebClientPromise).getAnalyticsWebClientPromise) {
				(awc as GenericAnalyticWebClientPromise).getAnalyticsWebClientPromise().then((client) => {
					const instance = client.getInstance();
					sinkInteraction(instance, payloadPackage);
					if (config?.terminalErrors?.enabled && fg('platform_ufo_enable_terminal_errors')) {
						sinkTerminalErrors(instance, createTerminalErrorPayloadPackage.default);
					}
					if (config?.experimentalInteractionMetrics?.enabled) {
						sinkExperimentalInteractionMetrics(instance, payloadPackage);
					}
					if (config.postInteractionLog?.enabled) {
						sinkPostInteractionLog(instance, createPostInteractionLogPayloadPackage.default);
					}
					if (config?.extraInteractionMetrics?.enabled && fg('platform_ufo_enable_ttai_with_3p')) {
						sinkInteractionExtraMetrics(
							instance,
							createInteractionExtraMetricsPayloadPackage.default,
						);
					}
					if (config?.extraSearchPageInteraction?.enabled) {
						sinkExtraSearchPageInteraction(instance, payloadPackage);
					}
				});
			} else if ((awc as GenericAnalyticWebClientInstance).sendOperationalEvent) {
				sinkInteraction(awc as GenericAnalyticWebClientInstance, payloadPackage);
				if (config?.terminalErrors?.enabled && fg('platform_ufo_enable_terminal_errors')) {
					sinkTerminalErrors(
						awc as GenericAnalyticWebClientInstance,
						createTerminalErrorPayloadPackage.default,
					);
				}
				if (config?.experimentalInteractionMetrics?.enabled) {
					sinkExperimentalInteractionMetrics(
						awc as GenericAnalyticWebClientInstance,
						payloadPackage,
					);
				}
				if (config.postInteractionLog?.enabled) {
					sinkPostInteractionLog(
						awc as GenericAnalyticWebClientInstance,
						createPostInteractionLogPayloadPackage.default,
					);
				}
				if (config?.extraInteractionMetrics?.enabled && fg('platform_ufo_enable_ttai_with_3p')) {
					sinkInteractionExtraMetrics(
						awc as GenericAnalyticWebClientInstance,
						createInteractionExtraMetricsPayloadPackage.default,
					);
				}
				if (config?.extraSearchPageInteraction?.enabled) {
					sinkExtraSearchPageInteraction(awc as GenericAnalyticWebClientInstance, payloadPackage);
				}
			}
		},
	);
}
