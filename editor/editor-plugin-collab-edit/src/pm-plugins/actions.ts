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
import type { Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { AllSelection, NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { Step } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { receiveTransaction } from '@atlaskit/prosemirror-collab';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import type { PrivateCollabEditOptions } from '../types';

import {
	ADD_AGENT_SHIMMER_META,
	AGENT_SHIMMER_DEFAULT_DURATION_MS,
	type AgentShimmerRange,
	REMOVE_AGENT_SHIMMER_META,
} from './main/agent-shimmer-decorations';
import { getAgentShimmerRanges } from './main/agent-shimmer-ranges';
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
		applyRemoteSteps(json, view);
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
): void => {
	const { json, userIds = [] } = remoteData;
	if (json) {
		applyRemoteSteps(json, view, userIds, options);
	}
};

export const applyRemoteSteps = (
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	json: any[],
	view: EditorView,
	userIds?: (number | string)[],
	options?: PrivateCollabEditOptions,
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
		tr.setMeta('addToHistory', false);
		tr.setMeta('isRemote', true);

		// Agent edit shimmer: mark the ranges agent steps just wrote so the plugin reveals them with the
		// gloss-sweep → purple-highlight sequence. Gated as a whole so no experiment reads run
		// off-experiment; off-path leaves `agentShimmers` empty and everything below is a no-op.
		let durationMs = 0;
		let agentShimmers: AgentShimmerRange[] = [];
		if (expValEquals('platform_editor_agent_be_streaming', 'isEnabled', true)) {
			durationMs = expVal(
				'platform_editor_agent_be_streaming',
				'durationMs',
				AGENT_SHIMMER_DEFAULT_DURATION_MS,
			);
			// Telepointer shown by default; `telepointerDisabled` hides it (inverted because `expVal`
			// only permits `false` as a boolean default).
			const telepointerEnabled = !expVal(
				'platform_editor_agent_be_streaming',
				'telepointerDisabled',
				false,
			);
			agentShimmers = getAgentShimmerRanges(json, steps, tr, view, durationMs, telepointerEnabled);
			if (agentShimmers.length) {
				tr.setMeta(ADD_AGENT_SHIMMER_META, agentShimmers);
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

		// Remove each shimmer after `durationMs`. `dispatchMeta` is guarded so a timer firing after
		// teardown is a harmless no-op. Only reached when the gated block above produced ranges, so this
		// whole path is off-experiment-safe.
		if (agentShimmers.length) {
			const dispatchMeta = (metaKey: string, value: unknown): void => {
				try {
					view.dispatch(view.state.tr.setMeta(metaKey, value));
				} catch {
					// View torn down before the timer fired — nothing to clean up.
				}
			};
			agentShimmers.forEach(({ shimmerId }) => {
				setTimeout(() => {
					dispatchMeta(REMOVE_AGENT_SHIMMER_META, shimmerId);
				}, durationMs);
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
