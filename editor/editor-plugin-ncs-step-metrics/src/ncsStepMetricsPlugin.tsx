import { bind } from 'bind-event-listener';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import type { NcsStepMetricsPlugin } from './ncsStepMetricsPluginType';

// import { StorageClient } from '@atlaskit/frontend-utilities';

// const STORAGE_CLIENT_KEY = 'ncs-step-metrics-storage';
// const storageClient = new StorageClient(STORAGE_CLIENT_KEY);

/**
 * Metrics plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const ncsStepMetricsPlugin: NcsStepMetricsPlugin = () => ({
	name: 'ncsStepMetrics',
	pmPlugins() {
		return [
			{
				name: 'ncsStepMetricsPlugin',
				plugin: () =>
					new SafePlugin({
						view: () => {
							// Will check for any unsent analytics events and send them
							// have a list of active sessions, if the session stored in the browser is still active do not send the event
							// const currentStepMetrics = storageClient.getItem('ncsStepSessionMetrics') || {};
							// const currentActiveSession = storageClient.getItem('ncsActiveSessions') || {};
							let analyticsEventSent = false;
							const sendAnalyticsEvent = () => {
								// Get the current step session metrics from storage
								// This is a failsafe to ensure that we only send the analytics event once
								if (analyticsEventSent) {
									return;
								}

								analyticsEventSent = true;

								// Send Analytics Event
							};

							const handleBeforeUnload = () => {
								sendAnalyticsEvent();
							};

							// We need to ensure that the analytics event is sent when the user navigates away from the page
							// This is not fool proof, but it will cover most cases
							// We have a fallback to send the stored event on plugin initialization
							const unbindBeforeUnload = bind(window, {
								type: 'beforeunload',
								listener: handleBeforeUnload,
							});

							return {
								destroy() {
									// This will send the analytics event when the plugin is destroyed
									sendAnalyticsEvent();

									// Remove the beforeunload event listener
									unbindBeforeUnload();
								},
							};
						},
					}),
			},
		];
	},
});
