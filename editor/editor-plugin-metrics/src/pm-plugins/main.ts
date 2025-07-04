import { bind } from 'bind-event-listener';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { UserPreferencesProvider, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type Fragment } from '@atlaskit/editor-prosemirror/model';
import {
	PluginKey,
	type ReadonlyTransaction,
	type Selection,
	type EditorState,
} from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { type MetricsPlugin } from '../metricsPluginType';

import { ActiveSessionTimer } from './utils/active-session-timer';
import { getAnalyticsPayload } from './utils/analytics';
import { type TrActionType } from './utils/check-tr-actions/types';
import { getNewPluginState } from './utils/get-new-plugin-state';
import { isTrWithDocChanges } from './utils/is-tr-with-doc-changes';
import { shouldSkipTr } from './utils/should-skip-tr';

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
	safeInsertCount: number;
};

export type ActionByType = {
	textInputCount: number;
	nodeInsertionCount: number;
	nodeAttributeChangeCount: number;
	contentMovedCount: number;
	nodeDeletionCount: number;
	undoCount: number;
	markChangeCount: number;
	contentDeletedCount: number;
};

export const initialPluginState: MetricsState = {
	intentToStartEditTime: undefined,
	lastSelection: undefined,
	activeSessionTime: 0,
	totalActionCount: 0,
	contentSizeChanged: 0,
	shouldPersistActiveSession: undefined,
	timeOfLastTextInput: undefined,
	initialContent: undefined,
	actionTypeCount: {
		textInputCount: 0,
		nodeInsertionCount: 0,
		nodeAttributeChangeCount: 0,
		contentMovedCount: 0,
		nodeDeletionCount: 0,
		undoCount: 0,
		markChangeCount: 0,
		contentDeletedCount: 0,
	},
	repeatedActionCount: 0,
	safeInsertCount: 0,
};

export const createPlugin = (
	api: ExtractInjectionAPI<MetricsPlugin> | undefined,
	userPreferencesProvider?: UserPreferencesProvider,
) => {
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
				// Return if transaction is remote or replaceDocument is set
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
				// If there is no intentToStartEditTime and there are no doc changes, return the plugin state
				if (!intentToStartEditTime && !hasDocChanges && !tr.storedMarksSet) {
					return { ...pluginState, shouldPersistActiveSession };
				}

				// Set intentToStartEditTime if it is not set and there are doc changes or marks are set
				if (!intentToStartEditTime && (hasDocChanges || tr.storedMarksSet)) {
					intentToStartEditTime = now;
				}

				// Start active session timer if intentToStartEditTime is defined, shouldStartTimer is true and shouldPersistActiveSession is false
				// shouldPersistActiveSession is true when dragging block controls and when insert menu is open as user is interacting with the editor without making doc changes
				// Timer should start when menu closes or dragging stops
				if (intentToStartEditTime && meta?.shouldStartTimer && !shouldPersistActiveSession) {
					timer.startTimer();
				}

				if (hasDocChanges) {
					timer.startTimer();

					if (shouldSkipTr(tr)) {
						return { ...pluginState, shouldPersistActiveSession };
					}

					const newPluginState = getNewPluginState({
						now,
						intentToStartEditTime,
						shouldPersistActiveSession,
						tr,
						pluginState,
						oldState,
						newState,
					});

					return newPluginState;
				}

				return {
					...pluginState,
					lastSelection: meta?.newSelection || pluginState.lastSelection,
					intentToStartEditTime,
					shouldPersistActiveSession,
				};
			},
		},
		view(view: EditorView) {
			const fireAnalyticsEvent = () => {
				const pluginState = metricsKey.getState(view.state);
				if (!pluginState) {
					return;
				}
				let toolbarDocking;
				if (
					expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1') &&
					fg('platform_editor_controls_patch_13')
				) {
					toolbarDocking = userPreferencesProvider?.getPreference('toolbarDockingInitialPosition');
				}

				const payloadToSend = getAnalyticsPayload({
					currentContent: view.state.doc.content,
					pluginState,
					toolbarDocking: toolbarDocking || undefined,
				});

				if (pluginState && pluginState.totalActionCount > 0 && pluginState.activeSessionTime > 0) {
					api?.analytics?.actions?.fireAnalyticsEvent(payloadToSend, undefined, {
						immediate: true,
					});
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
