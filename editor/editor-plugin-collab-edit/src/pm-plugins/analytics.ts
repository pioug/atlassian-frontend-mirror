import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import type { AgentEditShimmerNotShownReason } from '@atlaskit/editor-common/analytics/types/agent-edit-shimmer-events';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics/types/enums';
import type {
	AnalyticsEventPayload,
	ErrorEventPayload,
} from '@atlaskit/editor-common/analytics/types/events';
import { getDocStructure } from '@atlaskit/editor-common/document-logger';
import type { FeatureFlags } from '@atlaskit/editor-common/types/feature-flags';
import { sniffUserBrowserExtensions } from '@atlaskit/editor-common/utils/browser-extensions';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

export const addSynchronyErrorAnalytics = (
	state: EditorState,
	tr: Transaction,
	featureFlags: FeatureFlags,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) => {
	return (error: Error): Transaction => {
		const browserExtensions = sniffUserBrowserExtensions({
			extensions: ['grammarly'],
		});

		const payload: ErrorEventPayload = {
			action: ACTION.SYNCHRONY_ERROR,
			actionSubject: ACTION_SUBJECT.EDITOR,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes: { error, browserExtensions },
		};

		if (featureFlags.synchronyErrorDocStructure) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			payload.attributes!.docStructure = getDocStructure(state.doc, {
				compact: true,
			});
		}

		editorAnalyticsApi?.attachAnalyticsEvent(payload)(tr);
		return tr;
	};
};

/**
 * Builds the `agentEditShimmerNotShown` operational event fired when an agent-authored edit applied
 * instantly without the skeleton shimmer/telepointer. Success is the ABSENCE of this event; a
 * neutral action + `reason` keeps expected degrades out of error dashboards. Attributes are non-PII:
 * only the agent kind and a sanitised error name/message (never the raw Error or any doc content).
 */
export const getAgentEditShimmerNotShownPayload = (
	reason: AgentEditShimmerNotShownReason,
	agentType?: string,
	error?: Error,
): AnalyticsEventPayload => ({
	action: ACTION.AGENT_EDIT_SHIMMER_NOT_SHOWN,
	actionSubject: ACTION_SUBJECT.COLLAB,
	eventType: EVENT_TYPE.OPERATIONAL,
	attributes: {
		reason,
		// Spread conditionally so absent context isn't emitted as `undefined` (the teardown path has no
		// single agent, and non-throw reasons have no error).
		...(agentType ? { agentType } : {}),
		...(error ? { error: `${error.name}: ${error.message}` } : {}),
	},
});

export type EntityEventType = 'error' | 'disconnected';

export const addSynchronyEntityAnalytics = (state: EditorState, tr: Transaction) => {
	return (
		type: EntityEventType,
		editorAnalyticsApi: EditorAnalyticsAPI | undefined,
	): Transaction => {
		editorAnalyticsApi?.attachAnalyticsEvent({
			action: type === 'error' ? ACTION.SYNCHRONY_ENTITY_ERROR : ACTION.SYNCHRONY_DISCONNECTED,
			actionSubject: ACTION_SUBJECT.EDITOR,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes: {
				// https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
				onLine: navigator.onLine,
				visibilityState: document.visibilityState,
			},
		})(tr);
		return tr;
	};
};
