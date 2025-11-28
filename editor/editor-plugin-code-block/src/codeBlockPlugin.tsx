import React from 'react';

import { codeBlock, codeBlockWithLocalId } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
	TRANSFORM_STRUCTURE_MENU_SECTION,
	TRANSFORM_STRUCTURE_CODE_BLOCK_MENU_ITEM,
	TRANSFORM_STRUCTURE_MENU_SECTION_RANK,
} from '@atlaskit/editor-common/block-menu';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import { IconCode } from '@atlaskit/editor-common/quick-insert';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { CodeBlockPlugin } from './codeBlockPluginType';
import { createInsertCodeBlockTransaction, insertCodeBlockWithAnalytics } from './editor-commands';
import { codeBlockAutoFullStopTransformPlugin } from './pm-plugins/codeBlockAutoFullStopTransformPlugin';
import {
	codeBlockCopySelectionPlugin,
	copySelectionPluginKey,
} from './pm-plugins/codeBlockCopySelectionPlugin';
import ideUX from './pm-plugins/ide-ux';
import { createCodeBlockInputRule } from './pm-plugins/input-rule';
import keymap from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
import refreshBrowserSelectionOnChange from './pm-plugins/refresh-browser-selection';
import { getToolbarConfig } from './pm-plugins/toolbar';
import { createCodeBlockMenuItem } from './ui/CodeBlockMenuItem';

const codeBlockPlugin: CodeBlockPlugin = ({ config: options, api }) => {
	if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
		api?.blockMenu?.actions.registerBlockMenuComponents([
			{
				type: 'block-menu-item',
				key: TRANSFORM_STRUCTURE_CODE_BLOCK_MENU_ITEM.key,
				parent: {
					type: 'block-menu-section' as const,
					key: TRANSFORM_STRUCTURE_MENU_SECTION.key,
					rank: TRANSFORM_STRUCTURE_MENU_SECTION_RANK[TRANSFORM_STRUCTURE_CODE_BLOCK_MENU_ITEM.key],
				},
				component: createCodeBlockMenuItem(api),
			},
		]);
	}

	return {
		name: 'codeBlock',

		nodes() {
			return [
				{
					name: 'codeBlock',
					node: fg('platform_editor_adf_with_localid') ? codeBlockWithLocalId : codeBlock,
				},
			];
		},

		getSharedState(state) {
			if (!state) {
				return undefined;
			}
			return {
				copyButtonHoverNode: copySelectionPluginKey.getState(state).codeBlockNode,
			};
		},

		pmPlugins() {
			return [
				{
					name: 'codeBlock',
					plugin: ({ getIntl }) =>
						createPlugin({
							...options,
							getIntl,
							api,
						}),
				},
				{
					name: 'codeBlockInputRule',
					plugin: ({ schema }: PMPluginFactoryParams) => {
						return createCodeBlockInputRule(schema, api?.analytics?.actions);
					},
				},
				{
					name: 'codeBlockIDEKeyBindings',
					plugin: () => ideUX(api),
				},
				{
					name: 'codeBlockKeyMap',
					plugin: ({ schema }: PMPluginFactoryParams) => keymap(schema),
				},
				{
					name: 'codeBlockCopySelection',
					plugin: () => codeBlockCopySelectionPlugin(),
				},
				{
					name: 'codeBlockAutoFullStopTransform',
					plugin: () => codeBlockAutoFullStopTransformPlugin(),
				},
			];
		},

		// Workaround for a firefox issue where dom selection is off sync
		// https://product-fabric.atlassian.net/browse/ED-12442
		onEditorViewStateUpdated(props) {
			refreshBrowserSelectionOnChange(props.originalTransaction, props.newEditorState);
		},

		actions: {
			/*
			 * Function will insert code block at current selection if block is empty or below current selection and set focus on it.
			 */
			insertCodeBlock: (inputMethod: INPUT_METHOD) =>
				insertCodeBlockWithAnalytics(inputMethod, api?.analytics?.actions),
		},

		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [
				{
					id: 'codeblock',
					title: formatMessage(blockTypeMessages.codeblock),
					description: formatMessage(blockTypeMessages.codeblockDescription),
					keywords: ['code block'],
					priority: 700,
					keyshortcut: '```',
					icon: () => <IconCode />,
					action(_insert, state, source) {
						const tr = createInsertCodeBlockTransaction({ state });
						api?.analytics?.actions.attachAnalyticsEvent({
							action: ACTION.INSERTED,
							actionSubject: ACTION_SUBJECT.DOCUMENT,
							actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
							attributes: {
								inputMethod: expValEqualsNoExposure(
									'platform_editor_plain_text_support',
									'isEnabled',
									true,
								)
									? source || INPUT_METHOD.QUICK_INSERT
									: INPUT_METHOD.QUICK_INSERT,
							},
							eventType: EVENT_TYPE.TRACK,
						})(tr);
						return tr;
					},
				},
			],
			floatingToolbar: getToolbarConfig(
				options?.allowCopyToClipboard,
				api,
				options?.overrideLanguageName,
			),
		},
	};
};

export default codeBlockPlugin;
