// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as allAdfSchemaSteps from '@atlaskit/adf-schema/steps';
// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as allAtlaskitCustomSteps from '@atlaskit/custom-steps';
import { isAiXstateMigrationEnabled } from '@atlaskit/editor-common/ai-xstate-migration';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import type {
	CollabEventConnectionData,
	CollabEventInitData,
	CollabEventPresenceData,
	CollabEventRemoteData,
	CollabSendableSelection,
	CollabTelepointerPayload,
} from '@atlaskit/editor-common/collab';
import {
	AGENT_EDIT_CHROME_DATA,
	getAgentEditChromeDynamicConfig,
} from '@atlaskit/editor-common/collab-agent-edit-chrome';
import { AGENT_REMOTE_EDIT_REVIEW_DATA } from '@atlaskit/editor-common/collab-agent-remote-edit-review';
import type { Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { AllSelection, NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { Step } from '@atlaskit/editor-prosemirror/transform-override';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { receiveTransaction, sendableSteps } from '@atlaskit/prosemirror-collab';

import type { PrivateCollabEditOptions } from '../types';
import { getAgentEditShimmerNotShownPayload } from './analytics';
import { getAgentEditRequester } from './main/agent-edit-requester';
import { getAgentEditSegments } from './main/agent-review-segments';
import { getAgentEditChromeRanges } from './main/agent-shimmer-ranges';
import { getRemoteAgentChromeIdentity } from './main/remote-agent-chrome-identity';
import { replaceDocument } from './utils';

/*
 * This is a non-op function to force ProseMirror to load and register all custom steps in the same bundle
 */
export const registerAllCustomSteps = (): void => {
	Object.entries(allAtlaskitCustomSteps).forEach(() => {});
	Object.entries(allAdfSchemaSteps).forEach(() => {});
};

export const handleInit = (
	initData: CollabEventInitData,
	view: EditorView,
	options?: PrivateCollabEditOptions,
	editorAnalyticsApi?: EditorAnalyticsAPI,
): void => {
	const { doc, json, version, reserveCursor } = initData;
	if (doc) {
		const { state } = view;
		const tr = replaceDocument(doc, state, version, options, reserveCursor, editorAnalyticsApi);
		tr.setMeta('isRemote', true);
		view.dispatch(tr);
	} else if (json) {
		applyRemoteSteps(json, view, undefined, options, editorAnalyticsApi);
	}
};

export const handleConnection = (
	connectionData: CollabEventConnectionData,
	view: EditorView,
): void => {
	const {
		state: { tr },
	} = view;
	view.dispatch(tr.setMeta('sessionId', connectionData));
};

export const handlePresence = (presenceData: CollabEventPresenceData, view: EditorView): void => {
	const {
		state: { tr },
	} = view;
	view.dispatch(tr.setMeta('presence', presenceData));
};

export const applyRemoteData = (
	remoteData: CollabEventRemoteData,
	view: EditorView,
	options: PrivateCollabEditOptions,
	editorAnalyticsApi?: EditorAnalyticsAPI,
): void => {
	const { json, userIds = [] } = remoteData;
	if (json) {
		applyRemoteSteps(json, view, userIds, options, editorAnalyticsApi);
	}
};

export const applyRemoteSteps = (
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	json: any[],
	view: EditorView,
	userIds?: (number | string)[],
	options?: PrivateCollabEditOptions,
	editorAnalyticsApi?: EditorAnalyticsAPI,
): void => {
	if (!json || !json.length) {
		return;
	}

	const {
		state,
		state: { schema },
	} = view;

	const steps = json.map((step) => Step.fromJSON(schema, step));

	let tr: Transaction;

	if (options && options.useNativePlugin && userIds) {
		tr = receiveTransaction(state, steps, userIds, {
			mapSelectionBackward: true,
		});
	} else {
		tr = state.tr;
		steps.forEach((step) => tr.step(step));
	}

	if (tr) {
		const agentEditRequester = getAgentEditRequester(json, view);
		const shouldRecordAgentEditInHistory = agentEditRequester?.isLocalUserRequester === true;
		tr.setMeta('addToHistory', shouldRecordAgentEditInHistory);
		tr.setMeta('isRemote', true);

		let visualJson = json;
		let visualSteps = steps;
		if (
			options?.useNativePlugin &&
			userIds &&
			(isExperimentEnabled('platform_editor_ai_streaming_ux_experience_m1') ||
				isExperimentEnabled('platform_editor_agent_be_streaming'))
		) {
			// Read the client ID before applying the acknowledgement, while the local steps
			// are still unconfirmed. receiveTransaction removes this same local prefix.
			// Exclude it from visuals too: the originating FE stream already owns its UI.
			const localClientId = sendableSteps(state)?.clientID;
			let acknowledgedSteps = 0;
			if (localClientId != null) {
				while (
					userIds[acknowledgedSteps] != null &&
					String(userIds[acknowledgedSteps]) === String(localClientId)
				) {
					acknowledgedSteps++;
				}
			}
			// Keep both remote inputs aligned after removing the acknowledged prefix.
			// Unified chrome accounts for local rollback steps in the applied transaction;
			// the full batch still participates in collaboration, presence and attribution.
			visualJson = json.slice(acknowledgedSteps);
			visualSteps = steps.slice(acknowledgedSteps);
		}
		const isM1StreamingEnabled = isExperimentEnabled(
			'platform_editor_ai_streaming_ux_experience_m1',
		);
		if (isM1StreamingEnabled || isExperimentEnabled('platform_editor_agent_be_streaming')) {
			const ranges = getAgentEditChromeRanges(
				visualJson,
				visualSteps,
				tr,
				view,
				(reason, agentType, error) =>
					editorAnalyticsApi?.attachAnalyticsEvent(
						getAgentEditShimmerNotShownPayload(reason, agentType, error),
					)(tr),
			);
			const requester = getAgentEditRequester(visualJson, view);
			if (ranges.length && requester) {
				// Collab supplies a machine agent type, not a display name; preserve the legacy
				// uppercase telepointer label as the fallback for observers that cannot resolve a
				// redesigned presentation from the forwarded identity.
				const telepointerLabel = requester.agentType.trim().toUpperCase();
				tr.setMeta(AGENT_EDIT_CHROME_DATA, {
					...(!isM1StreamingEnabled ? getAgentEditChromeDynamicConfig() : {}),
					...getRemoteAgentChromeIdentity(requester),
					...(telepointerLabel ? { telepointerLabel } : {}),
					ranges,
				});
			}
		}

		// Record the agent's edit (original + new slice per change) onto this
		// transaction; `editor-plugin-ai` consumes the meta to open the BE Review moment.
		// Same eligibility as FE Review moment: xstate AND the M1 streaming UX
		// experiment. `getAgentEditSegments` self-gates (returns null for non-agent
		// edits, never throws), so this is a no-op for ordinary collaborator edits.
		if (
			isAiXstateMigrationEnabled() &&
			isExperimentEnabled('platform_editor_ai_streaming_ux_experience_m1')
		) {
			const reviewData = getAgentEditSegments(json, steps, tr, view);
			if (reviewData) {
				tr.setMeta(AGENT_REMOTE_EDIT_REVIEW_DATA, reviewData);
			}
		}

		/*
		 * Persist marks across transactions. Fixes an issue where
		 * marks are lost if remote transactions are dispatched
		 * between a user creating the mark and typing.
		 */
		if (state.tr.storedMarks) {
			tr.setStoredMarks(state.tr.storedMarks);
		}

		view.dispatch(tr);
	}
};

export const handleTelePointer = (
	telepointerData: CollabTelepointerPayload,
	view: EditorView,
): void => {
	const {
		state: { tr },
	} = view;
	view.dispatch(tr.setMeta('telepointer', telepointerData));
};

function isAllSelection(selection: Selection) {
	return selection instanceof AllSelection;
}

function isNodeSelection(selection: Selection) {
	return selection instanceof NodeSelection;
}

export const getSendableSelection = (selection: Selection): CollabSendableSelection => {
	/**
	 * <kbd>CMD + A</kbd> triggers a AllSelection
	 * <kbd>escape</kbd> triggers a NodeSelection
	 */
	return {
		type: 'textSelection',
		anchor: selection.anchor,
		head:
			isAllSelection(selection) || isNodeSelection(selection) ? selection.head - 1 : selection.head,
	};
};
