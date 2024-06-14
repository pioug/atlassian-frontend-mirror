import React from 'react';

import { expand, nestedExpand } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconExpand } from '@atlaskit/editor-common/quick-insert';
import { createWrapSelectionTransaction } from '@atlaskit/editor-common/utils';

import type { ExpandPlugin } from '../types';

import { createExpandNode, insertExpand } from './commands';
import { expandKeymap } from './pm-plugins/keymap';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';

export const expandPlugin: ExpandPlugin = ({ config: options = {}, api }) => {
	return {
		name: 'expand',
		nodes() {
			return [
				{ name: 'expand', node: expand },
				{ name: 'nestedExpand', node: nestedExpand },
			];
		},
		actions: {
			insertExpand: insertExpand(api?.analytics?.actions),
		},
		pmPlugins() {
			return [
				{
					name: 'expand',
					plugin: ({ dispatch, getIntl }) => {
						return createPlugin(
							dispatch,
							getIntl,
							options.appearance,
							options.useLongPressSelection,
							api,
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
						priority: options?.getEditorFeatureFlags?.().platformEditorTypeaheadImprovedRelevancy
							? 700
							: 600,
						icon: () => <IconExpand />,
						action(insert, state) {
							const node = createExpandNode(state);
							if (!node) {
								return false;
							}
							const tr = state.selection.empty
								? insert(node)
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
