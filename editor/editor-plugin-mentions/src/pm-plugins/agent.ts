import type { DocNode } from '@atlaskit/adf-schema/doc';
import type { MentionUserType } from '@atlaskit/adf-schema/mention';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type {
	EditorState,
	ReadonlyTransaction,
	SafeStateField,
} from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet, type EditorView } from '@atlaskit/editor-prosemirror/view';
import type { MentionProvider, ResolvingMentionProvider } from '@atlaskit/mention/resource';
import { isResolvingMentionProvider, MentionNameStatus } from '@atlaskit/mention/resource';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';

import type { MentionPluginOptions, MentionPluginState } from '../types';

import { getAgentMentionParentContext } from './agent-mention-context';
import { nextRunStateDecorations } from './agent-run-state';
import { mentionPluginKey } from './key';
import { ACTIONS } from './main';

// 'AGENT' is not in the ADF schema UserType enum but is used at runtime.
type AgentUserType = MentionUserType | 'AGENT';
const AGENT_USER_TYPES = new Set<AgentUserType>(['APP', 'AGENT']);

const isAgentUserType = (userType: unknown): userType is AgentUserType => {
	return typeof userType === 'string' && AGENT_USER_TYPES.has(userType as AgentUserType);
};

const getAgentMentionName = (text: unknown, fallbackName?: unknown): string | null => {
	const trimmedFallbackName = typeof fallbackName === 'string' ? fallbackName.trim() : '';
	const normalizedFallbackName =
		(trimmedFallbackName.startsWith('@')
			? trimmedFallbackName.slice(1).trim()
			: trimmedFallbackName) || null;

	if (typeof text !== 'string') {
		return normalizedFallbackName;
	}

	const trimmedText = text.trim();
	const displayName = trimmedText.startsWith('@') ? trimmedText.slice(1).trim() : trimmedText;
	const normalizedName = displayName || normalizedFallbackName;

	return normalizedName;
};

const AI_STREAMING_TRANSFORMATION_META_KEY = 'isAIStreamingTransformation' as const;
const AGENT_MENTION_INACTIVITY_MS = 3000;
const MAX_PENDING_TYPED_AGENT_MENTION_FOCUS_DEFERS = 20;

type AgentMentionDetails = {
	context: DocNode;
	id: string;
	localId: string;
	name: string | null;
	nodeSize: number;
	parentEnd: number;
	parentNodeType: string | null;
	parentStart: number;
	pos: number;
	prompt: string | null;
};

/**
 * Returns true when a transaction represents a local user document edit that
 * should restart pending agent-mention inactivity tracking.
 *
 * Remote/collab updates, replace-document transactions, AI streaming transforms,
 * selection-only movements, and metadata-only transactions are intentionally ignored.
 */
const isQualifyingLocalUserDocChange = (tr: ReadonlyTransaction) => {
	const isAIStreaming = Boolean(tr.getMeta(AI_STREAMING_TRANSFORMATION_META_KEY));

	return (
		tr.docChanged && !tr.getMeta('isRemote') && !tr.getMeta('replaceDocument') && !isAIStreaming
	);
};

const isLocalSelectionChange = (tr: ReadonlyTransaction, hasPositionChanged: boolean) => {
	const isAIStreaming = Boolean(tr.getMeta(AI_STREAMING_TRANSFORMATION_META_KEY));

	// Pressing Enter can move selection through a doc split without setting tr.selectionSet
	// or changing from/to numerically, so local doc changes are checked against the
	// pending mention's current parent before publishing.
	return (
		(hasPositionChanged || tr.docChanged) &&
		!tr.getMeta('isRemote') &&
		!tr.getMeta('replaceDocument') &&
		!isAIStreaming
	);
};

/**
 * Reads agent-mention details from a known document position without traversing
 * the document. Callers pass a matcher so mapped positions are only accepted
 * when they still point at the same pending/tracked mention.
 */
const getAgentMentionDetailsAtPos = (
	state: EditorState,
	pos: number,
	matchesMention: (attrs: Record<string, unknown>) => boolean,
	fallbackName?: unknown,
): AgentMentionDetails | null => {
	if (pos < 0 || pos > state.doc.content.size) {
		return null;
	}

	const node = state.doc.nodeAt(pos);
	const mentionSchema = state.schema.nodes.mention;
	if (
		node?.type !== mentionSchema ||
		!isAgentUserType(node.attrs.userType) ||
		!matchesMention(node.attrs) ||
		!node.attrs.id ||
		!node.attrs.localId
	) {
		return null;
	}

	const $mentionPos = state.doc.resolve(Math.min(pos + node.nodeSize, state.doc.content.size));
	const parentNode = $mentionPos.node($mentionPos.depth);

	const id = node.attrs.id as string;
	const name = getAgentMentionName(node.attrs.text, fallbackName);

	return {
		id,
		localId: node.attrs.localId as string,
		context: getAgentMentionParentContext(parentNode, node.attrs.localId as string),
		name,
		prompt: parentNode.textContent.trim() || null,
		nodeSize: node.nodeSize,
		parentEnd: $mentionPos.end($mentionPos.depth),
		parentNodeType: parentNode.type.name ?? null,
		parentStart: $mentionPos.start($mentionPos.depth),
		pos,
	};
};

