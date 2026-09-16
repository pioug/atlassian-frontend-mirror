import React, { useEffect, useMemo } from 'react';

import { useIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuid } from 'uuid';

import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	toolbarInsertBlockMessages as messages,
	mentionMessages,
} from '@atlaskit/editor-common/messages';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import { IconMention } from '@atlaskit/editor-common/assets';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { TypeAheadInputMethod } from '@atlaskit/editor-plugin-type-ahead';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { isResolvingMentionProvider } from '@atlaskit/mention/is-resolving-mention-provider';
import { isPromise } from '@atlaskit/mention/is-promise';
import {
	MentionNameStatus,
	type MentionNameDetails,
	type MentionProvider,
} from '@atlaskit/mention/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';

import { insertMention } from './editor-commands';
import { isMentionTypeAheadEnabled } from './isMentionTypeAheadEnabled';
import type { MentionsPlugin } from './mentionsPluginType';
import { mentionNodeSpec } from './nodeviews/mentionNodeSpec';
import { agentMentionPluginKey, createAgentMentionPlugin } from './pm-plugins/agent';
import { mentionPluginKey } from './pm-plugins/key';
import { ACTIONS, createMentionPlugin } from './pm-plugins/main';
import type {
	AgentRunStateByLocalId,
	FireElementsChannelEvent,
	MentionChange,
	MentionSharedState,
} from './types';
import { InlineInvitePopupContainer } from './ui/InlineInvitePopupContainer';
import { SecondaryToolbarComponent } from './ui/SecondaryToolbarComponent';
import { createTypeAheadConfig } from './ui/type-ahead';
import { getMentionQuickInsertComponents } from './ui/quick-insert/getMentionQuickInsertComponents';

const processName = (name: MentionNameDetails, intl: IntlShape): string => {
	const unknownLabel = intl.formatMessage(mentionMessages.unknownLabel);
	if (name.status === MentionNameStatus.OK) {
		return `@${name.name || unknownLabel}`;
	} else {
		return `@${unknownLabel}`;
	}
};

/**
 * We will need to clean this up once mentionProvider is
 * put inside mention plugin.
 * See: https://product-fabric.atlassian.net/browse/ED-26011
 */
