import type { MentionUserType } from '@atlaskit/adf-schema';
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
import { insm } from '@atlaskit/insm';
import type { MentionProvider } from '@atlaskit/mention/resource';
import { SLI_EVENT_TYPE, SMART_EVENT_TYPE } from '@atlaskit/mention/resource';
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

import { mentionPluginKey } from './key';
import { canMentionBeCreatedInRange } from './utils';

export const ACTIONS = {
	COMMIT_PENDING_TYPED_AGENT_MENTION: 'COMMIT_PENDING_TYPED_AGENT_MENTION',
	SET_PENDING_TYPED_AGENT_MENTION: 'SET_PENDING_TYPED_AGENT_MENTION',
	SET_PROVIDER: 'SET_PROVIDER',
};

// 'AGENT' is not in the ADF schema UserType enum but is used at runtime.
const AGENT_USER_TYPES = new Set<MentionUserType | 'AGENT'>(['APP', 'AGENT']);

const AI_STREAMING_TRANSFORMATION_META_KEY = 'isAIStreamingTransformation' as const;
const AGENT_MENTION_INACTIVITY_MS = 3000;

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

/**
 * Reads agent-mention details from a known document position without traversing
 * the document. Callers pass a matcher so mapped positions are only accepted
 * when they still point at the same pending/tracked mention.
 */
const getAgentMentionDetailsAtPos = (
	state: EditorState,
	pos: number,
	matchesMention: (attrs: Record<string, unknown>) => boolean,
): AgentMentionDetails | null => {
	if (pos < 0 || pos > state.doc.content.size) {
		return null;
	}

	const node = state.doc.nodeAt(pos);
	const mentionSchema = state.schema.nodes.mention;
	if (
		node?.type !== mentionSchema ||
		!AGENT_USER_TYPES.has(node.attrs.userType) ||
		!matchesMention(node.attrs) ||
		!node.attrs.id
	) {
		return null;
	}

	const $mentionPos = state.doc.resolve(pos);
	const parentNode = $mentionPos.node($mentionPos.depth);

	return {
		id: node.attrs.id as string,
		context: parentNode.textContent.trim() || null,
		nodeSize: node.nodeSize,
		parentNodeType: parentNode.type.name ?? null,
		pos,
	};
};

/**
 * Finds an agent mention that survived a document change when the changed-range
 * scan did not find one. Prefers the previously tracked mention ID when present;
 * otherwise returns a surviving agent mention using the existing traversal order.
 */
