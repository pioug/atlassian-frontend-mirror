import React from 'react';

import {
	expandWithNestedExpand,
	expandWithNestedExpandLocalId,
	nestedExpand,
	nestedExpandWithLocalId,
} from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
	FORMAT_MENU_ITEM,
	FORMAT_EXPAND_MENU_ITEM,
	FORMAT_NESTED_MENU_RANK,
	FORMAT_NESTED_MENU_RANK_REVISED,
} from '@atlaskit/editor-common/block-menu';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconExpand } from '@atlaskit/editor-common/quick-insert';
import { createWrapSelectionTransaction } from '@atlaskit/editor-common/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { toggleExpandRange } from '../editor-commands/toggleExpandRange';
import type { ExpandPlugin } from '../types';
import { createExpandBlockMenuItem } from '../ui/ExpandBlockMenuItem';

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
	if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
		api?.blockMenu?.actions.registerBlockMenuComponents([
			{
				type: 'block-menu-item',
				key: FORMAT_EXPAND_MENU_ITEM.key,
				parent: {
					type: 'block-menu-section' as const,
					key: FORMAT_MENU_ITEM.key,
					rank: fg('platform_editor_block_menu_format_rank_revised')
						? FORMAT_NESTED_MENU_RANK_REVISED[FORMAT_EXPAND_MENU_ITEM.key]
						: FORMAT_NESTED_MENU_RANK[FORMAT_EXPAND_MENU_ITEM.key],
				},
				component: createExpandBlockMenuItem(api),
			},
		]);
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
					plugin: () => expandKeymap(api, { __livePage: options.__livePage }),
				},
			];
		},
		pluginsOptions: {
			floatingToolbar: getToolbarConfig(api),

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
						action(insert, state) {
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
								attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
								eventType: EVENT_TYPE.TRACK,
							})(tr);

							return tr;
						},
					},
				];
			},
		},
	};
};
