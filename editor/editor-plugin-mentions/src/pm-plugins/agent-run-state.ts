import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { AgentMentionRunState, AgentRunStateByLocalId } from '../types';

const AGENT_MENTION_USER_TYPES = new Set(['APP', 'AGENT']);
const isAgentMentionUserType = (userType: unknown): boolean =>
	typeof userType === 'string' && AGENT_MENTION_USER_TYPES.has(userType);

const AGENT_RUN_STATE_ANALYSING_CLASS = 'agent-mention-analysing-state';

/**
 * Map the bridge's run-state to a mention node visual class.
 * Currently only the "analysing" state changes the chip, applying a shimmer to the pill.
 */
const getRunStateClass = (runState: AgentMentionRunState): string | undefined => {
	switch (runState) {
		case 'thinking':
		case 'working':
			return AGENT_RUN_STATE_ANALYSING_CLASS;
		default:
			return undefined;
	}
};

/**
 * Build the node-decoration set that styles agent mentions by their run-state.
 */
export const buildAgentRunStateDecorations = (
	state: EditorState,
	runStateByLocalId: AgentRunStateByLocalId | undefined,
): DecorationSet => {
	if (!runStateByLocalId || Object.keys(runStateByLocalId).length === 0) {
		return DecorationSet.empty;
	}

	const mentionNodeType = state.schema.nodes.mention;
	if (!mentionNodeType) {
		return DecorationSet.empty;
	}

	const decorations: Decoration[] = [];
	state.doc.descendants((node, pos) => {
		if (node.type !== mentionNodeType || !isAgentMentionUserType(node.attrs.userType)) {
			return true;
		}

		const { localId } = node.attrs;
		const runState = typeof localId === 'string' ? runStateByLocalId[localId] : undefined;
		if (!runState) {
			return true;
		}

		const stateClass = getRunStateClass(runState);
		if (!stateClass) {
			return true;
		}

		decorations.push(
			Decoration.node(pos, pos + node.nodeSize, {
				class: stateClass,
			}),
		);
		return true;
	});

	return decorations.length ? DecorationSet.create(state.doc, decorations) : DecorationSet.empty;
};

/**
 * Computes the next cached run-state `DecorationSet` for a plugin's `apply`, so that
 * `props.decorations` can return a stored set instead of walking the doc on every transaction:
 */
export const nextRunStateDecorations = (
	previous: DecorationSet | undefined,
	tr: ReadonlyTransaction,
	newState: EditorState,
	runStateByLocalId: AgentRunStateByLocalId | undefined,
): DecorationSet | undefined => {
	if (runStateByLocalId !== undefined) {
		return buildAgentRunStateDecorations(newState, runStateByLocalId);
	}
	if (tr.docChanged && previous) {
		return previous.map(tr.mapping, tr.doc);
	}
	return previous;
};