/**
 * Finds an agent mention that survived a document change when the changed-range
 * scan did not find one. Uses the tracked localId as the mention instance identity
 * so same-agent mentions elsewhere in the document cannot be selected as fallback.
 */
const getSurvivingAgentMentionDetails = (
	state: EditorState,
	preferredLocalId: string,
	preferredName?: string | null,
): AgentMentionDetails | null => {
	const mentionSchema = state.schema.nodes.mention;
	let result: AgentMentionDetails | null = null;

	state.doc.descendants((node, pos) => {
		if (result) {
			return false;
		}
		if (
			node.type !== mentionSchema ||
			!isAgentUserType(node.attrs.userType) ||
			node.attrs.localId !== preferredLocalId
		) {
			return true;
		}

		result = getAgentMentionDetailsAtPos(
			state,
			pos,
			(attrs) => attrs.localId === preferredLocalId,
			preferredName,
		);

		return !result;
	});

	return result;
};

/**
 * Maps a pending typed agent mention through a document-changing transaction and
 * returns the updated pending state. If the mapped position was deleted or no
 * longer points at the same local mention, the pending mention is cleared.
 */
const getPendingTypedAgentMentionAfterDocChange = (
	state: EditorState,
	tr: ReadonlyTransaction,
	pendingTypedAgentMention: NonNullable<MentionPluginState['pendingTypedAgentMention']>,
	{ resetTimer }: { resetTimer: boolean },
) => {
	const mappedPos = tr.mapping.mapResult(pendingTypedAgentMention.pos, 1);
	const resetCount = resetTimer
		? pendingTypedAgentMention.resetCount + 1
		: pendingTypedAgentMention.resetCount;

	if (mappedPos.deleted) {
		return null;
	}

	const pendingMentionDetails = getAgentMentionDetailsAtPos(
		state,
		mappedPos.pos,
		(attrs) => attrs.localId === pendingTypedAgentMention.localId,
		pendingTypedAgentMention.name,
	);

	return pendingMentionDetails
		? {
				id: pendingMentionDetails.id,
				localId: pendingTypedAgentMention.localId,
				name: pendingMentionDetails.name,
				nodeSize: pendingMentionDetails.nodeSize,
				parentNodeType: pendingMentionDetails.parentNodeType,
				pos: pendingMentionDetails.pos,
				resetCount,
			}
		: null;
};

const hasPendingMentionMovedToNewParent = (
	oldState: EditorState,
	tr: ReadonlyTransaction,
	previousPendingTypedAgentMention: MentionPluginState['pendingTypedAgentMention'],
	pendingMentionDetails: AgentMentionDetails,
) => {
	if (!previousPendingTypedAgentMention) {
		return false;
	}

	const previousMentionDetails = getAgentMentionDetailsAtPos(
		oldState,
		previousPendingTypedAgentMention.pos,
		(attrs) => attrs.localId === previousPendingTypedAgentMention.localId,
	);

	// Keep the previous parent boundary associated with the left side of an
	// insertion at that boundary, so typing at the start of the parent does not
	// look like the pending mention moved into a new parent.
	const mappedPreviousParentStart =
		previousMentionDetails && tr.mapping.map(previousMentionDetails.parentStart, -1);

	return Boolean(
		previousMentionDetails && mappedPreviousParentStart !== pendingMentionDetails.parentStart,
	);
};

const isSelectionOutsideDirectParent = (
	state: EditorState,
	pendingMentionDetails: AgentMentionDetails,
) => {
	return (
		state.selection.from < pendingMentionDetails.parentStart ||
		state.selection.to > pendingMentionDetails.parentEnd
	);
};

/**
 * Finalises a pending typed agent mention by copying its details into the
 * public lastInserted* plugin state after the caller has already resolved the
 * pending mention from the current document.
 */
const commitResolvedPendingTypedAgentMention = (
	pluginState: MentionPluginState,
	pendingMentionDetails: AgentMentionDetails,
) => {
	return {
		hasPublicPluginStateChanged: true,
		pluginState: {
			...pluginState,
			pendingTypedAgentMention: null,
			lastInsertedAgentMentionId: pendingMentionDetails.id,
			lastInsertedAgentMentionLocalId: pendingMentionDetails.localId,
			lastInsertedAgentMentionContext: pendingMentionDetails.context,
			lastInsertedAgentMentionName: pendingMentionDetails.name,
			lastInsertedAgentMentionPrompt: pendingMentionDetails.prompt,
			lastInsertedAgentMentionParentNodeType: pendingMentionDetails.parentNodeType,
			lastAgentMentionInsertionCount: (pluginState.lastAgentMentionInsertionCount ?? 0) + 1,
		},
	};
};

/**
 * Resolves and finalises a pending typed agent mention. If the tracked mention
 * no longer resolves, the stale pending state is cleared without dispatching a
 * public update.
 */
