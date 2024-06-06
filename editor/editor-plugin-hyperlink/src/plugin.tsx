import React from 'react';

import { link } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { addLink, tooltip } from '@atlaskit/editor-common/keymaps';
import { LinkAction } from '@atlaskit/editor-common/link';
import type { HyperlinkState } from '@atlaskit/editor-common/link';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconLink } from '@atlaskit/editor-common/quick-insert';
import type {
	HyperlinkPluginOptions,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { CardPlugin } from '@atlaskit/editor-plugin-card';

import type { HideLinkToolbar, InsertLink, ShowLinkToolbar, UpdateLink } from './commands';
import {
	hideLinkToolbarSetMeta,
	insertLinkWithAnalytics,
	showLinkToolbar,
	updateLink,
} from './commands';
import fakeCursorToolbarPlugin from './pm-plugins/fake-cursor-for-toolbar';
import { createInputRulePlugin } from './pm-plugins/input-rule';
import { createKeymapPlugin } from './pm-plugins/keymap';
import { plugin, stateKey } from './pm-plugins/main';
import { toolbarButtonsPlugin } from './pm-plugins/toolbar-buttons';
import { getToolbarConfig } from './Toolbar';

export type HyperlinkPlugin = NextEditorPlugin<
	'hyperlink',
	{
		pluginConfiguration: HyperlinkPluginOptions | undefined;
		dependencies: [OptionalPlugin<AnalyticsPlugin>, OptionalPlugin<CardPlugin>];
		actions: {
			hideLinkToolbar: HideLinkToolbar;
			insertLink: InsertLink;
			updateLink: UpdateLink;
		};
		commands: {
			/**
			 * EditorCommand to show link toolbar.
			 *
			 * Example:
			 *
			 * ```
			 * const newTr = pluginInjectionApi?.hyperlink.commands.showLinkToolbar(
			 *   inputMethod
			 * )({ tr })
			 * ```
			 */
			showLinkToolbar: ShowLinkToolbar;
		};
		sharedState: HyperlinkState | undefined;
	}
>;

/**
 * Hyperlink plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const hyperlinkPlugin: HyperlinkPlugin = ({ config: options = {}, api }) => {
	return {
		name: 'hyperlink',

		marks() {
			return [{ name: 'link', mark: link }];
		},

		commands: {
			showLinkToolbar: (inputMethod = INPUT_METHOD.TOOLBAR) =>
				showLinkToolbar(inputMethod, api?.analytics?.actions),
		},

		actions: {
			hideLinkToolbar: hideLinkToolbarSetMeta,
			insertLink: (
				inputMethod,
				from,
				to,
				href,
				title,
				displayText,
				cardsAvailable = false,
				sourceEvent = undefined,
				appearance,
			) =>
				insertLinkWithAnalytics(
					inputMethod,
					from,
					to,
					href,
					api?.card?.actions,
					api?.analytics?.actions,
					title,
					displayText,
					cardsAvailable,
					sourceEvent,
					appearance,
				),
			updateLink: updateLink,
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}
			return stateKey.getState(editorState);
		},

		pmPlugins() {
			return [
				{
					name: 'hyperlink',
					plugin: ({ dispatch }) => plugin(dispatch, options?.editorAppearance),
				},
				{
					name: 'fakeCursorToolbarPlugin',
					plugin: () => fakeCursorToolbarPlugin,
				},
				{
					name: 'hyperlinkInputRule',
					plugin: ({ schema }) => createInputRulePlugin(schema, api?.analytics?.actions),
				},
				{
					name: 'hyperlinkKeymap',
					plugin: () => createKeymapPlugin(api?.analytics?.actions),
				},

				{
					name: 'hyperlinkToolbarButtons',
					plugin: () => {
						const hasCard = !!api?.card?.actions;
						return toolbarButtonsPlugin(hasCard ? { skipAnalytics: true } : undefined);
					},
				},
			];
		},

		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [
				{
					id: 'hyperlink',
					title: formatMessage(messages.link),
					description: formatMessage(messages.linkDescription),
					keywords: ['hyperlink', 'url'],
					priority: 1200,
					keyshortcut: tooltip(addLink),
					icon: () => <IconLink />,
					action(insert, state) {
						const tr = insert(undefined);
						tr.setMeta(stateKey, {
							type: LinkAction.SHOW_INSERT_TOOLBAR,
							inputMethod: INPUT_METHOD.QUICK_INSERT,
						});

						const analyticsAttached = api?.analytics?.actions?.attachAnalyticsEvent?.({
							action: ACTION.INVOKED,
							actionSubject: ACTION_SUBJECT.TYPEAHEAD,
							actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
							attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
							eventType: EVENT_TYPE.UI,
						})(tr);

						return analyticsAttached !== false ? tr : false;
					},
				},
			],
			floatingToolbar: getToolbarConfig(options, api),
		},
	};
};
