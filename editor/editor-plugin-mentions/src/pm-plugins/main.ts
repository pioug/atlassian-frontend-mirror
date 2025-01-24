import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { getInlineNodeViewProducer } from '@atlaskit/editor-common/react-node-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	Command,
	ExtractInjectionAPI,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import type { EditorState, SafeStateField } from '@atlaskit/editor-prosemirror/state';
import { findChildrenByType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { MentionProvider } from '@atlaskit/mention/resource';
import { SLI_EVENT_TYPE, SMART_EVENT_TYPE } from '@atlaskit/mention/resource';
import {
	ComponentNames,
	type Actions as MentionActions,
	type SliNames,
} from '@atlaskit/mention/types';
import { fg } from '@atlaskit/platform-feature-flags';

import type { MentionsPlugin } from '../mentionsPluginType';
import { MentionNodeView } from '../nodeviews/mention';
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
	pmPluginFactoryParams: PMPluginFactoryParams;
	fireEvent: FireElementsChannelEvent;
	options?: MentionPluginOptions;
	api?: ExtractInjectionAPI<MentionsPlugin>;
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

				if (hasNewPluginState) {
					pmPluginFactoryParams.dispatch(mentionPluginKey, newPluginState);
				}
				return newPluginState;
			},
		} as SafeStateField<MentionPluginState>,
		props: {
			nodeViews: {
				mention: getInlineNodeViewProducer({
					pmPluginFactoryParams,
					Component: MentionNodeView,
					extraComponentProps: {
						providerFactory: pmPluginFactoryParams.providerFactory,
						pluginInjectionApi: api,
						options,
					},
				}),
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
				update(view: EditorView, prevState: EditorState) {
					const newState = view.state;
					if (options?.handleMentionsChanged && fg('confluence_updated_mentions_livepages')) {
						const mentionSchema = newState.schema.nodes.mention;
						const mentionNodesBefore = findChildrenByType(prevState.doc, mentionSchema);
						const mentionLocalIdsAfter = new Set(
							findChildrenByType(newState.doc, mentionSchema).map(({ node }) => node.attrs.localId),
						);

						if (mentionNodesBefore.length > mentionLocalIdsAfter.size) {
							const deletedMentions: { type: 'deleted'; localId: string; id: string }[] =
								mentionNodesBefore
									.filter(({ node }) => !mentionLocalIdsAfter.has(node.attrs.localId))
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