const getSurvivingAgentMentionDetails = (
	state: EditorState,
	preferredId: string,
): AgentMentionDetails | null => {
	const mentionSchema = state.schema.nodes.mention;
	let result: AgentMentionDetails | null = null;

	state.doc.descendants((node, pos) => {
		if (result?.id === preferredId) {
			return false;
		}
		if (
			node.type !== mentionSchema ||
			!AGENT_USER_TYPES.has(node.attrs.userType) ||
			!node.attrs.id
		) {
			return true;
		}

		result = getAgentMentionDetailsAtPos(state, pos, (attrs) => attrs.id === node.attrs.id);

		return result?.id !== preferredId;
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
	);

	return pendingMentionDetails
		? {
				id: pendingMentionDetails.id,
				localId: pendingTypedAgentMention.localId,
				nodeSize: pendingMentionDetails.nodeSize,
				pos: pendingMentionDetails.pos,
				resetCount,
			}
		: null;
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

						const pendingMentionDetails = getAgentMentionDetailsAtPos(
							newState,
							pendingTypedAgentMention.pos,
							(attrs) => attrs.localId === pendingTypedAgentMention.localId,
						);

						if (!pendingMentionDetails) {
							newPluginState = {
								...newPluginState,
								pendingTypedAgentMention: null,
							};
							break;
						}

						newPluginState = {
							...newPluginState,
							pendingTypedAgentMention: null,
							lastInsertedAgentMentionId: pendingMentionDetails.id,
							lastInsertedAgentMentionContext: pendingMentionDetails.context,
							lastInsertedAgentMentionParentNodeType: pendingMentionDetails.parentNodeType,
							lastAgentMentionInsertionCount:
								(newPluginState.lastAgentMentionInsertionCount ?? 0) + 1,
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
				}

				// When the agent mentions experiment is off, dispatch immediately (original behaviour).
				// When it's on, defer dispatch to after the agent tracking block below so that
				// agent-mention state changes are included in the notification.
				if (hasPublicPluginStateChanged && !isAgentMentionsExperimentEnabled) {
					pmPluginFactoryParams.dispatch(mentionPluginKey, newPluginState);
				}

				if (isAgentMentionsExperimentEnabled && tr.docChanged && tr.getMeta('replaceDocument')) {
					newPluginState = {
						...newPluginState,
						pendingTypedAgentMention: null,
						lastInsertedAgentMentionId: null,
						lastInsertedAgentMentionContext: null,
						lastInsertedAgentMentionParentNodeType: null,
					};
					hasPublicPluginStateChanged = true;
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

				const isAIStreaming = Boolean(tr.getMeta(AI_STREAMING_TRANSFORMATION_META_KEY));
				if (
					tr.docChanged &&
					!tr.getMeta('replaceDocument') &&
					!isAIStreaming &&
					isAgentMentionsExperimentEnabled
				) {
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
										if (node.type === mentionSchema && AGENT_USER_TYPES.has(node.attrs.userType)) {
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
						stepsTouchMentions || Boolean(newPluginState.lastInsertedAgentMentionId);

					if (shouldResolveAgentMentionState) {
						let agentMentionId: string | null = null;
						let agentMentionContext: string | null = null;
						let agentMentionParentNodeType: string | null = null;
						let newCount = 0;
						let oldAgentMentionId: string | null = null;
						let oldCount = 0;
						const pendingTypedAgentMentionDetails: { current?: AgentMentionDetails } = {};

						if (stepsTouchMentions) {
							for (const [from, to] of newDocRanges) {
								const clampedTo = Math.min(to, newState.doc.content.size);
								if (from >= clampedTo) continue;
								newState.doc.nodesBetween(from, clampedTo, (node, pos) => {
									if (node.type !== mentionSchema || !AGENT_USER_TYPES.has(node.attrs.userType)) {
										return true;
									}
									newCount++;
									if (
										pendingTypedAgentMentionDetails.current === undefined &&
										action === ACTIONS.SET_PENDING_TYPED_AGENT_MENTION &&
										node.attrs.localId === params?.localId
									) {
										pendingTypedAgentMentionDetails.current = getAgentMentionDetailsAtPos(
											newState,
											pos,
											(attrs) => attrs.localId === params.localId,
										) ?? undefined;
									}
									if (agentMentionId === null && node.attrs.id) {
										const agentMentionDetails = getAgentMentionDetailsAtPos(
											newState,
											pos,
											(attrs) => attrs.id === node.attrs.id,
										);
										if (agentMentionDetails) {
											agentMentionId = agentMentionDetails.id;
											agentMentionContext = agentMentionDetails.context;
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
									if (node.type !== mentionSchema || !AGENT_USER_TYPES.has(node.attrs.userType)) {
										return true;
									}
									oldCount++;
									if (oldAgentMentionId === null && node.attrs.id) {
										oldAgentMentionId = node.attrs.id as string;
									}
									return true;
								});
							}
						}

						// When a deletion collapses the new-doc range to a zero-width point, or when
						// the doc changed but no step covered the tracked mention, the new-doc scan
						// above finds nothing. Check whether any agent mention survived in the document.
						let resolvedFromFullDocFallback = false;
						if (agentMentionId === null && newPluginState.lastInsertedAgentMentionId) {
							const survivorDetails = getSurvivingAgentMentionDetails(
								newState,
								newPluginState.lastInsertedAgentMentionId,
							);
							if (survivorDetails) {
								agentMentionId = survivorDetails.id;
								agentMentionContext = survivorDetails.context;
								agentMentionParentNodeType = survivorDetails.parentNodeType;
								resolvedFromFullDocFallback = true;
							}
						}

						const isNewInsertion =
							agentMentionId !== null &&
							!resolvedFromFullDocFallback &&
							(oldAgentMentionId !== agentMentionId || newCount > oldCount);
						const isPendingTypedAgentMentionInsertion =
							isNewInsertion &&
							action === ACTIONS.SET_PENDING_TYPED_AGENT_MENTION &&
							typeof params?.localId === 'string';
						const newInsertionCount = isNewInsertion
							? (newPluginState.lastAgentMentionInsertionCount ?? 0) + 1
							: undefined;

						if (isPendingTypedAgentMentionInsertion && pendingTypedAgentMentionDetails.current) {
							const pendingTypedAgentMentionLocalId = params?.localId as string;

							newPluginState = {
								...newPluginState,
								pendingTypedAgentMention: {
									id: pendingTypedAgentMentionDetails.current.id,
									localId: pendingTypedAgentMentionLocalId,
									nodeSize: pendingTypedAgentMentionDetails.current.nodeSize,
									pos: pendingTypedAgentMentionDetails.current.pos,
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
								lastInsertedAgentMentionContext: agentMentionContext,
								lastInsertedAgentMentionParentNodeType: agentMentionParentNodeType,
								...(newInsertionCount !== undefined
									? { lastAgentMentionInsertionCount: newInsertionCount }
									: {}),
							};
							hasPublicPluginStateChanged = true;
						} else if (
							agentMentionId !== (newPluginState.lastInsertedAgentMentionId ?? null) ||
							agentMentionContext !== (newPluginState.lastInsertedAgentMentionContext ?? null) ||
							agentMentionParentNodeType !==
								(newPluginState.lastInsertedAgentMentionParentNodeType ?? null) ||
							newInsertionCount !== undefined
						) {
							newPluginState = {
								...newPluginState,
								lastInsertedAgentMentionId: agentMentionId,
								lastInsertedAgentMentionContext: agentMentionContext,
								lastInsertedAgentMentionParentNodeType: agentMentionParentNodeType,
								...(newInsertionCount !== undefined
									? { lastAgentMentionInsertionCount: newInsertionCount }
									: {}),
							};
							hasPublicPluginStateChanged = true;
						}
					}
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

				if (hasPublicPluginStateChanged && isAgentMentionsExperimentEnabled) {
					pmPluginFactoryParams.dispatch(mentionPluginKey, newPluginState);
				}

				return newPluginState;
			},
		} as SafeStateField<MentionPluginState>,
		props: {
			nodeViews: {
				mention: (node) => {
					return new MentionNodeView(node, {
						options,
						api,
						portalProviderAPI: pmPluginFactoryParams.portalProviderAPI,
					});
				},
			},
		},
		view(editorView) {
			const isAgentMentionsEnabled = editorExperiment('platform_editor_agent_mentions', true);
			let pendingTypedAgentMentionTimer: ReturnType<typeof setTimeout> | undefined;
			let pendingTypedAgentMentionTimerKey: string | null = null;

			const clearPendingTypedAgentMentionTimer = () => {
				if (pendingTypedAgentMentionTimer) {
					clearTimeout(pendingTypedAgentMentionTimer);
					pendingTypedAgentMentionTimer = undefined;
				}
				pendingTypedAgentMentionTimerKey = null;
			};

			const schedulePendingTypedAgentMentionTimer = (
				mentionPluginState: MentionPluginState | undefined,
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

				clearPendingTypedAgentMentionTimer();
				pendingTypedAgentMentionTimerKey = timerKey;
				pendingTypedAgentMentionTimer = setTimeout(() => {
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
