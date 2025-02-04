import { bind } from 'bind-event-listener';

import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isTextInput } from '@atlaskit/editor-common/utils';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import {
	PluginKey,
	type ReadonlyTransaction,
	Selection,
	EditorState,
} from '@atlaskit/editor-prosemirror/state';
import { type Step } from '@atlaskit/editor-prosemirror/transform';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import { type MetricsPlugin } from '../metricsPluginType';

import { ActiveSessionTimer } from './utils/active-session-timer';
import { getAnalyticsPayload } from './utils/analytics';
import { isNonTextUndo } from './utils/is-non-text-undo';

export const metricsKey = new PluginKey('metricsPlugin');
type EditorStateConfig = Parameters<typeof EditorState.create>[0];

export type MetricsState = {
	intentToStartEditTime?: number;
	activeSessionTime: number;
	totalActionCount: number;
	contentSizeChanged: number;
	lastSelection?: Selection;
	actionTypeCount: ActionByType;
	timeOfLastTextInput?: number;
	initialContent?: Fragment;
};

export type ActionByType = {
	textInputCount: number;
	nodeInsertionCount: number;
	nodeAttributeChangeCount: number;
	contentMovedCount: number;
	nodeDeletionCount: number;
	undoCount: number;
};

export const initialPluginState: MetricsState = {
	intentToStartEditTime: undefined,
	lastSelection: undefined,
	activeSessionTime: 0,
	totalActionCount: 0,
	contentSizeChanged: 0,
	timeOfLastTextInput: undefined,
	initialContent: undefined,
	actionTypeCount: {
		textInputCount: 0,
		nodeInsertionCount: 0,
		nodeAttributeChangeCount: 0,
		contentMovedCount: 0,
		nodeDeletionCount: 0,
		undoCount: 0,
	},
};

export const createPlugin = (api: ExtractInjectionAPI<MetricsPlugin> | undefined) => {
	const timer = new ActiveSessionTimer(api);

	return new SafePlugin({
		key: metricsKey,
		state: {
			init: (_: EditorStateConfig, state: EditorState): MetricsState => {
				return {
					...initialPluginState,
					initialContent: state.doc.content,
				};
			},
			// eslint-disable-next-line @typescript-eslint/max-params
			apply(
				tr: ReadonlyTransaction,
				pluginState: MetricsState,
				oldState: EditorState,
				newState: EditorState,
			): MetricsState {
				const meta = tr.getMeta(metricsKey);

				let intentToStartEditTime =
					meta?.intentToStartEditTime || pluginState.intentToStartEditTime;

				if (meta && meta.stopActiveSession) {
					return { ...initialPluginState, initialContent: newState.doc.content };
				}

				if (!intentToStartEditTime) {
					if (tr.docChanged && !tr.getMeta('replaceDocument')) {
						intentToStartEditTime = performance.now();
					} else {
						return pluginState;
					}
				}

				const undoCount = isNonTextUndo(tr) ? 1 : 0;

				const newActionTypeCount: ActionByType = pluginState.actionTypeCount
					? {
							...pluginState.actionTypeCount,
							undoCount: pluginState.actionTypeCount.undoCount + undoCount,
						}
					: {
							...initialPluginState.actionTypeCount,
							undoCount,
						};

				const canIgnoreTr = () => !tr.steps.every((e: Step) => e instanceof AnalyticsStep);
				if (tr.docChanged && canIgnoreTr()) {
					const now = performance.now();
					timer.startTimer();

					const { actionTypeCount, timeOfLastTextInput, totalActionCount, activeSessionTime } =
						pluginState;
					// If previous and current action is text insertion, then don't increase total action count
					const isActionTextInput = isTextInput(tr);
					let newActiveSessionTime = activeSessionTime + (now - intentToStartEditTime);
					let newTextInputCount = isActionTextInput
						? actionTypeCount.textInputCount + 1
						: actionTypeCount.textInputCount;
					let newTotalActionCount = pluginState.totalActionCount + 1;

					if (pluginState.timeOfLastTextInput && isActionTextInput) {
						newActiveSessionTime = activeSessionTime + (now - (timeOfLastTextInput || 0));
						newTextInputCount = actionTypeCount.textInputCount;
						newTotalActionCount = totalActionCount;
					}

					const newPluginState = {
						...pluginState,
						activeSessionTime: newActiveSessionTime,
						totalActionCount: newTotalActionCount,
						timeOfLastTextInput: isActionTextInput ? now : undefined,
						contentSizeChanged:
							pluginState.contentSizeChanged +
							(newState.doc.content.size - oldState.doc.content.size),
						actionTypeCount: {
							...newActionTypeCount,
							textInputCount: newTextInputCount,
						},
					};
					return newPluginState;
				}

				return {
					...pluginState,
					lastSelection: meta?.newSelection || pluginState.lastSelection,
					intentToStartEditTime,
					actionTypeCount: newActionTypeCount,
				};
			},
		},
		view(view: EditorView) {
			const fireAnalyticsEvent = () => {
				const pluginState = metricsKey.getState(view.state);
				if (!pluginState) {
					return;
				}
				const payloadToSend = getAnalyticsPayload({
					currentContent: view.state.doc.content,
					pluginState,
				});

				if (pluginState && pluginState.totalActionCount > 0 && pluginState.activeSessionTime > 0) {
					api?.analytics.actions.fireAnalyticsEvent(payloadToSend, undefined, { immediate: true });
				}
			};

			const unbindBeforeUnload = bind(window, {
				type: 'beforeunload',
				listener: () => {
					fireAnalyticsEvent();
				},
			});

			return {
				destroy() {
					fireAnalyticsEvent();
					timer.cleanupTimer();
					unbindBeforeUnload();
				},
			};
		},
		props: {
			handleDOMEvents: {
				click: (view: EditorView) => {
					const pluginState = api?.metrics.sharedState.currentState();
					if (!pluginState || pluginState.intentToStartEditTime) {
						return false;
					}
					const newSelection = view.state.tr.selection;

					const newTr = view.state.tr;

					if (
						pluginState?.lastSelection?.from !== newSelection.from &&
						pluginState?.lastSelection?.to !== newSelection.to
					) {
						newTr.setMeta(metricsKey, {
							intentToStartEditTime: performance.now(),
							newSelection: newSelection,
						});
						view.dispatch(newTr);
						timer.startTimer();
					}
					return false;
				},
			},
		},
	});
};
