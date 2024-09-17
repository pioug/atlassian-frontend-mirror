import React from 'react';

import { codeBlock } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import { IconCode } from '@atlaskit/editor-common/quick-insert';
import type {
	Command,
	NextEditorPlugin,
	OptionalPlugin,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { CompositionPlugin } from '@atlaskit/editor-plugin-composition';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { fg } from '@atlaskit/platform-feature-flags';

import { createInsertCodeBlockTransaction, insertCodeBlockWithAnalytics } from './actions';
import { codeBlockAutoFullStopTransformPlugin } from './pm-plugins/codeBlockAutoFullStopTransformPlugin';
import { codeBlockCopySelectionPlugin } from './pm-plugins/codeBlockCopySelectionPlugin';
import ideUX from './pm-plugins/ide-ux';
import { createCodeBlockInputRule } from './pm-plugins/input-rule';
import keymap from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
import refreshBrowserSelectionOnChange from './refresh-browser-selection';
import { getToolbarConfig } from './toolbar';
import type { CodeBlockOptions } from './types';

export type CodeBlockPlugin = NextEditorPlugin<
	'codeBlock',
	{
		pluginConfiguration: CodeBlockOptions | undefined;
		dependencies: [
			DecorationsPlugin,
			CompositionPlugin,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<EditorDisabledPlugin>,
			OptionalPlugin<FeatureFlagsPlugin>,
		];
		actions: {
			insertCodeBlock: (inputMethod: INPUT_METHOD) => Command;
		};
	}
>;

const codeBlockPlugin: CodeBlockPlugin = ({ config: options, api }) => {
	const isNestingInQuoteSupported =
		api?.featureFlags?.sharedState.currentState()?.nestMediaAndCodeblockInQuote ||
		fg('editor_nest_media_and_codeblock_in_quotes_jira');

	return {
		name: 'codeBlock',

		nodes() {
			return [{ name: 'codeBlock', node: codeBlock }];
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
						return createCodeBlockInputRule(
							schema,
							api?.analytics?.actions,
							isNestingInQuoteSupported,
						);
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
				insertCodeBlockWithAnalytics(
					inputMethod,
					api?.analytics?.actions,
					isNestingInQuoteSupported,
				),
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
					action(_insert, state) {
						const tr = createInsertCodeBlockTransaction({ state, isNestingInQuoteSupported });
						api?.analytics?.actions.attachAnalyticsEvent({
							action: ACTION.INSERTED,
							actionSubject: ACTION_SUBJECT.DOCUMENT,
							actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
							attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
							eventType: EVENT_TYPE.TRACK,
						})(tr);
						return tr;
					},
				},
			],
			floatingToolbar: getToolbarConfig(options?.allowCopyToClipboard, api),
		},
	};
};

export default codeBlockPlugin;