const commitPendingTypedAgentMention = (
	state: EditorState,
	pluginState: MentionPluginState,
	pendingTypedAgentMention: NonNullable<MentionPluginState['pendingTypedAgentMention']>,
) => {
	const pendingMentionDetails = getAgentMentionDetailsAtPos(
		state,
		pendingTypedAgentMention.pos,
		(attrs) => attrs.localId === pendingTypedAgentMention.localId,
		pendingTypedAgentMention.name,
	);

	if (!pendingMentionDetails) {
		return {
			hasPublicPluginStateChanged: false,
			pluginState: {
				...pluginState,
				pendingTypedAgentMention: null,
			},
		};
	}

	return commitResolvedPendingTypedAgentMention(pluginState, pendingMentionDetails);
};

const hasTrackedAgentMentionState = (pluginState: MentionPluginState) =>
	Boolean(pluginState.pendingTypedAgentMention) ||
	(Boolean(pluginState.pendingPastedAgentMention) &&
		fg('platform_editor_agent_mentions_drop_one_fixes')) ||
	pluginState.lastInsertedAgentMentionId != null ||
	pluginState.lastInsertedAgentMentionLocalId != null ||
	pluginState.lastInsertedAgentMentionContext != null ||
	pluginState.lastInsertedAgentMentionName != null ||
	pluginState.lastInsertedAgentMentionPrompt != null ||
	pluginState.lastInsertedAgentMentionParentNodeType != null;

/**
 * Clears agent mention state that points at a specific document snapshot.
 * replaceDocument swaps content wholesale, so pending typed mentions and
 * lastInserted* details from the previous document must be cleared together.
 */
const clearTrackedAgentMentionState = (pluginState: MentionPluginState): MentionPluginState => {
	return {
		...pluginState,
		pendingTypedAgentMention: null,
		...(fg('platform_editor_agent_mentions_drop_one_fixes')
			? { pendingPastedAgentMention: null }
			: {}),
		lastInsertedAgentMentionId: null,
		lastInsertedAgentMentionLocalId: null,
		lastInsertedAgentMentionContext: null,
		lastInsertedAgentMentionName: null,
		lastInsertedAgentMentionPrompt: null,
		lastInsertedAgentMentionParentNodeType: null,
	};
};

/**
 * Attempts to synchronously resolve an agent mention name from the mention
 * provider's cache. Falls back to undefined if the provider doesn't support
 * name resolution, the result is a Promise (async/cache miss), or the status
 * is not OK.
 */
const resolveCachedAgentMentionName = (
	mentionProvider: MentionProvider,
	params: { name?: string | null } | undefined,
	id: string,
): string | undefined => {
	if (params?.name || !isResolvingMentionProvider(mentionProvider)) {
		return params?.name ?? undefined;
	}
	const result = mentionProvider.resolveMentionName(id);
	if (!(result instanceof Promise) && result.status === MentionNameStatus.OK) {
		return result.name || undefined;
	}
	return undefined;
};

/**
 * Resolves the name of a pasted agent mention via the mention provider and
 * dispatches the appropriate action to update plugin state.
 */
export const resolveAndDispatchPastedAgentMentionName = (
	agentId: string,
	mentionProvider: ResolvingMentionProvider,
	pendingResolveMentionIds: Set<string>,
	view: EditorView,
): void => {
	if (pendingResolveMentionIds.has(agentId)) {
		return;
	}
	pendingResolveMentionIds.add(agentId);
	const result = mentionProvider.resolveMentionName(agentId);

	if (result instanceof Promise) {
		result
			.then((nameDetails) => {
				pendingResolveMentionIds.delete(agentId);
				if (nameDetails.status === MentionNameStatus.OK && nameDetails.name) {
					view.dispatch(
						view.state.tr.setMeta(mentionPluginKey, {
							action: ACTIONS.RESOLVE_PASTED_AGENT_MENTION_NAME,
							params: { id: agentId, name: nameDetails.name },
						}),
					);
				} else {
					view.dispatch(
						view.state.tr.setMeta(mentionPluginKey, {
							action: ACTIONS.CLEAR_PENDING_PASTED_AGENT_MENTION,
							params: { id: agentId },
						}),
					);
				}
			})
			.catch(() => {
				pendingResolveMentionIds.delete(agentId);
			});
	} else if (result.status === MentionNameStatus.OK && result.name) {
		pendingResolveMentionIds.delete(agentId);
		view.dispatch(
			view.state.tr.setMeta(mentionPluginKey, {
				action: ACTIONS.RESOLVE_PASTED_AGENT_MENTION_NAME,
				params: { id: agentId, name: result.name },
			}),
		);
	} else {
		pendingResolveMentionIds.delete(agentId);
		view.dispatch(
			view.state.tr.setMeta(mentionPluginKey, {
				action: ACTIONS.CLEAR_PENDING_PASTED_AGENT_MENTION,
				params: { id: agentId },
			}),
		);
	}
};

type ApplyAgentMentionStateParams = {
	getIsRovoPanelOpen?: () => boolean;
	newState: EditorState;
	oldState: EditorState;
	pluginState: MentionPluginState;
	tr: ReadonlyTransaction;
};

