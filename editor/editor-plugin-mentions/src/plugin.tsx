import React from 'react';

import uuid from 'uuid';

import { mention } from '@atlaskit/adf-schema';
import type { AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconMention } from '@atlaskit/editor-common/quick-insert';
import type { TypeAheadInputMethod } from '@atlaskit/editor-plugin-type-ahead';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { ELEMENTS_CHANNEL } from '@atlaskit/mention/resource';

import { mentionPluginKey } from './pm-plugins/key';
import { createMentionPlugin } from './pm-plugins/main';
import { createTypeAheadConfig } from './type-ahead';
import type { FireElementsChannelEvent, MentionSharedState, MentionsPlugin } from './types';
import { SecondaryToolbarComponent } from './ui/SecondaryToolbarComponent';

const mentionsPlugin: MentionsPlugin = ({ config: options, api }) => {
	let sessionId = uuid();
	const fireEvent: FireElementsChannelEvent = <T extends AnalyticsEventPayload>(
		payload: T,
	): void => {
		const { createAnalyticsEvent } = api?.analytics?.sharedState.currentState() ?? {};
		if (!createAnalyticsEvent) {
			return;
		}

		if (payload.attributes && !payload.attributes.sessionId) {
			payload.attributes.sessionId = sessionId;
		}

		createAnalyticsEvent(payload).fire(ELEMENTS_CHANNEL);
	};
	const typeAhead = createTypeAheadConfig({
		sanitizePrivateContent: options?.sanitizePrivateContent,
		mentionInsertDisplayName: options?.insertDisplayName,
		HighlightComponent: options?.HighlightComponent,
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
