import { bind } from 'bind-event-listener';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import {
	PluginKey,
	type ReadonlyTransaction,
	Selection,
	EditorState,
} from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import { type MetricsPlugin } from '../metricsPluginType';

import { ActiveSessionTimer } from './utils/active-session-timer';
import { getAnalyticsPayload } from './utils/analytics';
import {
	ActionType,
	type TrActionType,
	checkTrActionType,
	shouldSkipTr,
} from './utils/check-tr-action-type';
import { isNonTextUndo } from './utils/is-non-text-undo';
import { isTrWithDocChanges } from './utils/is-tr-with-doc-changes';

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
	shouldPersistActiveSession?: boolean;
	initialContent?: Fragment;
	previousTrType?: TrActionType;
	repeatedActionCount: number;
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
	repeatedActionCount: 0,
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
				if (tr.getMeta('isRemote') || tr.getMeta('replaceDocument')) {
					return pluginState;
				}

				const meta = tr.getMeta(metricsKey);

				// If the active session is stopped, reset the plugin state, and set initialContent to new doc content
				if (meta && meta.stopActiveSession) {
					return { ...initialPluginState, initialContent: newState.doc.content };
				}

				const shouldPersistActiveSession =
					meta?.shouldPersistActiveSession ?? pluginState.shouldPersistActiveSession;

				const hasDocChanges = isTrWithDocChanges(tr);

				let intentToStartEditTime =
					meta?.intentToStartEditTime || pluginState.intentToStartEditTime;

				const now = performance.now();
				if (!intentToStartEditTime && !hasDocChanges && !tr.storedMarksSet) {
					return pluginState;
				}

				if (!intentToStartEditTime && (hasDocChanges || tr.storedMarksSet)) {
					intentToStartEditTime = now;
				}

				// Start active session timer if intentToStartEditTime is set and shouldStartTimer is true
				// shouldPersistActiveSession is set to true when dragging block controls and when insert menu is open
				// Timer should start when menu closes or dragging stops
				if (
					intentToStartEditTime &&
					meta?.shouldStartTimer &&
					!pluginState.shouldPersistActiveSession
				) {
					timer.startTimer();
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

				if (hasDocChanges) {
					timer.startTimer();

					const { actionTypeCount, timeOfLastTextInput, totalActionCount, previousTrType } =
						pluginState;

					if (shouldSkipTr(tr)) {
						return pluginState;
					}

					const trType = checkTrActionType(tr);

					let shouldNotIncrementActionCount = false;
					let shouldSetTimeOfLastTextInput = false;
					let isTextInput = false;

					if (trType) {
						const isNotNewStatus =
							trType.type === ActionType.UPDATING_STATUS &&
							previousTrType?.type === ActionType.UPDATING_STATUS &&
							trType?.extraData?.statusId === previousTrType?.extraData?.statusId;

						const isAddingTextToListNode =
							trType.type === ActionType.TEXT_INPUT &&
							!!previousTrType &&
							[
								ActionType.UPDATING_NEW_LIST_TYPE_ITEM,
								ActionType.INSERTING_NEW_LIST_TYPE_NODE,
							].includes(previousTrType.type);

						const isAddingNewListItemAfterTextInput =
							!!previousTrType &&
							previousTrType.type === ActionType.TEXT_INPUT &&
							[ActionType.UPDATING_NEW_LIST_TYPE_ITEM].includes(trType.type);

						// Check if tr is textInput and only increment textInputCount if previous action was not textInput
						isTextInput = [ActionType.TEXT_INPUT, ActionType.EMPTY_LINE_ADDED_OR_DELETED].includes(
							trType.type,
						);

						// timeOfLastTextInput should be set if tr includes continuous text input on the same node
						shouldSetTimeOfLastTextInput =
							[
								ActionType.TEXT_INPUT,
								ActionType.EMPTY_LINE_ADDED_OR_DELETED,
								ActionType.UPDATING_NEW_LIST_TYPE_ITEM,
								ActionType.INSERTING_NEW_LIST_TYPE_NODE,
								ActionType.UPDATING_STATUS,
							].includes(trType.type) || isNotNewStatus;

						// Should not increase action count if tr is text input,
						// empty line added or deleted, updating new list item or is updating same status node

						shouldNotIncrementActionCount =
							isTextInput ||
							isNotNewStatus ||
							isAddingTextToListNode ||
							isAddingNewListItemAfterTextInput;
					}

					let newTextInputCount = isTextInput
						? actionTypeCount.textInputCount + 1
						: actionTypeCount.textInputCount;
					let newTotalActionCount = totalActionCount + 1;

					if (timeOfLastTextInput && shouldNotIncrementActionCount) {
						newTotalActionCount = totalActionCount;
					}

					if (
						timeOfLastTextInput &&
						isTextInput &&
						previousTrType &&
						[
							ActionType.TEXT_INPUT,
							ActionType.EMPTY_LINE_ADDED_OR_DELETED,
							ActionType.UPDATING_NEW_LIST_TYPE_ITEM,
							ActionType.INSERTING_NEW_LIST_TYPE_NODE,
						].includes(previousTrType.type)
					) {
						newTextInputCount = actionTypeCount.textInputCount;
					}

					let newNodeAttrCount = actionTypeCount.nodeAttributeChangeCount;
					let newRepeatedActionCount = pluginState.repeatedActionCount;

					if (trType?.type === ActionType.CHANGING_ATTRS) {
						newNodeAttrCount = newNodeAttrCount + 1;
						if (previousTrType?.type === ActionType.CHANGING_ATTRS) {
							const { attr: newAttr, from: newFrom, to: newTo } = trType.extraData;
							const { attr: prevAttr, from: prevFrom, to: prevTo } = previousTrType.extraData;
							newRepeatedActionCount =
								newAttr === prevAttr && newFrom === prevFrom && newTo === prevTo
									? newRepeatedActionCount + 1
									: newRepeatedActionCount;
						}
					}

					const newPluginState = {
						...pluginState,
						activeSessionTime: now - intentToStartEditTime,
						totalActionCount: newTotalActionCount,
						timeOfLastTextInput: shouldSetTimeOfLastTextInput ? now : undefined,
						contentSizeChanged:
							pluginState.contentSizeChanged +
							(newState.doc.content.size - oldState.doc.content.size),
						actionTypeCount: {
							...newActionTypeCount,
							textInputCount: newTextInputCount,
							nodeAttributeChangeCount: newNodeAttrCount,
						},
						intentToStartEditTime,
						shouldPersistActiveSession,
						previousTrType: trType,
						repeatedActionCount: newRepeatedActionCount,
					};
					return newPluginState;
				}

				return {
					...pluginState,
					lastSelection: meta?.newSelection || pluginState.lastSelection,
					intentToStartEditTime,
					actionTypeCount: newActionTypeCount,
					shouldPersistActiveSession,
				};
			},
		},
		view(view: EditorView) {
			const handleIsDraggingChanged = api?.blockControls?.sharedState.onChange(
				({ nextSharedState, prevSharedState }) => {
					if (nextSharedState) {
						api?.core.actions.execute(({ tr }) => {
							if (!prevSharedState?.isDragging && nextSharedState.isDragging) {
								api?.metrics.commands.handleIntentToStartEdit({
									shouldStartTimer: false,
									shouldPersistActiveSession: true,
								})({ tr });
							} else if (prevSharedState?.isDragging && !nextSharedState.isDragging) {
								api?.metrics.commands.startActiveSessionTimer()({ tr });
							}
							return tr;
						});
					}
				},
			);

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
					handleIsDraggingChanged?.();
				},
			};
		},
		props: {
			handleDOMEvents: {
				click: (view: EditorView) => {
					const newSelection = view.state.tr.selection;
					const pluginState = api?.metrics.sharedState.currentState();

					if (
						pluginState?.lastSelection?.from !== newSelection.from &&
						pluginState?.lastSelection?.to !== newSelection.to
					) {
						api?.core.actions.execute(
							api?.metrics.commands.handleIntentToStartEdit({
								newSelection,
							}),
						);
					}
					return false;
				},
			},
		},
	});
};
