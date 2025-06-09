import { bind } from 'bind-event-listener';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { fireAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import type { NcsStepMetricsPlugin } from './ncsStepMetricsPluginType';
import { getPayload } from './pm-plugins/utils/analytics';
import {
	getNcsSessionStepMetrics,
	clearNcsSessionStepMetrics,
	clearNcsActiveSession,
	checkForUnfinishedNcsSessions,
} from './pm-plugins/utils/session';

/**
 * NCS Session Step Metrics plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const ncsStepMetricsPlugin: NcsStepMetricsPlugin = ({ api }) => {
	let sessionId: string | undefined;
	let createAnalyticsEvent: CreateUIAnalyticsEvent | undefined;

	return {
		name: 'ncsStepMetrics',
		pmPlugins() {
			return [
				{
					name: 'ncsStepMetricsPlugin',
					plugin: () =>
						new SafePlugin({
							view: () => {
								api?.collabEdit?.sharedState?.onChange(({ nextSharedState }) => {
									if (
										nextSharedState.sessionId !== undefined &&
										sessionId !== nextSharedState.sessionId
									) {
										sessionId = nextSharedState.sessionId;
										checkForUnfinishedNcsSessions(api);
									}
								});

								const unsubscribeAnalytics = api?.analytics?.sharedState?.onChange(
									({ nextSharedState }) => {
										if (nextSharedState.createAnalyticsEvent) {
											createAnalyticsEvent = nextSharedState.createAnalyticsEvent;

											unsubscribeAnalytics?.();
										}
									},
								);

								let analyticsEventSent = false;
								const sendAnalyticsEvent = () => {
									if (analyticsEventSent || !createAnalyticsEvent || !sessionId) {
										return;
									}
									analyticsEventSent = true;

									const ncsSessionStepMetrics = getNcsSessionStepMetrics(sessionId);
									if (!ncsSessionStepMetrics) {
										return;
									}

									// At this point in the editor lifecycle, we no longer have access to the analytics api
									// So we use the stored `createAnalyticsEvent` function to send the event
									fireAnalyticsEvent(createAnalyticsEvent, {
										immediate: true,
									})({
										payload: getPayload(ncsSessionStepMetrics),
									});
									clearNcsSessionStepMetrics(sessionId);
								};

								const handleBeforeUnload = () => {
									// On beforeunload, we want to clear the active session
									// So when the editor is re-initialized, it will send the stored analytics event
									clearNcsActiveSession(sessionId);
								};

								const unbindBeforeUnload = bind(window, {
									type: 'beforeunload',
									listener: handleBeforeUnload,
								});

								return {
									destroy() {
										/**
										 * We use requestAnimationFrame to ensure that the editor has been unmounted
										 * before we send the analytics event.
										 */
										requestAnimationFrame(() => {
											const akEditor = document.querySelector('.akEditor');
											if (!akEditor) {
												sendAnalyticsEvent();

												unbindBeforeUnload();
											}
										});
									},
								};
							},
						}),
				},
			];
		},
	};
};
