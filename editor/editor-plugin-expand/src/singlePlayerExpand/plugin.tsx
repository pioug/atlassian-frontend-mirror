import React from 'react';

import { expandWithNestedExpand, expandWithNestedExpandLocalId } from '@atlaskit/adf-schema/expand';
import { nestedExpand, nestedExpandWithLocalId } from '@atlaskit/adf-schema/nested-expand';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
	TRANSFORM_STRUCTURE_EXPAND_MENU_ITEM,
	TRANSFORM_STRUCTURE_MENU_SECTION,
	TRANSFORM_STRUCTURE_MENU_SECTION_RANK,
} from '@atlaskit/editor-common/block-menu';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconExpand } from '@atlaskit/editor-common/assets';
import { createWrapSelectionTransaction } from '@atlaskit/editor-common/utils';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';

import { toggleExpandRange } from '../editor-commands/toggleExpandRange';
import type { ExpandPlugin } from '../types';
import { createExpandBlockMenuItem } from '../ui/ExpandBlockMenuItem';
import { getExpandQuickInsertComponents } from '../ui/quick-insert/getExpandQuickInsertComponents';

const EXPAND_NODE_NAME = 'expand';

import {
	createExpandNode,
	insertExpand,
	insertExpandWithInputMethod,
	toggleExpandWithMatch,
	wrapSelectionAndSetExpandedState,
} from './commands';
import { expandKeymap } from './pm-plugins/keymap';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';

// Ignored via go/ees005
// eslint-disable-next-line prefer-const
export let expandPlugin: ExpandPlugin = ({ config: options = {}, api }) => {
	const isRegisteredSlashCommandEnabled = isExperimentEnabled('platform_editor_slash_command');
	if (editorExperiment('platform_editor_block_menu', true)) {
		api?.blockMenu?.actions.registerBlockMenuComponents([
			{
				type: 'block-menu-item',
				key: TRANSFORM_STRUCTURE_EXPAND_MENU_ITEM.key,
				parent: {
					type: 'block-menu-section' as const,
					key: TRANSFORM_STRUCTURE_MENU_SECTION.key,
					rank: (TRANSFORM_STRUCTURE_MENU_SECTION_RANK as Record<string, number>)[
						TRANSFORM_STRUCTURE_EXPAND_MENU_ITEM.key
					],
				},
				component: createExpandBlockMenuItem(api),
				isHidden: () =>
					Boolean(api?.blockMenu?.actions.isTransformOptionDisabled(EXPAND_NODE_NAME)),
			},
		]);
	}

	if (isRegisteredSlashCommandEnabled && options.allowInsertion === true) {
		api?.uiControlRegistry?.actions.register(
			getExpandQuickInsertComponents({ api, isLegacy: false }),
		);
	}

	return {
		name: 'expand',
		nodes() {
			return [
				{
					name: 'expand',
					node: fg('platform_editor_adf_with_localid')
						? expandWithNestedExpandLocalId
						: expandWithNestedExpand,
				},
				{
					name: 'nestedExpand',
					node: fg('platform_editor_adf_with_localid') ? nestedExpandWithLocalId : nestedExpand,
				},
			];
		},
		actions: {
			insertExpand: insertExpand(api),
			insertExpandWithInputMethod: insertExpandWithInputMethod(api),
		},
		commands: {
			toggleExpandWithMatch: (selection) => toggleExpandWithMatch(selection),
			toggleExpandRange,
		},
		getSharedState() {
			return {
				allowInsertion: options?.allowInsertion ?? true,
			};
		},
		pmPlugins() {
			return [
				{
					name: 'expand',
					plugin: ({ dispatch, getIntl, nodeViewPortalProviderAPI }) => {
						return createPlugin(
							dispatch,
							getIntl,
							options.appearance,
							options.useLongPressSelection,
							api,
							nodeViewPortalProviderAPI,
							options.allowInteractiveExpand ?? true,
							options.__livePage,
						);
					},
				},
				{
					name: 'expandKeymap',
					plugin: () => expandKeymap(api),
				},
			];
		},
		pluginsOptions: {
			floatingToolbar: getToolbarConfig(api),

			...(!isRegisteredSlashCommandEnabled && {
				quickInsert: ({ formatMessage }) => {
					if (options && options.allowInsertion !== true) {
						return [];
					}
					return [
						{
							id: 'expand',
							title: formatMessage(messages.expand),
							description: formatMessage(messages.expandDescription),
							keywords: ['accordion', 'collapse'],
							priority: 600,
							icon: () => <IconExpand />,
							action(insert, state, source) {
								const node = createExpandNode(state, undefined, !!api?.localId);
								if (!node) {
									return false;
								}

								const tr = state.selection.empty
									? insert(node)
									: fg('platform_editor_adf_with_localid')
										? wrapSelectionAndSetExpandedState(state, node)
										: createWrapSelectionTransaction({
												state,
												type: node.type,
											});

								api?.analytics?.actions.attachAnalyticsEvent({
									action: ACTION.INSERTED,
									actionSubject: ACTION_SUBJECT.DOCUMENT,
									actionSubjectId:
										node.type === state.schema.nodes.nestedExpand
											? ACTION_SUBJECT_ID.NESTED_EXPAND
											: ACTION_SUBJECT_ID.EXPAND,
									attributes: { inputMethod: source ?? INPUT_METHOD.QUICK_INSERT },
									eventType: EVENT_TYPE.TRACK,
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
