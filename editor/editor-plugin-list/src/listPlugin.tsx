import React from 'react';

import {
	bulletList,
	bulletListWithLocalId,
	listItem,
	listItemWithLocalId,
	orderedListWithOrder,
	orderedListWithOrderAndLocalId,
} from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { toggleBulletList, toggleOrderedList, tooltip } from '@atlaskit/editor-common/keymaps';
import { listMessages as messages } from '@atlaskit/editor-common/messages';
import { IconList, IconListNumber } from '@atlaskit/editor-common/quick-insert';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { ListPlugin } from './listPluginType';
import {
	toggleBulletList as toggleBulletListCommand,
	toggleOrderedList as toggleOrderedListCommand,
} from './pm-plugins/commands';
import { indentList } from './pm-plugins/commands/indent-list';
import { outdentList } from './pm-plugins/commands/outdent-list';
import inputRulePlugin from './pm-plugins/input-rules';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import keymapPlugin from './pm-plugins/keymap';
import { createPlugin, pluginKey as listPluginKey } from './pm-plugins/main';
import { findRootParentListNode } from './pm-plugins/utils/find';
import { isInsideListItem } from './pm-plugins/utils/selection';

/*
  Toolbar buttons to bullet and ordered list can be found in
  packages/editor/editor-core/src/plugins/toolbar-lists-indentation/ui/Toolbar.tsx
 */

/**
 * List plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const listPlugin: ListPlugin = ({ config: options, api }) => {
	const featureFlags = api?.featureFlags?.sharedState.currentState() || {};
	const editorAnalyticsAPI = api?.analytics?.actions;

	return {
		name: 'list',
		actions: {
			isInsideListItem,
			findRootParentListNode,
		},
		commands: {
			indentList: indentList(editorAnalyticsAPI),
			outdentList: (inputMethod) => outdentList(editorAnalyticsAPI)(inputMethod),
			toggleOrderedList: toggleOrderedListCommand(editorAnalyticsAPI),
			toggleBulletList: toggleBulletListCommand(editorAnalyticsAPI),
		},
		getSharedState: (editorState) => {
			if (!editorState) {
				return undefined;
			}

			return listPluginKey.getState(editorState);
		},

		nodes() {
			return [
				{
					name: 'bulletList',
					node: fg('platform_editor_adf_with_localid') ? bulletListWithLocalId : bulletList,
				},
				{
					name: 'orderedList',
					node: fg('platform_editor_adf_with_localid')
						? orderedListWithOrderAndLocalId
						: orderedListWithOrder,
				},
				{
					name: 'listItem',
					node: fg('platform_editor_adf_with_localid') ? listItemWithLocalId : listItem,
				},
			];
		},

		pmPlugins() {
			return [
				{
					name: 'list',
					plugin: ({ dispatch }) => createPlugin(dispatch, featureFlags),
				},
				{
					name: 'listInputRule',
					plugin: ({ schema, featureFlags }) => inputRulePlugin(schema, api?.analytics?.actions),
				},
				{
					name: 'listKeymap',
					plugin: () => keymapPlugin(featureFlags, api?.analytics?.actions),
				},
			];
		},

		pluginsOptions: {
			...(editorExperiment('platform_editor_insertion', 'control') && {
				quickInsert: ({ formatMessage }) => {
					return [
						{
							id: 'unorderedList',
							title: formatMessage(messages.unorderedList),
							description: formatMessage(messages.unorderedListDescription),
							keywords: ['ul', 'unordered'],
							priority: 1100,
							keyshortcut: tooltip(toggleBulletList),
							icon: () => <IconList />,
							action(insert, state) {
								const tr = insert(
									state.schema.nodes.bulletList.createChecked(
										{},
										state.schema.nodes.listItem.createChecked(
											{},
											state.schema.nodes.paragraph.createChecked(),
										),
									),
								);
								editorAnalyticsAPI?.attachAnalyticsEvent({
									action: ACTION.INSERTED,
									actionSubject: ACTION_SUBJECT.LIST,
									actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
									eventType: EVENT_TYPE.TRACK,
									attributes: {
										inputMethod: INPUT_METHOD.QUICK_INSERT,
									},
								})(tr);
								return tr;
							},
						},
						{
							id: 'orderedList',
							title: formatMessage(messages.orderedList),
							description: formatMessage(messages.orderedListDescription),
							keywords: ['ol', 'ordered'],
							priority: 1200,
							keyshortcut: tooltip(toggleOrderedList),
							icon: () => <IconListNumber />,
							action(insert, state) {
								const tr = insert(
									state.schema.nodes.orderedList.createChecked(
										{},
										state.schema.nodes.listItem.createChecked(
											{},
											state.schema.nodes.paragraph.createChecked(),
										),
									),
								);
								editorAnalyticsAPI?.attachAnalyticsEvent({
									action: ACTION.INSERTED,
									actionSubject: ACTION_SUBJECT.LIST,
									actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
									eventType: EVENT_TYPE.TRACK,
									attributes: {
										inputMethod: INPUT_METHOD.QUICK_INSERT,
									},
								})(tr);
								return tr;
							},
						},
					];
				},
			}),
		},
	};
};