export const applyAgentMentionState = ({
	tr,
	pluginState,
	oldState,
	newState,
	getIsRovoPanelOpen,
}: ApplyAgentMentionStateParams): {
	hasPublicPluginStateChanged: boolean;
	pluginState: MentionPluginState;
} => {
	// mentionPluginKey intentionally remains the shared transaction action channel while
	// agentMentionPluginKey owns the extracted agent state.
	const { action, params } = tr.getMeta(mentionPluginKey) || {
		action: null,
		params: null,
	};
	let hasPublicPluginStateChanged = false;
	let newPluginState = pluginState;
	const isAgentMentionsExperimentEnabled = editorExperiment('platform_editor_agent_mentions', true);

	const hasPositionChanged =
		oldState.selection.from !== newState.selection.from ||
		oldState.selection.to !== newState.selection.to;

	switch (action) {
		case ACTIONS.COMMIT_PENDING_TYPED_AGENT_MENTION: {
			const pendingTypedAgentMention = newPluginState.pendingTypedAgentMention;
			if (
				!isAgentMentionsExperimentEnabled ||
				!pendingTypedAgentMention ||
				pendingTypedAgentMention.localId !== params?.localId ||
				pendingTypedAgentMention.resetCount !== params?.resetCount
			) {
				break;
			}

			const commitResult = commitPendingTypedAgentMention(
				newState,
				newPluginState,
				pendingTypedAgentMention,
			);
			newPluginState = commitResult.pluginState;
			hasPublicPluginStateChanged =
				hasPublicPluginStateChanged || commitResult.hasPublicPluginStateChanged;
			break;
		}
		case ACTIONS.DISCARD_PENDING_TYPED_AGENT_MENTION: {
			const pendingTypedAgentMentionToDiscard = newPluginState.pendingTypedAgentMention;
			if (
				!isAgentMentionsExperimentEnabled ||
				!pendingTypedAgentMentionToDiscard ||
				pendingTypedAgentMentionToDiscard.localId !== params?.localId ||
				pendingTypedAgentMentionToDiscard.resetCount !== params?.resetCount
			) {
				break;
			}
			newPluginState = {
				...newPluginState,
				pendingTypedAgentMention: null,
			};
			hasPublicPluginStateChanged = true;
			break;
		}
		case ACTIONS.SET_PROVIDER:
			newPluginState = {
				...newPluginState,
				mentionProvider: params.provider,
			};
			hasPublicPluginStateChanged = true;
			break;
		case ACTIONS.RESOLVE_PASTED_AGENT_MENTION_NAME: {
			if (
				!isAgentMentionsExperimentEnabled ||
				!params?.id ||
				!params?.name ||
				newPluginState.pendingPastedAgentMention?.id !== params.id ||
				!fg('platform_editor_agent_mentions_drop_one_fixes')
			) {
				break;
			}
			newPluginState = {
				...newPluginState,
				pendingPastedAgentMention: null,
				lastInsertedAgentMentionId: newPluginState.pendingPastedAgentMention?.id,
				lastInsertedAgentMentionLocalId: newPluginState.pendingPastedAgentMention?.localId,
				lastInsertedAgentMentionContext: newPluginState.pendingPastedAgentMention?.context,
				lastInsertedAgentMentionName: params.name as string,
				lastInsertedAgentMentionPrompt: newPluginState.pendingPastedAgentMention?.prompt,
				lastInsertedAgentMentionParentNodeType:
					newPluginState.pendingPastedAgentMention?.parentNodeType,
			};
			hasPublicPluginStateChanged = true;
			break;
		}
		case ACTIONS.CLEAR_PENDING_PASTED_AGENT_MENTION: {
			if (
				!isAgentMentionsExperimentEnabled ||
				!params?.id ||
				newPluginState.pendingPastedAgentMention?.id !== params.id ||
				!fg('platform_editor_agent_mentions_drop_one_fixes')
			) {
				break;
			}
			newPluginState = {
				...newPluginState,
				pendingPastedAgentMention: null,
			};
			break;
		}
	}

	if (isAgentMentionsExperimentEnabled && isQualifyingLocalUserDocChange(tr)) {
		const mentionSchema = newState.schema.nodes.mention;

		const newDocRanges: Array<[number, number]> = [];
		const oldDocRanges: Array<[number, number]> = [];
		let stepsTouchMentions = false;
		tr.steps.forEach((step) => {
			let found = false;
			const stepNewRanges: Array<[number, number]> = [];
			const stepOldRanges: Array<[number, number]> = [];
			step.getMap().forEach((oldFrom, oldTo, newFrom, newTo) => {
				stepOldRanges.push([oldFrom, oldTo]);
				stepNewRanges.push([newFrom, newTo]);
				if (!found) {
					const clampedNewFrom = Math.min(newFrom, newState.doc.content.size);
					const clampedNewTo = Math.min(newTo, newState.doc.content.size);
					if (clampedNewFrom < clampedNewTo) {
						newState.doc.nodesBetween(clampedNewFrom, clampedNewTo, (node) => {
							if (node.type === mentionSchema && isAgentUserType(node.attrs.userType)) {
								found = true;
							}
							return !found;
						});
					}
					if (!found) {
						const clampedOldFrom = Math.min(oldFrom, oldState.doc.content.size);
						const clampedOldTo = Math.min(oldTo, oldState.doc.content.size);
						if (clampedOldFrom < clampedOldTo) {
							oldState.doc.nodesBetween(clampedOldFrom, clampedOldTo, (node) => {
								if (node.type === mentionSchema && AGENT_USER_TYPES.has(node.attrs.userType)) {
									found = true;
								}
								return !found;
							});
						}
					}
				}
			});
			if (found) {
				stepsTouchMentions = true;
				newDocRanges.push(...stepNewRanges);
				oldDocRanges.push(...stepOldRanges);
			}
		});

		const shouldResolveAgentMentionState =
			stepsTouchMentions || Boolean(newPluginState.lastInsertedAgentMentionLocalId);

		if (shouldResolveAgentMentionState) {
			let agentMentionId: string | null = null;
			let agentMentionLocalId: string | null = null;
			let agentMentionContext: DocNode | null = null;
			let agentMentionName: string | null = null;
			let agentMentionPrompt: string | null = null;
			let agentMentionParentNodeType: string | null = null;
			const existingAgentMentionLocalIdsInChangedRanges = new Set<string>();
			let pendingTypedAgentMentionDetails: AgentMentionDetails | null = null;

			if (stepsTouchMentions) {
				for (const [from, to] of newDocRanges) {
					const clampedTo = Math.min(to, newState.doc.content.size);
					if (from >= clampedTo) {
						continue;
					}
					newState.doc.nodesBetween(from, clampedTo, (node, pos) => {
						if (node.type !== mentionSchema || !isAgentUserType(node.attrs.userType)) {
							return true;
						}
						if (
							pendingTypedAgentMentionDetails === null &&
							action === ACTIONS.SET_PENDING_TYPED_AGENT_MENTION &&
							node.attrs.localId === params?.localId
						) {
							pendingTypedAgentMentionDetails = getAgentMentionDetailsAtPos(
								newState,
								pos,
								(attrs) => attrs.localId === params.localId,
								params.name,
							);
						}
						if (agentMentionLocalId === null && node.attrs.localId) {
							const cachedName = fg('platform_editor_agent_mentions_drop_one_fixes')
								? resolveCachedAgentMentionName(
										newPluginState.mentionProvider as MentionProvider,
										params,
										node.attrs.id as string,
									)
								: params?.name;
							const agentMentionDetails = getAgentMentionDetailsAtPos(
								newState,
								pos,
								(attrs) => attrs.localId === node.attrs.localId,
								cachedName,
							);
							if (agentMentionDetails) {
								agentMentionId = agentMentionDetails.id;
								agentMentionLocalId = agentMentionDetails.localId;
								agentMentionContext = agentMentionDetails.context;
								agentMentionName = agentMentionDetails.name;
								agentMentionPrompt = agentMentionDetails.prompt;
								agentMentionParentNodeType = agentMentionDetails.parentNodeType;
							}
						}
						return true;
					});
				}

				for (const [from, to] of oldDocRanges) {
					const clampedOldTo = Math.min(to, oldState.doc.content.size);
					if (from >= clampedOldTo) {
						continue;
					}
					oldState.doc.nodesBetween(from, clampedOldTo, (node) => {
						if (node.type !== mentionSchema || !isAgentUserType(node.attrs.userType)) {
							return true;
						}
						if (node.attrs.localId) {
							existingAgentMentionLocalIdsInChangedRanges.add(node.attrs.localId as string);
						}
						return true;
					});
				}
			}

			let resolvedFromFullDocFallback = false;
			if (agentMentionId === null && newPluginState.lastInsertedAgentMentionLocalId) {
				const survivorDetails = getSurvivingAgentMentionDetails(
					newState,
					newPluginState.lastInsertedAgentMentionLocalId,
					newPluginState.lastInsertedAgentMentionName,
				);
				if (survivorDetails) {
					agentMentionId = survivorDetails.id;
					agentMentionLocalId = survivorDetails.localId;
					agentMentionContext = survivorDetails.context;
					agentMentionName = survivorDetails.name;
					agentMentionPrompt = survivorDetails.prompt;
					agentMentionParentNodeType = survivorDetails.parentNodeType;
					resolvedFromFullDocFallback = true;
				}
			}

			const trackedAgentMentionLocalId = newPluginState.lastInsertedAgentMentionLocalId ?? null;
			const changedRangeMentionIsNew =
				agentMentionLocalId !== null &&
				!existingAgentMentionLocalIdsInChangedRanges.has(agentMentionLocalId);

			if (
				agentMentionLocalId !== null &&
				!changedRangeMentionIsNew &&
				agentMentionLocalId !== trackedAgentMentionLocalId
			) {
				const survivorDetails = trackedAgentMentionLocalId
					? getSurvivingAgentMentionDetails(
							newState,
							trackedAgentMentionLocalId,
							newPluginState.lastInsertedAgentMentionName,
						)
					: null;

				if (survivorDetails) {
					agentMentionId = survivorDetails.id;
					agentMentionLocalId = survivorDetails.localId;
					agentMentionContext = survivorDetails.context;
					agentMentionName = survivorDetails.name;
					agentMentionParentNodeType = survivorDetails.parentNodeType;
					resolvedFromFullDocFallback = true;
				} else {
					agentMentionId = null;
					agentMentionLocalId = null;
					agentMentionContext = null;
					agentMentionName = null;
					agentMentionParentNodeType = null;
				}
			}

			const isNewInsertion =
				agentMentionId !== null && !resolvedFromFullDocFallback && changedRangeMentionIsNew;
			const isPendingTypedAgentMentionInsertion =
				isNewInsertion &&
				action === ACTIONS.SET_PENDING_TYPED_AGENT_MENTION &&
				typeof params?.localId === 'string';
			const newInsertionCount = isNewInsertion
				? (newPluginState.lastAgentMentionInsertionCount ?? 0) + 1
				: undefined;

			const pendingTypedAgentMentionDetailsForState =
				pendingTypedAgentMentionDetails as AgentMentionDetails | null;

			if (isPendingTypedAgentMentionInsertion && pendingTypedAgentMentionDetailsForState) {
				const pendingTypedAgentMentionLocalId = params?.localId as string;

				newPluginState = {
					...newPluginState,
					pendingTypedAgentMention: {
						id: pendingTypedAgentMentionDetailsForState.id,
						localId: pendingTypedAgentMentionLocalId,
						name: pendingTypedAgentMentionDetailsForState.name,
						nodeSize: pendingTypedAgentMentionDetailsForState.nodeSize,
						parentNodeType: pendingTypedAgentMentionDetailsForState.parentNodeType,
						pos: pendingTypedAgentMentionDetailsForState.pos,
						resetCount: 1,
					},
				};
			} else if (isPendingTypedAgentMentionInsertion) {
				newPluginState = {
					...newPluginState,
					pendingTypedAgentMention: null,
					lastInsertedAgentMentionId: agentMentionId,
					lastInsertedAgentMentionLocalId: agentMentionLocalId,
					lastInsertedAgentMentionContext: agentMentionContext,
					lastInsertedAgentMentionName: agentMentionName,
					lastInsertedAgentMentionPrompt: agentMentionPrompt,
					lastInsertedAgentMentionParentNodeType: agentMentionParentNodeType,
					...(newInsertionCount !== undefined
						? { lastAgentMentionInsertionCount: newInsertionCount }
						: {}),
				};
				hasPublicPluginStateChanged = true;
			} else if (
				agentMentionId !== (newPluginState.lastInsertedAgentMentionId ?? null) ||
				agentMentionLocalId !== (newPluginState.lastInsertedAgentMentionLocalId ?? null) ||
				agentMentionName !== (newPluginState.lastInsertedAgentMentionName ?? null) ||
				agentMentionPrompt !== (newPluginState.lastInsertedAgentMentionPrompt ?? null) ||
				agentMentionParentNodeType !==
					(newPluginState.lastInsertedAgentMentionParentNodeType ?? null) ||
				newInsertionCount !== undefined
			) {
				const isTaskItemMentionForPaste = agentMentionParentNodeType === 'taskItem';
				if (!isTaskItemMentionForPaste && isNewInsertion && getIsRovoPanelOpen?.()) {
					// Rovo is already open, so do not publish a nudge-triggering state change.
				} else if (
					agentMentionName === null &&
					agentMentionId !== null &&
					isResolvingMentionProvider(newPluginState.mentionProvider) &&
					fg('platform_editor_agent_mentions_drop_one_fixes')
				) {
					newPluginState = {
						...newPluginState,
						pendingPastedAgentMention: {
							id: agentMentionId,
							localId: agentMentionLocalId as string,
							context: agentMentionContext as DocNode,
							prompt: agentMentionPrompt,
							parentNodeType: agentMentionParentNodeType,
						},
						...(newInsertionCount !== undefined
							? { lastAgentMentionInsertionCount: newInsertionCount }
							: {}),
					};
				} else {
					newPluginState = {
						...newPluginState,
						lastInsertedAgentMentionId: agentMentionId,
						lastInsertedAgentMentionLocalId: agentMentionLocalId,
						lastInsertedAgentMentionContext: agentMentionContext,
						lastInsertedAgentMentionName: agentMentionName,
						lastInsertedAgentMentionPrompt: agentMentionPrompt,
						lastInsertedAgentMentionParentNodeType: agentMentionParentNodeType,
						...(newInsertionCount !== undefined
							? { lastAgentMentionInsertionCount: newInsertionCount }
							: {}),
					};
					hasPublicPluginStateChanged = true;
				}
			}
		}
	}

	if (
		isAgentMentionsExperimentEnabled &&
		tr.docChanged &&
		tr.getMeta('replaceDocument') &&
		hasTrackedAgentMentionState(newPluginState)
	) {
		newPluginState = clearTrackedAgentMentionState(newPluginState);
		hasPublicPluginStateChanged = true;
	}

	if (
		isAgentMentionsExperimentEnabled &&
		newPluginState.pendingTypedAgentMention &&
		action !== ACTIONS.SET_PENDING_TYPED_AGENT_MENTION &&
		action !== ACTIONS.COMMIT_PENDING_TYPED_AGENT_MENTION &&
		tr.docChanged
	) {
		newPluginState = {
			...newPluginState,
			pendingTypedAgentMention: getPendingTypedAgentMentionAfterDocChange(
				newState,
				tr,
				newPluginState.pendingTypedAgentMention,
				{ resetTimer: isQualifyingLocalUserDocChange(tr) },
			),
		};
	}

	const shouldCheckPendingTypedAgentMentionParent = isLocalSelectionChange(tr, hasPositionChanged);
	if (
		isAgentMentionsExperimentEnabled &&
		newPluginState.pendingTypedAgentMention &&
		action !== ACTIONS.SET_PENDING_TYPED_AGENT_MENTION &&
		action !== ACTIONS.COMMIT_PENDING_TYPED_AGENT_MENTION &&
		shouldCheckPendingTypedAgentMentionParent
	) {
		const pendingTypedAgentMention = newPluginState.pendingTypedAgentMention;
		const pendingMentionDetails = getAgentMentionDetailsAtPos(
			newState,
			pendingTypedAgentMention.pos,
			(attrs) => attrs.localId === pendingTypedAgentMention.localId,
			pendingTypedAgentMention.name,
		);

		if (!pendingMentionDetails) {
			newPluginState = {
				...newPluginState,
				pendingTypedAgentMention: null,
			};
		} else if (
			hasPendingMentionMovedToNewParent(
				oldState,
				tr,
				pluginState.pendingTypedAgentMention,
				pendingMentionDetails,
			) ||
			isSelectionOutsideDirectParent(newState, pendingMentionDetails)
		) {
			if (pendingMentionDetails.parentNodeType !== 'taskItem' && getIsRovoPanelOpen?.()) {
				newPluginState = {
					...newPluginState,
					pendingTypedAgentMention: null,
				};
				hasPublicPluginStateChanged = true;
			} else {
				const commitResult = commitResolvedPendingTypedAgentMention(
					newPluginState,
					pendingMentionDetails,
				);
				newPluginState = commitResult.pluginState;
				hasPublicPluginStateChanged =
					hasPublicPluginStateChanged || commitResult.hasPublicPluginStateChanged;
			}
		}
	}

	return {
		hasPublicPluginStateChanged,
		pluginState: newPluginState,
	};
};