function Component({
	mentionProvider,
	api,
}: {
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	mentionProvider: Promise<MentionProvider> | undefined;
}) {
	const mentionProviderMemo = useMemo(() => {
		return mentionProvider;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const intl = useIntl();
	useEffect(() => {
		mentionProviderMemo?.then((mentionProviderSync) => {
			api?.base?.actions?.registerMarks(({ tr, node, pos }) => {
				const { doc } = tr;
				const { schema } = doc.type;
				const { mention: mentionNodeType } = schema.nodes;
				const { id } = node.attrs;
				if (node.type === mentionNodeType) {
					if (isResolvingMentionProvider(mentionProviderSync)) {
						const nameDetail = mentionProviderSync?.resolveMentionName(id);
						let newText;
						if (isPromise(nameDetail)) {
							newText = `@${intl.formatMessage(mentionMessages.unknownLabel)}`;
						} else {
							newText = processName(nameDetail, intl);
						}
						const currentPos = tr.mapping.map(pos);
						tr.replaceWith(
							currentPos,
							currentPos + node.nodeSize,
							schema.text(newText, node.marks),
						);
					}
				}
			});
		});
	}, [mentionProviderMemo, api, intl]);
	return null;
}

const mentionsPlugin: MentionsPlugin = ({ config: options, api }) => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const sessionId = uuid();
	let previousMediaProvider: MentionProvider;
	const fireEvent: FireElementsChannelEvent = (
		payload: AnalyticsEventPayload,
		channel?: string,
	): void => {
		const fireAnalyticsEvent = api?.analytics?.actions?.fireAnalyticsEvent;

		if (!fireAnalyticsEvent) {
			return;
		}

		if (payload.attributes && !payload.attributes.sessionId) {
			payload.attributes.sessionId = sessionId;
		}

		fireAnalyticsEvent(payload, channel);
	};

	const typeAhead = createTypeAheadConfig({
		canOpenTypeAhead: options?.canOpenTypeAhead,
		sanitizePrivateContent: options?.sanitizePrivateContent,
		mentionInsertDisplayName: options?.insertDisplayName,
		HighlightComponent: options?.HighlightComponent,
		handleMentionsChanged: options?.handleMentionsChanged,
		enableAgentSectioning: options?.enableAgentSectioning,
		showAgentMentionsLabsLozenge: options?.showAgentMentionsLabsLozenge,
		profilecardProvider: options?.profilecardProvider,
		fireEvent,
		api,
	});
	const canOpenMentionTypeAhead = () => isMentionTypeAheadEnabled(options?.canOpenTypeAhead);
	const isRegisteredSlashCommandEnabled = isExperimentEnabled('platform_editor_slash_command');

	if (isRegisteredSlashCommandEnabled) {
		api?.uiControlRegistry?.actions.register(
			getMentionQuickInsertComponents({ api, canOpenMentionTypeAhead, typeAhead }),
		);
	}

	return {
		name: 'mention',

		nodes() {
			return [{ name: 'mention', node: mentionNodeSpec() }];
		},

		pmPlugins() {
			const plugins = [
				{
					name: 'mention',
					plugin: (pmPluginFactoryParams: PMPluginFactoryParams) =>
						createMentionPlugin({ pmPluginFactoryParams, fireEvent, options, api }),
				},
			];

			if (editorExperiment('platform_editor_agent_mentions', true)) {
				plugins.push({
					name: 'agentMention',
					plugin: (pmPluginFactoryParams: PMPluginFactoryParams) =>
						createAgentMentionPlugin({ pmPluginFactoryParams, options }),
				});
			}

			return plugins;
		},

		contentComponent({ editorView, providerFactory }) {
			if (!editorView) {
				return null;
			}

			return (
				<WithProviders
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					providers={['mentionProvider']}
					providerFactory={providerFactory}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					renderNode={({ mentionProvider }) => {
						return (
							<>
								<Component mentionProvider={mentionProvider} api={api} />
								{fg('inline_invite_from_mentions_kill_switch') && (
									<InlineInvitePopupContainer
										mentionProvider={mentionProvider}
										api={api}
										editorView={editorView}
									/>
								)}
							</>
						);
					}}
				/>
			);
		},

		secondaryToolbarComponent({ editorView, disabled }) {
			if (!editorView) {
				return null;
			}

			return (
				<SecondaryToolbarComponent
					editorView={editorView}
					api={api}
					disabled={disabled}
					typeAhead={typeAhead}
				/>
			);
		},

		commands: {
			insertMention: insertMention({
				sanitizePrivateContent: options?.sanitizePrivateContent ?? false,
				mentionInsertDisplayName: options?.insertDisplayName ?? false,
				api,
			}),
		},

		actions: {
			openTypeAhead(inputMethod: TypeAheadInputMethod) {
				return Boolean(
					api?.typeAhead?.actions?.open({
						triggerHandler: typeAhead,
						inputMethod,
					}),
				);
			},
			announceMentionsInsertion: (mentionChanges: MentionChange[]) => {
				if (options?.handleMentionsChanged) {
					options.handleMentionsChanged(mentionChanges);
				}
			},
			setAgentMentionRunStates: (runStateByLocalId: AgentRunStateByLocalId) => {
				if (
					!(
						editorExperiment('platform_editor_agent_mentions', true) &&
						isExperimentEnabled('platform_editor_agent_mention_state_anim')
					)
				) {
					return false;
				}
				return (
					api?.core.actions.execute(({ tr }) =>
						tr.setMeta(mentionPluginKey, {
							action: ACTIONS.SET_AGENT_RUN_STATES,
							params: { runStateByLocalId },
						}),
					) ?? false
				);
			},
			updateSectionTitle: (props) => {
				if (!options?.enableAgentSectioning) {
					return false;
				}

				return api?.typeAhead?.actions?.updateSectionTitle?.(props) ?? false;
			},
			setProvider: async (providerPromise) => {
				if (!fg('platform_editor_mention_provider_via_plugin_config')) {
					return false;
				}

				const provider = await providerPromise;
				// Prevent someone trying to set the exact same provider twice for performance reasons
				if (previousMediaProvider === provider) {
					return false;
				}
				previousMediaProvider = provider;
				return (
					api?.core.actions.execute(({ tr }) =>
						tr.setMeta(mentionPluginKey, {
							action: ACTIONS.SET_PROVIDER,
							params: { provider },
						}),
					) ?? false
				);
			},
		},

		getSharedState(editorState: EditorState | undefined): MentionSharedState | undefined {
			if (!editorState) {
				return undefined;
			}

			const mentionPluginState = mentionPluginKey.getState(editorState);
			const agentMentionPluginState = agentMentionPluginKey.getState(editorState);
			// Exclude pendingPastedAgentMention — it is an @internal transient field and
			// should not be part of the public shared state API. Exposing it would cause
			// unnecessary re-renders in subscribers and leak implementation details.
			const {
				pendingPastedAgentMention: _excluded,
				// Internal decoration-only state, kept out of the public shared state.
				runStateDecorations: _excludedRunState,
				...publicPluginState
			} = mentionPluginState ?? {};
			return {
				...publicPluginState,
				...(agentMentionPluginState
					? {
							lastAgentMentionInsertionCount:
								agentMentionPluginState.lastAgentMentionInsertionCount,
							lastInsertedAgentMentionContext:
								agentMentionPluginState.lastInsertedAgentMentionContext,
							lastInsertedAgentMentionId: agentMentionPluginState.lastInsertedAgentMentionId,
							lastInsertedAgentMentionLocalId:
								agentMentionPluginState.lastInsertedAgentMentionLocalId,
							lastInsertedAgentMentionName: agentMentionPluginState.lastInsertedAgentMentionName,
							lastInsertedAgentMentionParentNodeType:
								agentMentionPluginState.lastInsertedAgentMentionParentNodeType,
							lastInsertedAgentMentionPrompt:
								agentMentionPluginState.lastInsertedAgentMentionPrompt,
						}
					: {}),
				typeAheadHandler: typeAhead,
			};
		},

		pluginsOptions: {
			quickInsert: isRegisteredSlashCommandEnabled
				? undefined
				: ({ formatMessage }) => [
						{
							id: 'mention',
							title: formatMessage(messages.mention),
							description: formatMessage(messages.mentionDescription),
							keywords: ['team', 'user'],
							priority: 400,
							keyshortcut: '@',
							icon: () => <IconMention />,
							isHidden: () =>
								canOpenMentionTypeAhead() === false ||
								api?.mention.sharedState.currentState()?.canInsertMention === false,
							action(insert, state) {
								const pluginState = mentionPluginKey.getState(state);
								if (pluginState && pluginState.canInsertMention === false) {
									return false;
								}

								const tr = insert(undefined);
								const didOpen = api?.typeAhead?.actions.openAtTransaction({
									triggerHandler: typeAhead,
									inputMethod: INPUT_METHOD.QUICK_INSERT,
								})(tr);
								if (didOpen === false) {
									return false;
								}

								return tr;
							},
						},
					],
			typeAhead,
		},
	};
};

export { mentionsPlugin };
