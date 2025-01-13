import React, { useEffect, useMemo } from 'react';

import { type IntlShape, useIntl } from 'react-intl-next';
import uuid from 'uuid';

import { mention } from '@atlaskit/adf-schema';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	toolbarInsertBlockMessages as messages,
	mentionMessages,
} from '@atlaskit/editor-common/messages';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import { IconMention } from '@atlaskit/editor-common/quick-insert';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { TypeAheadInputMethod } from '@atlaskit/editor-plugin-type-ahead';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
	isResolvingMentionProvider,
	type MentionNameDetails,
	type MentionProvider,
} from '@atlaskit/mention/resource';
import { MentionNameStatus, isPromise } from '@atlaskit/mention/types';
import { fg } from '@atlaskit/platform-feature-flags';

import type { MentionsPlugin } from './mentionsPluginType';
import { mentionPluginKey } from './pm-plugins/key';
import { ACTIONS, createMentionPlugin } from './pm-plugins/main';
import type { FireElementsChannelEvent, MentionSharedState } from './types';
import { SecondaryToolbarComponent } from './ui/SecondaryToolbarComponent';
import { createTypeAheadConfig } from './ui/type-ahead';

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
	mentionProvider: Promise<MentionProvider> | undefined;
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
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
		sanitizePrivateContent: options?.sanitizePrivateContent,
		mentionInsertDisplayName: options?.insertDisplayName,
		HighlightComponent: options?.HighlightComponent,
		handleMentionsChanged: options?.handleMentionsChanged,
		fireEvent,
		api,
	});

	return {
		name: 'mention',

		nodes() {
			return [{ name: 'mention', node: mention }];
		},

		pmPlugins() {
			return [
				{
					name: 'mention',
					plugin: (pmPluginFactoryParams) =>
						createMentionPlugin({ pmPluginFactoryParams, fireEvent, options, api }),
				},
			];
		},

		contentComponent({ providerFactory }) {
			return (
				<WithProviders
					providers={['mentionProvider']}
					providerFactory={providerFactory}
					renderNode={({ mentionProvider }) => {
						return <Component mentionProvider={mentionProvider} api={api} />;
					}}
				/>
			);
		},

		secondaryToolbarComponent({ editorView, disabled }) {
			return (
				<SecondaryToolbarComponent
					editorView={editorView}
					api={api}
					disabled={disabled}
					typeAhead={typeAhead}
				/>
			);
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
			announceMentionsInsertion: (
				mentionChanges: {
					type: 'added' | 'deleted';
					localId: string;
					id: string;
					taskLocalId?: string;
				}[],
			) => {
				if (options?.handleMentionsChanged) {
					options.handleMentionsChanged(mentionChanges);
				}
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
			return {
				...mentionPluginState,
				typeAheadHandler: typeAhead,
			};
		},

		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [
				{
					id: 'mention',
					title: formatMessage(messages.mention),
					description: formatMessage(messages.mentionDescription),
					keywords: ['team', 'user'],
					priority: 400,
					keyshortcut: '@',
					icon: () => <IconMention />,
					action(insert, state) {
						const tr = insert(undefined);
						const pluginState = mentionPluginKey.getState(state);
						if (pluginState && pluginState.canInsertMention === false) {
							return false;
						}

						api?.typeAhead?.actions.openAtTransaction({
							triggerHandler: typeAhead,
							inputMethod: INPUT_METHOD.QUICK_INSERT,
						})(tr);

						return tr;
					},
				},
			],
			typeAhead,
		},
	};
};

export { mentionsPlugin };
