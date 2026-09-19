// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as allAdfSchemaSteps from '@atlaskit/adf-schema/steps';
// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as allAtlaskitCustomSteps from '@atlaskit/custom-steps';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
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
import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { receiveTransaction, sendableSteps } from '@atlaskit/prosemirror-collab';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { PrivateCollabEditOptions } from '../types';
import { getAgentEditShimmerNotShownPayload } from './analytics';
import { getAgentEditRequester } from './main/agent-edit-requester';
import { getAgentEditSegments } from './main/agent-review-segments';
import {
	ADD_AGENT_SHIMMER_META,
	AGENT_EDIT_HIGHLIGHT_DEFAULT_DURATION_MS,
	AGENT_SHIMMER_DEFAULT_DURATION_MS,
	type AgentShimmerRange,
	HIGHLIGHT_AGENT_SHIMMER_META,
	REMOVE_AGENT_SHIMMER_META,
} from './main/agent-shimmer-decorations';
import { getAgentEditChromeRanges, getAgentShimmerRanges } from './main/agent-shimmer-ranges';
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
		const agentEditRequester = fg('platform_editor_agent_be_review_undo')
			? getAgentEditRequester(json, view)
			: null;
		const shouldRecordAgentEditInHistory = agentEditRequester?.isLocalUserRequester === true;
		tr.setMeta('addToHistory', shouldRecordAgentEditInHistory);
		tr.setMeta('isRemote', true);

		// Agent edit shimmer: mark the ranges agent steps just wrote so the plugin reveals them with the
		// skeleton loader, then (optionally) a purple "just edited" highlight. Gated as a whole so no
		// experiment reads run off-experiment; off-path leaves `agentShimmers` empty and everything below
		// is a no-op.
		let shimmerDurationMs = 0;
		let highlightDurationMs = 0;
		let agentShimmers: AgentShimmerRange[] = [];
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
		const isUnifiedPostApplyChromeEnabled = isExperimentEnabled(
			'platform_editor_ai_unified_post_apply_chrome',
		);
		if (
			isUnifiedPostApplyChromeEnabled &&
			(isM1StreamingEnabled || isExperimentEnabled('platform_editor_agent_be_streaming'))
		) {
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
		if (
			!isUnifiedPostApplyChromeEnabled &&
			expValEquals('platform_editor_agent_be_streaming', 'isEnabled', true)
		) {
			// The skeleton and purple-highlight phases toggle independently. `shimmerDurationMs` is the
			// skeleton lifetime; `0` skips the skeleton (an edit can still get the purple highlight).
			shimmerDurationMs = expVal(
				'platform_editor_agent_be_streaming',
				'shimmerDurationMs',
				AGENT_SHIMMER_DEFAULT_DURATION_MS,
			);
			// `highlightDurationMs` is the purple "just edited" highlight lifetime; `0` skips the highlight
			// (the skeleton still shows). `0` on both shows nothing.
			highlightDurationMs = expVal(
				'platform_editor_agent_be_streaming',
				'highlightDurationMs',
				AGENT_EDIT_HIGHLIGHT_DEFAULT_DURATION_MS,
			);
			// Telepointer shown by default; `telepointerDisabled` hides it (inverted because `expVal`
			// only permits `false` as a boolean default).
			const telepointerEnabled = !expVal(
				'platform_editor_agent_be_streaming',
				'telepointerDisabled',
				false,
			);
			agentShimmers = getAgentShimmerRanges(
				visualJson,
				visualSteps,
				tr,
				view,
				shimmerDurationMs,
				highlightDurationMs,
				telepointerEnabled,
				// An agent edit that applied without the shimmer fires the operational event on the same
				// transaction, so success stays event-free and only degrades are reported.
				(reason, agentType, error) =>
					editorAnalyticsApi?.attachAnalyticsEvent(
						getAgentEditShimmerNotShownPayload(reason, agentType, error),
					)(tr),
			);
			if (agentShimmers.length) {
				tr.setMeta(ADD_AGENT_SHIMMER_META, agentShimmers);
			}
		}

		// Record the agent's edit (original + new slice per change) onto this
		// transaction; `editor-plugin-ai` consumes the meta to open the BE Review moment.
		// Same eligibility as FE Review moment: xstate AND the M1 streaming UX
		// experiment. `getAgentEditSegments` self-gates (returns null for non-agent
		// edits, never throws), so this is a no-op for ordinary collaborator edits.
		if (
			expValEquals('platform_editor_ai_xstate_migration', 'isEnabled', true) &&
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

		// Schedule each shimmer's phase changes. `dispatchMeta` is guarded so a timer firing after
		// teardown is a harmless no-op. Only reached when the gated block above produced ranges, so this
		// whole path is off-experiment-safe.
		if (agentShimmers.length) {
			let tornDownReported = false;
			const dispatchMeta = (metaKey: string, value: unknown): void => {
				try {
					view.dispatch(view.state.tr.setMeta(metaKey, value));
				} catch {
					// View torn down before the timer fired — nothing to clean up. Report once (not once
					// per shimmer) so we can see how often shimmers are interrupted by teardown.
					if (!tornDownReported) {
						tornDownReported = true;
						editorAnalyticsApi?.fireAnalyticsEvent(
							getAgentEditShimmerNotShownPayload('tornDownMidAnimation'),
						);
					}
				}
			};
			agentShimmers.forEach(({ shimmerId }) => {
				if (shimmerDurationMs > 0) {
					// Skeleton first. When it clears, show the purple highlight (if enabled) then remove;
					// otherwise remove straight away.
					setTimeout(() => {
						if (highlightDurationMs > 0) {
							dispatchMeta(HIGHLIGHT_AGENT_SHIMMER_META, shimmerId);
							setTimeout(() => {
								dispatchMeta(REMOVE_AGENT_SHIMMER_META, shimmerId);
							}, highlightDurationMs);
						} else {
							dispatchMeta(REMOVE_AGENT_SHIMMER_META, shimmerId);
						}
					}, shimmerDurationMs);
				} else {
					// Skeleton disabled: the range already starts in the highlight phase, so just time its
					// removal. (Reached only when `highlightDurationMs > 0`, else no ranges were produced.)
					setTimeout(() => {
						dispatchMeta(REMOVE_AGENT_SHIMMER_META, shimmerId);
					}, highlightDurationMs);
				}
			});
		}
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
