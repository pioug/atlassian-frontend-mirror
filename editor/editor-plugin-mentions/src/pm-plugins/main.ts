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
import type { EditorState, SafeStateField } from '@atlaskit/editor-prosemirror/state';
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
import type { FireElementsChannelEvent, MentionPluginOptions, MentionPluginState } from '../types';

import { mentionPluginKey } from './key';
import { canMentionBeCreatedInRange } from './utils';

export const ACTIONS = {
	SET_PROVIDER: 'SET_PROVIDER',
};

// 'AGENT' is not in the ADF schema UserType enum but is used at runtime.
const AGENT_USER_TYPES = new Set<MentionUserType | 'AGENT'>(['APP', 'AGENT']);

const AI_STREAMING_TRANSFORMATION_META_KEY = 'isAIStreamingTransformation' as const;

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
				let hasNewPluginState = false;
				let newPluginState = pluginState;

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
					hasNewPluginState = true;
				}

				switch (action) {
					case ACTIONS.SET_PROVIDER:
						newPluginState = {
							...newPluginState,
							mentionProvider: params.provider,
						};
						hasNewPluginState = true;
						break;
				}

				// When the agent mentions experiment is off, dispatch immediately (original behaviour).
				// When it's on, defer dispatch to after the agent tracking block below so that
				// agent-mention state changes are included in the notification.
				if (hasNewPluginState && !editorExperiment('platform_editor_agent_mentions', true)) {
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

				const isAIStreaming = Boolean(tr.getMeta(AI_STREAMING_TRANSFORMATION_META_KEY));
				if (
					tr.docChanged &&
					!tr.getMeta('replaceDocument') &&
					!isAIStreaming &&
					editorExperiment('platform_editor_agent_mentions', true)
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

					if (stepsTouchMentions || newPluginState.lastInsertedAgentMentionId) {
						let agentMentionId: string | null = null;
						let agentMentionContext: string | null = null;
						let agentMentionParentNodeType: string | null = null;
						let newCount = 0;
						let oldAgentMentionId: string | null = null;
						let oldCount = 0;

						if (stepsTouchMentions) {
							for (const [from, to] of newDocRanges) {
								const clampedTo = Math.min(to, newState.doc.content.size);
								if (from >= clampedTo) continue;
								newState.doc.nodesBetween(from, clampedTo, (node, _pos, parent) => {
									if (node.type !== mentionSchema || !AGENT_USER_TYPES.has(node.attrs.userType)) {
										return true;
									}
									newCount++;
									if (agentMentionId === null && node.attrs.id) {
										agentMentionId = node.attrs.id as string;
										agentMentionParentNodeType = parent?.type.name ?? null;
										agentMentionContext = parent?.textContent.trim() || null;
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
						let resolvedFromSurvivor = false;
						if (agentMentionId === null && newPluginState.lastInsertedAgentMentionId) {
							const prevId = newPluginState.lastInsertedAgentMentionId;
							let survivorId: string | null = null;
							let survivorContext: string | null = null;
							let survivorParentNodeType: string | null = null;
							newState.doc.descendants((node, _pos, parent) => {
								if (survivorId === prevId) return false;
								if (node.type === mentionSchema && AGENT_USER_TYPES.has(node.attrs.userType)) {
									// Prefer the previously tracked ID; otherwise keep the first found.
									survivorId = node.attrs.id as string;
									survivorParentNodeType = parent?.type.name ?? null;
									survivorContext = parent?.textContent.trim() || null;
								}
								return survivorId !== prevId;
							});
							if (survivorId !== null) {
								agentMentionId = survivorId;
								agentMentionContext = survivorContext;
								agentMentionParentNodeType = survivorParentNodeType;
								resolvedFromSurvivor = true;
							}
						}

						const isNewInsertion =
							agentMentionId !== null &&
							!resolvedFromSurvivor &&
							(oldAgentMentionId !== agentMentionId || newCount > oldCount);
						const newInsertionCount = isNewInsertion
							? (newPluginState.lastAgentMentionInsertionCount ?? 0) + 1
							: undefined;

						if (
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
							hasNewPluginState = true;
						}
					}
				}

				if (hasNewPluginState && editorExperiment('platform_editor_agent_mentions', true)) {
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
				destroy() {
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