type CreateAgentMentionPluginViewParams = {
	editorView: EditorView;
	getIsRovoPanelOpen?: () => boolean;
	stateKey: PluginKey<MentionPluginState>;
};

type AgentMentionPluginView = {
	destroy: () => void;
	update: (view: EditorView, prevState: EditorState) => void;
};

export const createAgentMentionPluginView = ({
	editorView,
	getIsRovoPanelOpen,
	stateKey,
}: CreateAgentMentionPluginViewParams): AgentMentionPluginView => {
	const isAgentMentionsEnabled = editorExperiment('platform_editor_agent_mentions', true);
	let pendingTypedAgentMentionTimer: ReturnType<typeof setTimeout> | undefined;
	let pendingTypedAgentMentionTimerKey: string | null = null;
	let pendingTypedAgentMentionFocusDeferCount = 0;
	const pendingResolveMentionIds = new Set<string>();

	const clearPendingTypedAgentMentionTimer = ({
		preserveFocusDeferCount = false,
	}: { preserveFocusDeferCount?: boolean } = {}) => {
		if (pendingTypedAgentMentionTimer) {
			clearTimeout(pendingTypedAgentMentionTimer);
			pendingTypedAgentMentionTimer = undefined;
		}
		pendingTypedAgentMentionTimerKey = null;
		if (!preserveFocusDeferCount) {
			pendingTypedAgentMentionFocusDeferCount = 0;
		}
	};

	const shouldDeferPendingTypedAgentMention = () =>
		typeof document !== 'undefined' && document.hasFocus() && !editorView.hasFocus();

	const schedulePendingTypedAgentMentionTimer = (
		mentionPluginState: MentionPluginState | undefined,
		{ preserveFocusDeferCount = false }: { preserveFocusDeferCount?: boolean } = {},
	) => {
		if (!isAgentMentionsEnabled) {
			clearPendingTypedAgentMentionTimer();
			return;
		}

		const pendingTypedAgentMention = mentionPluginState?.pendingTypedAgentMention;
		if (!pendingTypedAgentMention) {
			clearPendingTypedAgentMentionTimer();
			return;
		}

		const timerKey = `${pendingTypedAgentMention.localId}:${pendingTypedAgentMention.resetCount}`;
		if (timerKey === pendingTypedAgentMentionTimerKey) {
			return;
		}

		clearPendingTypedAgentMentionTimer({ preserveFocusDeferCount });
		pendingTypedAgentMentionTimerKey = timerKey;
		pendingTypedAgentMentionTimer = setTimeout(() => {
			const isTaskItemMention = pendingTypedAgentMention.parentNodeType === 'taskItem';
			if (!isTaskItemMention && getIsRovoPanelOpen?.()) {
				// Agent actions continue to use mentionPluginKey as the shared transaction meta channel.
				editorView.dispatch(
					editorView.state.tr.setMeta(mentionPluginKey, {
						action: ACTIONS.DISCARD_PENDING_TYPED_AGENT_MENTION,
						params: {
							localId: pendingTypedAgentMention.localId,
							resetCount: pendingTypedAgentMention.resetCount,
						},
					}),
				);
				return;
			}

			const latestPendingTypedAgentMention = stateKey.getState(
				editorView.state,
			)?.pendingTypedAgentMention;

			if (
				!latestPendingTypedAgentMention ||
				latestPendingTypedAgentMention.localId !== pendingTypedAgentMention.localId ||
				latestPendingTypedAgentMention.resetCount !== pendingTypedAgentMention.resetCount
			) {
				return;
			}

			if (
				shouldDeferPendingTypedAgentMention() &&
				pendingTypedAgentMentionFocusDeferCount < MAX_PENDING_TYPED_AGENT_MENTION_FOCUS_DEFERS
			) {
				pendingTypedAgentMentionFocusDeferCount++;
				pendingTypedAgentMentionTimerKey = null;
				schedulePendingTypedAgentMentionTimer(stateKey.getState(editorView.state), {
					preserveFocusDeferCount: true,
				});
				return;
			}

			pendingTypedAgentMentionFocusDeferCount = 0;
			editorView.dispatch(
				editorView.state.tr.setMeta(mentionPluginKey, {
					action: ACTIONS.COMMIT_PENDING_TYPED_AGENT_MENTION,
					params: {
						localId: pendingTypedAgentMention.localId,
						resetCount: pendingTypedAgentMention.resetCount,
					},
				}),
			);
		}, AGENT_MENTION_INACTIVITY_MS);
	};

	return {
		update(view: EditorView, prevState: EditorState) {
			const mentionPluginState = stateKey.getState(view.state);
			if (mentionPluginState === stateKey.getState(prevState)) {
				return;
			}
			schedulePendingTypedAgentMentionTimer(mentionPluginState);

			if (
				editorExperiment('platform_editor_agent_mentions', true) &&
				mentionPluginState?.pendingPastedAgentMention?.id != null &&
				mentionPluginState?.mentionProvider &&
				isResolvingMentionProvider(mentionPluginState.mentionProvider) &&
				fg('platform_editor_agent_mentions_drop_one_fixes')
			) {
				resolveAndDispatchPastedAgentMentionName(
					mentionPluginState.pendingPastedAgentMention.id,
					mentionPluginState.mentionProvider,
					pendingResolveMentionIds,
					view,
				);
			}
		},
		destroy() {
			clearPendingTypedAgentMentionTimer();
		},
	};
};

