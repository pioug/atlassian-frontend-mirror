import { bind } from 'bind-event-listener';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import type { NcsStepMetricsPlugin } from './ncsStepMetricsPluginType';

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

							let analyticsEventSent = false;
							const sendAnalyticsEvent = () => {
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
