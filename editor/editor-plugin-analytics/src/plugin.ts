import { useLayoutEffect } from 'react';

import type { AnalyticsWithChannel } from '@atlaskit/adf-schema/steps';
import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	EVENT_TYPE,
	fireAnalyticsEvent,
	getAnalyticsEventsFromTransaction,
} from '@atlaskit/editor-common/analytics';
import { isPerformanceAPIAvailable } from '@atlaskit/editor-common/is-performance-api-available';
import { measureRender } from '@atlaskit/editor-common/performance/measure-render';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	FeatureFlags,
	NextEditorPlugin,
	OptionalPlugin,
	PerformanceTracking,
} from '@atlaskit/editor-common/types';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { CreateAttachPayloadIntoTransaction } from './analytics-api/attach-payload-into-transaction';
import { createAttachPayloadIntoTransaction } from './analytics-api/attach-payload-into-transaction';
import { editorAnalyticsChannel } from './consts';
import { analyticsPluginKey } from './plugin-key';
import { generateUndoRedoInputSoucePayload } from './undo-redo-input-source';

export interface AnalyticsPluginOptions {
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	performanceTracking?: PerformanceTracking;
}

function createPlugin(options: AnalyticsPluginOptions, featureFlags: FeatureFlags) {
	if (!options) {
		return;
	}

	const hasRequiredPerformanceAPIs = isPerformanceAPIAvailable();

	return new SafePlugin({
		key: analyticsPluginKey,
		state: {
			init: () => {
				return {
					...options,
					fireAnalytics: fireAnalyticsEvent(options.createAnalyticsEvent),
				};
			},
			apply: (tr, pluginState, _, state) => {
				const { createAnalyticsEvent } = tr.getMeta(analyticsPluginKey) ?? {};

				// When the createAnalyticsEvent is reconfigured
				if (
					(options.createAnalyticsEvent &&
						options.createAnalyticsEvent !== pluginState.createAnalyticsEvent) ||
					(pluginState.createAnalyticsEvent !== createAnalyticsEvent && createAnalyticsEvent)
				) {
					return {
						...pluginState,
						createAnalyticsEvent: options.createAnalyticsEvent ?? createAnalyticsEvent,
					};
				}

				if (featureFlags.catchAllTracking) {
					const analyticsEventWithChannel = getAnalyticsEventsFromTransaction(tr);
					if (analyticsEventWithChannel.length > 0) {
						for (const { payload, channel } of analyticsEventWithChannel) {
							// Measures how much time it takes to update the DOM after each ProseMirror document update
							// that has an analytics event.
							if (
								hasRequiredPerformanceAPIs &&
								tr.docChanged &&
								payload.action !== ACTION.INSERTED &&
								payload.action !== ACTION.DELETED
							) {
								const measureName = `${payload.actionSubject}:${payload.action}:${payload.actionSubjectId}`;
								measureRender(
									// NOTE this name could be resulting in misleading data -- where if multiple payloads are
									// received before a render completes -- the measurement value will be inaccurate (this is
									// due to measureRender requiring unique measureNames)
									measureName,
									({ duration, distortedDuration }) => {
										fireAnalyticsEvent(pluginState.createAnalyticsEvent)({
											payload: extendPayload({
												payload,
												duration,
												distortedDuration,
											}),
											channel,
										});
									},
								);
							}
						}
					}
				}
				return pluginState;
			},
		},
	});
}

export type AnalyticsPlugin = NextEditorPlugin<
	'analytics',
	{
		pluginConfiguration: AnalyticsPluginOptions;
		sharedState: {
			/**
			 * **Warning:** Do not use this directly. Use the `analyticsPlugin.actions`
			 * instead, as it will properly queue all events.
			 */
			createAnalyticsEvent: CreateUIAnalyticsEvent | null;
			/**
			 * **Warning:** Do not use this directly. Use the `analyticsPlugin.actions`
			 * instead, as it will properly queue all events.
			 */
			attachAnalyticsEvent: CreateAttachPayloadIntoTransaction | null;
			performanceTracking: PerformanceTracking | undefined;
		};
		dependencies: [OptionalPlugin<FeatureFlagsPlugin>];
		actions: EditorAnalyticsAPI;
	}
