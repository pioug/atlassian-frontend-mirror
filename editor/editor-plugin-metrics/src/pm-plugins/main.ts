import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isTextInput } from '@atlaskit/editor-common/utils';
import { PluginKey, type ReadonlyTransaction, Selection } from '@atlaskit/editor-prosemirror/state';
import { type Step } from '@atlaskit/editor-prosemirror/transform';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import { type MetricsPlugin } from '../metricsPluginType';

import { ActiveSessionTimer } from './utils/active-session-timer';
import { isNonTextUndo } from './utils/isNonTextUndo';

export const metricsKey = new PluginKey('metricsPlugin');

export type MetricsState = {
	editSessionStartTime?: number;
	intentToStartEditTime?: number;
	activeSessionTime: number;
	totalActionCount: number;
	lastSelection?: Selection;
	actionTypeCount: ActionByType;
	timeOfLastTextInput?: number;
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
	editSessionStartTime: undefined,
	intentToStartEditTime: undefined,
	lastSelection: undefined,
	activeSessionTime: 0,
	totalActionCount: 0,
	timeOfLastTextInput: undefined,
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
			init: (): MetricsState => {
				return { ...initialPluginState, editSessionStartTime: performance.now() };
			},

			apply(tr: ReadonlyTransaction, pluginState: MetricsState): MetricsState {
				const meta = tr.getMeta(metricsKey);

				let intentToStartEditTime =
					meta?.intentToStartEditTime || pluginState.intentToStartEditTime;

				if (meta && meta.stopActiveSession) {
					return { ...pluginState, intentToStartEditTime: undefined, lastSelection: undefined };
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

					// If previous and current action is text insertion, then don't increase total action count
					const isActionTextInput = isTextInput(tr);

					if (pluginState.timeOfLastTextInput && isActionTextInput) {
						return {
							...pluginState,
							activeSessionTime:
								pluginState.activeSessionTime + (now - pluginState.timeOfLastTextInput),
							totalActionCount: pluginState.totalActionCount,
							timeOfLastTextInput: now,
						};
					}

					return {
						...pluginState,
						activeSessionTime: pluginState.activeSessionTime + (now - intentToStartEditTime),
						totalActionCount: pluginState.totalActionCount + 1,
						timeOfLastTextInput: isActionTextInput ? now : undefined,
						actionTypeCount: newActionTypeCount,
					};
				}

				return {
					...pluginState,
					lastSelection: meta?.newSelection || pluginState.lastSelection,
					intentToStartEditTime,
					actionTypeCount: newActionTypeCount,
				};
			},
		},
		view() {
			return {
				destroy() {
					api?.core.actions.execute(api?.metrics?.commands.fireSessionAnalytics());
					timer.cleanupTimer();
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
