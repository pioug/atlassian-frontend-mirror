import type { DocNode, MentionUserType } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	Command,
	ExtractInjectionAPI,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import type {
	EditorState,
	ReadonlyTransaction,
	SafeStateField,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { insm } from '@atlaskit/insm';
import type { MentionProvider, ResolvingMentionProvider } from '@atlaskit/mention/resource';
import {
	isResolvingMentionProvider,
	MentionNameStatus,
	SLI_EVENT_TYPE,
	SMART_EVENT_TYPE,
} from '@atlaskit/mention/resource';
import { ComponentNames } from '@atlaskit/mention/types';
import type { Actions as MentionActions, SliNames } from '@atlaskit/mention/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { MentionsPlugin } from '../mentionsPluginType';
import { MentionNodeView } from '../nodeviews/mentionNodeView';
import { MENTION_PROVIDER_REJECTED, MENTION_PROVIDER_UNDEFINED } from '../types';
import type {
	AgentMentionDetails,
	FireElementsChannelEvent,
	MentionPluginOptions,
	MentionPluginState,
} from '../types';

import { getAgentMentionParentContext } from './agent-mention-context';
import { mentionPluginKey } from './key';
import { canMentionBeCreatedInRange } from './utils';

export const ACTIONS = {
	COMMIT_PENDING_TYPED_AGENT_MENTION: 'COMMIT_PENDING_TYPED_AGENT_MENTION',
	DISCARD_PENDING_TYPED_AGENT_MENTION: 'DISCARD_PENDING_TYPED_AGENT_MENTION',
	SET_PENDING_TYPED_AGENT_MENTION: 'SET_PENDING_TYPED_AGENT_MENTION',
	SET_PROVIDER: 'SET_PROVIDER',
	/**
	 * Dispatched from view().update() when async resolveMentionName() resolves
	 * for a pasted agent mention.
	 * Updates lastInsertedAgentMentionName so the nudge shows the correct name.
	 */
	RESOLVE_PASTED_AGENT_MENTION_NAME: 'RESOLVE_PASTED_AGENT_MENTION_NAME',
	/**
	 * Dispatched from view().update() when async resolveMentionName() resolves
	 * with a non-OK status for a pasted agent mention.
	 * Clears pendingPastedAgentMention so no retry loop occurs.
	 */
	CLEAR_PENDING_PASTED_AGENT_MENTION: 'CLEAR_PENDING_PASTED_AGENT_MENTION',
};

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

const PACKAGE_NAME = process.env._PACKAGE_NAME_ as string;
const PACKAGE_VERSION = process.env._PACKAGE_VERSION_ as string;

const setProvider =
	(provider: MentionProvider | undefined): Command =>
	(state, dispatch) => {
		if (dispatch) {
			dispatch(
				state.tr.setMeta(mentionPluginKey, {
					action: ACTIONS.SET_PROVIDER,
					params: { provider },
				}),
			);
		}
		return true;
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
 *
 * Handles both async (Promise) and synchronous cache-hit results:
 * - On OK resolution  → dispatches RESOLVE_PASTED_AGENT_MENTION_NAME so the nudge
 *   shows the correct agent name.
 * - On non-OK result  → dispatches CLEAR_PENDING_PASTED_AGENT_MENTION to prevent
 *   an infinite retry loop on subsequent update() calls.
 *
 * Guards against duplicate in-flight requests via pendingResolveMentionIds.
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
		result.then((nameDetails) => {
			pendingResolveMentionIds.delete(agentId);
			if (nameDetails.status === MentionNameStatus.OK && nameDetails.name) {
				view.dispatch(
					view.state.tr.setMeta(mentionPluginKey, {
						action: ACTIONS.RESOLVE_PASTED_AGENT_MENTION_NAME,
						params: { id: agentId, name: nameDetails.name },
					}),
				);
			} else {
				// Non-OK status — clear pendingPastedAgentMention to prevent
				// an infinite retry loop on subsequent update() calls.
				view.dispatch(
					view.state.tr.setMeta(mentionPluginKey, {
						action: ACTIONS.CLEAR_PENDING_PASTED_AGENT_MENTION,
						params: { id: agentId },
					}),
				);
			}
		});
	} else if (result.status === MentionNameStatus.OK && result.name) {
		pendingResolveMentionIds.delete(agentId);
		// Synchronous hit on a second update cycle (e.g. provider warmed up
		// between the paste transaction and this view update).
		view.dispatch(
			view.state.tr.setMeta(mentionPluginKey, {
				action: ACTIONS.RESOLVE_PASTED_AGENT_MENTION_NAME,
				params: { id: agentId, name: result.name },
			}),
		);
	} else {
		pendingResolveMentionIds.delete(agentId);
		// Non-OK synchronous status — clear pendingPastedAgentMention to prevent
		// an infinite retry loop on subsequent update() calls.
		view.dispatch(
			view.state.tr.setMeta(mentionPluginKey, {
				action: ACTIONS.CLEAR_PENDING_PASTED_AGENT_MENTION,
				params: { id: agentId },
			}),
		);
	}
};

