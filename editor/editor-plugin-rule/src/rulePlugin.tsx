import React from 'react';

import { rule, ruleWithAttrs, ruleWithLocalId } from '@atlaskit/adf-schema/rule';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconDivider } from '@atlaskit/editor-common/assets';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { insertHorizontalRule } from './pm-plugins/commands';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import inputRulePlugin from './pm-plugins/input-rule';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import keymapPlugin from './pm-plugins/keymap';
import type { RulePlugin } from './rulePluginType';
import { getRuleQuickInsertComponents } from './ui/quick-insert/getRuleQuickInsertComponents';
import { getToolbarConfig } from './ui/toolbar';

export const rulePlugin: RulePlugin = ({ api }) => {
	const isRegisteredSlashCommandEnabled = isExperimentEnabled('platform_editor_slash_command');

	if (isRegisteredSlashCommandEnabled) {
		api?.uiControlRegistry?.actions.register(getRuleQuickInsertComponents({ api }));
	}

	return {
		name: 'rule',

		nodes() {
			return [
				{
					name: 'rule',
					node: isExperimentEnabled('platform_editor_lovability_dividers_attributes')
						? ruleWithAttrs
						: fg('platform_editor_adf_with_localid')
							? ruleWithLocalId
							: rule,
				},
			];
		},

		actions: {
			insertHorizontalRule: insertHorizontalRule(api?.analytics?.actions),
		},

		pmPlugins() {
			return [
				{
					name: 'ruleInputRule',
					plugin: ({ schema }) => inputRulePlugin(schema, api?.analytics?.actions),
				},
				{
					name: 'ruleKeymap',
					plugin: () => keymapPlugin(api?.analytics?.actions),
				},
			];
		},

		pluginsOptions: {
			...(isExperimentEnabled('platform_editor_lovability_dividers')
				? { floatingToolbar: (state, intl) => getToolbarConfig(state, intl, api) }
				: {}),
			quickInsert: isRegisteredSlashCommandEnabled
				? undefined
				: ({ formatMessage }) => [
						{
							id: 'rule',
							title: formatMessage(messages.horizontalRule),
							description: formatMessage(messages.horizontalRuleDescription),
							keywords: ['horizontal', 'rule', 'line', 'hr'],
							priority: 1200,
							keyshortcut: '---',
							icon: () => <IconDivider />,
							action(insert, state, source) {
								const tr: Transaction | null = insert(state.schema.nodes.rule.createChecked());

								api?.analytics?.actions.attachAnalyticsEvent({
									action: ACTION.INSERTED,
									actionSubject: ACTION_SUBJECT.DOCUMENT,
									actionSubjectId: ACTION_SUBJECT_ID.DIVIDER,
									attributes: { inputMethod: source ?? INPUT_METHOD.QUICK_INSERT },
									eventType: EVENT_TYPE.TRACK,
								})(tr);
								return tr;
							},
						},
					],
		},
	};
};
