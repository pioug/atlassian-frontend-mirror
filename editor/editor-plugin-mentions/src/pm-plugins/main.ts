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
import { findChildrenByType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { insm } from '@atlaskit/insm';
import type { MentionProvider } from '@atlaskit/mention/resource';
import { SLI_EVENT_TYPE, SMART_EVENT_TYPE } from '@atlaskit/mention/resource';
import {
	ComponentNames,
	type Actions as MentionActions,
	type SliNames,
} from '@atlaskit/mention/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { MentionsPlugin } from '../mentionsPluginType';
import { MentionNodeView } from '../nodeviews/mentionNodeView';
import {
	type FireElementsChannelEvent,
	MENTION_PROVIDER_REJECTED,
	MENTION_PROVIDER_UNDEFINED,
	type MentionPluginOptions,
	type MentionPluginState,
} from '../types';

import { mentionPluginKey } from './key';
import { canMentionBeCreatedInRange } from './utils';

export const ACTIONS = {
	SET_PROVIDER: 'SET_PROVIDER',
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
}: CreateMentionPlugin) {
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
			// @ts-ignore - Workaround for help-center local consumption

			init(_, state: EditorState): MentionPluginState {
				const canInsertMention = canMentionBeCreatedInRange(
					state.selection.from,
					state.selection.to,
				)(state);
				return {
					canInsertMention,
				};
			},
			// @ts-ignore - Workaround for help-center local consumption

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

				if (hasNewPluginState) {
					pmPluginFactoryParams.dispatch(mentionPluginKey, newPluginState);
				}

				type MentionMapItem = {
					id: string;
					localId: string;
				};

				if (
					expValEquals('platform_editor_new_mentions_detection_logic', 'isEnabled', true) &&
					options?.handleMentionsChanged &&
					tr.docChanged
				) {
					insm.session?.startFeature('mentionDeletionDetection');

					const mentionSchema = newState.schema.nodes.mention;
					const mentionsRemoved = new Map<string, MentionMapItem>();

					// @ts-ignore - Workaround for help-center local consumption

					tr.steps.forEach((step, index) => {
						// @ts-ignore - Workaround for help-center local consumption

						step.getMap().forEach((from, to) => {
							// @ts-ignore - Workaround for help-center local consumption

							const newStart = tr.mapping.slice(index).map(from, -1);
							// @ts-ignore - Workaround for help-center local consumption

							const newEnd = tr.mapping.slice(index).map(to);
							// @ts-ignore - Workaround for help-center local consumption

							const oldStart = tr.mapping.invert().map(newStart, -1);
							// @ts-ignore - Workaround for help-center local consumption

							const oldEnd = tr.mapping.invert().map(newEnd);

							const oldSlice = oldState.doc.slice(oldStart, oldEnd);
							const newSlice = newState.doc.slice(newStart, newEnd);

							const mentionsBefore = new Map<string, MentionMapItem>();
							const mentionsAfter = new Map<string, MentionMapItem>();

							// @ts-ignore - Workaround for help-center local consumption
							oldSlice.content.descendants((node) => {
								if (node.type.name === mentionSchema.name && node.attrs.localId) {
									mentionsBefore.set(node.attrs.localId, {
										id: node.attrs.id,
										localId: node.attrs.localId,
									});
								}
							});

							// @ts-ignore - Workaround for help-center local consumption

							newSlice.content.descendants((node) => {
								if (node.type.name === mentionSchema.name && node.attrs.localId) {
									mentionsAfter.set(node.attrs.localId, {
										id: node.attrs.id,
										localId: node.attrs.localId,
									});
								}
							});

							// Determine which mentions were removed in this step
							// @ts-ignore - Workaround for help-center local consumption

							mentionsBefore.forEach((mention, localId) => {
								if (!mentionsAfter.has(localId)) {
									mentionsRemoved.set(localId, mention);
								}
							});

							// Adjust mentionsRemoved by removing any that reappear
							// @ts-ignore - Workaround for help-center local consumption

							mentionsAfter.forEach((_, localId) => {
								if (mentionsRemoved.has(localId)) {
									mentionsRemoved.delete(localId);
								}
							});
						});
					});

					if (mentionsRemoved.size > 0) {
						// @ts-ignore - Workaround for help-center local consumption

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
			// @ts-ignore - Workaround for help-center local consumption

			nodeViews: {
				// @ts-ignore - Workaround for help-center local consumption
				mention: (node, view, getPos, decorations, innerDecorations) => {
					return new MentionNodeView(node, {
						options,
						api,
						portalProviderAPI: pmPluginFactoryParams.portalProviderAPI,
					});
				},
			},
		},
		// @ts-ignore - Workaround for help-center local consumption

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
				// @ts-ignore - Workaround for help-center local consumption

				destroy() {
					if (pmPluginFactoryParams.providerFactory) {
						pmPluginFactoryParams.providerFactory.unsubscribe('mentionProvider', providerHandler);
					}
					if (mentionProvider) {
						mentionProvider.unsubscribe('mentionPlugin');
					}
				},
				// @ts-ignore - Workaround for help-center local consumption

				update(view: EditorView, prevState: EditorState) {
					const newState = view.state;
					if (
						!expValEquals('platform_editor_new_mentions_detection_logic', 'isEnabled', true) &&
						options?.handleMentionsChanged
					) {
						const mentionSchema = newState.schema.nodes.mention;
						const mentionNodesBefore = findChildrenByType(prevState.doc, mentionSchema);
						const mentionLocalIdsAfter = new Set(
							// @ts-ignore - Workaround for help-center local consumption

							findChildrenByType(newState.doc, mentionSchema).map(({ node }) => node.attrs.localId),
						);

						if (mentionNodesBefore.length > mentionLocalIdsAfter.size) {
							const deletedMentions: { id: string; localId: string; type: 'deleted' }[] =
								mentionNodesBefore
									// @ts-ignore - Workaround for help-center local consumption

									.filter(({ node }) => !mentionLocalIdsAfter.has(node.attrs.localId))
									// @ts-ignore - Workaround for help-center local consumption

									.map(({ node }) => ({
										type: 'deleted',
										id: node.attrs.id,
										localId: node.attrs.localId,
									}));

							if (deletedMentions.length > 0) {
								options.handleMentionsChanged(deletedMentions);
							}
						}
					}
				},
			};
		},
	});
}