interface CreateMentionPlugin {
	api?: ExtractInjectionAPI<MentionsPlugin>;
	fireEvent: FireElementsChannelEvent;
	options?: MentionPluginOptions;
	pmPluginFactoryParams: PMPluginFactoryParams;
}

export function createMentionPlugin({
	pmPluginFactoryParams,
	fireEvent,
	options,
	api,
}: CreateMentionPlugin): SafePlugin<MentionPluginState> {
	let mentionProvider: MentionProvider;

	// Injected by Rovo-aware consumers only. Non-Rovo consumers omit this field
	// entirely so this plugin incurs zero bundle cost from rovo-experience-api.
	const getIsRovoPanelOpen = options?.getIsRovoPanelOpen;

	const sendAnalytics = (
		event: string,
		actionSubject: string,
		action: string,
		attributes?: {
			[key: string]: string | number;
		},
	): void => {
		if (event === SLI_EVENT_TYPE || event === SMART_EVENT_TYPE) {
			fireEvent(
				{
					action: action as MentionActions,
					actionSubject: actionSubject as ComponentNames | SliNames,
					eventType: EVENT_TYPE.OPERATIONAL,
					attributes: {
						packageName: PACKAGE_NAME,
						packageVersion: PACKAGE_VERSION,
						componentName: ComponentNames.MENTION,
						...attributes,
					},
				},
				'fabricElements',
			);
		}
	};

	return new SafePlugin({
		key: mentionPluginKey,
		state: {
			init(_, state: EditorState): MentionPluginState {
				const canInsertMention = canMentionBeCreatedInRange(
					state.selection.from,
					state.selection.to,
				)(state);
				return {
					canInsertMention,
				};
			},
			apply(tr, pluginState: MentionPluginState, oldState, newState): MentionPluginState {
				const { action, params } = tr.getMeta(mentionPluginKey) || {
					action: null,
					params: null,
				};
				let hasPublicPluginStateChanged = false;
				let newPluginState = pluginState;
				const isAgentMentionsExperimentEnabled = editorExperiment(
					'platform_editor_agent_mentions',
					true,
				);

				const hasPositionChanged =
					oldState.selection.from !== newState.selection.from ||
					oldState.selection.to !== newState.selection.to;

				if (tr.docChanged || (tr.selectionSet && hasPositionChanged)) {
					newPluginState = {
						...pluginState,
						canInsertMention: canMentionBeCreatedInRange(
							newState.selection.from,
							newState.selection.to,
						)(newState),
					};
					hasPublicPluginStateChanged = true;
				}

				switch (action) {
					case ACTIONS.COMMIT_PENDING_TYPED_AGENT_MENTION: {
						const pendingTypedAgentMention = newPluginState.pendingTypedAgentMention;
						// Ignore stale timer callbacks. The localId and resetCount must still match the
						// current pending mention so older timers cannot publish after later user edits.
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
						// Silently discard the pending typed agent mention without committing it.
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
						// Guard: only apply if there is a matching pending pasted mention (staleness check).
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
						// resolveMentionName() returned a non-OK status — clear the pending state.
						newPluginState = {
							...newPluginState,
							pendingPastedAgentMention: null,
						};
						break;
					}
				}

				// When the agent mentions experiment is off, dispatch immediately (original behaviour).
				// When it's on, defer dispatch to after the agent tracking block below so that
				// agent-mention state changes are included in the notification.
				if (hasPublicPluginStateChanged && !isAgentMentionsExperimentEnabled) {
					pmPluginFactoryParams.dispatch(mentionPluginKey, newPluginState);
				}

				type MentionMapItem = {
					id: string;
					localId: string;
				};

				if (options?.handleMentionsChanged && tr.docChanged) {
					insm.session?.startFeature('mentionDeletionDetection');

					const mentionSchema = newState.schema.nodes.mention;
					const mentionsRemoved = new Map<string, MentionMapItem>();

					tr.steps.forEach((step, index) => {
						step.getMap().forEach((from, to) => {
							const newStart = tr.mapping.slice(index).map(from, -1);
							const newEnd = tr.mapping.slice(index).map(to);
							const oldStart = tr.mapping.invert().map(newStart, -1);
							const oldEnd = tr.mapping.invert().map(newEnd);

							const oldSlice = oldState.doc.slice(oldStart, oldEnd);
							const newSlice = newState.doc.slice(newStart, newEnd);

							const mentionsBefore = new Map<string, MentionMapItem>();
							const mentionsAfter = new Map<string, MentionMapItem>();

							oldSlice.content.descendants((node) => {
								if (node.type.name === mentionSchema.name && node.attrs.localId) {
									mentionsBefore.set(node.attrs.localId, {
										id: node.attrs.id,
										localId: node.attrs.localId,
									});
								}
							});

							newSlice.content.descendants((node) => {
								if (node.type.name === mentionSchema.name && node.attrs.localId) {
									mentionsAfter.set(node.attrs.localId, {
										id: node.attrs.id,
										localId: node.attrs.localId,
									});
								}
							});

							// Determine which mentions were removed in this step
							mentionsBefore.forEach((mention, localId) => {
								if (!mentionsAfter.has(localId)) {
									mentionsRemoved.set(localId, mention);
								}
							});

							// Adjust mentionsRemoved by removing any that reappear
							mentionsAfter.forEach((_, localId) => {
								if (mentionsRemoved.has(localId)) {
									mentionsRemoved.delete(localId);
								}
							});
						});
					});

					if (mentionsRemoved.size > 0) {
						const changes = Array.from(mentionsRemoved.values()).map((mention) => ({
							id: mention.id,
							localId: mention.localId,
							type: 'deleted' as const,
						}));
						options.handleMentionsChanged(changes);
					}

					insm.session?.endFeature('mentionDeletionDetection');
				}

				if (isAgentMentionsExperimentEnabled && isQualifyingLocalUserDocChange(tr)) {
					const mentionSchema = newState.schema.nodes.mention;

					const newDocRanges: Array<[number, number]> = [];
					const oldDocRanges: Array<[number, number]> = [];
					let stepsTouchMentions = false;
					tr.steps.forEach((step) => {
						let found = false;
						// Only merge a step's ranges if it actually touched an agent mention,
						// so unrelated steps (e.g. mark-only changes) don't inflate the scan area.
						const stepNewRanges: Array<[number, number]> = [];
						const stepOldRanges: Array<[number, number]> = [];
						step.getMap().forEach((oldFrom, oldTo, newFrom, newTo) => {
							stepOldRanges.push([oldFrom, oldTo]);
							stepNewRanges.push([newFrom, newTo]);
							if (!found) {
								// Clamp positions: delete-only steps can produce newTo > doc.content.size.
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
											if (
												node.type === mentionSchema &&
												AGENT_USER_TYPES.has(node.attrs.userType)
											) {
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
								if (from >= clampedTo) continue;
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
										// Try to recover the name synchronously from the mention provider's
										// name cache (populated by cacheMentionName on typed insert).
										const cachedName = fg('platform_editor_agent_mentions_drop_one_fixes')
											? resolveCachedAgentMentionName(
													mentionProvider,
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
								if (from >= clampedOldTo) continue;
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

						// When a deletion collapses the new-doc range to a zero-width point, or when
						// the doc changed but no step covered the tracked mention, the new-doc scan
						// above finds nothing. Check whether any agent mention survived in the document.
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

						const trackedAgentMentionLocalId =
							newPluginState.lastInsertedAgentMentionLocalId ?? null;
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
							// Fallback: if the localId-specific scan missed the typed mention,
							// publish immediately so the insertion is not dropped.
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
							// Suppress the nudge for pasted/non-typed agent mentions when Rovo is already
							// open.
							const isTaskItemMentionForPaste = agentMentionParentNodeType === 'taskItem';
							if (!isTaskItemMentionForPaste && isNewInsertion && getIsRovoPanelOpen?.()) {
								// Rovo is already open — skip setting lastInsertedAgentMention* so the
								// downstream nudge listener never fires.
							} else if (
								agentMentionName === null &&
								agentMentionId !== null &&
								isResolvingMentionProvider(newPluginState.mentionProvider) &&
								fg('platform_editor_agent_mentions_drop_one_fixes')
							) {
								// Store details in pendingPastedAgentMention (private, not broadcast), preventing a double-nudge.
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
								// the nudge does not fire until the name is resolved.
							} else {
								// Not suppressed — update state so the nudge fires normally.
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

				// Typed agent mentions stay pending while the user is still editing around them,
				// but leaving the mention's direct parent means they have moved on from that
				// paragraph/block. Publish immediately in that case instead of waiting for the
				// inactivity timer.
				const shouldCheckPendingTypedAgentMentionParent = isLocalSelectionChange(
					tr,
					hasPositionChanged,
				);
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
						// Suppress the nudge when Rovo chat is already open, mirroring the same
						// guard used in the inactivity-timer path. Task-item mentions are
						// exempt because they auto-fire the mini modal and never show a nudge.
						if (pendingMentionDetails.parentNodeType !== 'taskItem' && getIsRovoPanelOpen?.()) {
							// Discard without committing so lastInsertedAgentMention* fields are
							// never set and the downstream nudge listener never fires.
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

				if (hasPublicPluginStateChanged && isAgentMentionsExperimentEnabled) {
					pmPluginFactoryParams.dispatch(mentionPluginKey, newPluginState);
				}

				return newPluginState;
			},
		} as SafeStateField<MentionPluginState>,
		props: {
			nodeViews: {
				mention: (node, view) => {
					return new MentionNodeView(node, {
						options,
						api,
						editorView: view,
						portalProviderAPI: pmPluginFactoryParams.portalProviderAPI,
					});
				},
			},
		},
		view(editorView) {
			const isAgentMentionsEnabled = editorExperiment('platform_editor_agent_mentions', true);
			let pendingTypedAgentMentionTimer: ReturnType<typeof setTimeout> | undefined;
			let pendingTypedAgentMentionTimerKey: string | null = null;
			let pendingTypedAgentMentionFocusDeferCount = 0;
			// Tracks agent IDs for which resolveMentionName() is already in-flight,
			// preventing duplicate concurrent Promises for the same ID across update() cycles.
			const pendingResolveMentionIds = new Set<string>();

			/**
			 * Clears the currently scheduled pending typed-agent-mention timer.
			 *
			 * By default this also resets the focus defer count because a new pending mention,
			 * local edit reset, or cleanup should start a fresh escape-hatch window. Focus-based
			 * retries pass `preserveFocusDeferCount` so repeated defers for the same pending
			 * mention are counted toward the bounded retry cap.
			 */
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

			/**
			 * Typed agent mentions intentionally wait before invoking the agent so content the
			 * user adds next can become context. That context can be authored through
			 * editor-adjacent UI, such as mention typeahead, date picker, or status picker,
			 * where focus leaves the ProseMirror editor but remains in the active document.
			 * Treat that as continued authoring activity by restarting the inactivity window.
			 * This only defers the inactivity timer path: existing selection-change handling can
			 * still publish or clear the pending mention sooner. After 20 focus defers (~1 minute),
			 * publish anyway so pathological focus states cannot keep the mention pending indefinitely.
			 */
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
					{
						// Suppress the agent-mention nudge when the Rovo panel is already open,
						// but only for non-task-item mentions.
						const isTaskItemMention = pendingTypedAgentMention.parentNodeType === 'taskItem';
						if (!isTaskItemMention && getIsRovoPanelOpen?.()) {
							// Dispatch a discard so pendingTypedAgentMention is nulled out of plugin
							// state.
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
					}

					const latestPendingTypedAgentMention = mentionPluginKey.getState(
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
						schedulePendingTypedAgentMentionTimer(mentionPluginKey.getState(editorView.state), {
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

			const providerHandler = (
				name: string,
				providerPromise?: Promise<MentionProvider | ContextIdentifierProvider>,
			) => {
				switch (name) {
					case 'mentionProvider':
						if (!providerPromise) {
							fireEvent({
								action: ACTION.ERRORED,
								actionSubject: ACTION_SUBJECT.MENTION,
								actionSubjectId: ACTION_SUBJECT_ID.MENTION_PROVIDER,
								eventType: EVENT_TYPE.OPERATIONAL,
								attributes: {
									reason: MENTION_PROVIDER_UNDEFINED,
								},
							});
							return setProvider(undefined)(editorView.state, editorView.dispatch);
						}

						(providerPromise as Promise<MentionProvider>)
							.then((provider) => {
								if (mentionProvider) {
									mentionProvider.unsubscribe('mentionPlugin');
								}

								mentionProvider = provider;
								setProvider(provider)(editorView.state, editorView.dispatch);

								provider.subscribe(
									'mentionPlugin',
									undefined,
									undefined,
									undefined,
									undefined,
									sendAnalytics,
								);
							})
							.catch(() => {
								fireEvent({
									action: ACTION.ERRORED,
									actionSubject: ACTION_SUBJECT.MENTION,
									actionSubjectId: ACTION_SUBJECT_ID.MENTION_PROVIDER,
									eventType: EVENT_TYPE.OPERATIONAL,
									attributes: {
										reason: MENTION_PROVIDER_REJECTED,
									},
								});
								return setProvider(undefined)(editorView.state, editorView.dispatch);
							});
						break;
				}
				return;
			};

			const providerViaConfig = fg('platform_editor_mention_provider_via_plugin_config');
			if (providerViaConfig && options?.mentionProvider) {
				providerHandler('mentionProvider', options?.mentionProvider);
			} else {
				pmPluginFactoryParams.providerFactory.subscribe('mentionProvider', providerHandler);
			}

			return {
				update(view, prevState) {
					const mentionPluginState = mentionPluginKey.getState(view.state);
					if (mentionPluginState === mentionPluginKey.getState(prevState)) {
						return;
					}
					schedulePendingTypedAgentMentionTimer(mentionPluginState);

					// If a pasted agent mention has no name (cache miss), resolve it async
					// via the mention provider and dispatch RESOLVE_PASTED_AGENT_MENTION_NAME
					// so the nudge displays the correct name.
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
					if (pmPluginFactoryParams.providerFactory) {
						pmPluginFactoryParams.providerFactory.unsubscribe('mentionProvider', providerHandler);
					}
					if (mentionProvider) {
						mentionProvider.unsubscribe('mentionPlugin');
					}
				},
			};
		},
	});
}
