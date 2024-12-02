import React from 'react';

import uuid from 'uuid';

import { mention } from '@atlaskit/adf-schema';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconMention } from '@atlaskit/editor-common/quick-insert';
import type { TypeAheadInputMethod } from '@atlaskit/editor-plugin-type-ahead';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { MentionsPlugin } from './mentionsPluginType';
import { mentionPluginKey } from './pm-plugins/key';
import { createMentionPlugin } from './pm-plugins/main';
import type { FireElementsChannelEvent, MentionSharedState } from './types';
import { SecondaryToolbarComponent } from './ui/SecondaryToolbarComponent';
import { createTypeAheadConfig } from './ui/type-ahead';

const mentionsPlugin: MentionsPlugin = ({ config: options, api }) => {
	let sessionId = uuid();
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
						createMentionPlugin(pmPluginFactoryParams, fireEvent, options),
				},
			];
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
					isDisabledOffline: true,
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