export const agentMentionPluginKey: PluginKey<MentionPluginState> =
	new PluginKey<MentionPluginState>('agentMention');

type CreateAgentMentionPluginParams = {
	options?: MentionPluginOptions;
	pmPluginFactoryParams: PMPluginFactoryParams;
};

export const createAgentMentionPlugin = ({
	options,
	pmPluginFactoryParams,
}: CreateAgentMentionPluginParams): SafePlugin<MentionPluginState> => {
	return new SafePlugin({
		key: agentMentionPluginKey,
		state: {
			init(): MentionPluginState {
				return {};
			},
			apply(tr, pluginState, oldState, newState): MentionPluginState {
				const result = applyAgentMentionState({
					tr,
					pluginState,
					oldState,
					newState,
					getIsRovoPanelOpen: options?.getIsRovoPanelOpen,
				});
				let nextPluginState = result.pluginState;

				const meta = tr.getMeta(mentionPluginKey);
				const nextDecorations = nextRunStateDecorations(
					pluginState.runStateDecorations,
					tr,
					newState,
					meta?.action === ACTIONS.SET_AGENT_RUN_STATES
						? (meta.params?.runStateByLocalId ?? {})
						: undefined,
				);
				if (nextPluginState.runStateDecorations !== nextDecorations) {
					nextPluginState = { ...nextPluginState, runStateDecorations: nextDecorations };
				}

				const mentionPluginState = mentionPluginKey.getState(newState);

				if (result.hasPublicPluginStateChanged) {
					pmPluginFactoryParams.dispatch(mentionPluginKey, {
						...mentionPluginState,
						...result.pluginState,
					});
				}

				return nextPluginState;
			},
		} as SafeStateField<MentionPluginState>,
		props: {
			decorations(state) {
				const runStateDecorations = agentMentionPluginKey.getState(state)?.runStateDecorations;
				if (!runStateDecorations || runStateDecorations === DecorationSet.empty) {
					return undefined;
				}
				if (!isExperimentEnabled('platform_editor_agent_mention_state_anim')) {
					return undefined;
				}
				return runStateDecorations;
			},
		},
		view(editorView) {
			return createAgentMentionPluginView({
				editorView,
				getIsRovoPanelOpen: options?.getIsRovoPanelOpen,
				stateKey: agentMentionPluginKey,
			});
		},
	});
};
