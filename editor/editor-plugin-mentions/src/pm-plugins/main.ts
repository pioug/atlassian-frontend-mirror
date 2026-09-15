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
import { SLI_EVENT_TYPE, SMART_EVENT_TYPE } from '@atlaskit/mention/analytics';
import {
	ComponentNames,
	type MentionProvider,
	type Actions as MentionActions,
	type SliNames,
} from '@atlaskit/mention/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { MentionsPlugin } from '../mentionsPluginType';
import { MentionNodeView } from '../nodeviews/mentionNodeView';
import { MENTION_PROVIDER_REJECTED, MENTION_PROVIDER_UNDEFINED } from '../types';
import type { FireElementsChannelEvent, MentionPluginOptions, MentionPluginState } from '../types';

import { mentionPluginKey } from './key';
import { canMentionBeCreatedInRange } from './utils';

export const ACTIONS = {
	COMMIT_PENDING_TYPED_AGENT_MENTION: 'COMMIT_PENDING_TYPED_AGENT_MENTION',
	DISCARD_PENDING_TYPED_AGENT_MENTION: 'DISCARD_PENDING_TYPED_AGENT_MENTION',
	SET_PENDING_TYPED_AGENT_MENTION: 'SET_PENDING_TYPED_AGENT_MENTION',
	SET_PROVIDER: 'SET_PROVIDER',
	/**
	 * Dispatched by the `setAgentMentionRunStates` action to push the product's run-state
	 * map into plugin state, which drives the run-state node decorations.
	 */
	SET_AGENT_RUN_STATES: 'SET_AGENT_RUN_STATES',
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
				let hasPublicPluginStateChanged = false;
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
					hasPublicPluginStateChanged = true;
				}

				switch (action) {
					case ACTIONS.SET_PROVIDER:
						newPluginState = {
							...newPluginState,
							mentionProvider: params.provider,
						};
						hasPublicPluginStateChanged = true;
						break;
				}

				if (hasPublicPluginStateChanged) {
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
