import React from 'react';

import type { IntlShape } from 'react-intl-next';

import {
	blockquoteWithList,
	blockquoteWithNestedCodeblockOrMedia,
	hardBreak,
	heading,
} from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { keymap, tooltip } from '@atlaskit/editor-common/keymaps';
import { blockTypeMessages as messages } from '@atlaskit/editor-common/messages';
import type {
	QuickInsertActionInsert,
	QuickInsertItem,
	QuickInsertItemId,
} from '@atlaskit/editor-common/provider-factory';
import { IconHeading, IconQuote } from '@atlaskit/editor-common/quick-insert';
import type { HeadingLevels, ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';
import { ToolbarSize } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import { type BlockTypePlugin } from './blockTypePluginType';
import type { TextBlockTypes } from './pm-plugins/block-types';
import { setBlockTypeWithAnalytics } from './pm-plugins/commands';
import type { InputMethod } from './pm-plugins/commands/block-type';
import { insertBlockQuoteWithAnalytics } from './pm-plugins/commands/block-type';
import inputRulePlugin from './pm-plugins/input-rule';
import keymapPlugin from './pm-plugins/keymap';
import { createPlugin, pluginKey } from './pm-plugins/main';
import type { BlockTypeNode } from './pm-plugins/types';
import { PrimaryToolbarComponent } from './pm-plugins/ui/PrimaryToolbarComponent';

const headingPluginOptions = (
	{ formatMessage }: IntlShape,
	isAllowed: boolean,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): Array<QuickInsertItem> => {
	if (!isAllowed) {
		return [];
	}

	return Array.from({ length: 6 }, (_v, idx) => {
		const level = (idx + 1) as HeadingLevels;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const descriptionDescriptor = (messages as any)[`heading${level}Description`];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const keyshortcut = tooltip((keymap as any)[`toggleHeading${level}`]);

		const id = `heading${level}` as QuickInsertItemId;

		return {
			id,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			title: formatMessage((messages as any)[id]),
			description: formatMessage(descriptionDescriptor),
			priority: 1300,
			keywords: [`h${level}`],
			keyshortcut,
			icon: () => <IconHeading level={level} />,
			action(insert: QuickInsertActionInsert, state: EditorState) {
				const tr = insert(state.schema.nodes.heading.createChecked({ level }));
				editorAnalyticsApi?.attachAnalyticsEvent({
					action: ACTION.FORMATTED,
					actionSubject: ACTION_SUBJECT.TEXT,
					eventType: EVENT_TYPE.TRACK,
					actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
					attributes: {
						inputMethod: INPUT_METHOD.QUICK_INSERT,
						newHeadingLevel: level,
					},
				})(tr);

				return tr;
			},
		};
	});
};

const blockquotePluginOptions = (
	{ formatMessage }: IntlShape,
	isAllowed: boolean,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): Array<QuickInsertItem> => {
	if (!isAllowed) {
		return [];
	}

	return [
		{
			id: 'blockquote',
			title: formatMessage(messages.blockquote),
			description: formatMessage(messages.blockquoteDescription),
			priority: 1300,
			keyshortcut: '>',
			icon: () => <IconQuote />,
			action(insert, state) {
				const tr = insert(
					state.schema.nodes.blockquote.createChecked(
						{},
						state.schema.nodes.paragraph.createChecked(),
					),
				);
				editorAnalyticsApi?.attachAnalyticsEvent({
					action: ACTION.FORMATTED,
					actionSubject: ACTION_SUBJECT.TEXT,
					eventType: EVENT_TYPE.TRACK,
					actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
					attributes: {
						inputMethod: INPUT_METHOD.QUICK_INSERT,
					},
				})(tr);

				return tr;
			},
		},
	];
};

const blockTypePlugin: BlockTypePlugin = ({ config: options, api }) => {
	const isNestingInQuoteSchemaChanged =
		fg('platform_editor_nest_in_quotes_adf_change') ||
		fg('editor_nest_media_and_codeblock_in_quotes_jira');

	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		toolbarSize,
		disabled,
		isToolbarReducedSpacing,
	}) => {
		let isSmall =
			options && options.isUndoRedoButtonsEnabled
				? toolbarSize < ToolbarSize.XXL
				: toolbarSize < ToolbarSize.XL;

		if (fg('platform_editor_toolbar_responsive_fixes')) {
			isSmall = toolbarSize < ToolbarSize.XXL;
		}

		return (
			<PrimaryToolbarComponent
				isSmall={isSmall}
				disabled={disabled}
				isToolbarReducedSpacing={isToolbarReducedSpacing}
				api={api}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				shouldUseDefaultRole={false}
			/>
		);
	};
	api?.primaryToolbar?.actions.registerComponent({
		name: 'blockType',
		component: primaryToolbarComponent,
	});

	return {
		name: 'blockType',

		nodes() {
			const nodes: BlockTypeNode[] = [
				{ name: 'heading', node: heading },
				{
					name: 'blockquote',
					node: isNestingInQuoteSchemaChanged
						? blockquoteWithNestedCodeblockOrMedia
						: blockquoteWithList,
				},
				{ name: 'hardBreak', node: hardBreak },
			];

			if (options && options.allowBlockType) {
				const exclude = options.allowBlockType.exclude ? options.allowBlockType.exclude : [];
				return nodes.filter((node) => exclude.indexOf(node.name) === -1);
			}

			return nodes;
		},

		pmPlugins() {
			return [
				{
					name: 'blockType',
					plugin: ({ dispatch }) =>
						createPlugin(api, dispatch, options && options.lastNodeMustBeParagraph),
				},
				{
					name: 'blockTypeInputRule',
					plugin: ({ schema, featureFlags }) =>
						inputRulePlugin(api?.analytics?.actions, schema, featureFlags),
				},
				// Needs to be lower priority than editor-tables.tableEditing
				// plugin as it is currently swallowing right/down arrow events inside tables
				{
					name: 'blockTypeKeyMap',
					plugin: ({ schema, featureFlags }) =>
						keymapPlugin(api?.analytics?.actions, schema, featureFlags),
				},
			];
		},

		actions: {
			insertBlockQuote(inputMethod: InputMethod) {
				return insertBlockQuoteWithAnalytics(inputMethod, api?.analytics?.actions);
			},
		},

		commands: {
			setTextLevel(level: TextBlockTypes, inputMethod: InputMethod) {
				return setBlockTypeWithAnalytics(level, inputMethod, api?.analytics?.actions);
			},
		},

		getSharedState(editorState) {
			if (!editorState) {
				return;
			}
			return pluginKey.getState(editorState);
		},

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,

		pluginsOptions: {
			quickInsert: (intl) => {
				const exclude =
					options && options.allowBlockType && options.allowBlockType.exclude
						? options.allowBlockType.exclude
						: [];

				return [
					...blockquotePluginOptions(
						intl,
						exclude.indexOf('blockquote') === -1,
						api?.analytics?.actions,
					),
					...headingPluginOptions(intl, exclude.indexOf('heading') === -1, api?.analytics?.actions),
				];
			},
		},
	};
};

export { blockTypePlugin };
export { pluginKey } from './pm-plugins/main';
export type { BlockTypeState } from './pm-plugins/main';