>;

/**
 * Analytics plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
const analyticsPlugin: AnalyticsPlugin = ({ config: options = {}, api }) => {
	const featureFlags = api?.featureFlags?.sharedState.currentState() || {};
	const analyticsEventPropQueue: Set<{ payload: AnalyticsEventPayload; channel?: string }> =
		new Set();

	return {
		name: 'analytics',

		getSharedState: (editorState) => {
			if (!editorState) {
				return {
					createAnalyticsEvent: null,
					attachAnalyticsEvent: null,
					performanceTracking: undefined,
				};
			}
			const { createAnalyticsEvent, performanceTracking } =
				analyticsPluginKey.getState(editorState) ?? {};
			return {
				createAnalyticsEvent,
				attachAnalyticsEvent: createAttachPayloadIntoTransaction(editorState.selection),
				performanceTracking,
			};
		},

		actions: {
			attachAnalyticsEvent:
				(payload: AnalyticsEventPayload, channel: string = editorAnalyticsChannel) =>
				(tr: Transaction) => {
					const { createAnalyticsEvent, attachAnalyticsEvent } =
						api?.analytics?.sharedState.currentState() ?? {};
					if (!tr || !createAnalyticsEvent || !attachAnalyticsEvent) {
						analyticsEventPropQueue.add({ payload, channel: channel });
						return false;
					}

					attachAnalyticsEvent({
						tr,
						payload,
						channel,
					});

					return true;
				},
			fireAnalyticsEvent: (payload: AnalyticsEventPayload) => {
				const { createAnalyticsEvent } = api?.analytics?.sharedState.currentState() ?? {};
				if (!createAnalyticsEvent) {
					analyticsEventPropQueue.add({ payload });
					return;
				}

				fireAnalyticsEvent(createAnalyticsEvent)({ payload });
			},
		},

		usePluginHook({ editorView }) {
			const { createAnalyticsEvent } = useAnalyticsEvents();
			useLayoutEffect(() => {
				const {
					dispatch,
					state: { tr },
				} = editorView;
				tr.setMeta(analyticsPluginKey, { createAnalyticsEvent });

				dispatch(tr);

				// Attach all analytics events to the transaction
				analyticsEventPropQueue.forEach(({ payload, channel }) => {
					createAnalyticsEvent(payload)?.fire(channel ?? editorAnalyticsChannel);
				});

				// Clear the queue
				analyticsEventPropQueue.clear();
			}, [createAnalyticsEvent, editorView]);
		},

		pmPlugins() {
			return [
				{
					name: 'analyticsPlugin',
					plugin: () => createPlugin(options, featureFlags),
				},
			];
		},

		onEditorViewStateUpdated({ originalTransaction, transactions, newEditorState }) {
			const pluginState = analyticsPluginKey.getState(newEditorState);

			if (!pluginState || !pluginState.createAnalyticsEvent) {
				return;
			}

			const steps = transactions.reduce<AnalyticsWithChannel<any>[]>((acc, tr) => {
				const payloads: AnalyticsWithChannel<any>[] = tr.steps
					.filter((step): step is AnalyticsStep<any> => step instanceof AnalyticsStep)
					.map((x) => x.analyticsEvents)
					.reduce((acc, val) => acc.concat(val), []);

				acc.push(...payloads);

				return acc;
			}, []);

			if (steps.length === 0) {
				return;
			}

			const { createAnalyticsEvent } = pluginState;
			const undoAnaltyicsEventTransformer = generateUndoRedoInputSoucePayload(originalTransaction);

			steps.forEach(({ payload, channel }) => {
				const nextPayload = undoAnaltyicsEventTransformer(payload);

				fireAnalyticsEvent(createAnalyticsEvent)({
					payload: nextPayload,
					channel,
				});
			});
		},
	};
};

export function extendPayload({
	payload,
	duration,
	distortedDuration,
}: {
	payload: AnalyticsEventPayload;
	duration: number;
	distortedDuration: boolean;
}) {
	return {
		...payload,
		attributes: {
			...payload.attributes,
			duration,
			distortedDuration,
		},
		eventType: EVENT_TYPE.OPERATIONAL,
	} as AnalyticsEventPayload;
}

export { analyticsPlugin };
